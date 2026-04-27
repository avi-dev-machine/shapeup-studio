"""Trainer model for staff management and marquee display."""
from sqlalchemy import Column, Integer, String, Boolean
from db.database import Base


class Trainer(Base):
    __tablename__ = "trainers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    photo_url = Column(String(500), default="")
    is_in_marquee = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
