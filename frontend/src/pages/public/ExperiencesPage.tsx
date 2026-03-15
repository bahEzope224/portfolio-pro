import { MapPin, ImageOff } from 'lucide-react'
import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useExperiences } from '@/hooks/useApi'
import { assetUrl, formatMonthYear } from '@/lib/utils'

export default function ExperiencesPage() {
  const { data: experiences, isLoading, isError } = useExperiences()

  return (
    <Section className="pt-32">
      <SectionHeading
        tag="Parcours"
        title="Expériences"
        subtitle="Mon historique professionnel et les entreprises avec lesquelles j'ai collaboré."
      />

      {isLoading && <Spinner />}
      {isError   && <EmptyState message="Impossible de charger les expériences." />}
      {experiences?.length === 0 && <EmptyState message="Aucune expérience pour le moment." />}

      {experiences && experiences.length > 0 && (
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-white/[0.06]
                          hidden md:block" />

          <div className="flex flex-col gap-8">
            {experiences.map((exp, i) => (
              <article
                key={exp.id}
                className="relative flex gap-8 animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Timeline dot */}
                <div className="hidden md:flex shrink-0 w-14 h-14 rounded-2xl
                                bg-ink-800/80 border border-white/[0.07]
                                items-center justify-center relative z-10">
                  {exp.logo_path ? (
                    <img
                      src={assetUrl(exp.logo_path)}
                      alt={exp.company}
                      className="w-9 h-9 object-contain rounded-lg"
                    />
                  ) : (
                    <ImageOff className="w-5 h-5 text-ink-600" />
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 glass glass-hover rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start
                                  sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-display font-bold text-white text-xl">
                        {exp.position}
                      </h3>
                      <p className="text-accent-400 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-mono text-ink-300">
                        {formatMonthYear(exp.start_date)} →{' '}
                        {exp.end_date ? formatMonthYear(exp.end_date) : 'Présent'}
                      </p>
                      {exp.location && (
                        <p className="flex items-center justify-end gap-1
                                      text-xs text-ink-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-ink-300 text-sm leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
