import asyncio
from collections.abc import Awaitable, Callable
from typing import TypeVar


T = TypeVar("T")


async def with_retry(
    operation: Callable[[], Awaitable[T]],
    max_retries: int = 3,
    initial_backoff: float = 1.0,
) -> T:

    last_error = None

    for attempt in range(max_retries):

        try:
            return await operation()

        except Exception as exc:

            last_error = exc

            if attempt == max_retries - 1:
                break

            delay = (
                initial_backoff
                * (2 ** attempt)
            )

            await asyncio.sleep(delay)

    raise last_error