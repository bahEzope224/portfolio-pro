import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminPage, Button, Spinner, EmptyState, Card } from '@/components/ui'
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/hooks/useApi'
import type { Skill } from '@/types'

const schema = z.object({
  name:     z.string().min(1, 'Requis'),
  category: z.string().min(1, 'Requis'),
  level:    z.coerce.number().min(0).max(100),
  icon:     z.string().optional(),
  order:    z.coerce.number().default(0),
})
type FormData = z.infer<typeof schema>

function SkillModal({ skill, onClose }: { skill?: Skill; onClose: () => void }) {
  const create = useCreateSkill()
  const update = useUpdateSkill()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: skill ?? { level: 50, order: 0 },
  })

  const levelValue = watch('level', skill?.level ?? 50)

  const onSubmit = async (data: FormData) => {
    try {
      if (skill) {
        await update.mutateAsync({ id: skill.id, data })
        toast.success('Compétence mise à jour !')
      } else {
        await create.mutateAsync(data as any)
        toast.success('Compétence créée !')
      }
      onClose()
    } catch {
      toast.error('Une erreur est survenue.')
    }
  }

  const isPending = create.isPending || update.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-ink-900/80 backdrop-blur-sm">
      <div className="w-full max-w-md glass rounded-3xl p-7 relative">
        <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-lg
                                             text-ink-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-display font-bold text-white text-xl mb-6">
          {skill ? 'Modifier la compétence' : 'Nouvelle compétence'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Nom *</label>
              <input {...register('name')} className="input-field" placeholder="React" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Catégorie *</label>
              <input {...register('category')} className="input-field" placeholder="Frontend" />
              {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
              Niveau : {levelValue}%
            </label>
            <input {...register('level')} type="range" min="0" max="100" step="5"
                   className="w-full accent-accent-500" />
            {/* Preview bar */}
            <div className="skill-bar mt-2">
              <div className="skill-bar-fill" style={{ width: `${levelValue}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
                Icône (devicon)
              </label>
              <input {...register('icon')} className="input-field" placeholder="react" />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Ordre</label>
              <input {...register('order')} type="number" className="input-field" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" loading={isPending}>
              {skill ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminSkillsPage() {
  const { data: skills, isLoading } = useSkills()
  const deleteMutation = useDeleteSkill()
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState<Skill | undefined>()

  const grouped = skills?.reduce<Record<string, Skill[]>>((acc, s) => {
    acc[s.category] = [...(acc[s.category] ?? []), s]
    return acc
  }, {})

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette compétence ?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Compétence supprimée.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  return (
    <>
      <AdminPage
        title="Compétences"
        action={
          <Button onClick={() => { setEditing(undefined); setModal(true) }}>
            <Plus className="w-4 h-4" />
            Nouvelle compétence
          </Button>
        }
      >
        {isLoading && <Spinner />}
        {!isLoading && skills?.length === 0 && <EmptyState message="Aucune compétence." />}

        {grouped && Object.keys(grouped).length > 0 && (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-display font-semibold text-ink-300 text-sm
                               uppercase tracking-wider mb-3">{category}</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((skill) => (
                    <Card key={skill.id} className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-body font-medium text-white">{skill.name}</span>
                          <span className="text-xs font-mono text-ink-500">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <div className="skill-bar-fill" style={{ width: `${skill.level}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => { setEditing(skill); setModal(true) }}
                                className="p-1.5 rounded-lg text-ink-400 hover:text-white
                                           hover:bg-white/[0.06] transition-all">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(skill.id)}
                                className="p-1.5 rounded-lg text-ink-400 hover:text-red-400
                                           hover:bg-red-500/10 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminPage>

      {modal && (
        <SkillModal
          skill={editing}
          onClose={() => { setModal(false); setEditing(undefined) }}
        />
      )}
    </>
  )
}
