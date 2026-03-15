import { Link } from 'react-router-dom'
import { FolderKanban, Briefcase, Zap, FileText, ArrowRight, Star, BookOpen } from 'lucide-react'
import { useProjects, useExperiences, useSkills, useCV, useAllReviews, useAllBlogPosts } from '@/hooks/useApi'
import { AdminPage, Card } from '@/components/ui'

export default function DashboardPage() {
  const { data: projects }    = useProjects()
  const { data: experiences } = useExperiences()
  const { data: skills }      = useSkills()
  const { data: cv }          = useCV()
  const { data: reviews }     = useAllReviews()
  const { data: posts }       = useAllBlogPosts()

  const stats = [
    { label: 'Projets',      value: projects?.length    ?? '—', icon: FolderKanban, to: '/admin/projects' },
    { label: 'Expériences',  value: experiences?.length ?? '—', icon: Briefcase,    to: '/admin/experiences' },
    { label: 'Compétences',  value: skills?.length      ?? '—', icon: Zap,          to: '/admin/skills' },
    { label: 'Articles',     value: posts?.length       ?? '—', icon: BookOpen,     to: '/admin/blog' },
    { label: 'Avis clients', value: reviews?.length     ?? '—', icon: Star,         to: '/admin/reviews' },
    { label: 'CV uploadé',   value: cv ? 'Oui' : 'Non',         icon: FileText,     to: '/admin/cv' },
  ]

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <AdminPage title="Tableau de bord">
      {/* Stats grid — 2 cols mobile, 3 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-8 sm:mb-10">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="glass glass-hover rounded-2xl p-4 sm:p-6
                       flex items-start justify-between group"
          >
            <div className="min-w-0">
              <p className="text-ink-400 text-xs sm:text-sm font-body mb-1 truncate">{label}</p>
              <p className="font-display font-bold text-white text-2xl sm:text-3xl">{value}</p>
              {label === 'Avis clients' && avgRating && (
                <p className="text-xs text-gold-light font-mono mt-1">★ {avgRating}/5</p>
              )}
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl
                            bg-accent-500/15 border border-accent-500/20
                            flex items-center justify-center shrink-0 ml-2
                            group-hover:bg-accent-500/25 transition-colors duration-200">
              <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent-400" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick access */}
      <Card>
        <h2 className="font-display font-semibold text-white mb-4 text-sm sm:text-base">
          Accès rapide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {[
            { to: '/admin/projects',    label: 'Gérer les projets',     icon: FolderKanban },
            { to: '/admin/experiences', label: 'Gérer les expériences', icon: Briefcase },
            { to: '/admin/skills',      label: 'Gérer les compétences', icon: Zap },
            { to: '/admin/blog',        label: 'Écrire un article',     icon: BookOpen },
            { to: '/admin/reviews',     label: 'Gérer les avis',        icon: Star },
            { to: '/admin/cv',          label: 'Gérer le CV',           icon: FileText },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                         bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05]
                         text-ink-200 hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Icon className="w-4 h-4 text-accent-400 shrink-0" />
                <span className="text-xs sm:text-sm font-body truncate">{label}</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100
                                     transition-opacity shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      </Card>
    </AdminPage>
  )
}
