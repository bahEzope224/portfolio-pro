import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Code2, Sun, Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/hooks/useTheme'

function cn(...c: (string | boolean | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isDark, toggle: toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const toggleLang = () => i18n.changeLanguage(i18n.language.startsWith('fr') ? 'en' : 'fr')

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

  return (
    <header
      className={cn('fixed top-0 inset-x-0 z-50 transition-all duration-300', scrolled ? 'py-3 backdrop-blur-xl border-b shadow-sm' : 'py-5')}
      style={scrolled ? { backgroundColor: 'var(--bg-base)', borderBottomColor: 'var(--border)' } : undefined}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
               style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <Code2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            dev<span style={{ color: 'var(--accent)' }}>.</span>Bah
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200"
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="ml-1 p-2 rounded-lg transition-all duration-200"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleLang}
            className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}
          >
            <span className="text-base leading-none">
              {i18n.language.startsWith('fr') ? '\u{1F1EB}\u{1F1F7}' : '\u{1F1EC}\u{1F1E7}'}
            </span>
            {i18n.language.startsWith('fr') ? 'FR' : 'EN'}
          </button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <button onClick={toggleTheme} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={toggleLang} className="p-2 text-xs font-mono font-semibold" style={{ color: 'var(--text-secondary)' }}>
            {i18n.language.startsWith('fr') ? '\u{1F1EB}\u{1F1F7}' : '\u{1F1EC}\u{1F1E7}'}
          </button>
          <button className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }} onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden absolute top-full inset-x-0 backdrop-blur-xl border-b px-6 pb-6 pt-2 flex flex-col gap-1"
          style={{ backgroundColor: 'var(--bg-base)', borderBottomColor: 'var(--border)' }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-body font-medium transition-all duration-200"
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
