import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useSkills } from '@/hooks/useApi'
import type { Skill } from '@/types'

function SkillCard({ skill, lang }: { skill: Skill, lang: string }) {
  const name = lang === 'en' && skill.name_en ? skill.name_en : skill.name
  return (
    <div className="glass glass-hover rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-body font-medium text-white text-sm">{name}</span>
        <span className="text-xs font-mono">{skill.level}%</span>
      </div>
      <div className="skill-bar">
        <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
      </div>
    </div>
  )
}

export default function SkillsPage() {
  const { i18n, t } = useTranslation()
  const { data: skills, isLoading, isError } = useSkills()
  const currentLang = i18n.language

  const grouped = skills?.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = currentLang === 'en' && skill.category_en ? skill.category_en : skill.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('skills.tag')}
        title={t('skills.title')}
        subtitle={t('skills.subtitle')}
      />
      {isLoading && <Spinner />}
      {isError   && <EmptyState message={t('skills.errLoad')} />}
      {skills?.length === 0 && <EmptyState message={t('skills.empty')} />}
      {grouped && Object.keys(grouped).length > 0 && (
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items], ci) => (
            <div key={category} className="animate-fade-up opacity-0"
                 style={{ animationDelay: `${ci * 100}ms` }}>
              <h3 className="font-display font-bold text-xl mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-accent-500" />
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((skill) => <SkillCard key={skill.id} skill={skill} lang={currentLang} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
