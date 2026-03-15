"""
Pydantic schemas for request/response validation.
"""

from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, HttpUrl, validator


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


class AdminUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class AdminUserOut(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    is_featured: bool = False
    order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None
    description: Optional[str] = None


class ProjectOut(ProjectBase):
    id: int
    image_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Experiences
# ---------------------------------------------------------------------------

class ExperienceBase(BaseModel):
    company: str
    position: str
    start_date: str        # "YYYY-MM"
    end_date: Optional[str] = None
    description: str
    location: Optional[str] = None
    order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(ExperienceBase):
    company: Optional[str] = None
    position: Optional[str] = None
    start_date: Optional[str] = None
    description: Optional[str] = None


class ExperienceOut(ExperienceBase):
    id: int
    logo_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Skills
# ---------------------------------------------------------------------------

class SkillBase(BaseModel):
    name: str
    category: str
    level: int = 50
    icon: Optional[str] = None
    order: int = 0

    @validator("level")
    def level_range(cls, v):
        if not 0 <= v <= 100:
            raise ValueError("level must be between 0 and 100")
        return v


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    name: Optional[str] = None
    category: Optional[str] = None


class SkillOut(SkillBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# CV
# ---------------------------------------------------------------------------

class CVOut(BaseModel):
    id: int
    filename: str
    file_path: str
    upload_date: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Contact
# ---------------------------------------------------------------------------

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


# ---------------------------------------------------------------------------
# Reviews
# ---------------------------------------------------------------------------

class ReviewBase(BaseModel):
    author_name: str
    author_role: str
    company: Optional[str] = None
    content: str
    rating: int = 5
    is_featured: bool = False
    is_visible: bool = True
    order: int = 0

    @validator("rating")
    def rating_range(cls, v):
        if not 1 <= v <= 5:
            raise ValueError("rating must be between 1 and 5")
        return v


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(ReviewBase):
    author_name: Optional[str] = None
    author_role: Optional[str] = None
    content: Optional[str] = None


class ReviewOut(ReviewBase):
    id: int
    avatar_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Review Invitations
# ---------------------------------------------------------------------------

class InvitationCreate(BaseModel):
    """Payload envoyé par l'admin pour créer un lien d'invitation."""
    client_name:    str
    client_role:    str
    client_company: Optional[str] = None
    client_email:   Optional[str] = None


class InvitationOut(BaseModel):
    id:             int
    token:          str
    client_name:    str
    client_role:    str
    client_company: Optional[str] = None
    client_email:   Optional[str] = None
    is_used:        bool
    expires_at:     datetime
    created_at:     datetime
    review_id:      Optional[int] = None
    invite_url:     Optional[str] = None   # construit côté router

    class Config:
        from_attributes = True


class PublicReviewSubmit(BaseModel):
    """Formulaire soumis par le client via son lien unique."""
    content: str
    rating:  int

    @validator("rating")
    def rating_range(cls, v):
        if not 1 <= v <= 5:
            raise ValueError("rating must be between 1 and 5")
        return v

    @validator("content")
    def content_min(cls, v):
        if len(v.strip()) < 10:
            raise ValueError("L'avis doit faire au moins 10 caractères")
        return v.strip()


# ---------------------------------------------------------------------------
# Blog
# ---------------------------------------------------------------------------

class BlogPostBase(BaseModel):
    title:            str
    excerpt:          Optional[str] = None
    content:          str
    category:         str = "Général"
    tags:             List[str] = []
    reading_time:     int = 5
    is_published:     bool = False
    is_featured:      bool = False
    meta_title:       Optional[str] = None
    meta_description: Optional[str] = None


class BlogPostCreate(BlogPostBase):
    slug: Optional[str] = None


class BlogPostUpdate(BlogPostBase):
    title:        Optional[str] = None
    content:      Optional[str] = None
    category:     Optional[str] = None
    slug:         Optional[str] = None


class BlogPostOut(BlogPostBase):
    id:           int
    slug:         str
    cover_path:   Optional[str] = None
    views:        int
    published_at: Optional[datetime] = None
    created_at:   datetime
    updated_at:   datetime

    class Config:
        from_attributes = True


class BlogPostSummary(BaseModel):
    id:           int
    title:        str
    slug:         str
    excerpt:      Optional[str] = None
    cover_path:   Optional[str] = None
    category:     str
    tags:         List[str]
    reading_time: int
    is_featured:  bool
    is_published: bool    
    views:        int
    published_at: Optional[datetime] = None
    created_at:   datetime

    class Config:
        from_attributes = True