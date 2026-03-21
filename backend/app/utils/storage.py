"""
Storage service — Cloudflare R2 (compatible S3).
Remplace le stockage local éphémère de Render.
En dev : stockage local si les vars R2 ne sont pas définies.
"""

import os
import uuid
import boto3
from pathlib import Path
from fastapi import HTTPException, UploadFile, status

# ── Config ────────────────────────────────────────────────────────────────
R2_ACCOUNT_ID       = os.getenv("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY_ID    = os.getenv("R2_ACCESS_KEY_ID", "")
R2_SECRET_ACCESS_KEY= os.getenv("R2_SECRET_ACCESS_KEY", "")
R2_BUCKET_NAME      = os.getenv("R2_BUCKET_NAME", "portfolio-uploads")
R2_PUBLIC_URL       = os.getenv("R2_PUBLIC_URL", "")   # https://pub-xxxx.r2.dev

USE_R2 = bool(R2_ACCOUNT_ID and R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY)

import logging as _logging
_logger2 = _logging.getLogger(__name__)
_logger2.warning(f"[R2_DEBUG] ACCOUNT_ID='{R2_ACCOUNT_ID[:4] if R2_ACCOUNT_ID else 'VIDE'}' ACCESS_KEY='{R2_ACCESS_KEY_ID[:4] if R2_ACCESS_KEY_ID else 'VIDE'}' SECRET='{R2_SECRET_ACCESS_KEY[:4] if R2_SECRET_ACCESS_KEY else 'VIDE'}' USE_R2={USE_R2}")

import logging
_logger = logging.getLogger(__name__)
_logger.info(f"[STORAGE] USE_R2={USE_R2} | BUCKET={R2_BUCKET_NAME} | PUBLIC_URL={R2_PUBLIC_URL} | ACCOUNT={R2_ACCOUNT_ID[:6] if R2_ACCOUNT_ID else 'VIDE'}")

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_CV_TYPES    = {"application/pdf"}
MAX_IMAGE_SIZE      = 5  * 1024 * 1024   # 5 MB
MAX_CV_SIZE         = 10 * 1024 * 1024   # 10 MB


def _get_r2_client():
    return boto3.client(
        "s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
        region_name="auto",
    )


def _upload_to_r2(content: bytes, key: str, content_type: str) -> str:
    """Upload vers R2 et retourne l'URL publique."""
    client = _get_r2_client()
    client.put_object(
        Bucket=R2_BUCKET_NAME,
        Key=key,
        Body=content,
        ContentType=content_type,
    )
    return f"{R2_PUBLIC_URL}/{key}"


def _delete_from_r2(key: str) -> None:
    """Supprime un fichier de R2."""
    try:
        client = _get_r2_client()
        client.delete_object(Bucket=R2_BUCKET_NAME, Key=key)
    except Exception as e:
        print(f"[R2] Delete failed for {key}: {e}")


def _save_local(content: bytes, folder: str, ext: str) -> str:
    """Fallback local pour le développement."""
    dest_dir = Path(f"uploads/{folder}")
    dest_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    path = dest_dir / filename
    path.write_bytes(content)
    return str(path)


# ── Public API ────────────────────────────────────────────────────────────

def save_file(
    upload: UploadFile,
    folder: str,
    allowed_types: set,
    max_size: int,
) -> str:
    """
    Valide et sauvegarde un fichier.
    Retourne :
      - En prod (R2)  : URL publique complète  https://pub-xxxx.r2.dev/images/xxx.jpg
      - En dev (local): chemin relatif          uploads/images/xxx.jpg
    """
    if upload.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Type de fichier non autorisé : {upload.content_type}",
        )

    content = upload.file.read()
    if len(content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Fichier trop volumineux (max {max_size // 1024 // 1024} MB)",
        )

    ext = Path(upload.filename).suffix.lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"

    if USE_R2:
        key = f"{folder}/{unique_name}"
        _logger.info(f"[R2] Uploading {key} to R2...")
        url = _upload_to_r2(content, key, upload.content_type)
        _logger.info(f"[R2] Success: {url}")
        return url
    else:
        return _save_local(content, folder, ext)


def delete_file(path_or_url: str) -> None:
    """Supprime un fichier (R2 ou local)."""
    if not path_or_url:
        return
    if USE_R2 and path_or_url.startswith("http"):
        # Extrait la clé depuis l'URL : https://pub-xxx.r2.dev/images/xxx.jpg → images/xxx.jpg
        key = path_or_url.replace(f"{R2_PUBLIC_URL}/", "")
        _delete_from_r2(key)
    else:
        # Fichier local
        try:
            Path(path_or_url).unlink(missing_ok=True)
        except Exception:
            pass


def save_image(upload: UploadFile) -> str:
    return save_file(upload, "images", ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE)


def save_cv(upload: UploadFile) -> str:
    return save_file(upload, "cv", ALLOWED_CV_TYPES, MAX_CV_SIZE)