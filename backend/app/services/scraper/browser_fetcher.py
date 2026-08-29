
from playwright.async_api import (
    async_playwright,
)

from .exceptions import BrowserFetchError


class BrowserFetcher:

    async def fetch(
        self,
        url: str,
    ) -> tuple[str, int, str]:

        try:

            async with async_playwright() as p:

                browser = await p.chromium.launch(
                    headless=True
                )

                page = await browser.new_page()

                response = await page.goto(
                    url,
                    wait_until="domcontentloaded",
                    timeout=30000,
                )

                await page.wait_for_load_state(
                    "networkidle"
                )

                html = await page.content()

                status_code = (
                    response.status
                    if response
                    else 200
                )

                final_url = page.url

                await browser.close()

                return (
                    html,
                    status_code,
                    final_url,
                )

        except Exception as exc:

            raise BrowserFetchError(
                str(exc)
            ) from exc