"""Reviews API — Public list/submit + Admin moderation (delete)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db.database import get_db
from models.review import Review
from schemas.review import ReviewCreate, ReviewResponse
from core.security import get_current_admin

router = APIRouter(tags=["Reviews"])


@router.get("/reviews", response_model=List[ReviewResponse])
async def list_reviews(db: AsyncSession = Depends(get_db)):
    """List all reviews, newest first."""
    result = await db.execute(select(Review).order_by(Review.created_at.desc()))
    return result.scalars().all()


@router.post("/reviews", response_model=ReviewResponse, status_code=201)
async def submit_review(data: ReviewCreate, db: AsyncSession = Depends(get_db)):
    """Public: submit a review (1-5 stars + comment)."""
    review = Review(**data.model_dump())
    db.add(review)
    await db.flush()
    await db.refresh(review)
    return review


@router.delete("/admin/reviews/{review_id}", status_code=204)
async def delete_review(
    review_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: dict = Depends(get_current_admin),
):
    """Admin: delete a review."""
    result = await db.execute(select(Review).where(Review.id == review_id))
    review = result.scalar_one_or_none()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    await db.delete(review)
