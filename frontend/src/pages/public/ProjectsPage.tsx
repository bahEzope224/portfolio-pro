import { ExternalLink, Github, ImageOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Badge, Spinner, EmptyState } from '@/components/ui'
import { useProjects } from '@/hooks/useApi'
import { assetUrl, truncate } from '@/lib/utils'

export default function ProjectsPage() {
    const { i18n, t } = useTranslation()
    const { data: projects, isLoading, isError } = useProjects()
    const currentLang = i18n.language

    return (
      <Section className="pt-32">
        <SectionHeading
          tag={t('projects.tag')}
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />
        {isLoading && <Spinner />}
        {isError   && <EmptyState message={t('projects.errLoad')} />}
        {projects && projects.length === 0 && <EmptyState message={t('projects.empty')} />}
        {projects && projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const title = currentLang === 'en' && project.title_en ? project.title_en : project.title
              const desc  = currentLang === 'en' && project.description_en ? project.description_en : project.description

              return (
                <article key={project.id}
                  className="glass glass-hover rounded-2xl overflow-hidden group animate-fade-up opacity-0"
                  style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="aspect-video bg-ink-800/60 overflow-hidden relative">
                    {project.image_path ? (
                      <img src={assetUrl(project.image_path)} alt={title}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff className="w-8 h-8 text-ink-600" />
                      </div>
                    )}
                    {project.is_featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full
                                       bg-gold-DEFAULT/20 border border-gold-DEFAULT/30
                                       text-gold-light text-xs font-mono">
                        {t('projects.featured')}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl mb-2">{title}</h3>
                    <p className="text-ink-300 text-sm leading-relaxed mb-4">
                      {truncate(desc, 130)}
                    </p>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech_stack.map((tech) => <Badge key={tech} label={tech} />)}
                </div>
                <div className="flex items-center gap-3">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1.5 hover:text-white text-sm transition-colors duration-200">
                      <Github className="w-4 h-4" />{t('projects.source')}
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1.5 text-accent-400 hover:text-accent-300 text-sm transition-colors duration-200">
                      <ExternalLink className="w-4 h-4" />{t('projects.demo')}
                    </a>
                  )}
                </div>
                  </div>
                </article>
              )
            })}
        </div>
      )}
    </Section>
  )
}
