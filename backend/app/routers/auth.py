"""
Auth router – login + admin user creation.
POST /api/auth/login  → returns JWT
POST /api/auth/register  → creates first admin (disabled if one already exists)
GET  /api/auth/me     → returns current user info
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas
from app.utils.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
)

router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Authenticate admin and return access token."""
    user = db.query(models.AdminUser).filter(
        models.AdminUser.username == form_data.username
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/register", response_model=schemas.AdminUserOut, status_code=201)
def register(
    payload: schemas.AdminUserCreate,
    db: Session = Depends(get_db),
):
    """
    Create the first admin account.
    Raises 409 if an admin already exists (prevents open registration).
    """
    if db.query(models.AdminUser).count() > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An admin account already exists. Registration is disabled.",
        )

    user = models.AdminUser(
        username=payload.username,
        email=payload.email,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=schemas.AdminUserOut)
def me(current_user: models.AdminUser = Depends(get_current_user)):
    """Return the currently authenticated admin user."""
    return current_user
