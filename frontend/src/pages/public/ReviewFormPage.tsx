import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Send, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { useCheckInvitation, useSubmitReview } from '@/hooks/useApi'
import { Button } from '@/components/ui'

// ── Star picker ───────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  const labels = ['', 'Mauvais', 'Passable', 'Bien', 'Très bien', 'Excellent !']

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-125 focus:outline-none"
          >
            <Star
              className={`w-10 h-10 transition-all duration-150 ${
                star <= (hovered || value)
                  ? 'fill-gold-DEFAULT text-gold-DEFAULT drop-shadow-[0_0_8px_rgba(240,180,41,0.5)]'
                  : 'fill-transparent text-ink-700'
              }`}
            />
          </button>
        ))}
      </div>
      <p className="text-sm font-mono text-ink-400 h-5 transition-all">
        {labels[hovered || value] ?? ''}
      </p>
    </div>
  )
}

// ── States ────────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-20">
      <Loader2 className="w-10 h-10 animate-spin text-accent-400" />
      <p className="text-ink-400 font-mono text-sm">Vérification du lien…</p>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20
                      flex items-center justify-center">
        <XCircle className="w-8 h-8 text-red-400" />
      </div>
      <div>
        <h3 className="font-display font-bold text-white text-xl mb-2">Lien invalide</h3>
        <p className="text-ink-400 text-sm max-w-sm">{message}</p>
      </div>
    </div>
  )
}

function SuccessState({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-accent-500/15 border border-accent-500/30
                      flex items-center justify-center animate-float">
        <CheckCircle className="w-10 h-10 text-accent-400" />
      </div>
      <div>
        <h3 className="font-display font-bold text-white text-2xl mb-3">
          Merci {name.split(' ')[0]} ! 🎉
        </h3>
        <p className="text-ink-300 text-base max-w-sm leading-relaxed">
          Votre avis a été soumis avec succès. Il sera publié sur le portfolio
          après validation — généralement sous 24h.
        </p>
      </div>
      <p className="text-ink-500 text-xs font-mono">Vous pouvez fermer cette page.</p>
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────
export default function ReviewFormPage() {
  const { token } = useParams<{ token: string }>()
  const { data: invitation, isLoading, isError, error } = useCheckInvitation(token ?? '')
  const submitMutation = useSubmitReview()

  const [rating,    setRating]    = useState(5)
  const [content,   setContent]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!content.trim() || content.trim().length < 10) {
      setFormError('Votre avis doit faire au moins 10 caractères.')
      return
    }

    try {
      await submitMutation.mutateAsync({ token: token!, content, rating })
      setSubmitted(true)
    } catch (err: any) {
      setFormError(
        err?.response?.data?.detail ?? 'Une erreur est survenue. Veuillez réessayer.'
      )
    }
  }

  const errorMessage = (error as any)?.response?.data?.detail ?? 'Lien invalide ou expiré.'

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4 py-16">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full
                        bg-accent-500/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full
                        bg-purple-500/8 blur-[100px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-accent-500/10 border border-accent-500/20
                          text-accent-300 text-sm font-mono mb-6">
            <Star className="w-3.5 h-3.5 fill-current" />
            Formulaire d'avis client
          </div>
          <h1 className="font-display font-bold text-white text-3xl mb-2">
            Votre retour compte
          </h1>
          <p className="text-ink-400 text-sm">
            Partagez votre expérience de travail en quelques mots.
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          {isLoading && <LoadingState />}

          {isError && <ErrorState message={errorMessage} />}

          {submitted && invitation && (
            <SuccessState name={invitation.client_name} />
          )}

          {invitation && !submitted && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Pre-filled author info */}
              <div className="bg-ink-800/50 rounded-2xl p-4 border border-white/[0.05]">
                <p className="text-xs font-mono text-ink-500 uppercase tracking-wide mb-2">
                  Votre profil
                </p>
                <p className="font-display font-semibold text-white">{invitation.client_name}</p>
                <p className="text-accent-400 text-sm">{invitation.client_role}</p>
                {invitation.client_company && (
                  <p className="text-ink-400 text-sm">{invitation.client_company}</p>
                )}
              </div>

              {/* Expiry notice */}
              <div className="flex items-center gap-2 text-xs text-ink-500 font-mono">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                Lien valable jusqu'au{' '}
                {new Date(invitation.expires_at).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>

              {/* Star rating */}
              <div>
                <p className="text-xs font-mono text-ink-400 uppercase tracking-wide mb-3 text-center">
                  Note globale
                </p>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              {/* Review content */}
              <div>
                <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
                  Votre témoignage *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  placeholder="Décrivez votre expérience de travail : qualité du travail livré, communication, respect des délais, points forts…"
                  className="input-field resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between mt-1">
                  {formError ? (
                    <p className="text-red-400 text-xs">{formError}</p>
                  ) : (
                    <span />
                  )}
                  <p className={`text-xs font-mono ${
                    content.length < 10 ? 'text-ink-600' : 'text-ink-400'
                  }`}>
                    {content.length} caractères
                  </p>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                loading={submitMutation.isPending}
                className="w-full justify-center py-4 text-base"
              >
                <Send className="w-5 h-5" />
                Envoyer mon avis
              </Button>

              <p className="text-center text-xs text-ink-600 leading-relaxed">
                Votre avis sera relu par l'équipe avant publication.
                Aucune information personnelle ne sera partagée sans votre accord.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
