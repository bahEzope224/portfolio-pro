"""
CV router – upload / replace / delete / public read.
Only one CV record exists at a time.
"""

from typing import Optional
import httpx
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import StreamingResponse
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


@router.get("/proxy")
async def proxy_cv(db: Session = Depends(get_db)):
    """
    Server-side proxy: fetches the PDF from R2 and streams it back.
    Bypasses browser CORS restrictions since the fetch is server→R2.
    """
    cv = db.query(models.CV).first()
    if not cv:
        raise HTTPException(status_code=404, detail="No CV found")

    file_url = cv.file_path
    # If stored as a relative path (local dev), reject gracefully
    if not file_url.startswith("http"):
        raise HTTPException(status_code=400, detail="CV is stored locally; proxy not needed")

    async with httpx.AsyncClient() as client:
        try:
            r = await client.get(file_url, follow_redirects=True, timeout=30)
            r.raise_for_status()
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"Failed to fetch CV from storage: {exc}")

    return StreamingResponse(
        content=iter([r.content]),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="{cv.filename}"',
            "Cache-Control": "public, max-age=3600",
        },
    )


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
