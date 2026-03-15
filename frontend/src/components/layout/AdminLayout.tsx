import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, Briefcase,
  Zap, FileText, LogOut, Code2, Star, Link2,
  BookOpen, Menu, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { clearToken } from '@/store/auth'
import { useAllReviews } from '@/hooks/useApi'

const ADMIN_LINKS = [
  { to: '/admin',             label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/projects',    label: 'Projets',      icon: FolderKanban },
  { to: '/admin/experiences', label: 'Expériences',  icon: Briefcase },
  { to: '/admin/skills',      label: 'Compétences',  icon: Zap },
  { to: '/admin/blog',        label: 'Blog',         icon: BookOpen },
  { to: '/admin/reviews',     label: 'Avis publiés', icon: Star },
  { to: '/admin/invitations', label: 'Invitations',  icon: Link2 },
  { to: '/admin/cv',          label: 'CV',           icon: FileText },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const { data: allReviews } = useAllReviews()
  const pendingCount = allReviews?.filter((r) => !r.is_visible).length ?? 0
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    clearToken()
    navigate('/admin/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  const NavContent = () => (
    <>
      {/* Brand */}
      <div className="flex items-center justify-between px-3 py-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-500/20 border border-accent-500/30
                          flex items-center justify-center">
            <Code2 className="w-4 h-4 text-accent-400" />
          </div>
          <span className="font-display font-bold text-white">Admin</span>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={closeSidebar}
          className="lg:hidden p-1.5 rounded-lg text-ink-400 hover:text-white
                     hover:bg-white/[0.06] transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
        {ADMIN_LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={closeSidebar}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20'
                : 'text-ink-300 hover:text-white hover:bg-white/[0.05]',
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {to === '/admin/invitations' && pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-ink-900
                               text-xs font-bold flex items-center justify-center shrink-0">
                {pendingCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                   text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 mt-2"
      >
        <LogOut className="w-4 h-4" />
        Déconnexion
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-ink-900">

      {/* ── Mobile top bar ────────────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40
                         flex items-center justify-between
                         px-4 py-3 bg-ink-900/90 backdrop-blur-xl
                         border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent-500/20 border border-accent-500/30
                          flex items-center justify-center">
            <Code2 className="w-4 h-4 text-accent-400" />
          </div>
          <span className="font-display font-bold text-white text-sm">Admin</span>
        </div>

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-ink-900
                             text-xs font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-ink-300 hover:text-white
                       hover:bg-white/[0.06] transition-all"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* ── Desktop sidebar ─────────────────────────────────────────── */}
        <aside className="hidden lg:flex w-64 shrink-0 flex-col
                          border-r border-white/[0.05] bg-ink-900/50 backdrop-blur-sm
                          p-4 sticky top-0 h-screen">
          <NavContent />
        </aside>

        {/* ── Mobile sidebar overlay ───────────────────────────────────── */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="lg:hidden fixed inset-0 z-50 bg-ink-900/80 backdrop-blur-sm"
              onClick={closeSidebar}
            />
            {/* Drawer */}
            <aside className="lg:hidden fixed top-0 left-0 z-50
                              w-72 h-full flex flex-col
                              bg-ink-900 border-r border-white/[0.06]
                              p-4 shadow-2xl
                              animate-fade-in">
              <NavContent />
            </aside>
          </>
        )}

        {/* ── Main content ─────────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
