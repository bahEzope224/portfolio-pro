"""
Experiences router – public reads + admin CRUD + logo upload.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.utils.files import save_image, delete_file

router = APIRouter()


@router.get("/", response_model=List[schemas.ExperienceOut])
def list_experiences(db: Session = Depends(get_db)):
    return db.query(models.Experience).order_by(models.Experience.order, models.Experience.id.desc()).all()


@router.get("/{exp_id}", response_model=schemas.ExperienceOut)
def get_experience(exp_id: int, db: Session = Depends(get_db)):
    exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    return exp


@router.post("/", response_model=schemas.ExperienceOut, status_code=201)
def create_experience(
    company: str = Form(...),
    position: str = Form(...),
    start_date: str = Form(...),
    end_date: Optional[str] = Form(None),
    description: str = Form(...),
    location: Optional[str] = Form(None),
    order: int = Form(0),
    logo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    logo_path = save_image(logo) if logo and logo.filename else None
    exp = models.Experience(
        company=company, position=position,
        start_date=start_date, end_date=end_date,
        description=description, location=location,
        order=order, logo_path=logo_path,
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)
    return exp


@router.put("/{exp_id}", response_model=schemas.ExperienceOut)
def update_experience(
    exp_id: int,
    company: Optional[str] = Form(None),
    position: Optional[str] = Form(None),
    start_date: Optional[str] = Form(None),
    end_date: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    logo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")

    if company is not None:     exp.company     = company
    if position is not None:    exp.position    = position
    if start_date is not None:  exp.start_date  = start_date
    if end_date is not None:    exp.end_date    = end_date
    if description is not None: exp.description = description
    if location is not None:    exp.location    = location
    if order is not None:       exp.order       = order

    if logo and logo.filename:
        if exp.logo_path:
            delete_file(exp.logo_path)
        exp.logo_path = save_image(logo)

    db.commit()
    db.refresh(exp)
    return exp


@router.delete("/{exp_id}", status_code=204)
def delete_experience(
    exp_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    exp = db.query(models.Experience).filter(models.Experience.id == exp_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    if exp.logo_path:
        delete_file(exp.logo_path)
    db.delete(exp)
    db.commit()
