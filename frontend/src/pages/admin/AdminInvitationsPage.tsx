import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Trash2, X, Copy, CheckCircle, Clock,
  Link2, Star, Eye, ThumbsUp, ThumbsDown, Send,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminPage, Button, Spinner, EmptyState, Card } from '@/components/ui'
import {
  useInvitations, useCreateInvitation, useDeleteInvitation,
  useAllReviews, useApproveReview, useRejectReview,
} from '@/hooks/useApi'
import type { ReviewInvitation, Review } from '@/types'

// ── Zod schema ────────────────────────────────────────────────────────────
const schema = z.object({
  client_name:    z.string().min(1, 'Requis'),
  client_role:    z.string().min(1, 'Requis'),
  client_company: z.string().optional(),
  client_email:   z.string().email('Email invalide').optional().or(z.literal('')),
})
type FormData = z.infer<typeof schema>

// ── Copy URL helper ───────────────────────────────────────────────────────
function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Lien copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      title="Copier le lien"
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono
                  transition-all duration-200 ${
        copied
          ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
          : 'bg-white/[0.04] text-ink-400 border border-white/[0.06] hover:text-white hover:border-white/20'
      }`}
    >
      {copied
        ? <><CheckCircle className="w-3.5 h-3.5" />Copié</>
        : <><Copy className="w-3.5 h-3.5" />Copier le lien</>
      }
    </button>
  )
}

// ── Create invitation modal ───────────────────────────────────────────────
function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: (url: string) => void }) {
  const createMutation = useCreateInvitation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createMutation.mutateAsync({
        client_name:    data.client_name,
        client_role:    data.client_role,
        client_company: data.client_company || undefined,
        client_email:   data.client_email   || undefined,
      })
      onCreated(res.data.invite_url)
      onClose()
    } catch {
      toast.error('Erreur lors de la création.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-ink-900/80 backdrop-blur-sm">
      <div className="w-full max-w-md glass rounded-3xl p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-ink-400
                     hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display font-bold text-white text-xl mb-1">
          Créer une invitation
        </h2>
        <p className="text-ink-400 text-sm mb-6">
          Un lien unique valable 7 jours sera généré pour ce client.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
                Nom complet *
              </label>
              <input {...register('client_name')} className="input-field"
                     placeholder="Marie Martin" />
              {errors.client_name && (
                <p className="text-red-400 text-xs mt-1">{errors.client_name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
                Poste *
              </label>
              <input {...register('client_role')} className="input-field"
                     placeholder="CTO" />
              {errors.client_role && (
                <p className="text-red-400 text-xs mt-1">{errors.client_role.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
              Entreprise
            </label>
            <input {...register('client_company')} className="input-field"
                   placeholder="ACME Corp" />
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
              Email du client (pour référence)
            </label>
            <input {...register('client_email')} type="email" className="input-field"
                   placeholder="marie@acme.com" />
            {errors.client_email && (
              <p className="text-red-400 text-xs mt-1">{errors.client_email.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit" loading={createMutation.isPending}>
              <Link2 className="w-4 h-4" />
              Générer le lien
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Generated link modal ──────────────────────────────────────────────────
function GeneratedLinkModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Lien copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-ink-900/80 backdrop-blur-sm">
      <div className="w-full max-w-lg glass rounded-3xl p-8 relative text-center">
        <div className="w-16 h-16 rounded-full bg-accent-500/15 border border-accent-500/30
                        flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-accent-400" />
        </div>

        <h2 className="font-display font-bold text-white text-xl mb-2">
          Lien généré avec succès !
        </h2>
        <p className="text-ink-400 text-sm mb-6">
          Envoyez ce lien à votre client. Il est valable <strong className="text-white">7 jours</strong> et ne peut être utilisé qu'une seule fois.
        </p>

        {/* URL display */}
        <div className="bg-ink-800/60 rounded-xl p-4 border border-white/[0.06] mb-5">
          <p className="text-xs font-mono text-ink-500 mb-2">Lien d'invitation</p>
          <p className="text-sm font-mono text-accent-300 break-all leading-relaxed">{url}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCopy}
            className={`btn-primary ${copied ? 'bg-green-600 hover:bg-green-500' : ''}`}
          >
            {copied
              ? <><CheckCircle className="w-4 h-4" />Copié !</>
              : <><Copy className="w-4 h-4" />Copier le lien</>
            }
          </button>
          <Button variant="ghost" onClick={onClose}>Fermer</Button>
        </div>

        <p className="text-ink-600 text-xs font-mono mt-5">
          💡 Conseil : envoyez ce lien par email en mentionnant que l'avis sera relu avant publication.
        </p>
      </div>
    </div>
  )
}

// ── Pending reviews section ───────────────────────────────────────────────
function PendingReviews() {
  const { data: allReviews, isLoading } = useAllReviews()
  const approveMutation = useApproveReview()
  const rejectMutation  = useRejectReview()

  const pending = allReviews?.filter((r) => !r.is_visible) ?? []

  if (isLoading) return null
  if (pending.length === 0) return null

  const handleApprove = async (id: number) => {
    try {
      await approveMutation.mutateAsync(id)
      toast.success('✅ Avis approuvé et publié !')
    } catch {
      toast.error('Erreur lors de l\'approbation.')
    }
  }

  const handleReject = async (id: number) => {
    if (!confirm('Supprimer cet avis définitivement ?')) return
    try {
      await rejectMutation.mutateAsync(id)
      toast.success('Avis supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display font-semibold text-white text-lg">
          Avis en attente de validation
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono
                         bg-amber-500/15 text-amber-300 border border-amber-500/20">
          {pending.length} en attente
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {pending.map((review) => (
          <Card key={review.id} className="border-l-2 border-l-amber-500/40">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-white text-sm">
                    {review.author_name}
                  </span>
                  <span className="text-ink-500 text-xs">·</span>
                  <span className="text-ink-400 text-xs">{review.author_role}</span>
                  {review.company && (
                    <span className="text-ink-500 text-xs">@ {review.company}</span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-2">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-3.5 h-3.5 ${
                      s <= review.rating
                        ? 'fill-gold-DEFAULT text-gold-DEFAULT'
                        : 'fill-transparent text-ink-700'
                    }`} />
                  ))}
                  <span className="text-xs font-mono text-ink-500 ml-1">
                    {review.rating}/5
                  </span>
                </div>

                <p className="text-ink-300 text-sm leading-relaxed italic">
                  "{review.content}"
                </p>

                <p className="text-ink-600 text-xs font-mono mt-2">
                  Soumis le {new Date(review.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <Button
                  variant="primary"
                  onClick={() => handleApprove(review.id)}
                  loading={approveMutation.isPending}
                  className="text-xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Approuver
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleReject(review.id)}
                  loading={rejectMutation.isPending}
                  className="text-xs"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Rejeter
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function AdminInvitationsPage() {
  const { data: invitations, isLoading } = useInvitations()
  const deleteMutation = useDeleteInvitation()
  const [showCreate,  setShowCreate]  = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)

  const handleDelete = async (id: number) => {
    if (!confirm('Révoquer cette invitation ?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Invitation révoquée.')
    } catch {
      toast.error('Erreur.')
    }
  }

  const isExpired = (exp: string) => new Date() > new Date(exp)

  return (
    <>
      <AdminPage
        title="Invitations & Validation"
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4" />
            Nouvelle invitation
          </Button>
        }
      >
        {/* Pending reviews — top priority */}
        <PendingReviews />

        {/* How it works */}
        <Card className="mb-8 bg-accent-500/5 border-accent-500/15">
          <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-accent-400" />
            Comment ça fonctionne
          </h3>
          <ol className="space-y-2 text-sm text-ink-300">
            {[
              'Cliquez "Nouvelle invitation" et renseignez les infos du client',
              'Copiez le lien généré et envoyez-le par email à votre client',
              'Le client remplit le formulaire (note + avis)',
              "L'avis apparaît ici en attente — vous l'approuvez ou le rejetez",
              'Une fois approuvé, il est publié instantanément sur /reviews',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-accent-500/20 border border-accent-500/30
                                 flex items-center justify-center text-xs font-mono text-accent-400 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>

        {/* Invitations list */}
        <h2 className="font-display font-semibold text-white text-lg mb-4">
          Invitations envoyées
        </h2>

        {isLoading && <Spinner />}
        {!isLoading && invitations?.length === 0 && (
          <EmptyState message="Aucune invitation créée pour le moment." />
        )}

        {invitations && invitations.length > 0 && (
          <div className="flex flex-col gap-3">
            {invitations.map((inv: ReviewInvitation) => {
              const expired = isExpired(inv.expires_at)
              return (
                <Card
                  key={inv.id}
                  className={`transition-opacity ${expired && !inv.is_used ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Author info */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-display font-semibold text-white text-sm">
                          {inv.client_name}
                        </span>
                        <span className="text-ink-500 text-xs">·</span>
                        <span className="text-ink-400 text-xs">{inv.client_role}</span>
                        {inv.client_company && (
                          <span className="text-ink-500 text-xs">@ {inv.client_company}</span>
                        )}
                        {inv.client_email && (
                          <span className="text-ink-600 text-xs font-mono">{inv.client_email}</span>
                        )}
                      </div>

                      {/* Status badges */}
                      <div className="flex items-center gap-2 mb-2">
                        {inv.is_used ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                           bg-accent-500/15 text-accent-300 border border-accent-500/20">
                            ✓ Utilisé
                          </span>
                        ) : expired ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                           bg-ink-700 text-ink-500 border border-white/[0.05]">
                            Expiré
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                           bg-green-500/15 text-green-300 border border-green-500/20">
                            ● Actif
                          </span>
                        )}

                        {inv.review_id && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                           bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/20">
                            <Star className="w-2.5 h-2.5 inline mr-0.5" />
                            Avis reçu #{inv.review_id}
                          </span>
                        )}
                      </div>

                      {/* Dates + link */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-ink-600 font-mono">
                          <Clock className="w-3 h-3" />
                          Expire le {new Date(inv.expires_at).toLocaleDateString('fr-FR')}
                        </span>
                        {!inv.is_used && !expired && (
                          <CopyButton url={inv.invite_url} />
                        )}
                      </div>
                    </div>

                    {/* Delete */}
                    {!inv.is_used && (
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(inv.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </AdminPage>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={(url) => {
            setGeneratedUrl(url)
            setShowCreate(false)
          }}
        />
      )}

      {generatedUrl && (
        <GeneratedLinkModal
          url={generatedUrl}
          onClose={() => setGeneratedUrl(null)}
        />
      )}
    </>
  )
}
