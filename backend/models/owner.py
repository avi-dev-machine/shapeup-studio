"""Owner model — singleton record for the gym owner."""
from sqlalchemy import Column, Integer, String, Text
from db.database import Base


class Owner(Base):
    __tablename__ = "owner"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, default="Debashish Dutta")
    photo_url = Column(String(500), default="")
    description = Column(Text, default="")
