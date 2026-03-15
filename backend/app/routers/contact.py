"""
Contact router – sends an email to the portfolio owner.
"""

from fastapi import APIRouter, HTTPException, status
from app import schemas
from app.utils.email import send_contact_email

router = APIRouter()


@router.post("/", status_code=200)
def contact(payload: schemas.ContactMessage):
    """Send a contact form message via email."""
    success = send_contact_email(
        sender_name=payload.name,
        sender_email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send email. Please try again later.",
        )
    return {"message": "Message sent successfully!"}
