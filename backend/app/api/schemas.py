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

# --- Profile ---
class ProfileCreate(BaseModel):
    user_id: str
    language: str = "ja"
    family_size: int = 1
    dietary: list[str] = []
    allergies: list[str] = []
    cooking_frequency: str = ""
    budget: str = ""

class ProfileResponse(BaseModel):
    id: int
    user_id: str
    language: str
    family_size: int
    dietary: list[str]
    allergies: list[str]
    cooking_frequency: str
    budget: str
    
    class Config:
        from_attributes = True


# --- Auth ---
class LoginRequest(BaseModel):
    # Optional Supabase session object forwarded from frontend
    class SupabaseUser(BaseModel):
        id: str
        aud: Optional[str] = None
        role: Optional[str] = None
        email: Optional[str] = None

    class SupabaseSession(BaseModel):
        access_token: str
        token_type: Optional[str] = None
        expires_in: Optional[int] = None
        expires_at: Optional[int] = None
        refresh_token: Optional[str] = None
        user: Optional[SupabaseUser] = None

    supabase_session: Optional[SupabaseSession] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

