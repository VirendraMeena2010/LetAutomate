class ScraperError(Exception):
    """Base exception for scraper errors."""


class RobotsDeniedError(ScraperError):
    """Raised when robots.txt disallows crawling."""


class FetchError(ScraperError):
    """Raised when a page cannot be fetched."""


class RateLimitError(ScraperError):
    """Raised when scraping is rate limited."""


class BrowserFetchError(ScraperError):
    """Raised when Playwright fails."""


class PageExtractionError(ScraperError):
    """Raised when page extraction fails."""