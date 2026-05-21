from sqlalchemy import Column, Integer, String, Date
from .database import Base

class FridgeContents(Base):
   
   
    __tablename__ = "fridge_contents"

    # itemID = Column(Integer, primary_key=True, index=True)
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    # Store category as integer in DB (maps to a display name in API)
    category = Column(Integer, nullable=False, default=9)
    date_purchase = Column(Date, nullable=True)
    date_expiration = Column(Date, nullable=False)
    quantity = Column(Integer, nullable=False)
