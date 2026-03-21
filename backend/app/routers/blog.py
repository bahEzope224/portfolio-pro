"""
Blog Router
===========
Public  : GET /api/blog/          → liste des articles publiés (summary)
          GET /api/blog/{slug}    → article complet + incrémente views
          GET /api/blog/categories → liste des catégories
          GET /api/blog/tags       → liste de tous les tags
Admin   : POST / PUT / DELETE     → CRUD complet + upload cover
"""
import re
import json
import unicodedata
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
from app.utils.files import save_image, delete_file

router = APIRouter()

# ---------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------f slugify(text_: str) -> str:
    text_ = unicodedata.normalize("NFKD", text_)
    text_ = text_.encode("ascii", "ignore").decode("ascii")
    text_ = text_.lower().strip()
    text_ = re.sub(r"[^\w\s-]", "", text_)
    text_ = re.sub(r"[\s_-]+", "-", text_)
    text_ = re.sub(r"^-+|-+$", "", text_)
    return text_

def unique_slug(title: str, db: Session, exclude_id: Optional[int] = None) -> str:
    base = slugify(title)
    slug = base
    counter = 1
    while True:
        query = db.query(models.BlogPost).filter(models.BlogPost.slug == slug)
        if exclude_id:
            query = query.filter(models.BlogPost.id != exclude_id)
        if not query.first():
            return slug
        slug = f"{base}-{counter}"
        counter += 1

def estimate_reading_time(content: str) -> int:
    words = len(content.split())
    return max(1, round(words / 200))

# ---------------------------------------------------------------------------
# Public endpoints
# ---------------------------------------------------------------------------
@router.get("/", response_model=List[schemas.BlogPostSummary])
def list_posts(
    category: Optional[str] = Query(None),
    tag: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db),
):
    query = db.query(models.BlogPost).filter(models.BlogPost.is_published == True)

    if category:
        query = query.filter(
            func.lower(models.BlogPost.category) == category.lower()
        )

    if tag:
        # Opérateur JSONB PostgreSQL @> pour chercher dans un tableau JSON
        query = query.filter(
            text("blog_posts.tags @> :tag_json").bindparams(
                tag_json=json.dumps([tag])
            )
        )

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            models.BlogPost.title.ilike(search_term) |
            models.BlogPost.excerpt.ilike(search_term)
        )

    return (
        query
       .order_by(models.BlogPost.published_at.desc(), models.BlogPost.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get("/featured", response_model=List[schemas.BlogPostSummary])
def featured_posts(db: Session = Depends(get_db)):
    return (
        db.query(models.BlogPost)
        .filter(
            models.BlogPost.is_published == True,
            models.BlogPost.is_featured == True,
        )
        .order_by(models.BlogPost.published_at.desc())
        .limit(3)
        .all()
    )


@router.get("/categories", response_model=List[str])
def list_categories(db: Session = Depends(get_db)):
    rows = (
        db.query(models.BlogPost.category)
        .filter(models.BlogPost.is_published == True)
        .distinct()
        .all()
    )
    return [r[0] for r in rows]


@router.get("/tags", response_model=List[str])
def list_tags(db: Session = Depends(get_db)):
    posts = (
        db.query(models.BlogPost.tags)
        .filter(models.BlogPost.is_published == True)
        .all()
    )
    all_tags = set()
    for (tags,) in posts:
        if tags:
            all_tags.update(tags)
    return sorted(list(all_tags))


@router.get("/{slug}", response_model=schemas.BlogPostOut)
def get_post(slug: str, db: Session = Depends(get_db)):
    post = db.query(models.BlogPost).filter(
        models.BlogPost.slug == slug,
        models.BlogPost.is_published == True,
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    post.views += 1
    db.commit()
    db.refresh(post)
    return post


# ---------------------------------------------------------------------------
# Admin endpoints
# ---------------------------------------------------------------------------
@router.get("/admin/all", response_model=List[schemas.BlogPostSummary])
def list_all_posts(
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    return (
        db.query(models.BlogPost)
        .order_by(modelsBlogPost.updated_at.desc())
        .all()
    )


@router.post("/", response_model=schemas.BlogPostOut, status_code=201)
def create_post(
    title:            str  = Form(...),
    content:          str  = Form(...),
    category:         str  = Form("Général"),
    tags:             str  = Form("[]"),
    excerpt:          Optional[str] = Form(None),
    slug:             Optional[str] = Form(None),
    is_published:     bool = Form(False),
    is_featured:      bool = Form(False),
    meta_title:       Optional[str] = Form(None),
    meta_description: Optional[str] = Form(None),
    cover:            Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    final_slug = unique_slug(slug or title, db)
    cover_path = save_image(cover) if cover and cover.filename else None

    post = models.BlogPost(
        title=title,
        slug=final_slug,
        excerpt=excerpt,
        content=content,
        category=category,
        ts=json.loads(tags),
        reading_time=estimate_reading_time(content),
        cover_path=cover_path,
        is_published=is_published,
        is_featured=is_featured,
        meta_title=meta_title or title[:70],
        meta_description=meta_description or (excerpt or "")[:160],
        published_at=datetime.utcnow() if is_published else None,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/{post_id}", response_model=schemas.BlogPostOut)
def update_post(
    post_id:          int,
    title:            Optional[str]  = Form(None),
    content:          Optional[str]  = Form(None),
    category:         Optional[str]  = Form(None),
    tags:             Optional[str]  = Form(None),
    excerpt:          Optional[str]  = Form(None),
    slug:             Optional[str]  = Form(None),
    is_published:     Optional[bool] = Form(None),
    is_featured:      Optional[bool] = Form(None),
    meta_title:       Optional[str]  = Form(None),
    meta_description: Optional[str]  = Form(None),
    cover:            Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")

    if title is not None:
        post.title = title
        post.reading_time = estimate_reading_time(post.content)
    if content is not None:
        post.content = content
        post.reading_time = estimate_reading_time(content)
    if category is not None:         post.category = category
    if tags is not None:             post.tags = json.loads(tags)
    if excerpt is not None:          post.excerpt = excerpt
    if meta_title is not None:       post.meta_title = meta_title
    if meta_description is not None: post.meta_description = meta_description
    if is_featured is not None:      post.is_featured = is_featured

    if is_published is not None:
       if is_published and not post.is_published:
            post.published_at = datetime.utcnow()
        post.is_published = is_published

    if slug is not None:
        post.slug = unique_slug(slug, db, exclude_id=post_id)
    elif title is not None:
        post.slug = unique_slug(title, db, exclude_id=post_id)

    if cover and cover.filename:
        if post.cover_path:
            delete_file(post.cover_path)
        post.cover_path = save_image(cover)

    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    if post.cover_path:
        delete_file(post.cover_path)
    db.delete(post)
    db.commit()


@router.get("/admin/{post_id}", response_model=schemas.BlogPstOut)
def get_post_by_id(
    post_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    post = db.query(models.BlogPost).filter(models.BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Article non trouvé")
    return post
