import { useState } from 'react'
import { Quote, Star, UserCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner, EmptyState } from '@/components/ui'
import { useReviews } from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'
import type { Review } from '@/types'

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${cls} transition-colors ${
          star <= rating ? 'fill-gold-DEFAULT text-gold-DEFAULT' : 'fill-transparent text-ink-700'
        }`} />
      ))}
    </div>
  )
}

function Avatar({ review }: { review: Review }) {
  const initials = review.author_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  if (review.avatar_path) {
    return <img src={assetUrl(review.avatar_path)} alt={review.author_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
  }
  const colors = [
    'bg-accent-500/20 text-accent-300', 'bg-purple-500/20 text-purple-300',
    'bg-teal-500/20 text-teal-300',     'bg-rose-500/20 text-rose-300',
    'bg-amber-500/20 text-amber-300',
  ]
  const colorIdx = review.author_name.charCodeAt(0) % colors.length
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center
                     font-display font-bold text-sm border border-white/10 ${colors[colorIdx]}`}>
      {initials}
    </div>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const isLong = review.content.length > 220

  return (
    <article className="glass glass-hover rounded-2xl p-7 flex flex-col gap-5
                        animate-fade-up opacity-0 relative overflow-hidden group"
             style={{ animationDelay: `${index * 80}ms` }}>
      <div className="absolute -top-2 -right-2 w-16 h-16 opacity-[0.04]
                      group-hover:opacity-[0.07] transition-opacity duration-300">
        <Quote className="w-full h-full text-accent-400" />
      </div>
      {review.is_featured && (
        <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full
                          text-xs font-mono bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/20">
          ✦ Featured
        </span>
      )}
      <div className={review.is_featured ? 'mt-4' : ''}>
        <StarRating rating={review.rating} />
      </div>
      <blockquote className="text-ink-200 text-[15px] leading-relaxed font-body italic relative">
        <span className="text-accent-400 text-2xl font-display not-italic leading-none mr-1">"</span>
        {isLong && !expanded ? review.content.slice(0, 220) + '…' : review.content}
        <span className="text-accent-400 text-2xl font-display not-italic leading-none ml-0.5">"</span>
        {isLong && (
          <button onClick={() => setExpanded(!expanded)}
                  className="ml-2 text-accent-400 hover:text-accent-300 text-xs font-mono not-italic transition-colors">
            {expanded ? t('common.showLess') : t('common.readMore')}
          </button>
        )}
      </blockquote>
      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
        <Avatar review={review} />
        <div>
          <p className="font-display font-semibold text-white text-sm">{review.author_name}</p>
          <p className="text-ink-400 text-xs font-body">
            {review.author_role}
            {review.company && <span className="text-ink-500"> · {review.company}</span>}
          </p>
        </div>
      </div>
    </article>
  )
}

function ReviewStats({ reviews }: { reviews: Review[] }) {
  const { t } = useTranslation()
  if (reviews.length === 0) return null
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((r) => r.rating === star).length }))

  return (
    <div className="glass rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-8">
      <div className="text-center shrink-0">
        <p className="text-5xl font-display font-bold gradient-text">{avg.toFixed(1)}</p>
        <StarRating rating={Math.round(avg)} size="lg" />
        <p className="text-ink-400 text-xs font-mono mt-1">{reviews.length} {t('reviews.tag').toLowerCase()}</p>
      </div>
      <div className="flex-1 w-full flex flex-col gap-2">
        {counts.map(({ star, count }) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0
          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-10 shrink-0">
                <span className="text-xs font-mono">{star}</span>
                <Star className="w-3 h-3 fill-gold-DEFAULT text-gold-DEFAULT" />
              </div>
              <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-gold-DEFAULT to-gold-light transition-all duration-700"
                     style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-mono w-6 text-right shrink-0">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const { t } = useTranslation()
  const { data: reviews, isLoading, isError } = useReviews()

  return (
    <Section className="pt-32">
      <SectionHeading tag={t('reviews.tag')} title={t('reviews.title')} subtitle={t('reviews.subtitle')} />
      {isLoading && <Spinner />}
      {isError && <EmptyState message={t('reviews.errLoad')} />}
      {reviews && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 gap-5">
          <div className="w-20 h-20 rounded-3xl glass border border-white/[0.06] flex items-center justify-center">
            <UserCircle2 className="w-9 h-9 text-ink-600" />
          </div>
          <p className="text-ink-500 text-sm text-center">{t('reviews.empty')}</p>
        </div>
      )}
      {reviews && reviews.length > 0 && (
        <>
          <ReviewStats reviews={reviews} />
          {reviews.some((r) => r.is_featured) && (
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {reviews.filter((r) => r.is_featured).map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
          {reviews.some((r) => !r.is_featured) && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.filter((r) => !r.is_featured).map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
