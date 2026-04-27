"""Logo schemas."""
from pydantic import BaseModel


class LogoResponse(BaseModel):
    id: int
    logo_url: str

    class Config:
        from_attributes = True
