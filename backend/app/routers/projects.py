"""
Projects router – public reads + admin CRUD + image upload.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.utils.files import save_image, delete_file

router = APIRouter()


# ---------------------------------------------------------------------------
# Public
# ---------------------------------------------------------------------------

@router.get("/", response_model=List[schemas.ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    """Return all projects ordered by `order` field."""
    return db.query(models.Project).order_by(models.Project.order, models.Project.id).all()


@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ---------------------------------------------------------------------------
# Admin – CRUD
# ---------------------------------------------------------------------------

@router.post("/", response_model=schemas.ProjectOut, status_code=201)
def create_project(
    title: str = Form(...),
    title_en: Optional[str] = Form(None),
    description: str = Form(...),
    description_en: Optional[str] = Form(None),
    tech_stack: str = Form("[]"),  # JSON string
    github_url: Optional[str] = Form(None),
    live_url: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    order: int = Form(0),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    import json
    image_path = save_image(image) if image and image.filename else None

    project = models.Project(
        title=title,
        title_en=title_en,
        description=description,
        description_en=description_en,
        tech_stack=json.loads(tech_stack),
        github_url=github_url,
        live_url=live_url,
        is_featured=is_featured,
        order=order,
        image_path=image_path,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/{project_id}", response_model=schemas.ProjectOut)
def update_project(
    project_id: int,
    title: Optional[str] = Form(None),
    title_en: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    description_en: Optional[str] = Form(None),
    tech_stack: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    live_url: Optional[str] = Form(None),
    is_featured: Optional[bool] = Form(None),
    order: Optional[int] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    import json
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if title is not None:          project.title          = title
    if title_en is not None:       project.title_en       = title_en
    if description is not None:    project.description    = description
    if description_en is not None: project.description_en = description_en
    if tech_stack is not None:  project.tech_stack  = json.loads(tech_stack)
    if github_url is not None:  project.github_url  = github_url
    if live_url is not None:    project.live_url    = live_url
    if is_featured is not None: project.is_featured = is_featured
    if order is not None:       project.order       = order

    if image and image.filename:
        if project.image_path:
            delete_file(project.image_path)
        project.image_path = save_image(image)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=204)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.image_path:
        delete_file(project.image_path)
    db.delete(project)
    db.commit()
