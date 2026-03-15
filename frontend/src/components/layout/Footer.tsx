import { Link } from 'react-router-dom'
import { Github, Linkedin, Code2 } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row
                      items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-accent-400" />
          <span className="font-display font-bold text-white">
            dev<span className="text-accent-400">.</span>Bah
          </span>
        </Link>

        <p className="text-ink-400 text-sm">
          © {new Date().getFullYear()} — Tous droits réservés
        </p>

        <div className="flex items-center gap-4">
          {[
            { href: 'https://github.com/bahEzope224/', icon: Github,   label: 'GitHub' },
            { href: 'https://www.linkedin.com/in/ibrahima-bah-8215261b9/', icon: Linkedin, label: 'LinkedIn' },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-ink-400 hover:text-white
                         hover:bg-white/[0.06] transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
