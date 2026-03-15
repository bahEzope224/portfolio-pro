import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus, Pencil, Trash2, X, Eye, EyeOff,
  BookOpen, Clock, TrendingUp, FileText,
  Bold, Italic, Code, Link2, List, Quote,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminPage, Button, Spinner, EmptyState, Card, Badge } from '@/components/ui'
import {
  useAllBlogPosts, useCreateBlogPost,
  useUpdateBlogPost, useDeleteBlogPost,
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
  tags:             z.string(),       // comma-separated
  is_published:     z.boolean().default(false),
  is_featured:      z.boolean().default(false),
  meta_title:       z.string().optional(),
  meta_description: z.string().optional(),
})
type FormData = z.infer<typeof schema>

// ── Markdown toolbar ──────────────────────────────────────────────────────
function MarkdownToolbar({ onInsert }: { onInsert: (text: string, wrap?: boolean) => void }) {
  const tools = [
    { icon: Bold,   label: 'Gras',        insert: '**texte**',    wrap: true },
    { icon: Italic, label: 'Italique',     insert: '*texte*',      wrap: true },
    { icon: Code,   label: 'Code',         insert: '`code`',       wrap: true },
    { icon: Link2,  label: 'Lien',         insert: '[texte](url)', wrap: false },
    { icon: List,   label: 'Liste',        insert: '\n- élément',  wrap: false },
    { icon: Quote,  label: 'Citation',     insert: '\n> citation', wrap: false },
  ]
  return (
    <div className="flex items-center gap-1 px-3 py-2
                    border-b border-white/[0.05] bg-ink-800/30">
      {tools.map(({ icon: Icon, label, insert }) => (
        <button
          key={label}
          type="button"
          title={label}
          onClick={() => onInsert(insert)}
          className="p-1.5 rounded-lg text-ink-400 hover:text-white
                     hover:bg-white/[0.06] transition-all"
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
      <div className="w-px h-4 bg-white/[0.08] mx-1" />
      {['# ', '## ', '### '].map((h) => (
        <button
          key={h}
          type="button"
          onClick={() => onInsert(h + 'Titre')}
          className="px-2 py-1 rounded text-xs font-mono text-ink-400
                     hover:text-white hover:bg-white/[0.06] transition-all"
        >
          {h.trim()}
        </button>
      ))}
    </div>
  )
}

// ── Blog post editor modal ────────────────────────────────────────────────
function BlogEditorModal({
  post,
  onClose,
}: {
  post?: BlogPostSummary
  onClose: () => void
}) {
  const createMutation = useCreateBlogPost()
  const updateMutation = useUpdateBlogPost()
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [preview,   setPreview]   = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: post
        ? {
            title:        post.title,
            excerpt:      post.excerpt ?? '',
            content:      '',            // will be fetched on edit — placeholder
            category:     post.category,
            tags:         post.tags.join(', '),
            is_published: post.is_published ?? false,
            is_featured:  post.is_featured,
          }
        : {
            category:     'Général',
            tags:         '',
            is_published: false,
            is_featured:  false,
          },
    })

  const contentValue = watch('content', '')

  // Insert Markdown at cursor position
  const handleInsert = (text: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const current = contentValue
    const newVal = current.slice(0, start) + text + current.slice(end)
    setValue('content', newVal)
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + text.length
      ta.focus()
    }, 0)
  }

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
      if (post) {
        await updateMutation.mutateAsync({ id: post.id, form })
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

  // Simple Markdown preview
  const renderPreview = (md: string) => md
    .replace(/^### (.+)$/gm, '<h3 style="color:white;font-size:18px;margin:16px 0 8px">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:white;font-size:22px;margin:20px 0 10px">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:white;font-size:28px;margin:24px 0 12px">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#1e1e35;padding:2px 6px;border-radius:4px;font-family:monospace;color:#a78bfa">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #7c6af7;padding-left:12px;color:#9898b8;margin:12px 0">$1</blockquote>')
    .replace(/^\- (.+)$/gm, '<li style="color:#c8c8da;margin:4px 0">$1</li>')
    .replace(/\n\n/g, '</p><p style="color:#c8c8da;line-height:1.8;margin:12px 0">')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4
                    bg-ink-900/90 backdrop-blur-sm">
      <div className="w-full max-w-5xl glass rounded-3xl relative
                      flex flex-col max-h-[92vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5
                        border-b border-white/[0.05] shrink-0">
          <h2 className="font-display font-bold text-white text-xl">
            {post ? 'Modifier l\'article' : 'Nouvel article'}
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono
                          transition-all border ${preview
                ? 'bg-accent-500/20 text-accent-300 border-accent-500/30'
                : 'text-ink-400 border-white/[0.06] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              {preview ? 'Éditeur' : 'Prévisualisation'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ink-400 hover:text-white
                         hover:bg-white/[0.06] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit(onSubmit)} className="p-7 flex flex-col gap-5">
            <div className="grid md:grid-cols-3 gap-5">
              {/* Left — main content */}
              <div className="md:col-span-2 flex flex-col gap-4">
                {/* Title */}
                <div>
                  <input
                    {...register('title')}
                    placeholder="Titre de l'article…"
                    className="input-field text-xl font-display font-bold"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Excerpt */}
                <textarea
                  {...register('excerpt')}
                  rows={2}
                  placeholder="Résumé court (affiché dans les cards)…"
                  className="input-field resize-none text-sm"
                />

                {/* Markdown editor */}
                <div className="border border-white/[0.08] rounded-xl overflow-hidden">
                  {!preview && (
                    <MarkdownToolbar onInsert={handleInsert} />
                  )}
                  {preview ? (
                    <div
                      className="p-5 min-h-64 text-ink-300 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: renderPreview(contentValue)
                      }}
                    />
                  ) : (
                    <textarea
                      {...register('content')}
                      ref={(e) => {
                        register('content').ref(e)
                        ;(textareaRef as any).current = e
                      }}
                      rows={18}
                      placeholder={`# Titre de section\n\nVotre contenu en Markdown...\n\n## Sous-titre\n\nParagraphe avec **texte gras** et *italique*.\n\n- Point 1\n- Point 2\n\n> Citation importante`}
                      className="w-full p-4 bg-transparent text-ink-200 text-sm
                                 font-mono leading-relaxed resize-none
                                 focus:outline-none placeholder:text-ink-600"
                    />
                  )}
                </div>
                {errors.content && (
                  <p className="text-red-400 text-xs">{errors.content.message}</p>
                )}
              </div>

              {/* Right — settings */}
              <div className="flex flex-col gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
                    Catégorie *
                  </label>
                  <select {...register('category')} className="input-field">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
                    Tags (séparés par virgule)
                  </label>
                  <input
                    {...register('tags')}
                    className="input-field text-sm"
                    placeholder="ChatGPT, LLM, OpenAI"
                  />
                </div>

                {/* Cover */}
                <div>
                  <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-1.5">
                    Image de couverture
                  </label>
                  {post?.cover_path && !coverFile && (
                    <img
                      src={assetUrl(post.cover_path)}
                      alt=""
                      className="w-full aspect-video object-cover rounded-xl mb-2"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-xs text-ink-400
                               file:mr-2 file:py-1.5 file:px-3 file:rounded-lg
                               file:border-0 file:text-xs file:font-mono
                               file:bg-accent-500/15 file:text-accent-400
                               hover:file:bg-accent-500/25 cursor-pointer"
                  />
                </div>

                {/* SEO */}
                <div className="glass rounded-xl p-4">
                  <p className="text-xs font-mono text-ink-500 uppercase tracking-wide mb-3">
                    SEO
                  </p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs text-ink-500 mb-1">
                        Meta title (max 70 chars)
                      </label>
                      <input
                        {...register('meta_title')}
                        maxLength={70}
                        className="input-field text-xs"
                        placeholder="Titre SEO…"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-ink-500 mb-1">
                        Meta description (max 160 chars)
                      </label>
                      <textarea
                        {...register('meta_description')}
                        maxLength={160}
                        rows={3}
                        className="input-field text-xs resize-none"
                        placeholder="Description SEO…"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl
                                    glass hover:bg-white/[0.04] transition-colors">
                    <input
                      {...register('is_published')}
                      type="checkbox"
                      className="rounded border-ink-600 bg-ink-800 text-accent-500"
                    />
                    <div>
                      <p className="text-sm text-white font-body">Publier</p>
                      <p className="text-xs text-ink-500">Visible publiquement</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl
                                    glass hover:bg-white/[0.04] transition-colors">
                    <input
                      {...register('is_featured')}
                      type="checkbox"
                      className="rounded border-ink-600 bg-ink-800 text-accent-500"
                    />
                    <div>
                      <p className="text-sm text-white font-body">Mettre en avant</p>
                      <p className="text-xs text-ink-500">Affiché sur l'accueil</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.05]">
              <Button variant="ghost" type="button" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" loading={isPending}>
                {post ? 'Mettre à jour' : 'Créer l\'article'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Main admin page ───────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const { data: posts, isLoading } = useAllBlogPosts()
  const deleteMutation = useDeleteBlogPost()
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<BlogPostSummary | undefined>()

  const openCreate = () => { setEditing(undefined); setModal(true) }
  const openEdit   = (p: BlogPostSummary) => { setEditing(p); setModal(true) }
  const closeModal = () => { setModal(false); setEditing(undefined) }

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Article supprimé.')
    } catch {
      toast.error('Erreur.')
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
            Nouvel article
          </Button>
        }
      >
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',     value: posts?.length ?? 0, icon: BookOpen },
            { label: 'Publiés',   value: published,           icon: Eye },
            { label: 'Brouillons',value: drafts,              icon: FileText },
            { label: 'Vues',      value: totalViews,          icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-500/15 border border-accent-500/20
                              flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent-400" />
              </div>
              <div>
                <p className="text-xl font-display font-bold gradient-text">{value}</p>
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
              <Card key={post.id} className={`flex items-start gap-4 ${
                !post.is_published ? 'opacity-60' : ''
              }`}>
                {/* Cover thumbnail */}
                {post.cover_path ? (
                  <img
                    src={assetUrl(post.cover_path)}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-ink-800/60 border border-white/[0.05]
                                  flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-ink-600" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display font-semibold text-white text-sm">
                      {post.title}
                    </h3>
                    {!post.is_published && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                       bg-ink-700 text-ink-400 border border-white/[0.05]">
                        Brouillon
                      </span>
                    )}
                    {post.is_featured && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-mono
                                       bg-gold-DEFAULT/15 text-gold-light border border-gold-DEFAULT/20">
                        ✦ Featured
                      </span>
                    )}
                  </div>
                  <p className="text-ink-500 text-xs font-mono mb-2">
                    {post.category} · {post.reading_time} min ·{' '}
                    {post.views} vues
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 4).map((t) => (
                      <Badge key={t} label={t} />
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono text-ink-500">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('fr-FR')
                      : new Date(post.created_at).toLocaleDateString('fr-FR')
                    }
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" onClick={() => openEdit(post)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AdminPage>

      {modal && <BlogEditorModal post={editing} onClose={closeModal} />}
    </>
  )
}
