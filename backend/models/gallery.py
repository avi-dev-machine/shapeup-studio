"""Gallery model for photos and videos."""
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from db.database import Base


class GalleryItem(Base):
    __tablename__ = "gallery"

    id = Column(Integer, primary_key=True, autoincrement=True)
    media_type = Column(String(20), nullable=False, default="image")  # image or video
    url = Column(String(500), nullable=False)
    caption = Column(String(500), default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
