from bs4 import BeautifulSoup

from .models import (
    OpenGraphMetadata,
    PageMetadata,
)


def extract_metadata(
    html: str,
) -> PageMetadata:

    soup = BeautifulSoup(
        html,
        "html.parser",
    )

    title = None

    if soup.title:
        title = soup.title.get_text(
            strip=True
        )

    description = None

    description_tag = soup.find(
        "meta",
        attrs={
            "name": "description"
        },
    )

    if description_tag:
        description = (
            description_tag.get("content")
        )

    canonical_url = None

    canonical = soup.find(
        "link",
        attrs={
            "rel": "canonical"
        },
    )

    if canonical:
        canonical_url = canonical.get(
            "href"
        )

    og = OpenGraphMetadata()

    og_values = {}

    for tag in soup.find_all(
        "meta"
    ):

        property_name = tag.get(
            "property"
        )

        if (
            property_name
            and property_name.startswith(
                "og:"
            )
        ):

            key = property_name[3:]

            og_values[key] = tag.get(
                "content"
            )

    og = OpenGraphMetadata(
        title=og_values.get("title"),
        description=og_values.get(
            "description"
        ),
        image=og_values.get("image"),
        url=og_values.get("url"),
        type=og_values.get("type"),
    )

    return PageMetadata(
        title=title,
        description=description,
        canonical_url=canonical_url,
        open_graph=og,
    )