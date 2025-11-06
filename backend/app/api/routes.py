from fastapi import APIRouter
from app.services.fridge_service import get_items

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@router.get("/items")
def read_items():
    items = get_items()
    return {"items": items}