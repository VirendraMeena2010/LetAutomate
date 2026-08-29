import asyncio
import time
from urllib.parse import urlparse


class DomainRateLimiter:

    def __init__(self, delay: float = 1.0):
        self.delay = delay

        self._last_request: dict[str, float] = {}

        self._lock = asyncio.Lock()

    async def wait(self, url: str) -> None:

        parsed = urlparse(url)

        domain = parsed.netloc

        async with self._lock:

            now = time.monotonic()

            last_request = (
                self._last_request.get(
                    domain,
                    0.0,
                )
            )

            elapsed = now - last_request

            if elapsed < self.delay:

                await asyncio.sleep(
                    self.delay - elapsed
                )

            self._last_request[domain] = (
                time.monotonic()
            )