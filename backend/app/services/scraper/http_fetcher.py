import httpx

from .config import DEFAULT_SCRAPER_CONFIG
from .exceptions import FetchError
from .retry import with_retry


class HTTPFetcher:

    def __init__(
        self,
        timeout: float | None = None,
        user_agent: str | None = None,
    ):

        config = DEFAULT_SCRAPER_CONFIG

        self.timeout = (
            timeout
            or config.request_timeout
        )

        self.user_agent = (
            user_agent
            or config.user_agent
        )

    async def fetch(
        self,
        url: str,
    ) -> tuple[str, int, str]:

        async def request():

            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
            ) as client:

                response = await client.get(
                    url,
                    headers={
                        "User-Agent": self.user_agent,
                        "Accept": "text/html,"
                                 "application/xhtml+xml",
                    },
                )

                if response.status_code >= 400:
                    raise FetchError(
                        f"HTTP {response.status_code}"
                    )

                return (
                    response.text,
                    response.status_code,
                    str(response.url),
                )

        return await with_retry(
            request,
            max_retries=3,
            initial_backoff=1.0,
        )