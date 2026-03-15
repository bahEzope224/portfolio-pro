# 🚀 Portfolio Développeur Web — Fullstack (React + FastAPI)

Un portfolio personnel complet avec interface publique et panneau d'administration sécurisé.

![Stack](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Backend-FastAPI%20%2B%20SQLite-009688?style=flat-square&logo=fastapi)
![Stack](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-orange?style=flat-square)

---

## ✨ Fonctionnalités

### Interface publique
| Page | Description |
|------|-------------|
| `/` | Accueil avec bio, photo et call-to-action |
| `/projects` | Grille de projets avec tech stack, liens GitHub/Live |
| `/experiences` | Timeline chronologique des expériences |
| `/skills` | Compétences groupées par catégorie avec barres de niveau |
| `/review` | Avis de client et ou partenaire|
| `/cv` | Preview PDF + bouton de téléchargement |
| `/contact` | Formulaire de contact avec envoi d'email |

### Admin (`/admin`) — protégé par JWT
- **Dashboard** avec statistiques globales
- **CRUD Projets** : titre, description, stack, liens, image
- **CRUD Expériences** : poste, entreprise, dates, logo
- **CRUD Compétences** : nom, catégorie, niveau (0-100)
- **Gestion CV** : upload/remplacement/suppression du PDF

---

## 📁 Structure du projet

```
portfolio/
├── backend/
│   ├── app/
│   │   ├── main.py              # Entrée FastAPI
│   │   ├── database.py          # Config SQLAlchemy
│   │   ├── models.py            # Modèles ORM
│   │   ├── schemas.py           # Schémas Pydantic
│   │   ├── routers/
│   │   │   ├── auth.py          # Login JWT
│   │   │   ├── projects.py      # CRUD projets
│   │   │   ├── experiences.py   # CRUD expériences
│   │   │   ├── skills.py        # CRUD compétences
│   │   │   ├── cv.py            # Upload/delete CV
│   │   │   └── contact.py       # Envoi email
│   │   └── utils/
│   │       ├── auth.py          # JWT helpers
│   │       ├── files.py         # Upload sécurisé
│   │       └── email.py         # SMTP helper
│   ├── uploads/                 # Fichiers uploadés (gitignored)
│   │   ├── images/
│   │   └── cv/
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.tsx              # Routes React Router
    │   ├── main.tsx             # Entrée React
    │   ├── index.css            # Styles globaux Tailwind
    │   ├── types/index.ts       # Types TypeScript
    │   ├── lib/
    │   │   ├── api.ts           # Instance Axios + intercepteurs
    │   │   └── utils.ts         # Helpers (cn, formatDate…)
    │   ├── store/auth.ts        # Auth (JWT localStorage)
    │   ├── hooks/useApi.ts      # TanStack Query hooks
    │   ├── components/
    │   │   ├── layout/          # Navbar, Footer, Layouts, ProtectedRoute
    │   │   └── ui/index.tsx     # Composants réutilisables
    │   └── pages/
    │       ├── public/          # HomePage, ProjectsPage, CVPage…
    │       └── admin/           # LoginPage, Dashboard, CRUD pages
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

---

## 🛠️ Installation

### Prérequis
- **Python** 3.10+
- **Node.js** 18+ et **npm**

---

### 1. Backend (FastAPI)

```bash
# Cloner et entrer dans le dossier backend
cd portfolio/backend

# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate    # Linux/Mac
# venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt

# Copier et configurer les variables d'environnement
cp .env.example .env
# Éditez .env avec vos valeurs

# Lancer le serveur
uvicorn app.main:app --reload --port 8000
```

L'API sera disponible sur `http://localhost:8000`  
Documentation Swagger : `http://localhost:8000/api/docs`

---

### 2. Créer le premier compte admin

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"votre_mot_de_passe"}'
```

> ⚠️ Cette route est désactivée après la création du premier compte.

---

### 3. Frontend (React + Vite)

```bash
# Depuis la racine du projet
cd portfolio/frontend

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env
# En dev le proxy Vite redirige /api → localhost:8000 automatiquement

# Lancer le serveur de développement
npm run dev
```

L'interface sera disponible sur `http://localhost:5173`

---

## ⚙️ Variables d'environnement

### Backend (`backend/.env`)

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DATABASE_URL` | URL de connexion SQLAlchemy | `sqlite:///./portfolio.db` |
| `SECRET_KEY` | Clé secrète JWT (générer avec `openssl rand -hex 32`) | ⚠️ Changer obligatoirement |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Durée de validité JWT | `1440` (24h) |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:5173` |
| `SMTP_HOST` | Serveur SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `587` |
| `SMTP_USER` | Email expéditeur | — |
| `SMTP_PASSWORD` | Mot de passe / App password | — |
| `CONTACT_EMAIL` | Email de réception des messages | `SMTP_USER` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l'API (vide en dev = proxy Vite) |

---

## 🚀 Déploiement

### Backend → Render.com

1. Créer un **Web Service** depuis votre repo GitHub
2. **Build command** : `pip install -r requirements.txt`
3. **Start command** : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Ajouter toutes les variables d'environnement dans l'onglet "Environment"
5. Pour PostgreSQL : ajouter un service PostgreSQL Render et copier l'URL dans `DATABASE_URL`

> ⚠️ Pour les fichiers uploadés en production, utilisez un stockage objet (S3, Cloudflare R2, Supabase Storage) au lieu du dossier `uploads/` local.

### Frontend → Vercel

1. Importer le repo sur [vercel.com](https://vercel.com)
2. **Root Directory** : `frontend`
3. **Build command** : `npm run build`
4. Ajouter la variable `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 🔐 Sécurité

- Mots de passe hashés avec **bcrypt** (passlib)
- Tokens JWT signés avec clé secrète configurable
- Upload limité aux types MIME autorisés (images + PDF uniquement)
- Taille max : 5 MB images, 10 MB PDF
- Noms de fichiers unifiés (UUID) pour éviter les path traversals
- Routes admin protégées par `OAuth2PasswordBearer`

---

## 🧪 Suggestions d'améliorations

### Tests
```bash
# Backend — pytest
pip install pytest httpx pytest-asyncio
pytest tests/

# Frontend — Vitest + Testing Library
npm install -D vitest @testing-library/react
npm run test
```

### Docker
```dockerfile
# Exemple Dockerfile backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Autres améliorations possibles
- [ ] **Internationalisation** (i18n) avec `react-i18next`
- [ ] **Mode sombre/clair** toggle
- [ ] **Animations** enrichies avec Framer Motion
- [ ] **SEO** : sitemap.xml, robots.txt, Open Graph meta
- [ ] **Optimisation images** : conversion WebP côté backend
- [ ] **Rate limiting** sur l'endpoint `/contact` (slowapi)
- [ ] **Refresh token** pour les sessions longues
- [ ] **Storage S3** pour les fichiers en production

---

## 📝 Licence

MIT — Libre d'utilisation et de modification.
