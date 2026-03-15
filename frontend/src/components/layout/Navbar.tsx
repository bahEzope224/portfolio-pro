import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/',            label: 'Accueil' },
  { to: '/projects',    label: 'Projets' },
  { to: '/experiences', label: 'Expériences' },
  { to: '/skills',      label: 'Compétences' },
  { to: '/reviews',     label: 'Avis' },
  { to: '/cv',          label: 'CV' },
  { to: '/contact',     label: 'Contact' },
]

export default function Navbar() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
            dev<span className="text-accent-400">.</span>folio
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
        </nav>

        <button
          className="md:hidden p-2 rounded-lg text-ink-300 hover:text-white
                     hover:bg-white/[0.06] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
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
