from datetime import date, timedelta
from app.db import models

from app.db.database import session
from app.api.schemas import Item

def create_items(items):
    created = []
    for item in items:
        new_item = Item(
            name=item.name,
            category=item.category,
            date_purchase=item.date_purchase,
            date_expiration=item.date_expiration
        )
        session.add(new_item)
        created.append(new_item)

    session.commit() 
    # itemID などの自動生成フィールドを反映させる
    for obj in created:
        session.refresh(obj)

    return created


# 賞味期限が切れているか判定
def is_expired(item: Item) -> bool:
    return item.date_expiration < date.today()

# 賞味期限切れの食材だけを抽出する
def expired_only(items: list[Item]) -> list[Item]:
    return [item for item in items if is_expired(item)]

# まだ食べられる食材だけを抽出する
def filter_valid(items: list[Item]) -> list[Item]:
    return [item for item in items if not is_expired(item)]

# カテゴリーごとに分類して並ぶ（追加機能）
def group_by_category(items: list[Item]) -> dict[str, list[Item]]: #戻り値は「カテゴリ名 → 食材リスト」
    grouped = {}
    for item in items:
        grouped.setdefault(item.category, []).append(item) # item.category（カテゴリ名）をキーにして、辞書に追加
    return grouped

# 今日から指定日数以内に賞味期限が来る食材を抽出する（追加機能。デフォルト：3日）
def expiring_soon(items: list[Item], days: int = 3) -> list[Item]:
    today = date.today()
    target_date = today + timedelta(days=days) #月末を超えてもエラーが発生しないように、timedeltaを使用
    return [item for item in items if today <= item.date_expiration <= target_date]
