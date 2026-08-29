from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser

import httpx

from .config import DEFAULT_SCRAPER_CONFIG


class RobotsManager:

    def __init__(self, user_agent: str | None = None):
        self.user_agent = (
            user_agent
            or DEFAULT_SCRAPER_CONFIG.user_agent
        )

        self._parsers: dict[str, RobotFileParser] = {}

    async def _load_robots(
        self,
        base_url: str,
    ) -> RobotFileParser:

        parsed = urlparse(base_url)

        robots_url = (
            f"{parsed.scheme}://"
            f"{parsed.netloc}/robots.txt"
        )

        parser = RobotFileParser()

        try:
            async with httpx.AsyncClient(
                timeout=10.0
            ) as client:

                response = await client.get(
                    robots_url,
                    headers={
                        "User-Agent": self.user_agent
                    },
                )

                if response.status_code == 200:
                    parser.parse(
                        response.text.splitlines()
                    )
                else:
                    parser.parse([])

        except httpx.HTTPError:
            parser.parse([])

        return parser

    async def can_fetch(self, url: str) -> bool:

        parsed = urlparse(url)

        domain = (
            f"{parsed.scheme}://"
            f"{parsed.netloc}"
        )

        if domain not in self._parsers:
            self._parsers[domain] = (
                await self._load_robots(domain)
            )

        parser = self._parsers[domain]

        return parser.can_fetch(
            self.user_agent,
            url,
        )