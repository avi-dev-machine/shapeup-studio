"""Special Programs API."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.database import get_db
from models.program import SpecialProgram
from schemas.program import ProgramCreate, ProgramUpdate, ProgramResponse
from core.security import get_current_admin

router = APIRouter(tags=["Programs"])

@router.get("/programs", response_model=List[ProgramResponse])
async def list_programs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SpecialProgram).order_by(SpecialProgram.display_order))
    return result.scalars().all()

@router.post("/admin/programs", response_model=ProgramResponse)
async def create_program(
    data: ProgramCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    prog = SpecialProgram(**data.model_dump())
    db.add(prog)
    await db.flush()
    await db.refresh(prog)
    return prog

@router.put("/admin/programs/{prog_id}", response_model=ProgramResponse)
async def update_program(
    prog_id: int,
    data: ProgramUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(SpecialProgram).where(SpecialProgram.id == prog_id))
    prog = result.scalar_one_or_none()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(prog, field, value)

    await db.flush()
    await db.refresh(prog)
    return prog

@router.delete("/admin/programs/{prog_id}")
async def delete_program(
    prog_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(SpecialProgram).where(SpecialProgram.id == prog_id))
    prog = result.scalar_one_or_none()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")

    await db.delete(prog)
    await db.flush()
    return {"status": "deleted"}
