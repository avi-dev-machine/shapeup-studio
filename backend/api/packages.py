"""Packages API — Public listing + Admin CRUD for all pricing categories."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from db.database import get_db
from models.package import Package
from schemas.package import PackageCreate, PackageUpdate, PackageResponse
from core.security import get_current_admin

router = APIRouter(tags=["Packages"])


@router.get("/packages", response_model=List[PackageResponse])
async def list_packages(
    category: Optional[str] = Query(None, description="Filter by category: gym, pt, group_pt, weight_loss, addon"),
    db: AsyncSession = Depends(get_db),
):
    """List packages, optionally filtered by category."""
    query = select(Package).order_by(Package.category, Package.display_order)
    if category:
        query = query.where(Package.category == category)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/admin/packages", response_model=PackageResponse, status_code=201)
async def create_package(
    data: PackageCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    pkg = Package(**data.model_dump())
    db.add(pkg)
    await db.flush()
    await db.refresh(pkg)
    return pkg


@router.put("/admin/packages/{package_id}", response_model=PackageResponse)
async def update_package(
    package_id: int,
    data: PackageUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(Package).where(Package.id == package_id))
    pkg = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(pkg, field, value)

    await db.flush()
    await db.refresh(pkg)
    return pkg


@router.delete("/admin/packages/{package_id}", status_code=204)
async def delete_package(
    package_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(Package).where(Package.id == package_id))
    pkg = result.scalar_one_or_none()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")
    await db.delete(pkg)
