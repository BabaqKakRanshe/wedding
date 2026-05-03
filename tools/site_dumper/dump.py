#!/usr/bin/env python3
"""Full-fidelity site dumper via headless Chromium.

Captures every network response (HTML, CSS, JS, JSON, images, fonts,
audio/video including HLS .m3u8 + .ts segments, XHR/fetch payloads).
BFS-crawls same-origin pages, scrolls each page to trigger lazy
loading, and tries to play media so streaming segments are pulled.

Output layout:
    out_dir/
        manifest.json                 -- url -> {local, status, content_type, headers}
        <host>/<path>/...             -- raw response bodies, original tree
        _long/<sha1>.<ext>            -- fallback for paths > OS limit

Usage:
    pip install -r requirements.txt
    python -m playwright install chromium
    python dump.py https://example.com out_dir
"""
from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import re
import sys
import urllib.parse
from pathlib import Path
from playwright.async_api import async_playwright, Response

HTML_LIKE = ("text/html", "application/xhtml+xml")
WIN_RESERVED = re.compile(r'[<>:"|?*\x00-\x1f]')


def safe_segment(s: str) -> str:
    s = WIN_RESERVED.sub("_", s)
    if s in {"", ".", ".."}:
        s = "_"
    return s[:180]


def url_to_relpath(url: str, content_type: str = "") -> Path:
    p = urllib.parse.urlsplit(url)
    host = safe_segment(p.netloc) or "_unknown_host"
    parts = [safe_segment(seg) for seg in p.path.split("/") if seg]
    trailing_slash = p.path.endswith("/") or not p.path
    if trailing_slash:
        parts.append("index.html")
    if p.query:
        qhash = hashlib.sha1(p.query.encode()).hexdigest()[:8]
        parts[-1] = f"{parts[-1]}__q__{qhash}"
    rel = Path(host, *parts)
    if any(ct in content_type for ct in HTML_LIKE) and rel.suffix == "":
        rel = rel.with_suffix(".html")
    return rel


async def auto_scroll(page, passes: int = 3, step: int = 800, pause: float = 0.4) -> None:
    """Scroll to bottom several times, triggering lazy-load and intersection observers."""
    for _ in range(passes):
        prev_y = -1
        for _ in range(200):
            cur_y = await page.evaluate("() => window.scrollY")
            if cur_y == prev_y:
                break
            prev_y = cur_y
            await page.evaluate(f"() => window.scrollBy(0, {step})")
            await asyncio.sleep(pause)
        await page.evaluate("() => window.scrollTo(0, 0)")
        await asyncio.sleep(pause)


