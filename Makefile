# Portfolio — Raccourcis de développement

.PHONY: backend frontend seed install help migrate

help:
	@echo "Commandes disponibles :"
	@echo "  make install   — Installe toutes les dépendances"
	@echo "  make backend   — Lance le serveur FastAPI"
	@echo "  make frontend  — Lance le serveur Vite"
	@echo "  make seed      — Peuple la base avec des données de démo"
	@echo "  make migrate   — Applique les migrations de base de données"
	@echo "  make dev       — Lance backend + frontend en parallèle"

install:
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

backend:
	cd backend && . venv/bin/activate && python migrate_db.py && uvicorn app.main:app --reload --port 8000

migrate:
	cd backend && . venv/bin/activate && python migrate_db.py

frontend:
	cd frontend && npm run dev

seed:
	cd backend && . venv/bin/activate && python seed.py

dev:
	@echo "Lancement du backend et du frontend en parallèle…"
	$(MAKE) -j2 backend frontend
