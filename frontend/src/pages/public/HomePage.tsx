import { Link } from 'react-router-dom'
import { ArrowRight, Download, Github, Linkedin, Sparkles } from 'lucide-react'
import { Section } from '@/components/ui'

export default function HomePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Section className="min-h-screen flex items-center pt-32 pb-16 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full
                          bg-accent-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full
                          bg-purple-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center w-full">
          {/* Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-accent-500/10 border border-accent-500/20
                            text-accent-300 text-sm font-mono mb-8
                            animate-fade-up">
              <Sparkles className="w-3.5 h-3.5" />
              Disponible pour de nouveaux projets
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.05] mb-6
                           animate-fade-up [animation-delay:100ms] opacity-0">
              Développeur<br />
              <span className="gradient-text">Full Stack</span>
            </h1>

            <p className="text-ink-300 text-lg leading-relaxed mb-10 max-w-lg
                          animate-fade-up [animation-delay:200ms] opacity-0">
              Je crée des expériences web modernes, performantes et accessibles.
              Passionné par le code propre et les interfaces soignées.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-up [animation-delay:300ms] opacity-0">
              <Link to="/projects" className="btn-primary">
                Voir mes projets
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/cv" className="btn-ghost">
                <Download className="w-4 h-4" />
                Télécharger CV
              </Link>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-10
                            animate-fade-up [animation-delay:400ms] opacity-0">
              {[
                { href: 'https://github.com', icon: Github, label: 'GitHub' },
                { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-ink-400 hover:text-white
                             text-sm font-body transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Avatar / visual */}
          <div className="flex justify-center animate-fade-up [animation-delay:200ms] opacity-0">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full
                              bg-gradient-to-br from-accent-500/30 to-purple-500/30
                              blur-xl scale-110 animate-float" />
              {/* Avatar circle */}
              <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full
                              bg-gradient-to-br from-ink-800 to-ink-700
                              border-2 border-white/[0.06]
                              flex items-center justify-center
                              overflow-hidden">
                {/* Placeholder avatar – replace with real photo */}
                <div className="w-full h-full bg-gradient-to-br
                                from-accent-500/20 via-ink-800 to-purple-500/20
                                flex items-center justify-center">
                  <span className="text-8xl select-none">👨‍💻</span>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4
                              glass rounded-2xl px-4 py-3 border border-white/[0.08]">
                <p className="text-xs text-ink-400 font-mono mb-0.5">Disponible</p>
                <p className="text-sm font-display font-semibold text-white">
                  Freelance / CDI
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <div className="border-y border-white/[0.05] bg-ink-800/30">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '3+',   label: 'Ans d\'expérience' },
            { value: '20+',  label: 'Projets livrés' },
            { value: '10+',  label: 'Technologies' },
            { value: '100%', label: 'Satisfaction client' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-display font-bold gradient-text mb-1">{value}</p>
              <p className="text-sm text-ink-400 font-body">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
