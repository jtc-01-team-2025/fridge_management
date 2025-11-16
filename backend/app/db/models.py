from sqlalchemy import Column, Integer, String, Date
from .database import Base

class FridgeContents(Base):
    """
    fridge_contentsテーブル

    itemID           : No, 主キー
    name             : 材料名
    category.        : カテゴリー
    date_purchase    : 購入日
    date_expiration  : 賞味期限
    
    """
    __tablename__ = "fridge_contents"
    itemID = Column(Integer, primary_key=True, index=True) #primary_key=Trueを指定すると、自動で連番のIDを生成してくれる
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # カテゴリーごとに賞味期限をチェックできるように（追加機能）
    date_purchase = Column(Date)
    date_expiration = Column(Date)
