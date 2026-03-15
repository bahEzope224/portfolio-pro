"""
CV router – upload / replace / delete / public read.
Only one CV record exists at a time.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.utils.files import save_cv, delete_file

router = APIRouter()


@router.get("/", response_model=Optional[schemas.CVOut])
def get_cv(db: Session = Depends(get_db)):
    """Public endpoint – returns current CV metadata or null."""
    return db.query(models.CV).first()


@router.post("/", response_model=schemas.CVOut, status_code=201)
def upload_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    """Upload (or replace) the CV PDF. Only one record is kept."""
    # Remove old record + file
    existing = db.query(models.CV).first()
    if existing:
        delete_file(existing.file_path)
        db.delete(existing)
        db.flush()

    file_path = save_cv(file)
    cv = models.CV(filename=file.filename, file_path=file_path)
    db.add(cv)
    db.commit()
    db.refresh(cv)
    return cv


@router.delete("/", status_code=204)
def delete_cv(
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    """Delete the current CV."""
    cv = db.query(models.CV).first()
    if not cv:
        raise HTTPException(status_code=404, detail="No CV found")
    delete_file(cv.file_path)
    db.delete(cv)
    db.commit()
