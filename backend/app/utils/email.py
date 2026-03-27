import os
import requests
from typing import Optional

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "")

def send_contact_email(
    sender_name: str,
    sender_email: str,
    subject: str,
    message: str,
) -> bool:
    """
    Envoie le message via l'API Brevo (fonctionne sur Render gratuit).
    """
    if not BREVO_API_KEY or not CONTACT_EMAIL:
        # Mode dev : on affiche juste dans la console
        print(f"\n--- CONTACT EMAIL (dev mode) ---")
        print(f"From: {sender_name} <{sender_email}>")
        print(f"Subject: {subject}")
        print(f"Message:\n{message}")
        print("-------------------------------\n")
        return True

    try:
        payload = {
            "sender": {"name": "Portfolio Contact", "email": CONTACT_EMAIL},
            "to": [{"email": CONTACT_EMAIL}],
            "replyTo": {"name": sender_name, "email": sender_email},
            "subject": f"[Portfolio Contact] {subject}",
            "htmlContent": f"""
            <html>
            <body style="font-family:sans-serif;max-width:600px;margin:auto">
                <h2 style="color:#6366f1">Nouveau message depuis ton portfolio</h2>
                <p><strong>Nom :</strong> {sender_name}</p>
                <p><strong>Email :</strong> <a href="mailto:{sender_email}">{sender_email}</a></p>
                <p><strong>Sujet :</strong> {subject}</p>
                <hr/>
                <p style="white-space:pre-wrap">{message}</p>
            </body>
            </html>
            """
        }

        response = requests.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": BREVO_API_KEY,
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=10
        )

        if response.status_code == 201:
            print(f"[email] ✅ Message envoyé via Brevo à {CONTACT_EMAIL}")
            return True
        else:
            print(f"[email] ❌ Erreur Brevo {response.status_code}: {response.text}")
            return False

    except Exception as exc:
        print(f"[email] Failed to send: {exc}")
        return False