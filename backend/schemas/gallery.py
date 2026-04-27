"""Gallery schemas."""
from pydantic import BaseModel
from datetime import datetime


class GalleryItemCreate(BaseModel):
    media_type: str = "image"
    url: str
    caption: str = ""


class GalleryItemResponse(BaseModel):
    id: int
    media_type: str
    url: str
    caption: str
    created_at: datetime

    class Config:
        from_attributes = True
