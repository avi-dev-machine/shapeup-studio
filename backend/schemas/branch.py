"""Branch schemas."""
from pydantic import BaseModel
from typing import Optional


class BranchCreate(BaseModel):
    name: str
    address: str
    maps_url: Optional[str] = ""
    photo_url: Optional[str] = None


class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    maps_url: Optional[str] = None
    photo_url: Optional[str] = None


class BranchResponse(BaseModel):
    id: int
    name: str
    address: str
    maps_url: str
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True
