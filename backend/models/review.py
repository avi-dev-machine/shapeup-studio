"""Review model for user-submitted ratings and comments."""
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timezone
from db.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    author_name = Column(String(255), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
