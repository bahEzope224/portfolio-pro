"""
Portfolio Backend - FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import engine, Base
from app.routers import projects, experiences, skills, cv, contact, auth, reviews, invitations

Base.metadata.create_all(bind=engine)

os.makedirs("uploads/images", exist_ok=True)
os.makedirs("uploads/cv", exist_ok=True)

app = FastAPI(
    title="Portfolio API",
    description="Backend API for personal developer portfolio",
    version="1.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router,        prefix="/api/auth",        tags=["Auth"])
app.include_router(projects.router,    prefix="/api/projects",    tags=["Projects"])
app.include_router(experiences.router, prefix="/api/experiences", tags=["Experiences"])
app.include_router(skills.router,      prefix="/api/skills",      tags=["Skills"])
app.include_router(cv.router,          prefix="/api/cv",          tags=["CV"])
app.include_router(contact.router,     prefix="/api/contact",     tags=["Contact"])
app.include_router(reviews.router,     prefix="/api/reviews",     tags=["Reviews"])
app.include_router(invitations.router, prefix="/api/invitations", tags=["Invitations"])

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "Portfolio API is running"}
