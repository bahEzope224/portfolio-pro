import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminPage, Button, Spinner, EmptyState, Card } from '@/components/ui'
import {
  useExperiences, useCreateExperience, useUpdateExperience, useDeleteExperience,
} from '@/hooks/useApi'
import { assetUrl, formatMonthYear } from '@/lib/utils'
import type { Experience } from '@/types'

const schema = z.object({
  company:    z.string().min(1, 'Requis'),
  position:   z.string().min(1, 'Requis'),
  start_date: z.string().min(1, 'Requis'),
  end_date:   z.string().optional(),
  description: z.string().min(1, 'Requis'),
  location:   z.string().optional(),
  order:      z.coerce.number().default(0),
})
type FormData = z.infer<typeof schema>

function ExperienceModal({ experience, onClose }: { experience?: Experience; onClose: () => void }) {
  const create = useCreateExperience()
  const update = useUpdateExperience()
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: experience ?? {},
  })

  const onSubmit = async (data: FormData) => {
    const form = new FormData()
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== '') form.append(k, String(v)) })
    if (logoFile) form.append('logo', logoFile)

    try {
      if (experience) {
        await update.mutateAsync({ id: experience.id, form })
        toast.success('Expérience mise à jour !')
      } else {
        await create.mutateAsync(form)
        toast.success('Expérience créée !')
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
      <div className="w-full max-w-lg glass rounded-3xl p-7 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-lg
                                             text-ink-400 hover:text-white hover:bg-white/[0.06] transition-all">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-display font-bold text-white text-xl mb-6">
          {experience ? 'Modifier' : 'Nouvelle expérience'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Entreprise *</label>
              <input {...register('company')} className="input-field" placeholder="ACME Corp" />
              {errors.company && <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Poste *</label>
              <input {...register('position')} className="input-field" placeholder="Développeur Full Stack" />
              {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Début * (YYYY-MM)</label>
              <input {...register('start_date')} className="input-field" placeholder="2022-01" />
              {errors.start_date && <p className="text-red-400 text-xs mt-1">{errors.start_date.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Fin (vide = Présent)</label>
              <input {...register('end_date')} className="input-field" placeholder="2024-06" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Localisation</label>
            <input {...register('location')} className="input-field" placeholder="Paris, France" />
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Description *</label>
            <textarea {...register('description')} rows={4} className="input-field resize-none"
                      placeholder="Missions et réalisations…" />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Logo entreprise</label>
            <input
              type="file" accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-400
                         file:mr-3 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:text-xs file:font-mono
                         file:bg-accent-500/15 file:text-accent-400
                         hover:file:bg-accent-500/25 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" loading={isPending}>
              {experience ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminExperiencesPage() {
  const { data: experiences, isLoading } = useExperiences()
  const deleteMutation = useDeleteExperience()
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState<Experience | undefined>()

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette expérience ?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Expérience supprimée.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  return (
    <>
      <AdminPage
        title="Expériences"
        action={
          <Button onClick={() => { setEditing(undefined); setModal(true) }}>
            <Plus className="w-4 h-4" />
            Nouvelle expérience
          </Button>
        }
      >
        {isLoading && <Spinner />}
        {!isLoading && experiences?.length === 0 && <EmptyState message="Aucune expérience." />}

        {experiences && experiences.length > 0 && (
          <div className="flex flex-col gap-3">
            {experiences.map((exp) => (
              <Card key={exp.id} className="flex items-start gap-4">
                {exp.logo_path && (
                  <img src={assetUrl(exp.logo_path)} alt={exp.company}
                       className="w-12 h-12 rounded-xl object-contain bg-white/5 shrink-0 p-1" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-white">{exp.position}</h3>
                  <p className="text-accent-400 text-sm font-medium">{exp.company}</p>
                  <p className="text-ink-500 text-xs font-mono mt-0.5">
                    {formatMonthYear(exp.start_date)} →{' '}
                    {exp.end_date ? formatMonthYear(exp.end_date) : 'Présent'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" onClick={() => { setEditing(exp); setModal(true) }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(exp.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AdminPage>

      {modal && (
        <ExperienceModal
          experience={editing}
          onClose={() => { setModal(false); setEditing(undefined) }}
        />
      )}
    </>
  )
}
