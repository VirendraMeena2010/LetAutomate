
from .browser_fetcher import BrowserFetcher
from .config import DEFAULT_SCRAPER_CONFIG
from .exceptions import RobotsDeniedError
from .http_fetcher import HTTPFetcher
from .metadata_extractor import (
    extract_metadata,
)
from .models import (
    PageResult,
    ScrapeResult,
)
from .page_discovery import (
    discover_pages,
)
from .rate_limiter import (
    DomainRateLimiter,
)
from .robots import RobotsManager
from .text_extractor import (
    extract_text,
)


class ScraperService:

    def __init__(self):

        config = DEFAULT_SCRAPER_CONFIG

        self.robots = RobotsManager(
            config.user_agent
        )

        self.rate_limiter = (
            DomainRateLimiter(
                config.rate_limit_delay
            )
        )

        self.http_fetcher = HTTPFetcher()

        self.browser_fetcher = (
            BrowserFetcher()
        )

        self.use_playwright = (
            config.use_playwright
        )

    async def scrape(
        self,
        url: str,
    ) -> ScrapeResult:

        allowed = await self.robots.can_fetch(
            url
        )

        if not allowed:
            raise RobotsDeniedError(
                f"robots.txt disallows: {url}"
            )

        await self.rate_limiter.wait(
            url
        )

        html, status, final_url = (
            await self.http_fetcher.fetch(
                url
            )
        )

        metadata = extract_metadata(
            html
        )

        text = extract_text(
            html
        )

        pages = [
            PageResult(
                url=final_url,
                page_type="homepage",
                status_code=status,
                text=text,
                metadata=metadata,
                fetch_method="http",
                success=True,
            )
        ]

        discovered = discover_pages(
            html,
            final_url,
        )

        for page_type, page_url in (
            discovered.items()
        ):

            if len(pages) >= (
                DEFAULT_SCRAPER_CONFIG.max_pages
            ):
                break

            page_result = (
                await self._scrape_page(
                    page_url,
                    page_type,
                )
            )

            pages.append(
                page_result
            )

        return ScrapeResult(
            url=url,
            final_url=final_url,
            status_code=status,
            fetch_method="http",
            metadata=metadata,
            pages=pages,
            success=True,
        )

    async def _scrape_page(
        self,
        url: str,
        page_type: str,
    ) -> PageResult:

        allowed = await self.robots.can_fetch(
            url
        )

        if not allowed:
            return PageResult(
                url=url,
                page_type=page_type,
                success=False,
                error="robots.txt disallowed",
            )

        await self.rate_limiter.wait(
            url
        )

        try:

            html, status, final_url = (
                await self.http_fetcher.fetch(
                    url
                )
            )

            metadata = extract_metadata(
                html
            )

            text = extract_text(
                html
            )

            return PageResult(
                url=final_url,
                page_type=page_type,
                status_code=status,
                text=text,
                metadata=metadata,
                fetch_method="http",
                success=True,
            )

        except Exception as http_error:

            if not self.use_playwright:
                return PageResult(
                    url=url,
                    page_type=page_type,
                    success=False,
                    error=str(http_error),
                )

            try:

                html, status, final_url = (
                    await self.browser_fetcher.fetch(
                        url
                    )
                )

                metadata = extract_metadata(
                    html
                )

                text = extract_text(
                    html
                )

                return PageResult(
                    url=final_url,
                    page_type=page_type,
                    status_code=status,
                    text=text,
                    metadata=metadata,
                    fetch_method="playwright",
                    success=True,
                )

            except Exception as browser_error:

                return PageResult(
                    url=url,
                    page_type=page_type,
                    success=False,
                    error=str(browser_error),
                )

