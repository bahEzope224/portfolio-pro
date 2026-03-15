import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Pencil, Trash2, X, Eye,
  BookOpen, Clock, TrendingUp, FileText,
  Bold, Italic, Code, Link2, List, Quote, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminPage, Button, Spinner, EmptyState, Card, Badge } from '@/components/ui'
import {
  useAllBlogPosts, useAdminBlogPost,
  useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost,
} from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'
import type { BlogPostSummary } from '@/types'

const CATEGORIES = [
  'IA', 'Géopolitique', 'Data Science',
  'Nouvelles Technologies', 'Développement Web', 'Général',
]

const schema = z.object({
  title:            z.string().min(1, 'Titre requis'),
  excerpt:          z.string().optional(),
  content:          z.string().min(10, 'Contenu trop court'),
  category:         z.string().min(1, 'Catégorie requise'),
  tags:             z.string(),
  is_published:     z.boolean().default(false),
  is_featured:      z.boolean().default(false),
  meta_title:       z.string().optional(),
  meta_description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

// ── Markdown toolbar ──────────────────────────────────────────────────────
function MarkdownToolbar({ textareaId }: { textareaId: string }) {
  const insert = (before: string, after = '') => {
    const ta = document.getElementById(textareaId) as HTMLTextAreaElement
    if (!ta) return
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const sel   = ta.value.slice(start, end)
    const newVal =
      ta.value.slice(0, start) +
      before + (sel || 'texte') + after +
      ta.value.slice(end)
    const nativeSet = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value'
    )?.set
    nativeSet?.call(ta, newVal)
    ta.dispatchEvent(new Event('input', { bubbles: true }))
    ta.focus()
    ta.selectionStart = start + before.length
    ta.selectionEnd   = start + before.length + (sel || 'texte').length
  }

  const tools = [
    { icon: Bold,   label: 'Gras',     action: () => insert('**', '**') },
    { icon: Italic, label: 'Italique', action: () => insert('*', '*') },
    { icon: Code,   label: 'Code',     action: () => insert('`', '`') },
    { icon: Link2,  label: 'Lien',     action: () => insert('[', '](url)') },
    { icon: List,   label: 'Liste',    action: () => insert('\n- ') },
    { icon: Quote,  label: 'Citation', action: () => insert('\n> ') },
  ]

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.05]
                    bg-ink-800/30 flex-wrap">
      {tools.map(({ icon: Icon, label, action }) => (
        <button key={label} type="button" title={label} onClick={action}
          className="p-1.5 rounded-lg text-ink-400 hover:text-white
                     hover:bg-white/[0.06] transition-all">
          <Icon className="w-4 h-4" />
        </button>
      ))}
      <div className="w-px h-4 bg-white/[0.08] mx-1" />
      {['# ', '## ', '### '].map((h) => (
        <button key={h} type="button" onClick={() => insert(h)}
          className="px-2 py-1 rounded text-xs font-mono text-ink-400
                     hover:text-white hover:bg-white/[0.06] transition-all">
          {h.trim()}
        </button>
      ))}
    </div>
  )
}

