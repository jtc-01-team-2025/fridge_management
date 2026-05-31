from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, func
from .database import Base

class FridgeContents(Base):
   
   
    __tablename__ = "fridge_contents"

    # itemID = Column(Integer, primary_key=True, index=True)
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    date_purchase = Column(Date, nullable=True)
    date_expiration = Column(Date, nullable=False)
    quantity = Column(Integer, nullable=False)

class ShoppingListItem(Base):
    __tablename__ = "shopping_list_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(64), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit = Column(String(20), nullable=False, default="個")
    category = Column(String(50), nullable=False)
    checked = Column(Boolean, nullable=False, default=False)
    checked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    