"""
Review Invitations Router
=========================
Flow complet :
  1. Admin POST /api/invitations/ → crée un token unique (7j) + retourne l'URL
  2. Client GET /api/invitations/{token} → vérifie le token, retourne les infos pré-remplies
  3. Client POST /api/invitations/{token}/submit → soumet l'avis (is_visible=False par défaut)
  4. Admin GET /api/invitations/ → liste toutes les invitations
  5. Admin POST /api/reviews/{id}/approve → rend l'avis visible publiquement
  6. Admin DELETE /api/invitations/{id} → révoque une invitation
"""
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.utils.auth import get_current_user
router = APIRouter()
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
INVITATION_DAYS = int(os.getenv("INVITATION_EXPIRE_DAYS", 7))
def _build_url(token: str) -> str:
    return f"{FRONTEND_URL}/review/{token}"
def _enrich(inv: models.ReviewInvitation) -> dict:
    """Ajoute invite_url au dict de l'invitation."""
    d = {c.name: getattr(inv, c.name) for c in inv.__table__.columns}
    d["invite_url"] = _build_url(inv.token)
    return d
# ---------------------------------------------------------------------------
# Admin — créer une invitation
# ---------------------------------------------------------------------------
@router.post("/", status_code=201)
def create_invitation(
    payload: schemas.InvitationCreate,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    """
    Génère un token unique et retourne le lien à envoyer au client.
    Le lien est valable INVITATION_DAYS jours (défaut : 7).
    """
    token = secrets.token_urlsafe(48) # 64 chars URL-safe
    invitation = models.ReviewInvitation(
        token=token,
        client_name=payload.client_name,
        client_role=payload.client_role,
        client_company=payload.client_company,
        client_email=payload.client_email,
        expires_at=datetime.now(timezone.utc) + timedelta(days=INVITATION_DAYS),
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return _enrich(invitation)
# ---------------------------------------------------------------------------
# Admin — lister toutes les invitations
# ---------------------------------------------------------------------------
@router.get("/", status_code=200)
def list_invitations(
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    invitations = (
        db.query(models.ReviewInvitation)
        .order_by(models.ReviewInvitation.created_at.desc())
        .all()
    )
    return [_enrich(inv) for inv in invitations]
# ---------------------------------------------------------------------------
# Admin — révoquer / supprimer une invitation
# ---------------------------------------------------------------------------
@router.delete("/{invitation_id}", status_code=204)
def delete_invitation(
    invitation_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    inv = db.query(models.ReviewInvitation).filter(
        models.ReviewInvitation.id == invitation_id
    ).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invitation not found")
    db.delete(inv)
    db.commit()
# ---------------------------------------------------------------------------
# Public — vérifier un token (appelé par le formulaire client)
# ---------------------------------------------------------------------------
@router.get("/{token}/check", status_code=200)
def check_invitation(token: str, db: Session = Depends(get_db)):
    """
    Vérifie qu'un token est valide et non expiré.
    Retourne les infos pré-remplies pour le formulaire client.
    """
    inv = db.query(models.ReviewInvitation).filter(
        models.ReviewInvitation.token == token
    ).first()
    if not inv:
        raise HTTPException(
            status_code=404,
            detail="Lien invalide. Ce lien n'existe pas."
        )
    if inv.is_used:
        raise HTTPException(
            status_code=410,
            detail="Ce lien a déjà été utilisé. Merci pour votre avis !"
        )
    if datetime.now(timezone.utc) > inv.expires_at:
        raise HTTPException(
            status_code=410,
            detail="Ce lien a expiré. Contactez l'administrateur pour un nouveau lien."
        )
    return {
        "valid": True,
        "client_name": inv.client_name,
        "client_role": inv.client_role,
        "client_company": inv.client_company,
        "expires_at": inv.expires_at,
    }
# ---------------------------------------------------------------------------
# Public — soumettre l'avis via le token
# ---------------------------------------------------------------------------
@router.post("/{token}/submit", status_code=201)
def submit_review(
    token: str,
    payload: schemas.PublicReviewSubmit,
    db: Session = Depends(get_db),
):
    """
    Le client soumet son avis. L'avis est créé avec is_visible=False
    — il sera visible publiquement seulement après approbation par l'admin.
    """
    inv = db.query(models.ReviewInvitation).filter(
        models.ReviewInvitation.token == token
    ).first()
    # Validations
    if not inv:
        raise HTTPException(status_code=404, detail="Lien invalide.")
    if inv.is_used:
        raise HTTPException(status_code=410, detail="Ce lien a déjà été utilisé.")
    if datetime.now(timezone.utc) > inv.expires_at:
        raise HTTPException(status_code=410, detail="Ce lien a expiré.")
    # Créer l'avis — invisible jusqu'à approbation admin
    review = models.Review(
        author_name=inv.client_name,
        author_role=inv.client_role,
        company=inv.client_company,
        content=payload.content,
        rating=payload.rating,
        is_featured=False,
        is_visible=False, # ← EN ATTENTE DE VALIDATION
        order=999,
    )
    db.add(review)
    db.flush() # obtenir l'id sans committer
    # Marquer l'invitation comme utilisée + lier l'avis
    inv.is_used = True
    inv.review_id = review.id
    db.commit()
    db.refresh(review)
    return {
        "message": "Merci pour votre avis ! Il sera publié après validation.",
        "review_id": review.id,
    }
# ---------------------------------------------------------------------------
# Admin — approuver un avis (le rendre visible)
# ---------------------------------------------------------------------------
@router.post("/approve/{review_id}", status_code=200)
def approve_review(
    review_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    """Rend un avis visible publiquement."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_visible = True
    review.order = db.query(models.Review).filter(
        models.Review.is_visible == True
    ).count()
    db.commit()
    db.refresh(review)
    return {"message": "Avis approuvé et publié.", "review": review}
# ---------------------------------------------------------------------------
# Admin — rejeter (supprimer) un avis en attente
# ---------------------------------------------------------------------------
@router.delete("/reject/{review_id}", status_code=204)
def reject_review(
    review_id: int,
    db: Session = Depends(get_db),
    _: models.AdminUser = Depends(get_current_user),
):
    """Supprime un avis en attente de validation."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()