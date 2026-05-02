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
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY:
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
            # Fallback to local if Cloudinary fails (not ideal for persistence but prevents 500)
            pass

    # Fallback to local storage (ephemeral on Render)
    # Generate unique filename
    ext = os.path.splitext(file.filename or "upload")[1] or ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    # Write file
    with open(file_path, "wb") as f:
        f.write(contents)

    url = f"/uploads/{unique_name}"
    return UploadResponse(url=url, filename=unique_name)
