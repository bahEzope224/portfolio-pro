import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Eye, Tag, Search, BookOpen, ImageOff } from 'lucide-react'
import { Section, SectionHeading, Spinner, EmptyState, Badge } from '@/components/ui'
import { useBlogPosts, useBlogCategories, useBlogTags } from '@/hooks/useApi'
import { assetUrl, truncate } from '@/lib/utils'
import type { BlogPostSummary } from '@/types'

// ── Category badge colors ─────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'IA':           'bg-purple-500/15 text-purple-300 border-purple-500/20',
  'Géopolitique': 'bg-red-500/15 text-red-300 border-red-500/20',
  'Data Science': 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  'Nouvelles Technologies': 'bg-teal-500/15 text-teal-300 border-teal-500/20',
  'Général':      'bg-ink-700 text-ink-300 border-white/10',
}

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? 'bg-accent-500/15 text-accent-300 border-accent-500/20'
}

// ── Post card ─────────────────────────────────────────────────────────────
function PostCard({ post, index }: { post: BlogPostSummary; index: number }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass glass-hover rounded-2xl overflow-hidden group
                 animate-fade-up opacity-0 flex flex-col"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Cover image */}
      <div className="aspect-video bg-ink-800/60 overflow-hidden relative">
        {post.cover_path ? (
          <img
            src={assetUrl(post.cover_path)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center
                          bg-gradient-to-br from-ink-800 to-ink-900">
            <BookOpen className="w-10 h-10 text-ink-700" />
          </div>
        )}
        {/* Category badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full
                          text-xs font-mono border ${getCategoryColor(post.category)}`}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-bold text-white text-lg leading-tight mb-2
                       group-hover:text-accent-300 transition-colors duration-200">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-ink-300 text-sm leading-relaxed mb-4 flex-1">
            {truncate(post.excerpt, 120)}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-ink-500 font-mono
                        border-t border-white/[0.05] pt-3 mt-auto">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.reading_time} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
          {post.published_at && (
            <span className="ml-auto">
              {new Date(post.published_at).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('')
  const [activeTag, setActiveTag] = useState('')

  const { data: posts,      isLoading } = useBlogPosts({
    category: category || undefined,
    tag:      activeTag || undefined,
    search:   search || undefined,
  })
  const { data: categories } = useBlogCategories()
  const { data: tags }       = useBlogTags()

  return (
    <Section className="pt-32">
      <SectionHeading
        tag="Blog"
        title="Mes réflexions"
        subtitle="Géopolitique, IA, data science et nouvelles technologies — mes analyses et points de vue."
      />

      {/* Search + filters */}
      <div className="flex flex-col gap-4 mb-10">
        {/* Search bar */}
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article…"
            className="input-field pl-11"
          />
        </div>

        {/* Category filters */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200
                          border ${!category
                ? 'bg-accent-500/20 text-accent-300 border-accent-500/30'
                : 'text-ink-400 border-white/[0.06] hover:border-white/20 hover:text-white'
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-mono transition-all duration-200
                            border ${cat === category
                  ? 'bg-accent-500/20 text-accent-300 border-accent-500/30'
                  : 'text-ink-400 border-white/[0.06] hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Tag filters */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <Tag className="w-3.5 h-3.5 text-ink-600 shrink-0" />
            {tags.slice(0, 15).map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                className={`px-2.5 py-0.5 rounded-md text-xs font-mono transition-all duration-200
                            border ${tag === activeTag
                  ? 'bg-accent-500/15 text-accent-300 border-accent-500/20'
                  : 'text-ink-500 border-white/[0.05] hover:text-ink-300 hover:border-white/10'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading && <Spinner />}

      {!isLoading && posts?.length === 0 && (
        <EmptyState message="Aucun article trouvé. Revenez bientôt !" />
      )}

      {posts && posts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </Section>
  )
}
