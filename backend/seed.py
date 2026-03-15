#!/usr/bin/env python3
"""
seed.py — Populate the database with sample data for development.
Run: python seed.py
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app import models
from app.utils.auth import get_password_hash

Base.metadata.create_all(bind=engine)

db = SessionLocal()

# ── Admin user ───────────────────────────────────────────────────────────
if not db.query(models.AdminUser).first():
    admin = models.AdminUser(
        username="admin",
        email="admin@portfolio.dev",
        hashed_password=get_password_hash("admin123"),
    )
    db.add(admin)
    print("✅ Admin créé : admin / admin123")

# ── Sample projects ──────────────────────────────────────────────────────
if not db.query(models.Project).first():
    projects = [
        models.Project(
            title="Portfolio Personnel",
            description="Ce portfolio fullstack avec React et FastAPI. "
                        "Interface publique + panneau admin sécurisé.",
            tech_stack=["React", "TypeScript", "FastAPI", "SQLite", "Tailwind CSS"],
            github_url="https://github.com/username/portfolio",
            live_url="https://portfolio.example.com",
            is_featured=True,
            order=1,
        ),
        models.Project(
            title="API REST E-commerce",
            description="Backend complet pour une boutique en ligne avec gestion "
                        "des commandes, paiements Stripe et notifications email.",
            tech_stack=["FastAPI", "PostgreSQL", "Redis", "Stripe", "Docker"],
            github_url="https://github.com/username/ecommerce-api",
            is_featured=True,
            order=2,
        ),
        models.Project(
            title="Dashboard Analytics",
            description="Tableau de bord en temps réel pour visualiser des métriques "
                        "métier avec graphiques interactifs.",
            tech_stack=["React", "D3.js", "WebSocket", "FastAPI"],
            github_url="https://github.com/username/dashboard",
            live_url="https://dashboard.example.com",
            order=3,
        ),
    ]
    db.add_all(projects)
    print("✅ 3 projets créés")

# ── Sample experiences ───────────────────────────────────────────────────
if not db.query(models.Experience).first():
    experiences = [
        models.Experience(
            company="Tech Startup Paris",
            position="Développeur Full Stack Senior",
            start_date="2022-03",
            end_date=None,
            description="Développement de fonctionnalités clés sur une plateforme SaaS B2B.\n"
                        "• Architecture microservices avec FastAPI et React\n"
                        "• Amélioration des performances API de 40%\n"
                        "• Encadrement de 2 développeurs juniors",
            location="Paris, France (Hybride)",
            order=1,
        ),
        models.Experience(
            company="Web Agency Lyon",
            position="Développeur Frontend React",
            start_date="2020-09",
            end_date="2022-02",
            description="Intégration et développement de sites web et applications React.\n"
                        "• Plus de 15 projets clients livrés\n"
                        "• Migration d'une app Angular vers React\n"
                        "• Mise en place de tests automatisés (Jest + Cypress)",
            location="Lyon, France",
            order=2,
        ),
        models.Experience(
            company="Freelance",
            position="Développeur Web Freelance",
            start_date="2019-01",
            end_date="2020-08",
            description="Missions freelance variées en développement web fullstack.",
            location="Remote",
            order=3,
        ),
    ]
    db.add_all(experiences)
    print("✅ 3 expériences créées")

# ── Sample skills ─────────────────────────────────────────────────────────
if not db.query(models.Skill).first():
    skills = [
        # Frontend
        models.Skill(name="React",      category="Frontend", level=90, icon="react",      order=1),
        models.Skill(name="TypeScript", category="Frontend", level=85, icon="typescript", order=2),
        models.Skill(name="Tailwind CSS",category="Frontend", level=88, icon="tailwindcss",order=3),
        models.Skill(name="Next.js",    category="Frontend", level=75, icon="nextjs",     order=4),
        # Backend
        models.Skill(name="Python",    category="Backend", level=90, icon="python",   order=1),
        models.Skill(name="FastAPI",   category="Backend", level=85, icon="fastapi",  order=2),
        models.Skill(name="Node.js",   category="Backend", level=70, icon="nodejs",   order=3),
        models.Skill(name="PostgreSQL",category="Backend", level=75, icon="postgresql",order=4),
        # DevOps
        models.Skill(name="Docker",    category="DevOps", level=70, icon="docker",    order=1),
        models.Skill(name="Git",       category="DevOps", level=90, icon="git",       order=2),
        models.Skill(name="Linux",     category="DevOps", level=75, icon="linux",     order=3),
    ]
    db.add_all(skills)
    print("✅ 11 compétences créées")

db.commit()
db.close()
print("\n🎉 Base de données initialisée avec succès !")
print("   Connectez-vous à /admin avec : admin / admin123")
