from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import crud, schemas
from app.db.database import get_db
from app.services import fridge_service
from app.api import shopping_utils
from typing import Optional

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
    items = crud.get_items_sorted(db)
    return fridge_service.group_by_category(items)

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


# =============================================================
# 買い物リスト /shopping/
# =============================================================

# 一覧取得
@router.get("/shopping/", response_model=list[schemas.ShoppingItemResponse])
def get_shopping_items(user_id: str, db: Session = Depends(get_db)):
    return crud.get_shopping_items(db, user_id)

# アイテム追加
@router.post("/shopping/", response_model=schemas.ShoppingItemResponse)
def create_shopping_item(data: schemas.ShoppingItemCreate, db: Session = Depends(get_db)):
    return crud.create_shopping_item(db, data)

# チェック状態切り替え
@router.put("/shopping/{item_id}/check/", response_model=schemas.ShoppingItemResponse)
def check_shopping_item(item_id: int, data: schemas.ShoppingItemCheckRequest, db: Session = Depends(get_db)):
    item = crud.check_shopping_item(db, item_id, data.checked)
    if not item:
        raise HTTPException(status_code=404, detail="アイテムが見つかりませんでした")
    return item

# アイテム削除
@router.delete("/shopping/{item_id}")
def delete_shopping_item(item_id: int, db: Session = Depends(get_db)):
    success = crud.delete_shopping_item(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="アイテムが見つかりませんでした")
    return {"message": f"アイテム（ID: {item_id}）を削除しました"}

# 在庫へ移動
# @router.post("/shopping/{item_id}/move-to-inventory/", response_model=schemas.ItemResponse)
# def move_to_inventory(item_id: int, date_expiration: date, db: Session = Depends(get_db)):
#     item = crud.move_to_inventory(db, item_id, date_expiration)
#     if not item:
#         raise HTTPException(status_code=404, detail="アイテムが見つかりませんでした")
#     return item