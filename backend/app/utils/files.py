"""
File upload helpers — délègue tout à storage.py
"""
from app.utils.storage import save_image, save_cv, delete_file

__all__ = ["save_image", "save_cv", "delete_file"]
