#!/bin/bash
# =============================================================================
# Script d'installation du système i18n (FR/EN) pour portfolio-pro
# Exécuter depuis la RACINE du projet : portfolio-pro/
# =============================================================================

set -e
DST="frontend/src"

echo "📦 Installation des packages i18n..."
cd frontend && npm install i18next react-i18next i18next-browser-languagedetector && cd ..

echo "📁 Création de la structure des dossiers..."
mkdir -p $DST/i18n/locales

# =============================================================================
# 1. CONFIG i18n
# =============================================================================
echo "⚙️  Création de src/i18n/index.ts..."
cat > $DST/i18n/index.ts << 'ENDOFFILE'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import fr from './locales/fr'
import en from './locales/en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n
ENDOFFILE

# =============================================================================
# 2. TRADUCTIONS FRANÇAISES
# =============================================================================
echo "🇫🇷  Création de src/i18n/locales/fr.ts..."
cat > $DST/i18n/locales/fr.ts << 'ENDOFFILE'
const fr = {
  nav: {
    home:        'Accueil',
    projects:    'Projets',
    experiences: 'Expériences',
    skills:      'Compétences',
    reviews:     'Avis',
    cv:          'CV',
    contact:     'Contact',
    blog:        'Blog',
  },
  home: {
    badge:          'Disponible pour de nouveaux projets',
    title:          'Développeur',
    titleHighlight: 'Full Stack',
    intro:          "Entre une idée griffonnée sur papier et une app utilisée par des milliers de personnes, il y a exactement",
    introEmphasis:  'une conversation.',
    desc:           "Je transforme des exigences complexes en interfaces qui",
    descEmphasis:   'semblent',
    descEnd:        "évidentes — parce que le meilleur code, on ne le voit pas.",
    cta:            'Voir mes projets',
    downloadCV:     'Télécharger CV',
    badgeAvailable: 'Disponible',
    badgeType:      'Freelance / CDI',
    stats: {
      experience:   "Ans d'expérience",
      projects:     'Projets livrés',
      technologies: 'Technologies',
      satisfaction: 'Satisfaction client',
    },
  },
  projects: {
    tag:      'Réalisations',
    title:    'Mes Projets',
    subtitle: "Une sélection de projets personnels et professionnels que j'ai construits.",
    featured: '✦ Featured',
    demo:     'Démo',
    source:   'Source',
    errLoad:  'Impossible de charger les projets.',
    empty:    'Aucun projet pour le moment.',
  },
  experiences: {
    tag:      'Parcours',
    title:    'Expériences',
    subtitle: "Mon historique professionnel et les entreprises avec lesquelles j'ai collaboré.",
    present:  "Aujourd'hui",
    errLoad:  'Impossible de charger les expériences.',
    empty:    'Aucune expérience pour le moment.',
  },
  skills: {
    tag:      'Expertise',
    title:    'Compétences',
    subtitle: 'Les technologies et outils que je maîtrise au quotidien.',
    errLoad:  'Impossible de charger les compétences.',
    empty:    'Aucune compétence pour le moment.',
  },
  cv: {
    tag:      'Curriculum Vitae',
    title:    'Mon CV',
    subtitle: 'Téléchargez ou consultez mon curriculum vitae directement en ligne.',
    download: 'Télécharger le CV',
    page:     'Page',
    of:       'sur',
    errLoad:  'CV non disponible pour le moment.',
  },
  contact: {
    tag:               'Contact',
    title:             'Travaillons ensemble',
    subtitle:          "Vous avez un projet ? N'hésitez pas à me contacter.",
    email:             'Email',
    location:          'Localisation',
    locationValue:     'Paris, France',
    availability:      'Disponibilité',
    availabilityValue: 'Lun – Ven, 9h – 18h',
    labelName:         'Nom',
    labelEmail:        'Email',
    labelSubject:      'Sujet',
    labelMessage:      'Message',
    placeholderName:    'Jean Dupont',
    placeholderEmail:   'jean@exemple.com',
    placeholderSubject: 'Proposition de projet…',
    placeholderMessage: 'Décrivez votre projet ou votre question…',
    send:        'Envoyer le message',
    successMsg:  'Message envoyé ! Je vous réponds rapidement.',
    errorMsg:    "Erreur lors de l'envoi. Veuillez réessayer.",
    validation: {
      nameTooShort:    'Nom trop court',
      emailInvalid:    'Email invalide',
      subjectTooShort: 'Sujet trop court',
      messageTooShort: 'Message trop court (min. 20 caractères)',
    },
  },
  reviews: {
    tag:     'Témoignages',
    title:   'Ce que disent mes clients',
    subtitle: "Des retours authentiques de professionnels avec lesquels j'ai collaboré.",
    errLoad: 'Impossible de charger les avis.',
    empty:   'Aucun avis pour le moment.',
  },
  blog: {
    tag:              'Blog',
    title:            'Articles & Réflexions',
    subtitle:         "Mes pensées sur la technologie, le développement et l'innovation.",
    searchPlaceholder:'Rechercher un article…',
    allCategories:    'Toutes',
    views:            'vues',
    readMore:         "Lire l'article",
    errLoad:          'Impossible de charger les articles.',
    empty:            'Aucun article pour le moment.',
    noResults:        'Aucun article ne correspond à votre recherche.',
  },
  common: {
    loading:  'Chargement…',
    error:    'Une erreur est survenue.',
    backHome: "Retour à l'accueil",
    readMore: 'Lire plus',
    showLess: 'Réduire',
  },
} as const

