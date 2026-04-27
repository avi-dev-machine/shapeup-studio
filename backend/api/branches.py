"""Branches API — Public listing + Admin edit."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.database import get_db
from models.branch import Branch
from schemas.branch import BranchCreate, BranchUpdate, BranchResponse
from core.security import get_current_admin

router = APIRouter(tags=["Branches"])


@router.get("/branches", response_model=List[BranchResponse])
async def list_branches(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Branch))
    return result.scalars().all()


@router.put("/admin/branches/{branch_id}", response_model=BranchResponse)
async def update_branch(
    branch_id: int,
    data: BranchUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(Branch).where(Branch.id == branch_id))
    branch = result.scalar_one_or_none()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(branch, field, value)

    await db.flush()
    await db.refresh(branch)
    return branch


@router.post("/admin/branches", response_model=BranchResponse)
async def create_branch(
    data: BranchCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    branch = Branch(**data.model_dump())
    db.add(branch)
    await db.flush()
    await db.refresh(branch)
    return branch


@router.delete("/admin/branches/{branch_id}")
async def delete_branch(
    branch_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(Branch).where(Branch.id == branch_id))
    branch = result.scalar_one_or_none()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    await db.delete(branch)
    await db.flush()
    return {"status": "deleted"}
