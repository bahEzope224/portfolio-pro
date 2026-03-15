# Portfolio — Raccourcis de développement

.PHONY: backend frontend seed install help

help:
	@echo "Commandes disponibles :"
	@echo "  make install   — Installe toutes les dépendances"
	@echo "  make backend   — Lance le serveur FastAPI"
	@echo "  make frontend  — Lance le serveur Vite"
	@echo "  make seed      — Peuple la base avec des données de démo"
	@echo "  make dev       — Lance backend + frontend en parallèle"

install:
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

backend:
	cd backend && . venv/bin/activate && uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

seed:
	cd backend && . venv/bin/activate && python seed.py

dev:
	@echo "Lancement du backend et du frontend en parallèle…"
	$(MAKE) -j2 backend frontend
