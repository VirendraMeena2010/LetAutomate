from dataclasses import dataclass


@dataclass(frozen=True)
class ScraperConfig:
    request_timeout: float = 15.0

    max_retries: int = 3

    initial_backoff: float = 1.0

    rate_limit_delay: float = 1.0

    max_pages: int = 6

    use_playwright: bool = True

    user_agent: str = (
        "AgentReachBot/1.0 "
        "(Website research crawler)"
    )


DEFAULT_SCRAPER_CONFIG = ScraperConfig()