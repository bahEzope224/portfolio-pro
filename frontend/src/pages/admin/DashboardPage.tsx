import { Link } from 'react-router-dom'
import { FolderKanban, Briefcase, Zap, FileText, ArrowRight, Star } from 'lucide-react'
import { useProjects, useExperiences, useSkills, useCV, useAllReviews } from '@/hooks/useApi'
import { AdminPage, Card } from '@/components/ui'

export default function DashboardPage() {
  const { data: projects }    = useProjects()
  const { data: experiences } = useExperiences()
  const { data: skills }      = useSkills()
  const { data: cv }          = useCV()
  const { data: reviews }     = useAllReviews()

  const stats = [
    { label: 'Projets',      value: projects?.length    ?? '—', icon: FolderKanban, to: '/admin/projects' },
    { label: 'Expériences',  value: experiences?.length ?? '—', icon: Briefcase,    to: '/admin/experiences' },
    { label: 'Compétences',  value: skills?.length      ?? '—', icon: Zap,          to: '/admin/skills' },
    { label: 'Avis clients', value: reviews?.length     ?? '—', icon: Star,         to: '/admin/reviews' },
    { label: 'CV uploadé',   value: cv ? 'Oui' : 'Non',          icon: FileText,     to: '/admin/cv' },
  ]

  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <AdminPage title="Tableau de bord">
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="glass glass-hover rounded-2xl p-6 flex items-start justify-between group"
          >
            <div>
              <p className="text-ink-400 text-sm font-body mb-1">{label}</p>
              <p className="font-display font-bold text-white text-3xl">{value}</p>
              {label === 'Avis clients' && avgRating && (
                <p className="text-xs text-gold-light font-mono mt-1">★ {avgRating} / 5 moy.</p>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20
                            flex items-center justify-center
                            group-hover:bg-accent-500/25 transition-colors duration-200">
              <Icon className="w-5 h-5 text-accent-400" />
            </div>
          </Link>
        ))}
      </div>

      <Card>
        <h2 className="font-display font-semibold text-white mb-4">Accès rapide</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { to: '/admin/projects',    label: 'Gérer les projets',     icon: FolderKanban },
            { to: '/admin/experiences', label: 'Gérer les expériences', icon: Briefcase },
            { to: '/admin/skills',      label: 'Gérer les compétences', icon: Zap },
            { to: '/admin/reviews',     label: 'Gérer les avis',        icon: Star },
            { to: '/admin/cv',          label: 'Gérer le CV',           icon: FileText },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center justify-between px-4 py-3 rounded-xl
                         bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05]
                         text-ink-200 hover:text-white transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-accent-400" />
                <span className="text-sm font-body">{label}</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </Card>
    </AdminPage>
  )
}
