import { useRef, useState } from 'react'
import { Upload, Trash2, FileText, Calendar, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminPage, Button, Spinner, Card } from '@/components/ui'
import { useCV, useUploadCV, useDeleteCV } from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'

export default function AdminCVPage() {
  const { data: cv, isLoading } = useCV()
  const uploadMutation = useUploadCV()
  const deleteMutation = useDeleteCV()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Seuls les fichiers PDF sont acceptés.')
      return
    }
    const form = new FormData()
    form.append('file', file)
    try {
      await uploadMutation.mutateAsync(form)
      toast.success(cv ? 'CV remplacé avec succès !' : 'CV uploadé avec succès !')
    } catch {
      toast.error('Erreur lors de l\'upload.')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Supprimer le CV actuel ?')) return
    try {
      await deleteMutation.mutateAsync()
      toast.success('CV supprimé.')
    } catch {
      toast.error('Erreur lors de la suppression.')
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  return (
    <AdminPage title="Gestion du CV">
      {isLoading && <Spinner />}

      {!isLoading && (
        <div className="max-w-2xl flex flex-col gap-6">
          {/* Current CV */}
          {cv ? (
            <Card>
              <h3 className="font-display font-semibold text-white mb-4">CV actuel</h3>
              <div className="flex items-center gap-4 p-4 bg-ink-800/50 rounded-xl
                              border border-white/[0.05]">
                <div className="w-12 h-12 rounded-xl bg-accent-500/15 border border-accent-500/20
                                flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-white truncate">{cv.filename}</p>
                  <p className="flex items-center gap-1.5 text-xs text-ink-400 font-mono mt-0.5">
                    <Calendar className="w-3 h-3" />
                    Uploadé le {new Date(cv.upload_date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={assetUrl(cv.file_path)}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-mono
                               bg-white/[0.04] border border-white/[0.06]
                               text-ink-300 hover:text-white transition-colors"
                  >
                    Aperçu
                  </a>
                  <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <FileText className="w-12 h-12 text-ink-600 mx-auto mb-3" />
              <p className="text-ink-400 font-body">Aucun CV uploadé pour le moment.</p>
            </Card>
          )}

          {/* Upload zone */}
          <Card>
            <h3 className="font-display font-semibold text-white mb-4">
              {cv ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-accent-400" />
                  Remplacer le CV
                </span>
              ) : 'Uploader un CV'}
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`
                border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-200
                ${dragging
                  ? 'border-accent-500 bg-accent-500/10'
                  : 'border-white/[0.08] hover:border-accent-500/40 hover:bg-white/[0.02]'
                }
              `}
            >
              <Upload className={`w-10 h-10 mx-auto mb-4 transition-colors
                                  ${dragging ? 'text-accent-400' : 'text-ink-500'}`} />
              <p className="font-display font-semibold text-white mb-1">
                Glissez votre PDF ici
              </p>
              <p className="text-ink-400 text-sm">ou cliquez pour choisir un fichier</p>
              <p className="text-ink-600 text-xs font-mono mt-3">PDF uniquement · Max 10 MB</p>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
                e.target.value = ''
              }}
            />

            {uploadMutation.isPending && (
              <div className="flex items-center justify-center gap-2 mt-4 text-accent-400">
                <Spinner className="py-0" />
                <span className="text-sm font-body">Upload en cours…</span>
              </div>
            )}
          </Card>
        </div>
      )}
    </AdminPage>
  )
}
