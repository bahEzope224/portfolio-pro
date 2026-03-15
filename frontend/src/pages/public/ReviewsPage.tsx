import { useState } from 'react'
import { Quote, Star, UserCircle2 } from 'lucide-react'
import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useReviews } from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'
import type { Review } from '@/types'

// ── Star rating display ───────────────────────────────────────────────────
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} transition-colors ${
            star <= rating
              ? 'fill-gold-DEFAULT text-gold-DEFAULT'
              : 'fill-transparent text-ink-700'
          }`}
        />
      ))}
    </div>
  )
}

// ── Avatar ────────────────────────────────────────────────────────────────
function Avatar({ review }: { review: Review }) {
  const initials = review.author_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (review.avatar_path) {
    return (
      <img
        src={assetUrl(review.avatar_path)}
        alt={review.author_name}
        className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
      />
    )
  }

  // Generate a deterministic color from the name
  const colors = [
    'bg-accent-500/20 text-accent-300',
    'bg-purple-500/20 text-purple-300',
    'bg-teal-500/20 text-teal-300',
    'bg-rose-500/20 text-rose-300',
    'bg-amber-500/20 text-amber-300',
  ]
  const colorIdx = review.author_name.charCodeAt(0) % colors.length

  return (
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center
                  font-display font-bold text-sm border border-white/10 ${colors[colorIdx]}`}
    >
      {initials}
    </div>
  )
}

// ── Review card ───────────────────────────────────────────────────────────
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.content.length > 220

  return (
    <article
      className="glass glass-hover rounded-2xl p-7 flex flex-col gap-5
                 animate-fade-up opacity-0 relative overflow-hidden group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Decorative quote mark */}
      <div className="absolute -top-2 -right-2 w-16 h-16 opacity-[0.04]
                      group-hover:opacity-[0.07] transition-opacity duration-300">
        <Quote className="w-full h-full text-accent-400" />
      </div>

      {/* Featured badge */}
      {review.is_featured && (
        <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full
                          text-xs font-mono bg-gold-DEFAULT/15 text-gold-light
                          border border-gold-DEFAULT/20">
          ✦ Recommandé
        </span>
      )}

      {/* Stars */}
      <div className={review.is_featured ? 'mt-4' : ''}>
        <StarRating rating={review.rating} />
      </div>

      {/* Content */}
      <blockquote className="text-ink-200 text-[15px] leading-relaxed font-body italic relative">
        <span className="text-accent-400 text-2xl font-display not-italic leading-none mr-1">
          "
        </span>
        {isLong && !expanded
          ? review.content.slice(0, 220) + '…'
          : review.content}
        <span className="text-accent-400 text-2xl font-display not-italic leading-none ml-0.5">
          "
        </span>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-accent-400 hover:text-accent-300 text-xs font-mono
                       not-italic transition-colors"
          >
            {expanded ? 'Réduire' : 'Lire plus'}
          </button>
        )}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
        <Avatar review={review} />
        <div>
          <p className="font-display font-semibold text-white text-sm">
            {review.author_name}
          </p>
          <p className="text-ink-400 text-xs font-body">
            {review.author_role}
            {review.company && (
              <span className="text-ink-500"> · {review.company}</span>
            )}
          </p>
        </div>
      </div>
    </article>
  )
}

// ── Stats bar ─────────────────────────────────────────────────────────────
function ReviewStats({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="glass rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-8">
      {/* Average */}
      <div className="text-center shrink-0">
        <p className="text-5xl font-display font-bold gradient-text">
          {avg.toFixed(1)}
        </p>
        <StarRating rating={Math.round(avg)} size="lg" />
        <p className="text-ink-400 text-xs font-mono mt-1">
          {reviews.length} avis
        </p>
      </div>

      {/* Bar breakdown */}
      <div className="flex-1 w-full flex flex-col gap-2">
        {counts.map(({ star, count }) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-10 shrink-0">
                <span className="text-xs font-mono text-ink-400">{star}</span>
                <Star className="w-3 h-3 fill-gold-DEFAULT text-gold-DEFAULT" />
              </div>
              <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-DEFAULT to-gold-light
                              transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-ink-500 w-6 text-right shrink-0">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const { data: reviews, isLoading, isError } = useReviews()

  return (
    <Section className="pt-32">
      <SectionHeading
        tag="Témoignages"
        title="Ce qu'ils disent"
        subtitle="Retours d'anciens clients et collaborateurs avec qui j'ai eu le plaisir de travailler."
      />

      {isLoading && <Spinner />}
      {isError && <EmptyState message="Impossible de charger les avis." />}

      {reviews && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 gap-5">
          <div className="w-20 h-20 rounded-3xl glass border border-white/[0.06]
                          flex items-center justify-center">
            <UserCircle2 className="w-9 h-9 text-ink-600" />
          </div>
          <div className="text-center">
            <h3 className="font-display font-bold text-white text-lg mb-1">
              Avis bientôt disponibles
            </h3>
            <p className="text-ink-500 text-sm">Les témoignages clients arrivent prochainement.</p>
          </div>
        </div>
      )}

      {reviews && reviews.length > 0 && (
        <>
          <ReviewStats reviews={reviews} />

          {/* Featured reviews first (large) */}
          {reviews.some((r) => r.is_featured) && (
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {reviews
                .filter((r) => r.is_featured)
                .map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))}
            </div>
          )}

          {/* Regular reviews (3 columns) */}
          {reviews.some((r) => !r.is_featured) && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews
                .filter((r) => !r.is_featured)
                .map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
