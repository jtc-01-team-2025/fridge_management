from app.api.schemas import ShoppingItemResponse


def filter_unchecked(items: list[ShoppingItemResponse]) -> list[ShoppingItemResponse]:
    return [item for item in items if not item.checked]


def filter_checked(items: list[ShoppingItemResponse]) -> list[ShoppingItemResponse]:
    return [item for item in items if item.checked]


def group_by_category(
    items: list[ShoppingItemResponse],
) -> dict[str, list[ShoppingItemResponse]]:
    grouped: dict[str, list[ShoppingItemResponse]] = {}
    for item in items:
        grouped.setdefault(item.category, []).append(item)
    return grouped
