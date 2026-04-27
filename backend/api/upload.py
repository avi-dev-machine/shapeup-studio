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

    # Generate unique filename
    ext = os.path.splitext(file.filename or "upload")[1] or ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    # Write file
    with open(file_path, "wb") as f:
        f.write(contents)

    url = f"/uploads/{unique_name}"
    return UploadResponse(url=url, filename=unique_name)
