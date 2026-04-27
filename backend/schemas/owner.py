"""Owner schemas."""
from pydantic import BaseModel
from typing import Optional


class OwnerUpdate(BaseModel):
    name: Optional[str] = None
    photo_url: Optional[str] = None
    description: Optional[str] = None


class OwnerResponse(BaseModel):
    id: int
    name: str
    photo_url: str
    description: str

    class Config:
        from_attributes = True
