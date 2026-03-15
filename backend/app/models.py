"""
SQLAlchemy ORM Models for the portfolio database.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from app.database import Base


class AdminUser(Base):
    """Admin user for the protected dashboard."""
    __tablename__ = "admin_users"

    id       = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email    = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Project(Base):
    """Portfolio project entry."""
    __tablename__ = "projects"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    tech_stack  = Column(JSON, default=list)   # ["React", "FastAPI", ...]
    github_url  = Column(String(500), nullable=True)
    live_url    = Column(String(500), nullable=True)
    image_path  = Column(String(500), nullable=True)  # relative path in /uploads/images/
    is_featured = Column(Boolean, default=False)
    order       = Column(Integer, default=0)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Experience(Base):
    """Professional experience / work history entry."""
    __tablename__ = "experiences"

    id          = Column(Integer, primary_key=True, index=True)
    company     = Column(String(150), nullable=False)
    position    = Column(String(150), nullable=False)
    start_date  = Column(String(20), nullable=False)   # "2022-01" (YYYY-MM)
    end_date    = Column(String(20), nullable=True)    # None means "Present"
    description = Column(Text, nullable=False)
    logo_path   = Column(String(500), nullable=True)
    location    = Column(String(150), nullable=True)
    order       = Column(Integer, default=0)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Skill(Base):
    """Technical skill with category and level."""
    __tablename__ = "skills"

    id       = Column(Integer, primary_key=True, index=True)
    name     = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)   # "Frontend", "Backend", "DevOps" …
    level    = Column(Integer, default=50)           # 0–100
    icon     = Column(String(100), nullable=True)    # e.g. "react", "python" (for devicons)
    order    = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class CV(Base):
    """Single CV/PDF record – only one row expected."""
    __tablename__ = "cv"

    id          = Column(Integer, primary_key=True, index=True)
    filename    = Column(String(255), nullable=False)
    file_path   = Column(String(500), nullable=False)  # relative: "uploads/cv/xxx.pdf"
    upload_date = Column(DateTime, default=datetime.utcnow)


class Review(Base):
    """Client / colleague testimonial / review."""
    __tablename__ = "reviews"

    id          = Column(Integer, primary_key=True, index=True)
    author_name = Column(String(150), nullable=False)
    author_role = Column(String(150), nullable=False)   # "CTO @ Startup Paris"
    company     = Column(String(150), nullable=True)
    avatar_path = Column(String(500), nullable=True)    # uploaded avatar image
    content     = Column(Text, nullable=False)           # testimonial text
    rating      = Column(Integer, default=5)             # 1–5 stars
    is_featured = Column(Boolean, default=False)
    is_visible  = Column(Boolean, default=True)          # toggle display on/off
    order       = Column(Integer, default=0)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ReviewInvitation(Base):
    """
    Token d'invitation unique envoyé à un client pour soumettre un avis.
    Le token expire après 7 jours ou dès qu'il est utilisé.
    """
    __tablename__ = "review_invitations"

    id            = Column(Integer, primary_key=True, index=True)
    token         = Column(String(128), unique=True, index=True, nullable=False)
    # Info pré-remplie par l'admin (facilite le formulaire client)
    client_name   = Column(String(150), nullable=False)
    client_role   = Column(String(150), nullable=False)
    client_company= Column(String(150), nullable=True)
    client_email  = Column(String(200), nullable=True)
    # Statut
    is_used       = Column(Boolean, default=False)   # True dès soumission
    expires_at    = Column(DateTime, nullable=False)
    created_at    = Column(DateTime, default=datetime.utcnow)
    # Lien vers l'avis créé après soumission (nullable jusqu'à soumission)
    review_id     = Column(Integer, nullable=True)   # FK vers reviews.id
