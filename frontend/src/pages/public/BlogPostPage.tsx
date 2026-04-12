import { useParams, Link } from 'react-router-dom'
import { Clock, Eye, ArrowLeft, Tag, Calendar, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBlogPost } from '@/hooks/useApi'
import { Spinner, Badge } from '@/components/ui'
import { assetUrl } from '@/lib/utils'

// ── Simple Markdown renderer ──────────────────────────────────────────────
// Convertit le Markdown en HTML basique sans dépendance externe
function renderMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Links & images
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    // Lists
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    // Horizontal rule
    .replace(/^---$/gm, '<hr />')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hupbci])(.+)$/gm, (m) =>
      m.startsWith('<') ? m : `<p>${m}</p>`
    )
}

// ── Category color ────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'IA':           'bg-purple-500/15 text-purple-300 border-purple-500/20',
  'Géopolitique': 'bg-red-500/15 text-red-300 border-red-500/20',
  'Data Science': 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  'Nouvelles Technologies': 'bg-teal-500/15 text-teal-300 border-teal-500/20',
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const { data: post, isLoading, isError } = useBlogPost(slug ?? '')
  const currentLang = i18n.language
  const locale = currentLang.startsWith('fr') ? 'fr-FR' : 'en-GB'

  if (isLoading) return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center">
      <Spinner />
    </div>
  )

  if (isError || !post) return (
    <div className="min-h-screen bg-ink-900 flex flex-col items-center justify-center gap-4">
      <BookOpen className="w-12 h-12 text-ink-600" />
      <h2 className="font-display font-bold text-white text-xl">{t('blog.articleNotFound')}</h2>
      <Link to="/blog" className="btn-ghost">← {t('blog.backToBlog')}</Link>
    </div>
  )

  const title   = currentLang === 'en' && post.title_en   ? post.title_en   : post.title
  const excerpt = currentLang === 'en' && post.excerpt_en ? post.excerpt_en : post.excerpt
  const content = currentLang === 'en' && post.content_en ? post.content_en : post.content

  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-accent-500/15 text-accent-300 border-accent-500/20'

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Hero with cover */}
      <div className="relative">
        {post.cover_path ? (
          <div className="h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-900/50 to-ink-900 z-10" />
            <img
              src={assetUrl(post.cover_path)}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-b from-ink-800/50 to-ink-900" />
        )}

        {/* Back button */}
        <div className="absolute top-24 left-0 right-0 z-20 max-w-3xl mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 hover:text-white
                       text-sm font-mono transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog.backToBlog')}
          </Link>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-6 pb-24 relative z-10"
           style={{ marginTop: post.cover_path ? '-4rem' : '2rem' }}>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`px-3 py-1 rounded-full text-xs font-mono border ${categoryColor}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            {post.reading_time} min {t('blog.readingTime')}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono">
            <Eye className="w-3.5 h-3.5" />
            {post.views} {t('blog.views')}
          </span>
          {post.published_at && (
            <span className="flex items-center gap-1.5 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(post.published_at).toLocaleDateString(locale, {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-white text-3xl md:text-4xl
                       leading-tight mb-4">
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-ink-300 text-lg leading-relaxed mb-6 italic
                        border-l-2 border-accent-500/40 pl-4">
            {excerpt}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            <Tag className="w-3.5 h-3.5 text-ink-600 mt-0.5" />
            {post.tags.map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mb-8" />

        {/* Article body — Markdown rendered */}
        <article
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </div>
    </div>
  )
}
