#!/usr/bin/env python3
"""Replay server for dumps produced by dump.py.

Serves captured responses by URL (path + query). For SPAs that hit
*other* hosts (Supabase, CDNs, analytics) we inject a tiny shim into
every HTML page that rewrites window.fetch + XMLHttpRequest URLs to
'/__off/<host><path>?<query>', which this server resolves against the
manifest. Cross-origin assets that came back as text/css get the same
treatment so their url(...) refs route through the shim (limited:
only for absolute URLs the bundler emitted).

Usage:
    python serve.py out_dir [--port 8080] [--host 127.0.0.1]
"""
from __future__ import annotations

import argparse
import json
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

SHIM = b"""<script>
(function () {
  var ORIGIN = location.origin;
  var PROXY = ORIGIN + '/__off/';
  function rewrite(u) {
    try {
      var x = new URL(u, location.href);
      if (x.origin === ORIGIN) return u;
      return PROXY + x.host + x.pathname + (x.search || '');
    } catch (e) { return u; }
  }
  var of = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string') {
      input = rewrite(input);
    } else if (input && typeof input === 'object' && 'url' in input) {
      try { input = new Request(rewrite(input.url), input); } catch (e) {}
    }
    return of.call(this, input, init);
  };
  var oo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) {
    arguments[1] = rewrite(u);
    return oo.apply(this, arguments);
  };
  // Block service-worker registration so it cannot bypass the shim.
  if (navigator.serviceWorker) {
    try {
      navigator.serviceWorker.register = function () {
        return Promise.reject(new Error('blocked by replay shim'));
      };
    } catch (e) {}
  }
})();
</script>
"""


def build_lookup(responses: dict) -> dict:
    lookup: dict[tuple[str, str, str], dict] = {}
    for url, entry in responses.items():
        p = urlsplit(url)
        host = p.netloc
        path = p.path or "/"
        lookup[(host, path, p.query)] = entry
        lookup.setdefault((host, path, ""), entry)
    return lookup


def inject_shim(body: bytes) -> bytes:
    """Insert SHIM right after <head> (or at the very top if no head)."""
    lower = body.lower()
    idx = lower.find(b"<head")
    if idx == -1:
        return SHIM + body
    end = lower.find(b">", idx)
    if end == -1:
        return SHIM + body
    insert_at = end + 1
    return body[:insert_at] + b"\n" + SHIM + body[insert_at:]


def make_handler(root: Path, manifest: dict):
    responses = manifest["responses"]
    origin_host = manifest["origin"]
    lookup = build_lookup(responses)

    class H(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def _resolve(self, host: str, path: str, query: str):
            for h in (host, origin_host):
                e = lookup.get((h, path, query))
                if e is not None:
                    return e
            for h in (host, origin_host):
                e = lookup.get((h, path, ""))
                if e is not None:
                    return e
            return None

        def _serve(self, write_body: bool) -> None:
            p = urlsplit(self.path)
            req_path = p.path or "/"
            req_query = p.query

            # /__off/<host>/<path...>?<query>  -- proxied cross-origin asset
            if req_path.startswith("/__off/"):
                tail = req_path[len("/__off/"):]
                slash = tail.find("/")
                if slash == -1:
                    target_host, target_path = tail, "/"
                else:
                    target_host, target_path = tail[:slash], tail[slash:]
                entry = self._resolve(target_host, target_path, req_query)
                if entry is None:
                    self.send_error(404, f"Not in dump: {target_host}{target_path}")
                    return
            else:
                host = (self.headers.get("Host") or origin_host).split(":")[0]
                entry = self._resolve(host, req_path, req_query)
                if entry is None and req_path == "/":
                    entry = self._resolve(host, "/index.html", "")

            if entry is None:
                self.send_error(404, f"Not in dump: {self.path}")
                return

            local = root / entry["local"]
            if not local.exists():
                self.send_error(404, f"File missing: {entry['local']}")
                return

            data = local.read_bytes()
            ct = entry.get("content_type") or (mimetypes.guess_type(str(local))[0] or "application/octet-stream")

            # Inject the shim into top-level HTML so JS calls get rerouted.
            if "text/html" in ct.lower():
                data = inject_shim(data)

            status = entry.get("status", 200)
            # If captured was 206 (partial), serve as 200 — we always return the full body.
            if status == 206:
                status = 200

            self.send_response(status)
            self.send_header("Content-Type", ct)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "*")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            if write_body:
                self.wfile.write(data)

        def do_GET(self):  # noqa: N802
            self._serve(write_body=True)

        def do_HEAD(self):  # noqa: N802
            self._serve(write_body=False)

        def do_POST(self):  # noqa: N802
            self._serve(write_body=True)

        def do_OPTIONS(self):  # noqa: N802
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "*")
            self.send_header("Content-Length", "0")
            self.end_headers()

        def log_message(self, fmt, *args):
            print(f"  {self.command} {self.path} -> {args[1] if len(args) > 1 else '?'}")

    return H


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("out_dir")
    ap.add_argument("--port", type=int, default=8080)
    ap.add_argument("--host", default="127.0.0.1")
    args = ap.parse_args()

    root = Path(args.out_dir)
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    print(f"Loaded {len(manifest['responses'])} responses from {root}")
    print(f"Origin: {manifest['origin']}")
    print(f"Open  : http://{args.host}:{args.port}/")

    server = ThreadingHTTPServer((args.host, args.port), make_handler(root, manifest))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