// ── Editor modal ──────────────────────────────────────────────────────────
function BlogEditorModal({
  postId,
  postSummary,
  onClose,
}: {
  postId?: number
  postSummary?: BlogPostSummary
  onClose: () => void
}) {
  const isEditing = !!postId

  // ← Charge le contenu COMPLET (avec content) depuis l'API
  const { data: fullPost, isLoading: loadingPost } = useAdminBlogPost(postId)

  const createMutation = useCreateBlogPost()
  const updateMutation = useUpdateBlogPost()
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [preview,   setPreview]   = useState(false)

  // On attend que fullPost soit chargé avant d'initialiser le formulaire
  const formValues = isEditing
    ? fullPost
      ? {
          title:            fullPost.title,
          excerpt:          fullPost.excerpt ?? '',
          content:          fullPost.content,   // ← contenu COMPLET
          category:         fullPost.category,
          tags:             fullPost.tags.join(', '),
          is_published:     fullPost.is_published,
          is_featured:      fullPost.is_featured,
          meta_title:       fullPost.meta_title ?? '',
          meta_description: fullPost.meta_description ?? '',
        }
      : undefined  // attend le chargement
    : {
        title: '', excerpt: '', content: '', category: 'Général',
        tags: '', is_published: false, is_featured: false,
        meta_title: '', meta_description: '',
      }

  const { register, handleSubmit, watch, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      values: formValues as FormData | undefined,
    })

  const contentValue = watch('content', '')

  const onSubmit = async (data: FormData) => {
    const form = new FormData()
    form.append('title',        data.title)
    form.append('content',      data.content)
    form.append('category',     data.category)
    form.append('tags',         JSON.stringify(
      data.tags.split(',').map((t) => t.trim()).filter(Boolean)
    ))
    if (data.excerpt)          form.append('excerpt',          data.excerpt)
    if (data.meta_title)       form.append('meta_title',       data.meta_title)
    if (data.meta_description) form.append('meta_description', data.meta_description)
    form.append('is_published', String(data.is_published))
    form.append('is_featured',  String(data.is_featured))
    if (coverFile) form.append('cover', coverFile)

    try {
      if (postId) {
        await updateMutation.mutateAsync({ id: postId, form })
        toast.success('Article mis à jour !')
      } else {
        await createMutation.mutateAsync(form)
        toast.success('Article créé !')
      }
      onClose()
    } catch {
      toast.error('Une erreur est survenue.')
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  const renderPreview = (md: string) => md
    .replace(/^### (.+)$/gm, '<h3 style="color:white;font-size:18px;margin:16px 0 8px;font-weight:600">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="color:white;font-size:22px;margin:20px 0 10px;font-weight:700">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="color:white;font-size:28px;margin:24px 0 12px;font-weight:700">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:white">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em style="color:#c8c8da">$1</em>')
    .replace(/`(.+?)`/g,       '<code style="background:#1e1e35;padding:2px 6px;border-radius:4px;font-family:monospace;color:#a78bfa;font-size:13px">$1</code>')
    .replace(/^> (.+)$/gm,     '<blockquote style="border-left:3px solid #7c6af7;padding-left:12px;color:#9898b8;margin:12px 0;font-style:italic">$1</blockquote>')
    .replace(/^\- (.+)$/gm,    '<li style="color:#c8c8da;margin:4px 0">▸ $1</li>')
    .replace(/\n\n/g,          '</p><p style="color:#c8c8da;line-height:1.8;margin:12px 0">')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4
                    bg-ink-900/90 backdrop-blur-sm">
      <div className="w-full max-w-5xl glass rounded-2xl sm:rounded-3xl relative
                      flex flex-col max-h-[96vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-7 py-4 sm:py-5
                        border-b border-white/[0.05] shrink-0">
          <h2 className="font-display font-bold text-white text-lg sm:text-xl">
            {isEditing ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPreview(!preview)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono
                          transition-all border ${preview
                ? 'bg-accent-500/20 text-accent-300 border-accent-500/30'
                : 'text-ink-400 border-white/[0.06] hover:text-white'}`}>
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{preview ? 'Éditeur' : 'Preview'}</span>
            </button>
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-ink-400 hover:text-white
                         hover:bg-white/[0.06] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading while fetching full content */}
        {isEditing && loadingPost ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent-400" />
            <p className="text-ink-400 text-sm font-mono">Chargement du contenu complet…</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            <form onSubmit={handleSubmit(onSubmit)}
                  className="p-4 sm:p-7 flex flex-col gap-4 sm:gap-5">

              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-5">
                {/* Left — content */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div>
                    <input {...register('title')} placeholder="Titre de l'article…"
                      className="input-field text-lg sm:text-xl font-display font-bold" />
                    {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <textarea {...register('excerpt')} rows={2}
                    placeholder="Résumé court…"
                    className="input-field resize-none text-sm" />

                  <div className="border border-white/[0.08] rounded-xl overflow-hidden">
                    {!preview && <MarkdownToolbar textareaId="blog-content-editor" />}
                    {preview ? (
                      <div className="p-4 sm:p-5 min-h-48 text-ink-300 text-sm leading-relaxed overflow-auto"
                        dangerouslySetInnerHTML={{ __html: renderPreview(contentValue) }} />
                    ) : (
                      <textarea {...register('content')}
                        id="blog-content-editor" rows={14}
                        placeholder={`# Titre\n\nVotre contenu Markdown…\n\n## Section\n\n- Point 1\n- Point 2\n\n> Citation`}
                        className="w-full p-4 bg-transparent text-ink-200 text-sm font-mono
                                   leading-relaxed resize-none focus:outline-none placeholder:text-ink-600" />
                    )}
                  </div>
                  {errors.content && <p className="text-red-400 text-xs">{errors.content.message}</p>}
                </div>

                {/* Right — settings */}
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Catégorie *</label>
                    <select {...register('category')} className="input-field">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Tags (virgule)</label>
                    <input {...register('tags')} className="input-field text-sm" placeholder="ChatGPT, LLM" />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">Couverture</label>
                    {(fullPost?.cover_path || postSummary?.cover_path) && !coverFile && (
                      <img src={assetUrl(fullPost?.cover_path || postSummary?.cover_path)}
                        alt="" className="w-full aspect-video object-cover rounded-xl mb-2" />
                    )}
                    <input type="file" accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                      className="block w-full text-xs text-ink-400
                                 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0
                                 file:text-xs file:font-mono file:bg-accent-500/15 file:text-accent-400
                                 hover:file:bg-accent-500/25 cursor-pointer" />
                  </div>

                  <div className="glass rounded-xl p-4">
                    <p className="text-xs font-mono text-ink-500 uppercase tracking-wide mb-3">SEO</p>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-xs text-ink-500 mb-1">Meta title (70 max)</label>
                        <input {...register('meta_title')} maxLength={70}
                          className="input-field text-xs" placeholder="Titre SEO…" />
                      </div>
                      <div>
                        <label className="block text-xs text-ink-500 mb-1">Meta description (160 max)</label>
                        <textarea {...register('meta_description')} maxLength={160} rows={3}
                          className="input-field text-xs resize-none" placeholder="Description SEO…" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl
                                      glass hover:bg-white/[0.04] transition-colors">
                      <input {...register('is_published')} type="checkbox"
                        className="rounded border-ink-600 bg-ink-800 text-accent-500" />
                      <div>
                        <p className="text-sm text-white font-body">Publier</p>
                        <p className="text-xs text-ink-500">Visible publiquement</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl
                                      glass hover:bg-white/[0.04] transition-colors">
                      <input {...register('is_featured')} type="checkbox"
                        className="rounded border-ink-600 bg-ink-800 text-accent-500" />
                      <div>
                        <p className="text-sm text-white font-body">Mettre en avant</p>
                        <p className="text-xs text-ink-500">Sur la page d'accueil</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.05]">
                <Button variant="ghost" type="button" onClick={onClose}>Annuler</Button>
                <Button type="submit" loading={isPending}>
                  {isEditing ? 'Mettre à jour' : 'Créer l\'article'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main admin page ───────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const { data: posts, isLoading } = useAllBlogPosts()
  const deleteMutation = useDeleteBlogPost()
  const [editingId,      setEditingId]      = useState<number | undefined>()
  const [editingSummary, setEditingSummary] = useState<BlogPostSummary | undefined>()
  const [showModal,      setShowModal]      = useState(false)

  const openCreate = () => {
    setEditingId(undefined)
    setEditingSummary(undefined)
    setShowModal(true)
  }

  const openEdit = (post: BlogPostSummary) => {
    setEditingId(post.id)      // ← fetch le contenu complet
    setEditingSummary(post)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(undefined)
    setEditingSummary(undefined)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article définitivement ?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Article supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  const published  = posts?.filter((p) => p.is_published).length ?? 0
  const drafts     = posts?.filter((p) => !p.is_published).length ?? 0
  const totalViews = posts?.reduce((s, p) => s + p.views, 0) ?? 0

  return (
    <>
      <AdminPage
        title="Blog"
        action={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvel article</span>
            <span className="sm:hidden">Nouveau</span>
          </Button>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: 'Total',      value: posts?.length ?? 0, icon: BookOpen },
            { label: 'Publiés',    value: published,           icon: Eye },
            { label: 'Brouillons', value: drafts,              icon: FileText },
            { label: 'Vues total', value: totalViews,          icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-accent-500/15 border border-accent-500/20
                              flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent-400" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-display font-bold gradient-text">{value}</p>
                <p className="text-xs text-ink-400 font-mono">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {isLoading && <Spinner />}
        {!isLoading && posts?.length === 0 && (
          <EmptyState message="Aucun article. Rédigez votre premier post !" />
        )}

        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <Card key={post.id}
                className={`transition-opacity ${!post.is_published ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  {post.cover_path ? (
                    <img src={assetUrl(post.cover_path)} alt=""
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-ink-800/60
                                    border border-white/[0.05] flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-ink-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-semibold text-white text-sm truncate max-w-xs">
                        {post.title}
                      </h3>
                      {!post.is_published && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-mono
                                         bg-ink-700 text-ink-400 border border-white/[0.05]">
                          Brouillon
                        </span>
                      )}
                      {post.is_featured && (
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-mono
                                         bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/20">
                          ✦ Featured
                        </span>
                      )}
                    </div>
                    <p className="text-ink-500 text-xs font-mono mb-1.5 hidden sm:block">
                      {post.category} · {post.reading_time} min · {post.views} vues
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((t) => <Badge key={t} label={t} />)}
                    </div>
                  </div>

                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs font-mono text-ink-500">
                      {new Date(post.published_at ?? post.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Button variant="ghost" onClick={() => openEdit(post)}
                      className="px-2.5 sm:px-5">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(post.id)}
                      className="px-2.5 sm:px-5">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AdminPage>

      {showModal && (
        <BlogEditorModal
          postId={editingId}
          postSummary={editingSummary}
          onClose={closeModal}
        />
      )}
    </>
  )
}
