"""Branch model for gym locations."""
from sqlalchemy import Column, Integer, String
from db.database import Base


class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    maps_url = Column(String(500), default="")
    photo_url = Column(String(500), nullable=True)
