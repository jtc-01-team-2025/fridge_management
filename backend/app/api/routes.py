from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import crud, schemas
from app.db.database import get_db #DBセッション提供関数の取り込み: Depends(get_db)で、リクエストごとにDBセッションを用意してもらうために使う
from app.services import fridge_service
from app.api.schemas import FridgeContentsCreate, ItemCreate


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
@router.get("/items/", response_model=list[schemas.FridgeContentsBase])
def read_items(db: Session = Depends(get_db)):
    return crud.get_items_sorted(db)


# まだ食べられるものの判定用endpoint
@router.get("/items/valid/", response_model=list[schemas.FridgeContentsBase])
def read_valid_items(db: Session = Depends(get_db)):
    all_items = crud.get_items_sorted(db)
    return fridge_service.filter_valid(all_items)

# 賞味期限切れの食材だけ表示用endpoint
@router.get("/items/expired/", response_model=list[schemas.FridgeContentsBase])
def read_expired_items(db: Session = Depends(get_db)):
    items = crud.get_items_sorted(db)
    return fridge_service.expired_only(items)

# 指定日数以内に賞味期限が来る食材にフィルターかける用endpoint
@router.get("/items/soon/", response_model=list[schemas.FridgeContentsBase])
def read_soon_expiring_items(days: int = 3, db: Session = Depends(get_db)):
    items = crud.get_items_sorted(db)
    return fridge_service.expiring_soon(items, days)

# カテゴリーごとに分類された食材一覧表示用endpoint
@router.get("/items/grouped/", response_model=dict[str, list[schemas.FridgeContentsBase]])
def read_grouped_items(db: Session = Depends(get_db)):
    items = crud.get_items_sorted(db)
    return fridge_service.group_by_category(items)

# 食材削除用endpoint
@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    success = crud.delete_item(db, item_id)
    if success:
        return {"message": f"食材（ID: {item_id}）を削除しました"}
    else:
        return {"error": "指定された食材が見つかりませんでした"}
