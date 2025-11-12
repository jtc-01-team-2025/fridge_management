from pydantic import BaseModel
from datetime import date

class FridgeContentsBase(BaseModel):
    name: str
    category: str
    date_expiration: date

# ユーザーが食材を登録するときに使う
class FridgeContentsCreate(FridgeContentsBase):
    pass
   

# レスポンス用のスキーマ
class FridgeContents(FridgeContentsBase):
    itemID: int
    date_input: date

    class Config:
        orm_mode = True
