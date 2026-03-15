import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  AdminPage, Button, Spinner, EmptyState, Badge, Card,
} from '@/components/ui'
import {
  useProjects, useCreateProject, useUpdateProject, useDeleteProject,
} from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'
import type { Project } from '@/types'

// ── Zod schema ───────────────────────────────────────────────────────────
const schema = z.object({
  title:       z.string().min(1, 'Titre requis'),
  description: z.string().min(1, 'Description requise'),
  tech_stack:  z.string(),   // comma-separated
  github_url:  z.string().optional(),
  live_url:    z.string().optional(),
  is_featured: z.boolean().default(false),
  order:       z.coerce.number().default(0),
})
type FormData = z.infer<typeof schema>

// ── Modal form ────────────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project?: Project
  onClose: () => void
}) {
  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()
  const [imageFile, setImageFile] = useState<File | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: project
      ? {
          title:       project.title,
          description: project.description,
          tech_stack:  project.tech_stack.join(', '),
          github_url:  project.github_url ?? '',
          live_url:    project.live_url ?? '',
          is_featured: project.is_featured,
          order:       project.order,
        }
      : {},
  })

  const onSubmit = async (data: FormData) => {
    const form = new FormData()
    form.append('title',       data.title)
    form.append('description', data.description)
    form.append('tech_stack',  JSON.stringify(data.tech_stack.split(',').map(t => t.trim()).filter(Boolean)))
    if (data.github_url)  form.append('github_url',  data.github_url)
    if (data.live_url)    form.append('live_url',    data.live_url)
    form.append('is_featured', String(data.is_featured))
    form.append('order',       String(data.order))
    if (imageFile) form.append('image', imageFile)

    try {
      if (project) {
        await updateMutation.mutateAsync({ id: project.id, form })
        toast.success('Projet mis à jour !')
      } else {
        await createMutation.mutateAsync(form)
        toast.success('Projet créé !')
      }
      onClose()
    } catch {
      toast.error('Une erreur est survenue.')
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-ink-900/80 backdrop-blur-sm">
      <div className="w-full max-w-lg glass rounded-3xl p-7 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-ink-400
                     hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display font-bold text-white text-xl mb-6">
          {project ? 'Modifier le projet' : 'Nouveau projet'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Titre *</label>
            <input {...register('title')} className="input-field" placeholder="Mon super projet" />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Description *</label>
            <textarea {...register('description')} rows={3} className="input-field resize-none" placeholder="Description du projet…" />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Tech stack */}
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
              Stack (séparées par virgule)
            </label>
            <input {...register('tech_stack')} className="input-field" placeholder="React, FastAPI, PostgreSQL" />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">GitHub URL</label>
              <input {...register('github_url')} className="input-field" placeholder="https://github.com/…" />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Live URL</label>
              <input {...register('live_url')} className="input-field" placeholder="https://…" />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-400
                         file:mr-3 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:text-xs file:font-mono
                         file:bg-accent-500/15 file:text-accent-400
                         hover:file:bg-accent-500/25 cursor-pointer"
            />
            {project?.image_path && !imageFile && (
              <p className="text-xs text-ink-500 mt-1">Image actuelle conservée</p>
            )}
          </div>

          {/* Featured + order */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input {...register('is_featured')} type="checkbox"
                     className="rounded border-ink-600 bg-ink-800 text-accent-500" />
              <span className="text-sm text-ink-300 font-body">Featured</span>
            </label>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1">Ordre</label>
              <input {...register('order')} type="number" className="input-field w-20" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" loading={isPending}>
              {project ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AdminProjectsPage() {
  const { data: projects, isLoading } = useProjects()
  const deleteMutation = useDeleteProject()
  const [modal,  setModal]  = useState(false)
  const [editing, setEditing] = useState<Project | undefined>()

  const openCreate = () => { setEditing(undefined); setModal(true) }
  const openEdit   = (p: Project) => { setEditing(p); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(undefined) }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce projet ?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Projet supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  return (
    <>
      <AdminPage
        title="Projets"
        action={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Button>
        }
      >
        {isLoading && <Spinner />}
        {!isLoading && projects?.length === 0 && (
          <EmptyState message="Aucun projet. Créez-en un !" />
        )}

        {projects && projects.length > 0 && (
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <Card key={p.id} className="flex items-start gap-4">
                {p.image_path && (
                  <img
                    src={assetUrl(p.image_path)}
                    alt={p.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-ink-700"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold text-white">{p.title}</h3>
                    {p.is_featured && (
                      <span className="text-xs text-gold-light font-mono">★ Featured</span>
                    )}
                  </div>
                  <p className="text-ink-400 text-sm line-clamp-1 mb-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tech_stack.slice(0, 4).map((t) => (
                      <Badge key={t} label={t} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" onClick={() => openEdit(p)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AdminPage>

      {modal && <ProjectModal project={editing} onClose={closeModal} />}
    </>
  )
}
