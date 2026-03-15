-- =============================================================================
--  PORTFOLIO DATABASE — SQL Complet
--  Compatible SQLite (défaut) et PostgreSQL (changer les types signalés)
--  Généré pour : portfolio-fullstack v1.1
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Extensions (PostgreSQL uniquement — ignorer sous SQLite)
-- ---------------------------------------------------------------------------
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- si vous passez aux UUID


-- ---------------------------------------------------------------------------
-- 1. TABLE : admin_users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,  -- PostgreSQL: SERIAL PRIMARY KEY
    username         VARCHAR(50)  NOT NULL UNIQUE,
    email            VARCHAR(100) NOT NULL UNIQUE,
    hashed_password  VARCHAR(255) NOT NULL,
    is_active        BOOLEAN      NOT NULL DEFAULT 1,    -- PostgreSQL: DEFAULT TRUE
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                     -- PostgreSQL: TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS ix_admin_users_email    ON admin_users(email);


-- ---------------------------------------------------------------------------
-- 2. TABLE : projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       VARCHAR(150) NOT NULL,
    description TEXT         NOT NULL,
    tech_stack  TEXT         NOT NULL DEFAULT '[]',   -- JSON array stocké en TEXT
    github_url  VARCHAR(500),
    live_url    VARCHAR(500),
    image_path  VARCHAR(500),
    is_featured BOOLEAN      NOT NULL DEFAULT 0,
    "order"     INTEGER      NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_projects_id ON projects(id);


