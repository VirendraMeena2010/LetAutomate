from urllib.parse import (
    urljoin,
    urlparse,
)

from bs4 import BeautifulSoup


PAGE_PATTERNS = {
    "about": [
        "about",
        "company",
        "who-we-are",
    ],
    "pricing": [
        "pricing",
        "plans",
    ],
    "careers": [
        "career",
        "careers",
        "jobs",
        "join-us",
    ],
    "blog": [
        "blog",
        "news",
        "articles",
        "resources",
    ],
}


def discover_pages(
    html: str,
    base_url: str,
) -> dict[str, str]:

    soup = BeautifulSoup(
        html,
        "html.parser",
    )

    discovered = {}

    base_domain = urlparse(
        base_url
    ).netloc

    for link in soup.find_all(
        "a",
        href=True,
    ):

        href = link["href"]

        absolute_url = urljoin(
            base_url,
            href,
        )

        parsed = urlparse(
            absolute_url
        )

        if parsed.netloc != base_domain:
            continue

        path = (
            parsed.path.lower()
        )

        anchor_text = (
            link.get_text(
                " ",
                strip=True,
            )
            .lower()
        )

        for page_type, patterns in (
            PAGE_PATTERNS.items()
        ):

            if page_type in discovered:
                continue

            if any(
                pattern in path
                or pattern in anchor_text
                for pattern in patterns
            ):

                discovered[page_type] = (
                    absolute_url
                )

    return discovered