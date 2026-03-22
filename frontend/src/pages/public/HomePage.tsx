import { Link } from 'react-router-dom'
import { ArrowRight, Download, Github, Linkedin, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section } from '@/components/ui'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <>
      <Section className="min-h-screen flex items-center pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none mesh-bg" />
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono mb-8 animate-fade-up"
              style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('home.badge')}
            </div>

            <h1
              className="text-5xl md:text-7xl font-display font-bold leading-[1.05] mb-6 animate-fade-up [animation-delay:100ms] opacity-0"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('home.title')}<br />
              <span className="gradient-text">{t('home.titleHighlight')}</span>
            </h1>

            <p className="text-lg leading-relaxed mb-3 max-w-lg animate-fade-up [animation-delay:200ms] opacity-0"
              style={{ color: 'var(--text-secondary)' }}>
              {t('home.intro')}{' '}
              <em className="not-italic font-semibold" style={{ color: 'var(--text-primary)' }}>
                {t('home.introEmphasis')}
              </em>
            </p>

            <p className="text-base leading-relaxed mb-10 max-w-lg animate-fade-up [animation-delay:250ms] opacity-0"
              style={{ color: 'var(--text-muted)' }}>
              {t('home.desc')}{' '}
              <em className="not-italic" style={{ color: 'var(--text-secondary)' }}>{t('home.descEmphasis')}</em>{' '}
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

            <div className="flex items-center gap-4 mt-10 animate-fade-up [animation-delay:400ms] opacity-0">
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
                    className="flex items-center gap-2 text-sm font-body transition-colors duration-200"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </a>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center animate-fade-up [animation-delay:200ms] opacity-0">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl scale-110 animate-float"
                style={{ background: 'radial-gradient(circle, var(--accent-dim), var(--mint-dim))' }}
              />
              <div
                className="relative w-72 h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-raised))', border: '2px solid var(--border)' }}
              >
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--accent-dim), transparent, var(--mint-dim))' }}
                >
                  <span className="text-8xl select-none">&#x1F468;&#x200D;&#x1F4BB;</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-3">
                <p className="text-xs font-mono mb-0.5" style={{ color: 'var(--text-muted)' }}>{t('home.badgeAvailable')}</p>
                <p className="text-sm font-display font-semibold" style={{ color: 'var(--text-primary)' }}>{t('home.badgeType')}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '3+', labelKey: 'home.stats.experience' },
            { value: '20+', labelKey: 'home.stats.projects' },
            { value: '10+', labelKey: 'home.stats.technologies' },
            { value: '100%', labelKey: 'home.stats.satisfaction' },
          ].map(({ value, labelKey }) => (
            <div key={labelKey} className="text-center">
              <p className="text-3xl font-display font-bold gradient-text mb-1">{value}</p>
              <p className="text-sm font-body" style={{ color: 'var(--text-muted)' }}>{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
