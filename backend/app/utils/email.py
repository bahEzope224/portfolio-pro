"""
Email sending utility using SMTP (works with Gmail, Mailtrap, Brevo, etc.)
Configure via environment variables.
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional


SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", 587))
SMTP_USER     = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", SMTP_USER)  # where to receive messages


def send_contact_email(
    sender_name: str,
    sender_email: str,
    subject: str,
    message: str,
) -> bool:
    """
    Send a contact form submission to the portfolio owner's inbox.
    Returns True on success, False on failure.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        # Dev mode: just print the message
        print(f"\n--- CONTACT EMAIL (dev mode) ---")
        print(f"From: {sender_name} <{sender_email}>")
        print(f"Subject: {subject}")
        print(f"Message:\n{message}")
        print("-------------------------------\n")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Portfolio Contact] {subject}"
        msg["From"]    = SMTP_USER
        msg["To"]      = CONTACT_EMAIL
        msg["Reply-To"] = f"{sender_name} <{sender_email}>"

        html_body = f"""
        <html><body style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#6366f1">New message from your portfolio</h2>
          <p><strong>Name:</strong> {sender_name}</p>
          <p><strong>Email:</strong> <a href="mailto:{sender_email}">{sender_email}</a></p>
          <p><strong>Subject:</strong> {subject}</p>
          <hr/>
          <p style="white-space:pre-wrap">{message}</p>
        </body></html>
        """
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, CONTACT_EMAIL, msg.as_string())

        return True
    except Exception as exc:
        print(f"[email] Failed to send: {exc}")
        return False
