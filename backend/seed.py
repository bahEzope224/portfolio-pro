#!/usr/bin/env python3
"""
seed.py — Populate the database with sample data for development.
Run: python seed.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app import models
from app.utils.auth import get_password_hash

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── Admin user ───────────────────────────────────────────────────────────
if not db.query(models.AdminUser).first():
    db.add(models.AdminUser(
        username="admin",
        email="admin@portfolio.dev",
        hashed_password=get_password_hash("admin123"),
    ))
    print("✅ Admin créé : admin / admin123")

# ── Projects ─────────────────────────────────────────────────────────────
if not db.query(models.Project).first():
    db.add_all([
        models.Project(title="Portfolio Personnel",
            description="Portfolio fullstack React + FastAPI avec admin sécurisé.",
            tech_stack=["React","TypeScript","FastAPI","SQLite","Tailwind CSS"],
            github_url="https://github.com/username/portfolio",
            live_url="https://portfolio.example.com",
            is_featured=True, order=1),
        models.Project(title="API REST E-commerce",
            description="Backend complet avec paiements Stripe et notifications email.",
            tech_stack=["FastAPI","PostgreSQL","Redis","Stripe","Docker"],
            github_url="https://github.com/username/ecommerce-api",
            is_featured=True, order=2),
        models.Project(title="Dashboard Analytics",
            description="Tableau de bord temps réel avec visualisations D3.js.",
            tech_stack=["React","D3.js","WebSocket","FastAPI"],
            live_url="https://dashboard.example.com",
            order=3),
    ])
    print("✅ 3 projets créés")

# ── Experiences ───────────────────────────────────────────────────────────
if not db.query(models.Experience).first():
    db.add_all([
        models.Experience(company="Tech Startup Paris",
            position="Développeur Full Stack Senior",
            start_date="2022-03", end_date=None,
            description="SaaS B2B 50k+ utilisateurs. Microservices FastAPI + React.\nOptimisation des performances (-40%). Encadrement de 2 juniors.",
            location="Paris, France (Hybride)", order=1),
        models.Experience(company="Web Agency Lyon",
            position="Développeur Frontend React",
            start_date="2020-09", end_date="2022-02",
            description="15+ projets clients. Migration Angular → React (-35% bundle).\nTests automatisés Cypress.",
            location="Lyon, France", order=2),
        models.Experience(company="Freelance",
            position="Développeur Web Indépendant",
            start_date="2018-01", end_date="2020-08",
            description="Missions freelance pour entrepreneurs et PME.",
            location="Remote", order=3),
    ])
    print("✅ 3 expériences créées")

# ── Skills ────────────────────────────────────────────────────────────────
if not db.query(models.Skill).first():
    db.add_all([
        models.Skill(name="React",       category="Frontend", level=92, icon="react",       order=1),
        models.Skill(name="TypeScript",  category="Frontend", level=88, icon="typescript",  order=2),
        models.Skill(name="Tailwind CSS",category="Frontend", level=90, icon="tailwindcss", order=3),
        models.Skill(name="Next.js",     category="Frontend", level=78, icon="nextjs",      order=4),
        models.Skill(name="Python",      category="Backend",  level=92, icon="python",      order=1),
        models.Skill(name="FastAPI",     category="Backend",  level=88, icon="fastapi",     order=2),
        models.Skill(name="PostgreSQL",  category="Backend",  level=78, icon="postgresql",  order=3),
        models.Skill(name="Docker",      category="DevOps",   level=72, icon="docker",      order=1),
        models.Skill(name="Git",         category="DevOps",   level=92, icon="git",         order=2),
        models.Skill(name="Linux",       category="DevOps",   level=78, icon="linux",       order=3),
    ])
    print("✅ 10 compétences créées")

# ── Reviews ───────────────────────────────────────────────────────────────
if not db.query(models.Review).first():
    db.add_all([
        models.Review(
            author_name="Sophie Marchand", author_role="CTO", company="Tech Startup Paris",
            content="Travailler avec ce développeur a transformé notre produit. Il n'a pas seulement écrit du code propre — il a compris nos enjeux métier et proposé des architectures qu'on n'aurait pas envisagées seuls. Le ratio qualité/délai est exceptionnel.",
            rating=5, is_featured=True, is_visible=True, order=1),
        models.Review(
            author_name="Thomas Renard", author_role="CEO & Co-fondateur", company="Launchpad SAS",
            content="J'avais un MVP à livrer en 6 semaines pour une démo investisseurs. Non seulement il a tenu le délai, mais le résultat était bien au-delà de mes attentes. Les investisseurs ont spécifiquement complimenté l'interface.",
            rating=5, is_featured=True, is_visible=True, order=2),
        models.Review(
            author_name="Amélie Duval", author_role="Directrice Marketing", company="Groupe Lumière",
            content="Nous avions besoin d'un dashboard pour notre équipe non-technique. Le résultat est intuitif, rapide, et ça a réduit nos reportings manuels de 80%. Communication claire sans jargon inutile.",
            rating=5, is_featured=False, is_visible=True, order=3),
        models.Review(
            author_name="Karim Benali", author_role="Lead Developer", company="Agence PixelPro",
            content="Sa maîtrise de React et FastAPI est solide, mais ce qui m'a le plus impressionné c'est sa capacité à lire du code existant rapidement et proposer des refactors pertinents sans casser l'existant.",
            rating=5, is_featured=False, is_visible=True, order=4),
        models.Review(
            author_name="Lucie Fontaine", author_role="Product Manager", company="FinTech Clarity",
            content="Profil rare : il comprend autant les enjeux produit que les contraintes techniques. Ses estimations sont fiables, ses questions posées au bon moment, et il sait dire non quand une feature est prématurée.",
            rating=5, is_featured=False, is_visible=True, order=5),
        models.Review(
            author_name="Antoine Moreau", author_role="Fondateur", company="Studio Morpho",
            content="Mission de refonte frontend d'une app en prod. Zéro régression, code plus maintenable, performances doublées. Livré 3 jours avant la deadline.",
            rating=4, is_featured=False, is_visible=True, order=6),
    ])
    print("✅ 6 avis clients créés")

db.commit()
db.close()
print("\n🎉 Base de données initialisée avec succès !")
print("   Connectez-vous à /admin avec : admin / admin123")
