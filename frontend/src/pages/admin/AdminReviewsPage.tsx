import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminPage, Button, Spinner, EmptyState, Card } from '@/components/ui'
import {
  useAllReviews,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
  useToggleReviewVisibility,
} from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'
import type { Review } from '@/types'

// ── Zod schema ────────────────────────────────────────────────────────────
const schema = z.object({
  author_name:    z.string().min(1, 'Requis'),
  author_role:    z.string().min(1, 'Requis'),
  author_role_en: z.string().optional(),
  company:        z.string().optional(),
  content:        z.string().min(10, 'Avis trop court (min. 10 caractères)'),
  content_en:     z.string().optional(),
  rating:         z.coerce.number().min(1).max(5).default(5),
  is_featured:    z.boolean().default(false),
  is_visible:     z.boolean().default(true),
  order:          z.coerce.number().default(0),
})
type FormData = z.infer<typeof schema>

// ── Star picker ───────────────────────────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? 'fill-gold-DEFAULT text-gold-DEFAULT'
                : 'fill-transparent text-ink-600'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-mono text-ink-400">{value}/5</span>
    </div>
  )
}

// ── Modal form ────────────────────────────────────────────────────────────
function ReviewModal({
  review,
  onClose,
}: {
  review?: Review
  onClose: () => void
}) {
  const createMutation = useCreateReview()
  const updateMutation = useUpdateReview()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: review
      ? {
          author_name:    review.author_name,
          author_role:    review.author_role,
          author_role_en: review.author_role_en ?? '',
          company:        review.company ?? '',
          content:        review.content,
          content_en:     review.content_en ?? '',
          rating:         review.rating,
          is_featured:    review.is_featured,
          is_visible:     review.is_visible,
          order:          review.order,
        }
      : { rating: 5, is_featured: false, is_visible: true, order: 0, author_role_en: '', content_en: '' },
  })

  const ratingValue = watch('rating', review?.rating ?? 5)

  const onSubmit = async (data: FormData) => {
    const form = new FormData()
    form.append('author_name',    data.author_name)
    form.append('author_role',    data.author_role)
    if (data.author_role_en) form.append('author_role_en', data.author_role_en)
    if (data.company)        form.append('company',        data.company)
    form.append('content',        data.content)
    if (data.content_en)     form.append('content_en',     data.content_en)
    form.append('rating',         String(data.rating))
    form.append('is_featured',    String(data.is_featured))
    form.append('is_visible',     String(data.is_visible))
    form.append('order',          String(data.order))
    if (avatarFile) form.append('avatar', avatarFile)

    try {
      if (review) {
        await updateMutation.mutateAsync({ id: review.id, form })
        toast.success('Avis mis à jour !')
      } else {
        await createMutation.mutateAsync(form)
        toast.success('Avis créé !')
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
          {review ? 'Modifier l\'avis' : 'Nouvel avis client'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase mb-1">Nom *</label>
              <input {...register('author_name')} className="input-field" placeholder="Marie Dupont" />
              {errors.author_name && <p className="text-red-400 text-xs mt-1">{errors.author_name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase mb-1">Role (FR) *</label>
              <input {...register('author_role')} className="input-field" placeholder="CEO" />
              {errors.author_role && <p className="text-red-400 text-xs mt-1">{errors.author_role.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase mb-1">Role (EN)</label>
            <input {...register('author_role_en')} className="input-field" placeholder="CEO" />
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
              Entreprise
            </label>
            <input {...register('company')} className="input-field"
                   placeholder="ACME Corp" />
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase mb-1">Témoignage (FR) *</label>
              <textarea {...register('content')} rows={5} className="input-field resize-none"
                        placeholder="Avis en français…" />
              {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase mb-1">Testimonial (EN)</label>
              <textarea {...register('content_en')} rows={5} className="input-field resize-none"
                        placeholder="English testimonial…" />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
              Note
            </label>
            <StarPicker
              value={ratingValue}
              onChange={(v) => setValue('rating', v)}
            />
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
              Photo / Avatar
            </label>
            {review?.avatar_path && !avatarFile && (
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={assetUrl(review.avatar_path)}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-xs text-ink-500">Photo actuelle conservée</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-400
                         file:mr-3 file:py-2 file:px-4 file:rounded-lg
                         file:border-0 file:text-xs file:font-mono
                         file:bg-accent-500/15 file:text-accent-400
                         hover:file:bg-accent-500/25 cursor-pointer"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('is_featured')}
                type="checkbox"
                className="rounded border-ink-600 bg-ink-800 text-accent-500"
              />
              <span className="text-sm text-ink-300 font-body">Mettre en avant</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('is_visible')}
                type="checkbox"
                className="rounded border-ink-600 bg-ink-800 text-accent-500"
              />
              <span className="text-sm text-ink-300 font-body">Visible publiquement</span>
            </label>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1">
                Ordre
              </label>
              <input
                {...register('order')}
                type="number"
                className="input-field w-20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" loading={isPending}>
              {review ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main admin page ───────────────────────────────────────────────────────
export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useAllReviews()
  const deleteMutation = useDeleteReview()
  const toggleMutation = useToggleReviewVisibility()
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<Review | undefined>()

  const openCreate = () => { setEditing(undefined); setModal(true) }
  const openEdit   = (r: Review) => { setEditing(r); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(undefined) }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet avis ?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Avis supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id)
    } catch {
      toast.error('Erreur lors du changement de visibilité.')
    }
  }

  // Stats
  const total    = reviews?.length ?? 0
  const visible  = reviews?.filter((r) => r.is_visible).length ?? 0
  const featured = reviews?.filter((r) => r.is_featured).length ?? 0
  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <>
      <AdminPage
        title="Avis clients"
        action={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            Nouvel avis
          </Button>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',       value: total },
            { label: 'Visibles',    value: visible },
            { label: 'En avant',    value: featured },
            { label: 'Note moy.',   value: avgRating },
          ].map(({ label, value }) => (
            <div key={label} className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-display font-bold gradient-text">{value}</p>
              <p className="text-xs text-ink-400 font-mono mt-1">{label}</p>
            </div>
          ))}
        </div>

        {isLoading && <Spinner />}
        {!isLoading && reviews?.length === 0 && (
          <EmptyState message="Aucun avis. Ajoutez-en un !" />
        )}

        {reviews && reviews.length > 0 && (
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className={`flex items-start gap-4 transition-opacity duration-200 ${
                  !review.is_visible ? 'opacity-50' : ''
                }`}
              >
                {/* Avatar preview */}
                <div className="shrink-0">
                  {review.avatar_path ? (
                    <img
                      src={assetUrl(review.avatar_path)}
                      alt={review.author_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent-500/15
                                    border border-accent-500/20
                                    flex items-center justify-center
                                    font-display font-bold text-xs text-accent-400">
                      {review.author_name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-display font-semibold text-white text-sm">
                      {review.author_name}
                    </span>
                    <span className="text-ink-500 text-xs">·</span>
                    <span className="text-ink-400 text-xs">{review.author_role}</span>
                    {review.company && (
                      <>
                        <span className="text-ink-600 text-xs">·</span>
                        <span className="text-ink-500 text-xs">{review.company}</span>
                      </>
                    )}
                    {review.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                       bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/20">
                        ✦ Featured
                      </span>
                    )}
                    {!review.is_visible && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                       bg-ink-700 text-ink-400 border border-white/[0.05]">
                        Masqué
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= review.rating
                            ? 'fill-gold-DEFAULT text-gold-DEFAULT'
                            : 'fill-transparent text-ink-700'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-ink-400 text-sm line-clamp-2 font-body italic">
                    "{review.content}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(review.id)}
                    title={review.is_visible ? 'Masquer' : 'Afficher'}
                    className={`p-2 rounded-lg transition-all ${
                      review.is_visible
                        ? 'text-ink-400 hover:text-white hover:bg-white/[0.06]'
                        : 'text-ink-600 hover:text-ink-300 hover:bg-white/[0.03]'
                    }`}
                  >
                    {review.is_visible
                      ? <Eye className="w-4 h-4" />
                      : <EyeOff className="w-4 h-4" />
                    }
                  </button>
                  <Button variant="ghost" onClick={() => openEdit(review)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AdminPage>

      {modal && <ReviewModal review={editing} onClose={closeModal} />}
    </>
  )
}
