from datetime import date, timedelta
from app.db import models

from app.db.database import get_db
from app.api.schemas import ItemCreate
from sqlalchemy.orm import Session
from app.db.models import FridgeContents
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.api.schemas import Item

def create_item(data: ItemCreate, db: Session):
    # 同じ食材（name, category, date_expiration）が既に存在するかチェック
    existing_item = db.query(models.FridgeContents).filter(
        models.FridgeContents.name == data.name,
        models.FridgeContents.category == data.category,
        models.FridgeContents.date_expiration == data.date_expiration
    ).first()
    
    if existing_item:
        # 既存のアイテムの数量を加算
        existing_item.quantity += data.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # 新しいアイテムを作成
        new_item = models.FridgeContents(
            name=data.name,
            category=data.category,
            date_purchase=data.date_purchase,
            date_expiration=data.date_expiration,
            quantity=data.quantity
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item


# 賞味期限が切れているか判定
def is_expired(item: FridgeContents) -> bool:
    return item.date_expiration < date.today()

# 賞味期限切れの食材だけを抽出する
def expired_only(items: list[FridgeContents]) -> list[FridgeContents]:
    return [item for item in items if is_expired(item)]

# まだ食べられる食材だけを抽出する
def filter_valid(items: list[FridgeContents]) -> list[FridgeContents]:
    return [item for item in items if not is_expired(item)]

# カテゴリーごとに分類して並ぶ（追加機能）
def group_by_category(items: list[FridgeContents]) -> dict[str, list[FridgeContents]]: #戻り値は「カテゴリ名 → 食材リスト」
    grouped = {}
    for item in items:
        grouped.setdefault(item.category, []).append(item) # item.category（カテゴリ名）をキーにして、辞書に追加
    return grouped

# 今日から指定日数以内に賞味期限が来る食材を抽出する（追加機能。デフォルト：3日）
def expiring_soon(items: list[FridgeContents], days: int = 3) -> list[FridgeContents]:
    today = date.today()
    target_date = today + timedelta(days=days) #月末を超えてもエラーが発生しないように、timedeltaを使用
    return [item for item in items if today <= item.date_expiration <= target_date]