class Dumper:
    def __init__(
        self,
        start_url: str,
        out_dir: Path,
        max_pages: int = 200,
        scroll_passes: int = 3,
        page_timeout_ms: int = 60000,
        idle_timeout_ms: int = 15000,
        media_play_seconds: float = 5.0,
        same_origin_only_crawl: bool = True,
    ) -> None:
        self.start_url = start_url
        self.origin = urllib.parse.urlsplit(start_url).netloc
        self.scheme = urllib.parse.urlsplit(start_url).scheme
        self.out_dir = out_dir
        self.max_pages = max_pages
        self.scroll_passes = scroll_passes
        self.page_timeout_ms = page_timeout_ms
        self.idle_timeout_ms = idle_timeout_ms
        self.media_play_seconds = media_play_seconds
        self.same_origin_only_crawl = same_origin_only_crawl
        self.visited_pages: set[str] = set()
        self.queue: list[str] = []
        self.manifest: dict[str, dict] = {}
        self.saved_urls: set[str] = set()

    def _save_body(self, url: str, body: bytes, status: int, headers: dict) -> None:
        if url in self.saved_urls:
            return
        ct = headers.get("content-type", "")
        rel = url_to_relpath(url, ct)
        local = self.out_dir / rel
        local.parent.mkdir(parents=True, exist_ok=True)
        try:
            local.write_bytes(body)
        except OSError:
            h = hashlib.sha1(url.encode()).hexdigest()
            ext = rel.suffix or ""
            local = self.out_dir / "_long" / f"{h}{ext}"
            local.parent.mkdir(parents=True, exist_ok=True)
            local.write_bytes(body)
        self.saved_urls.add(url)
        self.manifest[url] = {
            "local": str(local.relative_to(self.out_dir)).replace("\\", "/"),
            "status": status,
            "content_type": ct,
            "size": len(body),
        }

    async def _on_response(self, response: Response) -> None:
        try:
            url = response.url
            if url.startswith(("data:", "blob:", "chrome-extension:", "about:")):
                return
            req = response.request
            if req.resource_type == "websocket":
                return
            status = response.status
            if 300 <= status < 400:
                return
            try:
                body = await response.body()
            except Exception:
                return
            if not body:
                return
            try:
                headers = await response.all_headers()
            except Exception:
                headers = response.headers
            self._save_body(url, body, status, headers)
            ct = headers.get("content-type", "").split(";")[0]
            short = url if len(url) < 100 else url[:97] + "..."
            print(f"  [{status}] {ct or '?':<30} {len(body):>9}  {short}")
        except Exception as e:
            print(f"  ! response handler error: {e}", file=sys.stderr)

    async def _trigger_media(self, page) -> None:
        try:
            await page.evaluate(
                """() => {
                    document.querySelectorAll('video,audio').forEach(el => {
                        try {
                            el.muted = true;
                            el.preload = 'auto';
                            const p = el.play();
                            if (p && p.catch) p.catch(()=>{});
                        } catch (e) {}
                    });
                }"""
            )
        except Exception:
            pass
        await asyncio.sleep(self.media_play_seconds)

    async def _collect_links(self, page) -> list[str]:
        try:
            hrefs: list[str] = await page.eval_on_selector_all(
                "a[href]", "els => els.map(e => e.href)"
            )
        except Exception:
            hrefs = []
        out = []
        for h in hrefs:
            try:
                p = urllib.parse.urlsplit(h)
                if p.scheme not in ("http", "https"):
                    continue
                if self.same_origin_only_crawl and p.netloc != self.origin:
                    continue
                clean = urllib.parse.urlunsplit((p.scheme, p.netloc, p.path or "/", p.query, ""))
                out.append(clean)
            except Exception:
                continue
        return out

    async def _dismiss_overlays(self, page) -> None:
        """Many SPAs gate content behind an intro/cookie overlay that needs a
        user gesture. Click the viewport center, press Escape, and click any
        button that looks like a 'enter / accept / start' button."""
        for _ in range(3):
            try:
                vw = await page.evaluate("() => window.innerWidth")
                vh = await page.evaluate("() => window.innerHeight")
                await page.mouse.click(vw // 2, vh // 2)
            except Exception:
                pass
            await asyncio.sleep(0.5)
            for sel in (
                'button:has-text("Entrar")', 'button:has-text("Enter")',
                'button:has-text("Accept")', 'button:has-text("Aceptar")',
                'button:has-text("Принять")', 'button:has-text("OK")',
                'button:has-text("Начать")', 'button:has-text("Start")',
                '[role="button"]:has-text("Enter")',
            ):
                try:
                    el = await page.query_selector(sel)
                    if el:
                        await el.click(timeout=1500)
                        await asyncio.sleep(0.4)
                except Exception:
                    pass
            try:
                await page.keyboard.press("Escape")
            except Exception:
                pass
            await asyncio.sleep(0.3)

    async def _crawl_page(self, page, url: str) -> list[str]:
        print(f"\n=> {url}")
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=self.page_timeout_ms)
        except Exception as e:
            print(f"  ! goto failed: {e}", file=sys.stderr)
            return []
        try:
            await page.wait_for_load_state("networkidle", timeout=self.idle_timeout_ms)
        except Exception:
            pass
        await self._dismiss_overlays(page)
        try:
            await page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        await auto_scroll(page, passes=self.scroll_passes)
        await self._trigger_media(page)
        try:
            await page.wait_for_load_state("networkidle", timeout=8000)
        except Exception:
            pass
        return await self._collect_links(page)

    async def run(self) -> None:
        self.out_dir.mkdir(parents=True, exist_ok=True)
        self.queue.append(self.start_url)
        async with async_playwright() as pw:
            browser = await pw.chromium.launch(headless=True)
            context = await browser.new_context(
                viewport={"width": 1440, "height": 900},
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/127.0.0.0 Safari/537.36"
                ),
                ignore_https_errors=True,
                service_workers="block",
                accept_downloads=True,
            )
            page = await context.new_page()
            page.on("response", lambda r: asyncio.create_task(self._on_response(r)))
            page.on("pageerror", lambda e: print(f"  ! pageerror: {e}", file=sys.stderr))

            while self.queue and len(self.visited_pages) < self.max_pages:
                url = self.queue.pop(0)
                if url in self.visited_pages:
                    continue
                self.visited_pages.add(url)
                links = await self._crawl_page(page, url)
                for l in links:
                    if l not in self.visited_pages and l not in self.queue:
                        self.queue.append(l)

            try:
                await page.wait_for_load_state("networkidle", timeout=5000)
            except Exception:
                pass
            await context.close()
            await browser.close()

        manifest_path = self.out_dir / "manifest.json"
        manifest_path.write_text(
            json.dumps(
                {
                    "start_url": self.start_url,
                    "origin": self.origin,
                    "scheme": self.scheme,
                    "pages_visited": sorted(self.visited_pages),
                    "responses": self.manifest,
                },
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
        total_bytes = sum(e["size"] for e in self.manifest.values())
        print(
            f"\nDone. {len(self.manifest)} responses ({total_bytes/1_048_576:.1f} MB) "
            f"across {len(self.visited_pages)} pages."
        )
        print(f"Output : {self.out_dir.resolve()}")
        print(f"Manifest: {manifest_path.resolve()}")
        print(f"Replay : python serve.py {self.out_dir}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Headless full-site dumper.")
    ap.add_argument("url", help="Start URL, e.g. https://example.com/")
    ap.add_argument("out_dir", help="Output directory")
    ap.add_argument("--max-pages", type=int, default=200)
    ap.add_argument("--scroll-passes", type=int, default=3)
    ap.add_argument("--media-seconds", type=float, default=5.0,
                    help="Seconds to let media play so HLS/DASH segments load")
    ap.add_argument("--page-timeout", type=int, default=60000,
                    help="goto timeout, ms")
    ap.add_argument("--idle-timeout", type=int, default=15000,
                    help="network-idle wait, ms")
    ap.add_argument("--cross-origin-crawl", action="store_true",
                    help="Also follow links to other hosts (off by default)")
    args = ap.parse_args()

    dumper = Dumper(
        start_url=args.url,
        out_dir=Path(args.out_dir),
        max_pages=args.max_pages,
        scroll_passes=args.scroll_passes,
        page_timeout_ms=args.page_timeout,
        idle_timeout_ms=args.idle_timeout,
        media_play_seconds=args.media_seconds,
        same_origin_only_crawl=not args.cross_origin_crawl,
    )
    asyncio.run(dumper.run())


if __name__ == "__main__":
    main()
