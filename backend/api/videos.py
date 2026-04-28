"""Videos API — Public listing + Admin edit."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.database import get_db
from models.video import WorkoutVideo
from schemas.video import VideoCreate, VideoUpdate, VideoResponse
from core.security import get_current_admin

router = APIRouter(tags=["Videos"])


@router.get("/videos", response_model=List[VideoResponse])
async def list_videos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WorkoutVideo).order_by(WorkoutVideo.display_order))
    return result.scalars().all()


@router.post("/admin/videos", response_model=VideoResponse)
async def create_video(
    data: VideoCreate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    video = WorkoutVideo(**data.model_dump())
    db.add(video)
    await db.flush()
    await db.refresh(video)
    return video


@router.put("/admin/videos/{video_id}", response_model=VideoResponse)
async def update_video(
    video_id: int,
    data: VideoUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(WorkoutVideo).where(WorkoutVideo.id == video_id))
    video = result.scalar_one_or_none()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(video, field, value)

    await db.flush()
    await db.refresh(video)
    return video


@router.delete("/admin/videos/{video_id}")
async def delete_video(
    video_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    result = await db.execute(select(WorkoutVideo).where(WorkoutVideo.id == video_id))
    video = result.scalar_one_or_none()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    await db.delete(video)
    await db.flush()
    return {"status": "deleted"}
