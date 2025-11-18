from sqlalchemy.orm import Session
from app.db import models #models.pyの中のfridge_contentsクラスを使用するため
from app.api import schemas
from datetime import date

#create_itemを定義
def create_item(db: Session, item: schemas.FridgeContentsCreate):
    db_item = models.FridgeContents(
        name=item.name,
        category=item.category,
        date_purchase=item.date_purchase,  
        date_expiration=item.date_expiration
    )

    #入力されたデータをテーブルに格納
    db.add(db_item) #作ったdb_itmeをデータベースに追加する準備
    db.commit() #実際にデータベースに保存する処理
    db.refresh(db_item) #保存されたばかりのdb_itemを最新の状態に更新
    return db_item #保存したデータを返して、APIのレスポンスとして使えるように


#テーブルからデータの一覧を取得
def get_items_sorted(db: Session):
    return db.query(models.FridgeContents).order_by(models.FridgeContents.date_expiration).all()

#削除処理機能
def delete_item(db: Session, item_id: int):
    item = db.query(models.FridgeContents).filter(models.FridgeContents.itemID == item_id).first() # itemID（主キー）で該当の食材を探して、あれば削除
    if item:
        db.delete(item)
        db.commit()
        return True
    return False

