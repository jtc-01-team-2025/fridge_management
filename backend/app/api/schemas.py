from pydantic import BaseModel
from datetime import date

from typing import List


class FridgeContentsBase(BaseModel):
    name: str
    category: str
    registered_on: date
    expiry_date: date
    quantity: int

    class Config:
        from_attributes = True

class ItemCreate(BaseModel):
    name: str
    category: str
    registered_on: date
    expiry_date: date
    quantity: int

class Item(BaseModel):
    itemID: int
    name: str
    category: str
    registered_on: date
    expiry_date: date
    quantity: int

    model_config = {
        "from_attributes": True
    }

class ItemResponse(BaseModel):
    itemID: int
    name: str
    category: str
    registered_on: date
    expiry_date: date
    quantity: int

    class Config:
        from_attributes = True


# ユーザーが食材を登録するときに使う
class FridgeContentsCreate(FridgeContentsBase):
    pass
   