-- ---------------------------------------------------------------------------
-- 3. TABLE : experiences
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiences (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    company     VARCHAR(150) NOT NULL,
    position    VARCHAR(150) NOT NULL,
    start_date  VARCHAR(20)  NOT NULL,   -- Format "YYYY-MM"
    end_date    VARCHAR(20),             -- NULL = Présent
    description TEXT         NOT NULL,
    logo_path   VARCHAR(500),
    location    VARCHAR(150),
    "order"     INTEGER      NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_experiences_id ON experiences(id);


-- ---------------------------------------------------------------------------
-- 4. TABLE : skills
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       VARCHAR(100) NOT NULL,
    category   VARCHAR(100) NOT NULL,
    level      INTEGER      NOT NULL DEFAULT 50
               CHECK (level >= 0 AND level <= 100),
    icon       VARCHAR(100),
    "order"    INTEGER      NOT NULL DEFAULT 0,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_skills_id ON skills(id);


-- ---------------------------------------------------------------------------
-- 5. TABLE : cv
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cv (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    VARCHAR(255) NOT NULL,
    file_path   VARCHAR(500) NOT NULL,
    upload_date DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_cv_id ON cv(id);


-- ---------------------------------------------------------------------------
-- 6. TABLE : reviews  (nouveauté v1.1)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(150) NOT NULL,
    company     VARCHAR(150),
    avatar_path VARCHAR(500),
    content     TEXT         NOT NULL,
    rating      INTEGER      NOT NULL DEFAULT 5
                CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN      NOT NULL DEFAULT 0,
    is_visible  BOOLEAN      NOT NULL DEFAULT 1,
    "order"     INTEGER      NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ix_reviews_id         ON reviews(id);
CREATE INDEX IF NOT EXISTS ix_reviews_is_visible ON reviews(is_visible);
CREATE INDEX IF NOT EXISTS ix_reviews_rating     ON reviews(rating);



-- ---------------------------------------------------------------------------
-- Projets
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO projects
    (id, title, description, tech_stack, github_url, live_url, is_featured, "order")
VALUES
(1,
 'Portfolio Personnel',
 'Portfolio fullstack avec React et FastAPI. Interface publique moderne + panneau admin sécurisé avec gestion de projets, expériences, compétences, CV et avis clients.',
 '["React","TypeScript","FastAPI","SQLite","Tailwind CSS","TanStack Query"]',
 'https://github.com/username/portfolio',
 'https://portfolio.example.com',
 1, 1),

(2,
 'API REST E-commerce',
 'Backend complet pour une boutique en ligne avec gestion des commandes, paiements Stripe, notifications email et panel admin.',
 '["FastAPI","PostgreSQL","Redis","Stripe","Docker","Celery"]',
 'https://github.com/username/ecommerce-api',
 NULL,
 1, 2),

(3,
 'Dashboard Analytics Temps Réel',
 'Tableau de bord interactif avec visualisations D3.js et mise à jour WebSocket pour suivre des métriques métier en direct.',
 '["React","D3.js","WebSocket","FastAPI","Chart.js"]',
 'https://github.com/username/dashboard',
 'https://dashboard.example.com',
 0, 3),

(4,
 'App Mobile de Gestion de Tâches',
 'Application React Native cross-platform avec synchronisation cloud, notifications push et mode hors-ligne.',
 '["React Native","Expo","SQLite","Node.js","Firebase"]',
 'https://github.com/username/taskapp',
 NULL,
 0, 4);


-- ---------------------------------------------------------------------------
-- Expériences
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO experiences
    (id, company, position, start_date, end_date, description, location, "order")
VALUES
(1,
 'Tech Startup Paris',
 'Développeur Full Stack Senior',
 '2022-03',
 NULL,
 'Développement de fonctionnalités clés sur une plateforme SaaS B2B traitant 50k+ utilisateurs actifs.
• Architecture microservices avec FastAPI et React
• Réduction du temps de chargement de 40% via optimisation des requêtes et du cache Redis
• Mise en place d''un pipeline CI/CD complet avec GitHub Actions
• Encadrement et code review de 2 développeurs juniors',
 'Paris, France (Hybride)',
 1),

(2,
 'Web Agency Lyon',
 'Développeur Frontend React',
 '2020-09',
 '2022-02',
 'Intégration et développement de sites web et SPA React pour des clients variés (retail, santé, finance).
• Plus de 15 projets clients livrés dans les délais
• Migration d''une application Angular 8 vers React 17 (réduction du bundle de 35%)
• Mise en place des tests automatisés end-to-end avec Cypress
• Référent technique pour les intégrations Figma → React',
 'Lyon, France',
 2),

(3,
 'Digital Studio Nantes',
 'Développeur Web Junior',
 '2018-09',
 '2020-08',
 'Première expérience professionnelle au sein d''une agence digitale à taille humaine.
• Développement de thèmes WordPress sur-mesure
• Initiation au JavaScript moderne et aux frameworks frontend
• Participation à la refonte complète de 5 sites institutionnels',
 'Nantes, France',
 3),

(4,
 'Freelance',
 'Développeur Web Indépendant',
 '2017-06',
 '2018-08',
 'Missions freelance en développement web fullstack pour des entrepreneurs et PME.
• Création de sites vitrine et e-commerce (WooCommerce, Shopify)
• Développement d''outils internes sur-mesure
• Gestion directe de la relation client et du cahier des charges',
 'Remote / France',
 4);


-- ---------------------------------------------------------------------------
-- Compétences
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO skills (id, name, category, level, icon, "order") VALUES
-- Frontend
(1,  'React',         'Frontend', 92, 'react',       1),
(2,  'TypeScript',    'Frontend', 88, 'typescript',  2),
(3,  'Tailwind CSS',  'Frontend', 90, 'tailwindcss', 3),
(4,  'Next.js',       'Frontend', 78, 'nextjs',      4),
(5,  'Vue.js',        'Frontend', 65, 'vuejs',       5),
-- Backend
(6,  'Python',        'Backend',  92, 'python',      1),
(7,  'FastAPI',       'Backend',  88, 'fastapi',     2),
(8,  'Node.js',       'Backend',  72, 'nodejs',      3),
(9,  'PostgreSQL',    'Backend',  78, 'postgresql',  4),
(10, 'Redis',         'Backend',  65, 'redis',       5),
-- DevOps
(11, 'Docker',        'DevOps',   72, 'docker',      1),
(12, 'Git / GitHub',  'DevOps',   92, 'git',         2),
(13, 'Linux',         'DevOps',   78, 'linux',       3),
(14, 'CI/CD',         'DevOps',   68, NULL,          4),
-- Design & Outils
(15, 'Figma',         'Design',   70, 'figma',       1),
(16, 'Responsive',    'Design',   88, NULL,          2),
(17, 'REST / OpenAPI','Design',   85, NULL,          3);


-- ---------------------------------------------------------------------------
-- Avis clients
-- ---------------------------------------------------------------------------
INSERT OR IGNORE INTO reviews
    (id, author_name, author_role, company, content, rating, is_featured, is_visible, "order")
VALUES
(1,
 'Sophie Marchand',
 'CTO',
 'Tech Startup Paris',
 'Travailler avec ce développeur a transformé notre produit. Il n''a pas seulement écrit du code propre — il a compris nos enjeux métier et proposé des architectures qu''on n''aurait pas envisagées seuls. Le ratio qualité/délai est exceptionnel, et son sens du détail sur l''UX nous a évité plusieurs retours clients difficiles.',
 5, 1, 1, 1),

(2,
 'Thomas Renard',
 'CEO & Co-fondateur',
 'Launchpad SAS',
 'J''avais un MVP à livrer en 6 semaines pour une démo investisseurs. Non seulement il a tenu le délai, mais le résultat était bien au-delà de mes attentes visuellement et techniquement. Les investisseurs ont spécifiquement complimenté l''interface. Je le recommande les yeux fermés pour tout projet avec des contraintes fortes.',
 5, 1, 1, 2),

(3,
 'Amélie Duval',
 'Directrice Marketing',
 'Groupe Lumière',
 'Nous avions besoin d''un dashboard analytics pour notre équipe non-technique. Le résultat est intuitif, rapide, et ça a réduit nos reportings manuels de 80%. La communication tout au long du projet était claire et sans jargon inutile.',
 5, 0, 1, 3),

(4,
 'Karim Benali',
 'Lead Developer',
 'Agence PixelPro',
 'J''ai collaboré sur plusieurs missions. Sa maîtrise de React et FastAPI est solide, mais ce qui m''a le plus impressionné c''est sa capacité à lire du code existant rapidement et à proposer des refactors pertinents sans casser l''existant. Un vrai professionnel avec qui il fait bon travailler.',
 5, 0, 1, 4),

(5,
 'Lucie Fontaine',
 'Product Manager',
 'FinTech Clarity',
 'Profil rare : il comprend autant les enjeux produit que les contraintes techniques. Ses estimations sont fiables, ses questions posées au bon moment, et il sait dire non quand une feature est prématurée. Exactement ce dont une PM a besoin.',
 5, 0, 1, 5),

(6,
 'Antoine Moreau',
 'Fondateur',
 'Studio Morpho',
 'Mission de refonte frontend d''une app en prod. Zéro régression, code plus maintenable, et performances doublées. Le tout livré 3 jours avant la deadline. Que demander de plus ?',
 4, 0, 1, 6);


-- =============================================================================
--  VUES UTILES (optionnel — pour requêtes analytiques)
-- =============================================================================

-- Vue : résumé des statistiques du portfolio
CREATE VIEW IF NOT EXISTS v_portfolio_stats AS
SELECT
    (SELECT COUNT(*) FROM projects)                        AS total_projects,
    (SELECT COUNT(*) FROM projects WHERE is_featured = 1)  AS featured_projects,
    (SELECT COUNT(*) FROM experiences)                     AS total_experiences,
    (SELECT COUNT(*) FROM skills)                          AS total_skills,
    (SELECT COUNT(DISTINCT category) FROM skills)          AS skill_categories,
    (SELECT COUNT(*) FROM reviews WHERE is_visible = 1)    AS visible_reviews,
    (SELECT ROUND(AVG(rating), 2) FROM reviews
     WHERE is_visible = 1)                                 AS avg_rating,
    (SELECT COUNT(*) FROM cv)                              AS has_cv;


-- Vue : avis publics avec note moyenne
CREATE VIEW IF NOT EXISTS v_public_reviews AS
SELECT
    id,
    author_name,
    author_role,
    company,
    content,
    rating,
    is_featured,
    "order",
    created_at
FROM reviews
WHERE is_visible = 1
ORDER BY "order" ASC, id ASC;


-- =============================================================================
--  TRIGGERS — mise à jour automatique de updated_at
--  (SQLite ne supporte pas ON UPDATE dans le DEFAULT)
-- =============================================================================

CREATE TRIGGER IF NOT EXISTS trg_projects_updated_at
    AFTER UPDATE ON projects
    FOR EACH ROW
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_experiences_updated_at
    AFTER UPDATE ON experiences
    FOR EACH ROW
BEGIN
    UPDATE experiences SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_reviews_updated_at
    AFTER UPDATE ON reviews
    FOR EACH ROW
BEGIN
    UPDATE reviews SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;


-- =============================================================================
--  REQUÊTES DE VÉRIFICATION
-- =============================================================================

-- SELECT * FROM v_portfolio_stats;
-- SELECT author_name, rating, is_featured FROM v_public_reviews;
-- SELECT category, COUNT(*) as nb, ROUND(AVG(level),1) as avg_level
--   FROM skills GROUP BY category ORDER BY category;


-- =============================================================================
--  MIGRATION VERS POSTGRESQL
--  Remplacements à effectuer dans ce fichier :
--
--  SQLite → PostgreSQL
--  ─────────────────────────────────────────────────────────────────
--  INTEGER PRIMARY KEY AUTOINCREMENT  →  SERIAL PRIMARY KEY
--  DATETIME                           →  TIMESTAMPTZ
--  DEFAULT CURRENT_TIMESTAMP          →  DEFAULT NOW()
--  BOOLEAN DEFAULT 1                  →  BOOLEAN DEFAULT TRUE
--  BOOLEAN DEFAULT 0                  →  BOOLEAN DEFAULT FALSE
--  TEXT (pour JSON)                   →  JSONB
--  INSERT OR IGNORE                   →  INSERT ... ON CONFLICT DO NOTHING
--  CREATE TRIGGER ... BEGIN/END       →  Fonctions PL/pgSQL + CREATE TRIGGER
--  "order" (mot réservé entre "")     →  idem ou renommer en sort_order
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 7. TABLE : review_invitations  (v1.2)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS review_invitations (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    token          VARCHAR(128) NOT NULL UNIQUE,
    client_name    VARCHAR(150) NOT NULL,
    client_role    VARCHAR(150) NOT NULL,
    client_company VARCHAR(150),
    client_email   VARCHAR(200),
    is_used        BOOLEAN      NOT NULL DEFAULT 0,
    expires_at     DATETIME     NOT NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    review_id      INTEGER      REFERENCES reviews(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS ix_invitations_token   ON review_invitations(token);
CREATE INDEX IF NOT EXISTS ix_invitations_is_used ON review_invitations(is_used);
