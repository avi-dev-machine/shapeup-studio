"""Review schemas."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    author_name: str
    rating: int = Field(ge=1, le=5)
    comment: str = ""


class ReviewResponse(BaseModel):
    id: int
    author_name: str
    rating: int
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
