from pydantic import BaseModel
from datetime import date

from typing import List

class FridgeContentsBase(BaseModel):
    name: str
    category: str
    date_purchase: date
    date_expiration: date

class Item(BaseModel):
    itemID: int
    name: str
    category: str
    date_purchase: date
    date_expiration: date
    model_config = {
        "from_attributes": True  # ←これを追加
    }

class ItemCreate(BaseModel):
    items: List[Item]


# ユーザーが食材を登録するときに使う
class FridgeContentsCreate(FridgeContentsBase):
    pass
   

# レスポンス用のスキーマ
class FridgeContents(FridgeContentsBase):
    itemID: int
    

    class Config:
        from_attributes = True
