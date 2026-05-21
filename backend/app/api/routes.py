from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import crud, schemas
from app.db.database import get_db #DBセッション提供関数の取り込み: Depends(get_db)で、リクエストごとにDBセッションを用意してもらうために使う
from app.services import fridge_service
from app.api.schemas import ItemCreate
from typing import Optional
from app.db import models
from app.api.categories import id_to_name

router = APIRouter()

# root endpoint
@router.get("/")
def read_root():
    return {"message": "今日金曜日!"}

# 入力されたデータの格納用endpoint
@router.post("/items/", response_model=schemas.ItemResponse)
def create_item(data: schemas.ItemCreate, db: Session = Depends(get_db)):
    return fridge_service.create_item(data, db)



# データ一覧の取得用endpoint（賞味期限順に全ての食材）
@router.get("/items/", response_model=list[schemas.ItemResponse])
def read_items(db: Session = Depends(get_db)):
    return crud.get_items_sorted(db)


# まだ食べられるものの判定用endpoint
@router.get("/items/valid/", response_model=list[schemas.ItemResponse])
def read_valid_items(db: Session = Depends(get_db)):
    all_items = crud.get_items_sorted(db)
    return fridge_service.filter_valid(all_items)

# 賞味期限切れの食材だけ表示用endpoint
@router.get("/items/expired/", response_model=list[schemas.ItemResponse])
def read_expired_items(db: Session = Depends(get_db)):
    items = crud.get_items_sorted(db)
    return fridge_service.expired_only(items)

# 指定日数以内に賞味期限が来る食材にフィルターかける用endpoint
@router.get("/items/soon/", response_model=list[schemas.ItemResponse])
def read_soon_expiring_items(days: int = 3, db: Session = Depends(get_db)):
    items = crud.get_items_sorted(db)
    return fridge_service.expiring_soon(items, days)

# カテゴリーごとに分類された食材一覧表示用endpoint
@router.get("/items/grouped/", response_model=dict[str, list[schemas.ItemResponse]])
def read_grouped_items(db: Session = Depends(get_db)):
    # SQLAlchemyモデルオブジェクトを取得して直接グループ化
    items = db.query(models.FridgeContents).order_by(models.FridgeContents.date_expiration).all()
    grouped = {}
    for item in items:
        category_name = id_to_name(getattr(item, "category", None))
        if category_name not in grouped:
            grouped[category_name] = []
        # Convert SQLAlchemy model to plain dict and include category name
        item_dict = {
            "id": item.id,
            "name": item.name,
            "category": category_name,
            "date_purchase": item.date_purchase,
            "date_expiration": item.date_expiration,
            "quantity": item.quantity
        }
        grouped[category_name].append(item_dict)
    return grouped

# 食材単独削除用endpoint
@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    success = crud.delete_item(db, item_id)
    if success:
        return {"message": f"食材（ID: {item_id}）を削除しました"}
    else:
        return {"error": "指定された食材が見つかりませんでした"}

# 食材複数削除用endpoint
@router.delete("/items/")
def delete_multiple_items(
    data: schemas.ItemsDeleteRequest,
    db: Session = Depends(get_db)
):
    deleted_count = crud.delete_multiple_items(db, data.item_ids)
    return {"deleted": deleted_count}

# 食材個数更新用endpoint
@router.put("/items/{item_id}/consume/")
def consume_item(item_id: int, consume_item: int, db: Session = Depends(get_db)):
    updated_item = crud.consume_item(db, item_id, consume_item)
    if updated_item is None:
        return {"error": "指定された食材が見つからないか、消費数が無効です"}
    return {"message": f"食材（ID: {item_id}）を{consume_item}個消費しました", "updated_item": updated_item}