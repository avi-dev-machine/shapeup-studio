"""Hours and Admission schemas."""
from pydantic import BaseModel
from typing import Optional


class GymHoursResponse(BaseModel):
    id: int
    slot_name: str
    time_range: str
    is_highlighted: bool

    class Config:
        from_attributes = True


class GymHoursUpdate(BaseModel):
    slot_name: Optional[str] = None
    time_range: Optional[str] = None
    is_highlighted: Optional[bool] = None


class AdmissionChargeResponse(BaseModel):
    id: int
    description: str
    amount: int

    class Config:
        from_attributes = True


class AdmissionChargeUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[int] = None
