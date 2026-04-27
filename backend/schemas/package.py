"""Package schemas."""
from pydantic import BaseModel
from typing import Optional


class PackageBase(BaseModel):
    category: str
    title: str
    price: int
    duration: str = ""
    notes: str = ""
    display_order: int = 0


class PackageCreate(PackageBase):
    pass


class PackageUpdate(BaseModel):
    category: Optional[str] = None
    title: Optional[str] = None
    price: Optional[int] = None
    duration: Optional[str] = None
    notes: Optional[str] = None
    display_order: Optional[int] = None


class PackageResponse(PackageBase):
    id: int

    class Config:
        from_attributes = True
