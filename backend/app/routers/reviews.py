"""
Reviews router – public reads (visible only) + admin full CRUD + avatar upload.

Public  : GET /api/reviews/          → only is_visible=True, ordered
Admin   : POST / PUT / DELETE        → full control + avatar upload
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

@router.get("/", response_model=List[schemas.ReviewOut])
def list_reviews(db: Session = Depends(get_db)):
    """Return only visible reviews, sorted by order then id."""
    return (
        db.query(models.Review)
        .filter(models.Review.is_visible == True)
        .order_by(models.Review.order, models.Review.id)
        .all()
    )


# ---------------------------------------------------------------------------
# Admin
# ---------------------------------------------------------------------------

@router.get("/admin/all", response_model=List[schemas.ReviewOut])
def list_all_reviews(
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    """Return ALL reviews (including hidden) for admin management."""
    return db.query(models.Review).order_by(models.Review.order, models.Review.id).all()


@router.post("/", response_model=schemas.ReviewOut, status_code=201)
def create_review(
    author_name: str = Form(...),
    author_role: str = Form(...),
    company: Optional[str] = Form(None),
    content: str = Form(...),
    rating: int = Form(5),
    is_featured: bool = Form(False),
    is_visible: bool = Form(True),
    order: int = Form(0),
    avatar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    avatar_path = save_image(avatar) if avatar and avatar.filename else None

    review = models.Review(
        author_name=author_name,
        author_role=author_role,
        company=company,
        content=content,
        rating=rating,
        is_featured=is_featured,
        is_visible=is_visible,
        order=order,
        avatar_path=avatar_path,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.put("/{review_id}", response_model=schemas.ReviewOut)
def update_review(
    review_id: int,
    author_name: Optional[str] = Form(None),
    author_role: Optional[str] = Form(None),
    company: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    rating: Optional[int] = Form(None),
    is_featured: Optional[bool] = Form(None),
    is_visible: Optional[bool] = Form(None),
    order: Optional[int] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if author_name is not None:  review.author_name = author_name
    if author_role is not None:  review.author_role = author_role
    if company is not None:      review.company     = company
    if content is not None:      review.content     = content
    if rating is not None:       review.rating      = rating
    if is_featured is not None:  review.is_featured = is_featured
    if is_visible is not None:   review.is_visible  = is_visible
    if order is not None:        review.order       = order

    if avatar and avatar.filename:
        if review.avatar_path:
            delete_file(review.avatar_path)
        review.avatar_path = save_image(avatar)

    db.commit()
    db.refresh(review)
    return review


@router.patch("/{review_id}/toggle", response_model=schemas.ReviewOut)
def toggle_visibility(
    review_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    """Quick toggle visibility without a full form submission."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_visible = not review.is_visible
    db.commit()
    db.refresh(review)
    return review


@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.avatar_path:
        delete_file(review.avatar_path)
    db.delete(review)
    db.commit()
