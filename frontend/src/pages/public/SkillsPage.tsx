import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useSkills } from '@/hooks/useApi'
import type { Skill } from '@/types'

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="glass glass-hover rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-body font-medium text-white text-sm">{skill.name}</span>
        <span className="text-xs font-mono text-ink-400">{skill.level}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  )
}

export default function SkillsPage() {
  const { data: skills, isLoading, isError } = useSkills()

  // Group by category
  const grouped = skills?.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <Section className="pt-32">
      <SectionHeading
        tag="Expertise"
        title="Compétences"
        subtitle="Les technologies et outils que je maîtrise au quotidien."
      />

      {isLoading && <Spinner />}
      {isError   && <EmptyState message="Impossible de charger les compétences." />}
      {skills?.length === 0 && <EmptyState message="Aucune compétence pour le moment." />}

      {grouped && Object.keys(grouped).length > 0 && (
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items], ci) => (
            <div
              key={category}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${ci * 100}ms` }}
            >
              <h3 className="font-display font-bold text-white text-xl mb-5
                             flex items-center gap-3">
                <span className="w-8 h-px bg-accent-500" />
                {category}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}