export default fr
ENDOFFILE

# =============================================================================
# 3. TRADUCTIONS ANGLAISES
# =============================================================================
echo "🇬🇧  Création de src/i18n/locales/en.ts..."
cat > $DST/i18n/locales/en.ts << 'ENDOFFILE'
const en = {
  nav: {
    home:        'Home',
    projects:    'Projects',
    experiences: 'Experience',
    skills:      'Skills',
    reviews:     'Reviews',
    cv:          'Resume',
    contact:     'Contact',
    blog:        'Blog',
  },
  home: {
    badge:          'Available for new projects',
    title:          'Full Stack',
    titleHighlight: 'Developer',
    intro:          'Between an idea scribbled on paper and an app used by thousands of people, there is exactly',
    introEmphasis:  'one conversation.',
    desc:           'I turn complex requirements into interfaces that',
    descEmphasis:   'feel',
    descEnd:        'obvious — because the best code, you never see it.',
    cta:            'View my projects',
    downloadCV:     'Download Resume',
    badgeAvailable: 'Available',
    badgeType:      'Freelance / Full-time',
    stats: {
      experience:   'Years of experience',
      projects:     'Projects delivered',
      technologies: 'Technologies',
      satisfaction: 'Client satisfaction',
    },
  },
  projects: {
    tag:      'Work',
    title:    'My Projects',
    subtitle: 'A selection of personal and professional projects I have built.',
    featured: '✦ Featured',
    demo:     'Demo',
    source:   'Source',
    errLoad:  'Unable to load projects.',
    empty:    'No projects yet.',
  },
  experiences: {
    tag:      'Career',
    title:    'Experience',
    subtitle: 'My professional history and the companies I have worked with.',
    present:  'Present',
    errLoad:  'Unable to load experiences.',
    empty:    'No experience yet.',
  },
  skills: {
    tag:      'Expertise',
    title:    'Skills',
    subtitle: 'The technologies and tools I use on a daily basis.',
    errLoad:  'Unable to load skills.',
    empty:    'No skills yet.',
  },
  cv: {
    tag:      'Curriculum Vitae',
    title:    'My Resume',
    subtitle: 'Download or view my resume directly online.',
    download: 'Download Resume',
    page:     'Page',
    of:       'of',
    errLoad:  'Resume not available at the moment.',
  },
  contact: {
    tag:               'Contact',
    title:             "Let's work together",
    subtitle:          'Have a project in mind? Feel free to reach out.',
    email:             'Email',
    location:          'Location',
    locationValue:     'Paris, France',
    availability:      'Availability',
    availabilityValue: 'Mon – Fri, 9am – 6pm',
    labelName:         'Name',
    labelEmail:        'Email',
    labelSubject:      'Subject',
    labelMessage:      'Message',
    placeholderName:    'John Doe',
    placeholderEmail:   'john@example.com',
    placeholderSubject: 'Project proposal…',
    placeholderMessage: 'Describe your project or question…',
    send:        'Send message',
    successMsg:  'Message sent! I will get back to you shortly.',
    errorMsg:    'Error while sending. Please try again.',
    validation: {
      nameTooShort:    'Name is too short',
      emailInvalid:    'Invalid email',
      subjectTooShort: 'Subject is too short',
      messageTooShort: 'Message is too short (min. 20 characters)',
    },
  },
  reviews: {
    tag:     'Testimonials',
    title:   'What my clients say',
    subtitle: 'Genuine feedback from professionals I have worked with.',
    errLoad: 'Unable to load reviews.',
    empty:   'No reviews yet.',
  },
  blog: {
    tag:              'Blog',
    title:            'Articles & Thoughts',
    subtitle:         'My thoughts on technology, development and innovation.',
    searchPlaceholder:'Search an article…',
    allCategories:    'All',
    views:            'views',
    readMore:         'Read article',
    errLoad:          'Unable to load articles.',
    empty:            'No articles yet.',
    noResults:        'No articles match your search.',
  },
  common: {
    loading:  'Loading…',
    error:    'An error occurred.',
    backHome: 'Back to home',
    readMore: 'Read more',
    showLess: 'Show less',
  },
} as const

