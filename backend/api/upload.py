"""File upload endpoint — Admin only."""
import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from pydantic import BaseModel

from core.config import settings
from core.security import get_current_admin

router = APIRouter(tags=["Upload"])


class UploadResponse(BaseModel):
    url: str
    filename: str


@router.post("/admin/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    _admin: dict = Depends(get_current_admin),
):
    """Upload a file (image/video). Returns the public URL."""
    # Validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 10MB)")

    # If Cloudinary is configured, use it for persistent storage
    if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY in Render environment variables."
        )

    import cloudinary
    import cloudinary.uploader

    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True
    )
    
    try:
        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(contents, folder="shapeup")
        url = upload_result.get("secure_url")
        filename = upload_result.get("original_filename", "upload")
        return UploadResponse(url=url, filename=filename)
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")
