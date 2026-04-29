from pydantic import BaseModel
from typing import Optional

class ProgramCreate(BaseModel):
    name: str
    display_order: Optional[int] = 0

class ProgramUpdate(BaseModel):
    name: Optional[str] = None
    display_order: Optional[int] = None

class ProgramResponse(BaseModel):
    id: int
    name: str
    display_order: int

    class Config:
        from_attributes = True
