"""Smoke-test a replayed dump: open it in headless Chromium and report
any failed requests / console errors."""
import asyncio
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from playwright.async_api import async_playwright


async def main(url: str) -> int:
    failed = []
    console_errs = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(ignore_https_errors=True)
        page = await ctx.new_page()
        page.on("requestfailed", lambda r: failed.append((r.url, r.failure)))
        page.on("console", lambda m: console_errs.append((m.type, m.text)) if m.type in ("error",) else None)
        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        try:
            await page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        # try clicking to dismiss intro/overlay
        try:
            await page.mouse.click(720, 450)
            await asyncio.sleep(2)
        except Exception:
            pass
        await page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(2)
        title = await page.title()
        body_chars = await page.evaluate("() => document.body.innerText.length")
        body_preview = await page.evaluate("() => document.body.innerText.slice(0, 600)")
        print("Body preview:")
        print(body_preview)
        await ctx.close()
        await browser.close()
    print(f"Title       : {title}")
    print(f"Body chars  : {body_chars}")
    print(f"Failed reqs : {len(failed)}")
    for u, f in failed[:20]:
        print(f"  - {u}  ({f})")
    print(f"Console errs: {len(console_errs)}")
    for t, m in console_errs[:20]:
        print(f"  [{t}] {m[:300]}")
    return 0 if not failed and not console_errs else 1


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8765/"
    sys.exit(asyncio.run(main(url)))
