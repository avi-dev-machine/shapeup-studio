from pydantic import BaseModel
from typing import Optional

class VideoCreate(BaseModel):
    title: str
    video_url: str
    display_order: Optional[int] = 0

class VideoUpdate(BaseModel):
    title: Optional[str] = None
    video_url: Optional[str] = None
    display_order: Optional[int] = None

class VideoResponse(BaseModel):
    id: int
    title: str
    video_url: str
    display_order: int

    class Config:
        from_attributes = True
