import { Link } from 'react-router-dom'
import { Github, Linkedin, Code2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-10 mt-20 border-t" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>
            dev<span style={{ color: 'var(--accent)' }}>.</span>Bah
          </span>
        </Link>

        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {'©'} {new Date().getFullYear()} {'—'} Tous droits réservés
        </p>

        <div className="flex items-center gap-3">
          {[
            { href: 'https://github.com/bahEzope224/', icon: Github, label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/ibrahima-bah-8215261b9/', icon: Linkedin, label: 'LinkedIn' },
          ].map(({ href, icon: Icon, label }) => {
            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--accent)'
                  el.style.borderColor = 'var(--accent-border)'
                  el.style.backgroundColor = 'var(--accent-dim)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'var(--text-muted)'
                  el.style.borderColor = 'var(--border)'
                  el.style.backgroundColor = 'transparent'
                }}
              >
                <Icon className="w-4 h-4" />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
