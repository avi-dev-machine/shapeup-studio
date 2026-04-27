"""Package model for all pricing categories."""
from sqlalchemy import Column, Integer, String, Text
from db.database import Base


class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category = Column(String(50), nullable=False, index=True)  # gym, pt, group_pt, weight_loss, addon
    title = Column(String(255), nullable=False)
    price = Column(Integer, nullable=False)
    duration = Column(String(100), default="")
    notes = Column(Text, default="")
    display_order = Column(Integer, default=0)
