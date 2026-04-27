"""Trainers API — Public listing + Admin CRUD."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.database import get_db
from models.trainer import Trainer
from schemas.trainer import TrainerCreate, TrainerUpdate, TrainerResponse
from core.security import get_current_admin

router = APIRouter(tags=["Trainers"])


# ── Public ──────────────────────────────────────────────
@router.get("/trainers", response_model=List[TrainerResponse])
async def list_trainers(db: AsyncSession = Depends(get_db)):
    """List all trainers ordered by display_order."""
    result = await db.execute(select(Trainer).order_by(Trainer.display_order))
    return result.scalars().all()


# ── Admin ───────────────────────────────────────────────
@router.post("/admin/trainers", response_model=TrainerResponse, status_code=201)
async def create_trainer(
    data: TrainerCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    trainer = Trainer(**data.model_dump())
    db.add(trainer)
    await db.flush()
    await db.refresh(trainer)
    return trainer


@router.put("/admin/trainers/{trainer_id}", response_model=TrainerResponse)
async def update_trainer(
    trainer_id: int,
    data: TrainerUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(Trainer).where(Trainer.id == trainer_id))
    trainer = result.scalar_one_or_none()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(trainer, field, value)

    await db.flush()
    await db.refresh(trainer)
    return trainer


@router.delete("/admin/trainers/{trainer_id}", status_code=204)
async def delete_trainer(
    trainer_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(Trainer).where(Trainer.id == trainer_id))
    trainer = result.scalar_one_or_none()
    if not trainer:
        raise HTTPException(status_code=404, detail="Trainer not found")
    await db.delete(trainer)
