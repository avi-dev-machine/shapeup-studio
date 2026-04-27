"""Owner API — Public view + Admin edit."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db.database import get_db
from models.owner import Owner
from schemas.owner import OwnerUpdate, OwnerResponse
from core.security import get_current_admin

router = APIRouter(tags=["Owner"])


@router.get("/owner", response_model=OwnerResponse)
async def get_owner(db: AsyncSession = Depends(get_db)):
    """Get owner info (singleton)."""
    result = await db.execute(select(Owner))
    owner = result.scalar_one_or_none()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner record not found")
    return owner


@router.put("/admin/owner", response_model=OwnerResponse)
async def update_owner(
    data: OwnerUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(Owner))
    owner = result.scalar_one_or_none()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner record not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(owner, field, value)

    await db.flush()
    await db.refresh(owner)
    return owner
