"""Trainer schemas."""
from pydantic import BaseModel
from typing import Optional


class TrainerBase(BaseModel):
    name: str
    photo_url: str = ""
    is_in_marquee: bool = True
    display_order: int = 0


class TrainerCreate(TrainerBase):
    pass


class TrainerUpdate(BaseModel):
    name: Optional[str] = None
    photo_url: Optional[str] = None
    is_in_marquee: Optional[bool] = None
    display_order: Optional[int] = None


class TrainerResponse(TrainerBase):
    id: int

    class Config:
        from_attributes = True
