from sqlalchemy.orm import Session
from app.db import models #models.pyの中のfridge_contentsクラスを使用するため
from app.api import schemas
from datetime import date, datetime, timezone

#create_itemを定義
def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.FridgeContents(
        name=item.name,
        category=item.category,
        date_purchase=item.date_purchase,  
        date_expiration=item.date_expiration,
        quantity=item.quantity
    )

    #入力されたデータをテーブルに格納
    db.add(db_item) #作ったdb_itmeをデータベースに追加する準備
    db.commit() #実際にデータベースに保存する処理
    db.refresh(db_item) #保存されたばかりのdb_itemを最新の状態に更新
    return db_item #保存したデータを返して、APIのレスポンスとして使えるように


#テーブルからデータの一覧を取得
def get_items_sorted(db: Session):
    items = db.query(models.FridgeContents).order_by(models.FridgeContents.date_expiration).all()
    print("取得したデータ:", items)
    # Return plain dicts so the frontend always receives predictable keys (including `id`)
    result = []
    for it in items:
        result.append({
            "id": getattr(it, "id", None),
            "name": getattr(it, "name", ""),
            "category": getattr(it, "category", ""),
            "date_purchase": getattr(it, "date_purchase", None),
            "date_expiration": getattr(it, "date_expiration", None),
            "quantity": getattr(it, "quantity", 0),
        })
    return result

#削除処理機能(単独)
def delete_item(db: Session, item_id: int):
    item = db.query(models.FridgeContents).filter(models.FridgeContents.id == item_id).first() # itemID（主キー）で該当の食材を探して、あれば削除
    if item:
        db.delete(item)
        db.commit()
        return True
    return False

#削除処理機能(複数)
def delete_multiple_items(db: Session, item_ids: list[int]) -> int:
    deleted = (
        db.query(models.FridgeContents)
        .filter(models.FridgeContents.item_id.in_(item_ids))
        .delete(synchronize_session=False)
    )
    db.commit()
    return deleted

#食材個数の更新機能
def consume_item(db: Session, item_id: int, consume_item: int):
    item = (
    db.query(models.FridgeContents)
    .filter(models.FridgeContents.id == item_id)
    .first()
    ) 
    if (not item or consume_item <= 0):
        return None

    item.quantity -= consume_item

    if item.quantity <= 0:
        db.delete(item)
    else:
        db.add(item)

    db.commit()
    return item

# --- 買い物リスト ---

def create_shopping_item(db: Session, item: schemas.ShoppingItemCreate):
    db_item = models.ShoppingListItem(
        user_id=item.user_id,
        name=item.name,
        quantity=item.quantity,
        unit=item.unit,
        category=item.category,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_shopping_items(db: Session, user_id: str):
    return (
        db.query(models.ShoppingListItem)
        .filter(models.ShoppingListItem.user_id == user_id)
        .order_by(models.ShoppingListItem.created_at)
        .all()
    )


def check_shopping_item(db: Session, item_id: int, checked: bool):
    item = db.query(models.ShoppingListItem).filter(models.ShoppingListItem.id == item_id).first()
    if not item:
        return None
    item.checked = checked
    item.checked_at = datetime.now(timezone.utc) if checked else None
    db.commit()
    db.refresh(item)
    return item


def delete_shopping_item(db: Session, item_id: int) -> bool:
    item = db.query(models.ShoppingListItem).filter(models.ShoppingListItem.id == item_id).first()
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True