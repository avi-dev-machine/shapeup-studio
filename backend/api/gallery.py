"""Gallery API — Public listing + Admin upload/delete."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.database import get_db
from models.gallery import GalleryItem
from schemas.gallery import GalleryItemCreate, GalleryItemResponse
from core.security import get_current_admin

router = APIRouter(tags=["Gallery"])


@router.get("/gallery", response_model=List[GalleryItemResponse])
async def list_gallery(db: AsyncSession = Depends(get_db)):
    """List all gallery items, newest first."""
    result = await db.execute(select(GalleryItem).order_by(GalleryItem.created_at.desc()))
    return result.scalars().all()


@router.post("/admin/gallery", response_model=GalleryItemResponse, status_code=201)
async def add_gallery_item(
    data: GalleryItemCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    """Admin: add a gallery item (image/video URL from upload)."""
    item = GalleryItem(**data.model_dump())
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return item


@router.delete("/admin/gallery/{item_id}", status_code=204)
async def delete_gallery_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    """Admin: delete a gallery item."""
    result = await db.execute(select(GalleryItem).where(GalleryItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    await db.delete(item)