export default en
ENDOFFILE

# =============================================================================
# 4. main.tsx — ajout de l'import i18n (si pas déjà présent)
# =============================================================================
echo "🔧  Mise à jour de main.tsx..."
if ! grep -q "import './i18n'" $DST/main.tsx; then
  sed -i.bak "s|import './index.css'|import './index.css'\nimport './i18n'|" $DST/main.tsx
  echo "   ✅ Import i18n ajouté dans main.tsx"
else
  echo "   ℹ️  Import i18n déjà présent dans main.tsx"
fi

# =============================================================================
# 5. Navbar.tsx
# =============================================================================
echo "🔧  Remplacement de Navbar.tsx..."
cat > $DST/components/layout/Navbar.tsx << 'ENDOFFILE'
import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Code2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr')
  }

  const NAV_LINKS = [
    { to: '/',            label: t('nav.home') },
    { to: '/projects',    label: t('nav.projects') },
    { to: '/experiences', label: t('nav.experiences') },
    { to: '/skills',      label: t('nav.skills') },
    { to: '/reviews',     label: t('nav.reviews') },
    { to: '/cv',          label: t('nav.cv') },
    { to: '/contact',     label: t('nav.contact') },
    { to: '/blog',        label: t('nav.blog') },
  ]

  const currentLang = i18n.language.startsWith('fr') ? 'FR' : 'EN'
  const nextLang    = i18n.language.startsWith('fr') ? 'EN' : 'FR'

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'py-3 bg-ink-900/80 backdrop-blur-xl border-b border-white/[0.05]'
          : 'py-5 bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent-500/20 border border-accent-500/30
                          flex items-center justify-center
                          group-hover:bg-accent-500/30 transition-colors duration-200">
            <Code2 className="w-4 h-4 text-accent-400" />
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            dev<span className="text-accent-400">.</span>Bah
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200',
                  isActive
                    ? 'text-white bg-white/[0.08]'
                    : 'text-ink-300 hover:text-white hover:bg-white/[0.04]',
                )
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Language switcher */}
          <button
            onClick={toggleLang}
            aria-label={`Switch to ${nextLang}`}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       border border-white/[0.08] bg-white/[0.03]
                       text-xs font-mono font-semibold text-ink-300
                       hover:text-white hover:border-accent-500/40 hover:bg-accent-500/10
                       transition-all duration-200"
          >
            <span className="text-base leading-none">
              {i18n.language.startsWith('fr') ? '🇫🇷' : '🇬🇧'}
            </span>
            {currentLang}
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLang}
            aria-label={`Switch to ${nextLang}`}
            className="p-2 rounded-lg text-ink-300 hover:text-white
                       hover:bg-white/[0.06] transition-colors text-xs font-mono font-semibold"
          >
            {i18n.language.startsWith('fr') ? '🇫🇷' : '🇬🇧'}
          </button>
          <button
            className="p-2 rounded-lg text-ink-300 hover:text-white
                       hover:bg-white/[0.06] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden absolute top-full inset-x-0
                        bg-ink-900/95 backdrop-blur-xl border-b border-white/[0.05]
                        px-6 pb-6 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'px-4 py-3 rounded-lg text-sm font-body font-medium transition-all duration-200',
                  isActive ? 'text-white bg-white/[0.08]' : 'text-ink-300 hover:text-white',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
ENDOFFILE

