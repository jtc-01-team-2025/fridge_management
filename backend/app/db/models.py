from sqlalchemy import Column, Integer, String, Date
from .database import Base

class FridgeContents(Base):
   
   
    __tablename__ = "fridge_contents"

    itemID = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    registered_on = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False)
    quantity = Column(Integer, nullable=False)

