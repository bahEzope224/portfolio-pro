import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, Briefcase,
  Zap, FileText, LogOut, Code2, Star, Link2,BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clearToken } from '@/store/auth'
import { useAllReviews } from '@/hooks/useApi'

const ADMIN_LINKS = [
  { to: '/admin',              label: 'Dashboard',      icon: LayoutDashboard, end: true },
  { to: '/admin/projects',     label: 'Projets',        icon: FolderKanban },
  { to: '/admin/experiences',  label: 'Expériences',    icon: Briefcase },
  { to: '/admin/skills',       label: 'Compétences',    icon: Zap },
  { to: '/admin/reviews',      label: 'Avis publiés',   icon: Star },
  { to: '/admin/invitations',  label: 'Invitations',    icon: Link2 },
  { to: '/admin/cv',           label: 'CV',             icon: FileText },
  { to: '/admin/blog', label: 'Blog', icon: BookOpen },

]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { data: allReviews } = useAllReviews()
  const pendingCount = allReviews?.filter((r) => !r.is_visible).length ?? 0

  const handleLogout = () => {
    clearToken()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-ink-900">
      <aside className="w-64 shrink-0 border-r border-white/[0.05]
                        bg-ink-900/50 backdrop-blur-sm
                        flex flex-col p-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-3 py-4 mb-6">
          <div className="w-7 h-7 rounded-lg bg-accent-500/20 border border-accent-500/30
                          flex items-center justify-center">
            <Code2 className="w-4 h-4 text-accent-400" />
          </div>
          <span className="font-display font-bold text-white">Admin</span>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {ADMIN_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20'
                    : 'text-ink-300 hover:text-white hover:bg-white/[0.05]',
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {/* Badge pending reviews on Invitations link */}
              {to === '/admin/invitations' && pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-ink-900
                                 text-xs font-bold flex items-center justify-center shrink-0">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
