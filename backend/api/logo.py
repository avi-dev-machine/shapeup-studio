"""Logo API — Public view + Admin update."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db.database import get_db
from models.logo import SiteLogo
from schemas.logo import LogoResponse
from core.security import get_current_admin
from pydantic import BaseModel

router = APIRouter(tags=["Logo"])


class LogoUpdate(BaseModel):
    logo_url: str


@router.get("/logo", response_model=LogoResponse)
async def get_logo(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SiteLogo))
    logo = result.scalar_one_or_none()
    if not logo:
        raise HTTPException(status_code=404, detail="Logo not found")
    return logo


@router.put("/admin/logo", response_model=LogoResponse)
async def update_logo(
    data: LogoUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(SiteLogo))
    logo = result.scalar_one_or_none()
    if not logo:
        raise HTTPException(status_code=404, detail="Logo not found")

    logo.logo_url = data.logo_url
    await db.flush()
    await db.refresh(logo)
    return logo
