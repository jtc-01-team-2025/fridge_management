from datetime import date, timedelta
from app.api.schemas import Item

def is_expired(item: Item) -> bool:
    return item.date_expiration < date.today()

def expired_only(items: list[Item]) -> list[Item]:
    return [item for item in items if is_expired(item)]

def filter_valid(items: list[Item]) -> list[Item]:
    return [item for item in items if not is_expired(item)]

def group_by_category(items: list[Item]) -> dict[str, list[Item]]:
    grouped = {}
    for item in items:
        grouped.setdefault(item.category, []).append(item)
    return grouped

def expiring_soon(items: list[Item], days: int = 3) -> list[Item]:
    today = date.today()
    target_date = today + timedelta(days=days)
    return [item for item in items if today <= item.date_expiration <= target_date]