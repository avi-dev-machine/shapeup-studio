"""Authentication endpoint — Admin login."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from db.database import get_db
from models.admin import Admin
from schemas.auth import LoginRequest, TokenResponse
from core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Admin login — returns JWT token on success."""
    result = await db.execute(
        select(Admin).where(Admin.email == request.email)
    )
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(request.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": admin.email})
    return TokenResponse(access_token=token)
