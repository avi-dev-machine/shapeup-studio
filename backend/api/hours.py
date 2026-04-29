"""Gym Hours + Admission Charges API."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.database import get_db
from models.hours import GymHours, AdmissionCharge
from schemas.hours import GymHoursResponse, GymHoursUpdate, GymHoursCreate, AdmissionChargeResponse, AdmissionChargeUpdate
from core.security import get_current_admin

router = APIRouter(tags=["Hours & Admission"])


# ── Public ──────────────────────────────────────────────
@router.get("/hours", response_model=List[GymHoursResponse])
async def list_hours(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GymHours))
    return result.scalars().all()


@router.get("/admission", response_model=List[AdmissionChargeResponse])
async def list_admission(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdmissionCharge))
    return result.scalars().all()


# ── Admin ───────────────────────────────────────────────
@router.put("/admin/hours/{hour_id}", response_model=GymHoursResponse)
async def update_hours(
    hour_id: int,
    data: GymHoursUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(GymHours).where(GymHours.id == hour_id))
    hours = result.scalar_one_or_none()
    if not hours:
        raise HTTPException(status_code=404, detail="Gym hours slot not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(hours, field, value)

    await db.flush()
    await db.refresh(hours)
    return hours


@router.post("/admin/hours", response_model=GymHoursResponse)
async def create_hours(
    data: GymHoursCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    hours = GymHours(**data.model_dump())
    db.add(hours)
    await db.flush()
    await db.refresh(hours)
    return hours


@router.delete("/admin/hours/{hour_id}")
async def delete_hours(
    hour_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(GymHours).where(GymHours.id == hour_id))
    hours = result.scalar_one_or_none()
    if not hours:
        raise HTTPException(status_code=404, detail="Gym hours slot not found")

    await db.delete(hours)
    await db.flush()
    return {"status": "deleted"}


@router.put("/admin/admission/{charge_id}", response_model=AdmissionChargeResponse)
async def update_admission(
    charge_id: int,
    data: AdmissionChargeUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(AdmissionCharge).where(AdmissionCharge.id == charge_id))
    charge = result.scalar_one_or_none()
    if not charge:
        raise HTTPException(status_code=404, detail="Admission charge not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(charge, field, value)

    await db.flush()
    await db.refresh(charge)
    return charge