# =============================================================================
# 6. HomePage.tsx
# =============================================================================
echo "🔧  Remplacement de HomePage.tsx..."
cat > $DST/pages/public/HomePage.tsx << 'ENDOFFILE'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, Github, Linkedin, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <>
      <Section className="min-h-screen flex items-center pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full
                          bg-accent-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full
                          bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-accent-500/10 border border-accent-500/20
                            text-accent-300 text-sm font-mono mb-8 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5" />
              {t('home.badge')}
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.05] mb-6
                           animate-fade-up [animation-delay:100ms] opacity-0">
              {t('home.title')}<br />
              <span className="gradient-text">{t('home.titleHighlight')}</span>
            </h1>

            <p className="text-ink-300 text-lg leading-relaxed mb-3 max-w-lg
                animate-fade-up [animation-delay:200ms] opacity-0">
              {t('home.intro')}{' '}
              <em className="text-white not-italic font-medium">{t('home.introEmphasis')}</em>
            </p>
            <p className="text-ink-400 text-base leading-relaxed mb-10 max-w-lg
                animate-fade-up [animation-delay:250ms] opacity-0">
              {t('home.desc')}{' '}
              <em className="text-ink-200 not-italic">{t('home.descEmphasis')}</em>{' '}
              {t('home.descEnd')}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:300ms] opacity-0">
              <Link to="/projects" className="btn-primary">
                {t('home.cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/cv" className="btn-ghost">
                <Download className="w-4 h-4" />
                {t('home.downloadCV')}
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-10
                            animate-fade-up [animation-delay:400ms] opacity-0">
              {[
                { href: 'https://github.com/bahEzope224/', icon: Github, label: 'GitHub' },
                { href: 'https://www.linkedin.com/in/ibrahima-bah-8215261b9/', icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                   className="flex items-center gap-2 text-ink-400 hover:text-white
                              text-sm font-body transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex justify-center animate-fade-up [animation-delay:200ms] opacity-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full
                              bg-gradient-to-br from-accent-500/30 to-purple-500/30
                              blur-xl scale-110 animate-float" />
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full
                              bg-gradient-to-br from-ink-800 to-ink-700
                              border-2 border-white/[0.06]
                              flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br
                                from-accent-500/20 via-ink-800 to-purple-500/20
                                flex items-center justify-center">
                  <span className="text-8xl select-none">👨‍💻</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4
                              glass rounded-2xl px-4 py-3 border border-white/[0.08]">
                <p className="text-xs text-ink-400 font-mono mb-0.5">{t('home.badgeAvailable')}</p>
                <p className="text-sm font-display font-semibold text-white">{t('home.badgeType')}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="border-y border-white/[0.05] bg-ink-800/30">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '3+',   labelKey: 'home.stats.experience' },
            { value: '20+',  labelKey: 'home.stats.projects' },
            { value: '10+',  labelKey: 'home.stats.technologies' },
            { value: '100%', labelKey: 'home.stats.satisfaction' },
          ].map(({ value, labelKey }) => (
            <div key={labelKey} className="text-center">
              <p className="text-3xl font-display font-bold gradient-text mb-1">{value}</p>
              <p className="text-sm text-ink-400 font-body">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
ENDOFFILE

# =============================================================================
# 7. ProjectsPage.tsx
# =============================================================================
echo "🔧  Remplacement de ProjectsPage.tsx..."
cat > $DST/pages/public/ProjectsPage.tsx << 'ENDOFFILE'
import { ExternalLink, Github, ImageOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Badge, Spinner, EmptyState } from '@/components/ui'
import { useProjects } from '@/hooks/useApi'
import { assetUrl, truncate } from '@/lib/utils'

export default function ProjectsPage() {
  const { t } = useTranslation()
  const { data: projects, isLoading, isError } = useProjects()

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('projects.tag')}
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
      />
      {isLoading && <Spinner />}
      {isError   && <EmptyState message={t('projects.errLoad')} />}
      {projects && projects.length === 0 && <EmptyState message={t('projects.empty')} />}
      {projects && projects.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <article key={project.id}
              className="glass glass-hover rounded-2xl overflow-hidden group animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="aspect-video bg-ink-800/60 overflow-hidden relative">
                {project.image_path ? (
                  <img src={assetUrl(project.image_path)} alt={project.title}
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-8 h-8 text-ink-600" />
                  </div>
                )}
                {project.is_featured && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full
                                   bg-gold-DEFAULT/20 border border-gold-DEFAULT/30
                                   text-gold-light text-xs font-mono">
                    {t('projects.featured')}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-white text-xl mb-2">{project.title}</h3>
                <p className="text-ink-300 text-sm leading-relaxed mb-4">
                  {truncate(project.description, 130)}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech_stack.map((tech) => <Badge key={tech} label={tech} />)}
                </div>
                <div className="flex items-center gap-3">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1.5 text-ink-400 hover:text-white text-sm transition-colors duration-200">
                      <Github className="w-4 h-4" />{t('projects.source')}
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1.5 text-accent-400 hover:text-accent-300 text-sm transition-colors duration-200">
                      <ExternalLink className="w-4 h-4" />{t('projects.demo')}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  )
}
ENDOFFILE

# =============================================================================
# 8. ExperiencesPage.tsx
# =============================================================================
echo "🔧  Remplacement de ExperiencesPage.tsx..."
cat > $DST/pages/public/ExperiencesPage.tsx << 'ENDOFFILE'
import { MapPin, ImageOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useExperiences } from '@/hooks/useApi'
import { assetUrl, formatMonthYear } from '@/lib/utils'

export default function ExperiencesPage() {
  const { t } = useTranslation()
  const { data: experiences, isLoading, isError } = useExperiences()

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('experiences.tag')}
        title={t('experiences.title')}
        subtitle={t('experiences.subtitle')}
      />
      {isLoading && <Spinner />}
      {isError   && <EmptyState message={t('experiences.errLoad')} />}
      {experiences?.length === 0 && <EmptyState message={t('experiences.empty')} />}
      {experiences && experiences.length > 0 && (
        <div className="relative">
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-white/[0.06] hidden md:block" />
          <div className="flex flex-col gap-8">
            {experiences.map((exp, i) => (
              <article key={exp.id}
                className="relative flex gap-8 animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="hidden md:flex shrink-0 w-14 h-14 rounded-2xl
                                bg-ink-800/80 border border-white/[0.07]
                                items-center justify-center relative z-10">
                  {exp.logo_path ? (
                    <img src={assetUrl(exp.logo_path)} alt={exp.company}
                         className="w-9 h-9 object-contain rounded-lg" />
                  ) : (
                    <ImageOff className="w-5 h-5 text-ink-600" />
                  )}
                </div>
                <div className="flex-1 glass glass-hover rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-xl">{exp.position}</h3>
                      <p className="text-accent-400 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono text-ink-300">
                        {formatMonthYear(exp.start_date)} →{' '}
                        {exp.end_date ? formatMonthYear(exp.end_date) : t('experiences.present')}
                      </p>
                      {exp.location && (
                        <p className="flex items-center justify-end gap-1 text-xs text-ink-500 mt-1">
                          <MapPin className="w-3 h-3" />{exp.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-ink-300 text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
ENDOFFILE

# =============================================================================
# 9. SkillsPage.tsx
# =============================================================================
echo "🔧  Remplacement de SkillsPage.tsx..."
cat > $DST/pages/public/SkillsPage.tsx << 'ENDOFFILE'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useSkills } from '@/hooks/useApi'
import type { Skill } from '@/types'

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="glass glass-hover rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-body font-medium text-white text-sm">{skill.name}</span>
        <span className="text-xs font-mono text-ink-400">{skill.level}%</span>
      </div>
      <div className="skill-bar">
        <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
      </div>
    </div>
  )
}

export default function SkillsPage() {
  const { t } = useTranslation()
  const { data: skills, isLoading, isError } = useSkills()

  const grouped = skills?.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('skills.tag')}
        title={t('skills.title')}
        subtitle={t('skills.subtitle')}
      />
      {isLoading && <Spinner />}
      {isError   && <EmptyState message={t('skills.errLoad')} />}
      {skills?.length === 0 && <EmptyState message={t('skills.empty')} />}
      {grouped && Object.keys(grouped).length > 0 && (
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items], ci) => (
            <div key={category} className="animate-fade-up opacity-0"
                 style={{ animationDelay: `${ci * 100}ms` }}>
              <h3 className="font-display font-bold text-white text-xl mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-accent-500" />
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
ENDOFFILE

# =============================================================================
# 10. CVPage.tsx
# =============================================================================
echo "🔧  Remplacement de CVPage.tsx..."
cat > $DST/pages/public/CVPage.tsx << 'ENDOFFILE'
import { useState } from 'react'
import { Download, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner } from '@/components/ui'
import { useCV } from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function CVPage() {
  const { t, i18n } = useTranslation()
  const { data: cv, isLoading } = useCV()
  const [numPages,    setNumPages]    = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pdfLoading,  setPdfLoading]  = useState(true)
  const pdfUrl = cv ? assetUrl(cv.file_path) : null

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('cv.tag')}
        title={t('cv.title')}
        subtitle={t('cv.subtitle')}
      />
      {isLoading && <Spinner />}
      {!isLoading && !cv && (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-24 h-24 rounded-3xl bg-ink-800/60 border border-white/[0.06]
                          flex items-center justify-center animate-float">
            <FileText className="w-10 h-10 text-ink-500" />
          </div>
          <p className="text-ink-400 text-sm">{t('cv.errLoad')}</p>
        </div>
      )}
      {cv && pdfUrl && (
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-3xl glass rounded-2xl p-6
                          flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20
                              flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm">{cv.filename}</p>
                <p className="text-xs text-ink-400 font-mono">
                  {new Date(cv.upload_date).toLocaleDateString(
                    i18n.language.startsWith('fr') ? 'fr-FR' : 'en-GB'
                  )}
                </p>
              </div>
            </div>
            <a href={pdfUrl} download={cv.filename} className="btn-primary">
              <Download className="w-4 h-4" />
              {t('cv.download')}
            </a>
          </div>
          <div className="w-full max-w-3xl">
            {numPages > 1 && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg glass glass-hover disabled:opacity-30 text-ink-300 hover:text-white transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-mono text-ink-300">
                  {t('cv.page')} {currentPage} {t('cv.of')} {numPages}
                </span>
                <button onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                        disabled={currentPage === numPages}
                        className="p-2 rounded-lg glass glass-hover disabled:opacity-30 text-ink-300 hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="rounded-2xl overflow-hidden border border-white/[0.06]
                            flex justify-center bg-ink-800/30">
              {pdfLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent-400" />
                </div>
              )}
              <Document file={pdfUrl}
                onLoadSuccess={({ numPages: n }) => { setNumPages(n); setPdfLoading(false) }}
                onLoadError={() => setPdfLoading(false)}
                loading="">
                <Page pageNumber={currentPage}
                      width={Math.min(window.innerWidth - 80, 800)}
                      renderTextLayer={true}
                      renderAnnotationLayer={true} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
ENDOFFILE

# =============================================================================
# 11. ContactPage.tsx
# =============================================================================
echo "🔧  Remplacement de ContactPage.tsx..."
cat > $DST/pages/public/ContactPage.tsx << 'ENDOFFILE'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Mail, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Button } from '@/components/ui'
import { useSendContact } from '@/hooks/useApi'
import type { ContactFormData } from '@/types'

export default function ContactPage() {
  const { t } = useTranslation()
  const { mutateAsync, isPending } = useSendContact()

  const schema = z.object({
    name:    z.string().min(2, t('contact.validation.nameTooShort')),
    email:   z.string().email(t('contact.validation.emailInvalid')),
    subject: z.string().min(3, t('contact.validation.subjectTooShort')),
    message: z.string().min(20, t('contact.validation.messageTooShort')),
  })

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ContactFormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await mutateAsync(data)
      toast.success(t('contact.successMsg'))
      reset()
    } catch {
      toast.error(t('contact.errorMsg'))
    }
  }

  const infoCards = [
    { icon: Mail,   label: t('contact.email'),        value: <a href="mailto:bahibrahimatalibe@gmail.com">bahibrahimatalibe@gmail.com</a> },
    { icon: MapPin, label: t('contact.location'),     value: t('contact.locationValue') },
    { icon: Clock,  label: t('contact.availability'), value: t('contact.availabilityValue') },
  ]

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('contact.tag')}
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {infoCards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass glass-hover rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20
                              flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-xs text-ink-400 font-mono uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-white font-body font-medium text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}
              className="lg:col-span-3 glass rounded-2xl p-8 flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
                {t('contact.labelName')}
              </label>
              <input {...register('name')} placeholder={t('contact.placeholderName')} className="input-field" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
                {t('contact.labelEmail')}
              </label>
              <input {...register('email')} type="email" placeholder={t('contact.placeholderEmail')} className="input-field" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
              {t('contact.labelSubject')}
            </label>
            <input {...register('subject')} placeholder={t('contact.placeholderSubject')} className="input-field" />
            {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
              {t('contact.labelMessage')}
            </label>
            <textarea {...register('message')} rows={6} placeholder={t('contact.placeholderMessage')} className="input-field resize-none" />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" loading={isPending} className="self-end">
            <Send className="w-4 h-4" />
            {t('contact.send')}
          </Button>
        </form>
      </div>
    </Section>
  )
}
ENDOFFILE

# =============================================================================
# 12. ReviewsPage.tsx
# =============================================================================
echo "🔧  Remplacement de ReviewsPage.tsx..."
cat > $DST/pages/public/ReviewsPage.tsx << 'ENDOFFILE'
import { useState } from 'react'
import { Quote, Star, UserCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useReviews } from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'
import type { Review } from '@/types'

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${cls} transition-colors ${
          star <= rating ? 'fill-gold-DEFAULT text-gold-DEFAULT' : 'fill-transparent text-ink-700'
        }`} />
      ))}
    </div>
  )
}

function Avatar({ review }: { review: Review }) {
  const initials = review.author_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  if (review.avatar_path) {
    return <img src={assetUrl(review.avatar_path)} alt={review.author_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
  }
  const colors = [
    'bg-accent-500/20 text-accent-300', 'bg-purple-500/20 text-purple-300',
    'bg-teal-500/20 text-teal-300',     'bg-rose-500/20 text-rose-300',
    'bg-amber-500/20 text-amber-300',
  ]
  const colorIdx = review.author_name.charCodeAt(0) % colors.length
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center
                     font-display font-bold text-sm border border-white/10 ${colors[colorIdx]}`}>
      {initials}
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const isLong = review.content.length > 220

  return (
    <article className="glass glass-hover rounded-2xl p-7 flex flex-col gap-5
                        animate-fade-up opacity-0 relative overflow-hidden group"
             style={{ animationDelay: `${index * 80}ms` }}>
      <div className="absolute -top-2 -right-2 w-16 h-16 opacity-[0.04]
                      group-hover:opacity-[0.07] transition-opacity duration-300">
        <Quote className="w-full h-full text-accent-400" />
      </div>
      {review.is_featured && (
        <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full
                          text-xs font-mono bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/20">
          ✦ Featured
        </span>
      )}
      <div className={review.is_featured ? 'mt-4' : ''}>
        <StarRating rating={review.rating} />
      </div>
      <blockquote className="text-ink-200 text-[15px] leading-relaxed font-body italic relative">
        <span className="text-accent-400 text-2xl font-display not-italic leading-none mr-1">"</span>
        {isLong && !expanded ? review.content.slice(0, 220) + '…' : review.content}
        <span className="text-accent-400 text-2xl font-display not-italic leading-none ml-0.5">"</span>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
                  className="ml-2 text-accent-400 hover:text-accent-300 text-xs font-mono not-italic transition-colors">
            {expanded ? t('common.showLess') : t('common.readMore')}
          </button>
        )}
      </blockquote>
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
        <Avatar review={review} />
        <div>
          <p className="font-display font-semibold text-white text-sm">{review.author_name}</p>
          <p className="text-ink-400 text-xs font-body">
            {review.author_role}
            {review.company && <span className="text-ink-500"> · {review.company}</span>}
          </p>
        </div>
      </div>
    </article>
  )
}

function ReviewStats({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation()
  if (reviews.length === 0) return null
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }))

  return (
    <div className="glass rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-8">
      <div className="text-center shrink-0">
        <p className="text-5xl font-display font-bold gradient-text">{avg.toFixed(1)}</p>
        <StarRating rating={Math.round(avg)} size="lg" />
        <p className="text-ink-400 text-xs font-mono mt-1">{reviews.length} {t('reviews.tag').toLowerCase()}</p>
      </div>
      <div className="flex-1 w-full flex flex-col gap-2">
        {counts.map(({ star, count }) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-10 shrink-0">
                <span className="text-xs font-mono text-ink-400">{star}</span>
                <Star className="w-3 h-3 fill-gold-DEFAULT text-gold-DEFAULT" />
              </div>
              <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-gold-DEFAULT to-gold-light transition-all duration-700"
                     style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-mono text-ink-500 w-6 text-right shrink-0">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const { t } = useTranslation()
  const { data: reviews, isLoading, isError } = useReviews()

  return (
    <Section className="pt-32">
      <SectionHeading tag={t('reviews.tag')} title={t('reviews.title')} subtitle={t('reviews.subtitle')} />
      {isLoading && <Spinner />}
      {isError && <EmptyState message={t('reviews.errLoad')} />}
      {reviews && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 gap-5">
          <div className="w-20 h-20 rounded-3xl glass border border-white/[0.06] flex items-center justify-center">
            <UserCircle2 className="w-9 h-9 text-ink-600" />
          </div>
          <p className="text-ink-500 text-sm text-center">{t('reviews.empty')}</p>
        </div>
      )}
      {reviews && reviews.length > 0 && (
        <>
          <ReviewStats reviews={reviews} />
          {reviews.some((r) => r.is_featured) && (
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {reviews.filter((r) => r.is_featured).map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
          {reviews.some((r) => !r.is_featured) && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.filter((r) => !r.is_featured).map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
ENDOFFILE

# =============================================================================
# 13. BlogPage.tsx
# =============================================================================
echo "🔧  Remplacement de BlogPage.tsx..."
cat > $DST/pages/public/BlogPage.tsx << 'ENDOFFILE'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Eye, Tag, Search, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner, EmptyState, Badge } from '@/components/ui'
import { useBlogPosts, useBlogCategories, useBlogTags } from '@/hooks/useApi'
import { assetUrl, truncate } from '@/lib/utils'
import type { BlogPostSummary } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  'IA':                    'bg-purple-500/15 text-purple-300 border-purple-500/20',
  'Géopolitique':          'bg-red-500/15 text-red-300 border-red-500/20',
  'Data Science':          'bg-blue-500/15 text-blue-300 border-blue-500/20',
  'Nouvelles Technologies':'bg-teal-500/15 text-teal-300 border-teal-500/20',
  'Général':               'bg-ink-700 text-ink-300 border-white/10',
}
function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-accent-500/15 text-accent-300 border-accent-500/20'
}

function PostCard({ post, index }: { post: BlogPostSummary; index: number }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('fr') ? 'fr-FR' : 'en-GB'
  return (
    <Link to={`/blog/${post.slug}`}
          className="glass glass-hover rounded-2xl overflow-hidden group animate-fade-up opacity-0 flex flex-col"
          style={{ animationDelay: `${index * 70}ms` }}>
      <div className="aspect-video bg-ink-800/60 overflow-hidden relative">
        {post.cover_path ? (
          <img src={assetUrl(post.cover_path)} alt={post.title}
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
            <BookOpen className="w-10 h-10 text-ink-700" />
          </div>
        )}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-mono border ${getCategoryColor(post.category)}`}>
          {post.category}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-white text-lg leading-tight mb-2
                       group-hover:text-accent-300 transition-colors duration-200">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-ink-300 text-sm leading-relaxed mb-4 flex-1">{truncate(post.excerpt, 120)}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => <Badge key={tag} label={tag} />)}
          </div>
        )}
        <div className="flex items-center gap-4 text-xs text-ink-500 font-mono
                        border-t border-white/[0.05] pt-3 mt-auto">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.reading_time} min</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views} {t('blog.views')}</span>
          {post.published_at && (
            <span className="ml-auto">
              {new Date(post.published_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function BlogPage() {
  const { t } = useTranslation()
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [activeTag, setActiveTag] = useState('')

  const { data: posts,      isLoading } = useBlogPosts({ category: category || undefined, tag: activeTag || undefined, search: search || undefined })
  const { data: categories } = useBlogCategories()
  const { data: tags }       = useBlogTags()

  return (
    <Section className="pt-32">
      <SectionHeading tag={t('blog.tag')} title={t('blog.title')} subtitle={t('blog.subtitle')} />
      <div className="flex flex-col gap-4 mb-10">
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                 placeholder={t('blog.searchPlaceholder')} className="input-field pl-11" />
        </div>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setCategory('')}
                    className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200 border ${
                      !category ? 'bg-accent-500/20 text-accent-300 border-accent-500/30'
                                : 'text-ink-400 border-white/[0.06] hover:border-white/20 hover:text-white'}`}>
              {t('blog.allCategories')}
            </button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat === category ? '' : cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200 border ${
                        cat === category ? 'bg-accent-500/20 text-accent-300 border-accent-500/30'
                                         : 'text-ink-400 border-white/[0.06] hover:border-white/20 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <Tag className="w-3.5 h-3.5 text-ink-600 shrink-0" />
            {tags.slice(0, 15).map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                      className={`px-2.5 py-0.5 rounded-md text-xs font-mono transition-all duration-200 border ${
                        tag === activeTag ? 'bg-accent-500/15 text-accent-300 border-accent-500/20'
                                          : 'text-ink-500 border-white/[0.05] hover:text-ink-300 hover:border-white/10'}`}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      {isLoading && <Spinner />}
      {!isLoading && posts?.length === 0 && (
        <EmptyState message={search || category || activeTag ? t('blog.noResults') : t('blog.empty')} />
      )}
      {posts && posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
        </div>
      )}
    </Section>
  )
}
ENDOFFILE

echo ""
echo "✅  Terminé ! Tous les fichiers ont été créés/remplacés."
echo ""
echo "👉  Lance maintenant : cd frontend && npm run dev"
