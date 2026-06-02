from pydantic import BaseModel
from datetime import date
from typing import Optional, List


class FridgeContentsBase(BaseModel):
    #id: int
    name: str
    # store category id when creating/updating; string names are also accepted and normalized by backend
    category: int | str
    date_purchase: Optional[date] = None
    date_expiration: date
    quantity: int

    class Config:
        from_attributes = True

class ItemCreate(FridgeContentsBase):
    pass

class Item(BaseModel):
    id: int
    name: str
    category: str
    date_purchase: date
    date_expiration: date
    quantity: int

    model_config = {
        "from_attributes": True
    }

class ItemResponse(BaseModel):
    id: int
    name: str
    category: str
    date_purchase: Optional[date] = None
    date_expiration: date
    quantity: int

    class Config:
        from_attributes = True

class ItemsDeleteRequest(BaseModel):
    item_ids: List[int]


# --- Shopping list ---

class ShoppingItemCreate(BaseModel):
    name: str
    quantity: int
    unit: str = "個"
    category: str | int
    user_id: str = ""

    class Config:
        from_attributes = True


class ShoppingItemResponse(BaseModel):
    id: int
    user_id: str
    name: str
    quantity: int
    unit: str
    category: str | int
    checked: bool

    class Config:
        from_attributes = True


class ShoppingItemCheckRequest(BaseModel):
    checked: bool




   
