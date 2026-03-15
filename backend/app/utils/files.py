"""
Secure file upload helpers.
Handles images (JPEG/PNG/WebP/GIF) and CV (PDF only).
"""

import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from app.utils.storage import save_image, save_cv, delete_file

__all__ = ["save_image", "save_cv", "delete_file"]

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_CV_TYPES    = {"application/pdf"}
MAX_IMAGE_SIZE      = 5 * 1024 * 1024   # 5 MB
MAX_CV_SIZE         = 10 * 1024 * 1024  # 10 MB

UPLOAD_DIR_IMAGES = Path("uploads/images")
UPLOAD_DIR_CV     = Path("uploads/cv")


def _save_file(upload: UploadFile, dest_dir: Path, allowed_types: set, max_size: int) -> str:
    """
    Validate and save an uploaded file.
    Returns the relative file path (from project root).
    """
    if upload.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {upload.content_type}. Allowed: {allowed_types}",
        )

    # Read content & check size
    content = upload.file.read()
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Max size: {max_size // 1024 // 1024} MB",
        )

    # Build a unique filename
    ext = Path(upload.filename).suffix.lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = dest_dir / unique_name

    dest_dir.mkdir(parents=True, exist_ok=True)
    dest_path.write_bytes(content)

    return str(dest_path)


def save_image(upload: UploadFile) -> str:
    return _save_file(upload, UPLOAD_DIR_IMAGES, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE)


def save_cv(upload: UploadFile) -> str:
    return _save_file(upload, UPLOAD_DIR_CV, ALLOWED_CV_TYPES, MAX_CV_SIZE)


def delete_file(file_path: str) -> None:
    """Delete a file if it exists (silent on missing)."""
    try:
        Path(file_path).unlink(missing_ok=True)
    except Exception:
        pass
