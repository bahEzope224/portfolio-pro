import { useState } from 'react'
import { Download, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Spinner } from '@/components/ui'
import { useCV } from '@/hooks/useApi'
import { assetUrl } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function CVPage() {
  const { t, i18n } = useTranslation()
  const { data: cv, isLoading } = useCV()
  const [numPages,    setNumPages]    = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pdfLoading,  setPdfLoading]  = useState(true)
  const pdfUrl = cv ? assetUrl(cv.file_path) : null

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('cv.tag')}
        title={t('cv.title')}
        subtitle={t('cv.subtitle')}
      />
      {isLoading && <Spinner />}
      {!isLoading && !cv && (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-24 h-24 rounded-3xl bg-ink-800/60 border border-white/[0.06]
                          flex items-center justify-center animate-float">
            <FileText className="w-10 h-10" />
          </div>
          <p className="text-ink-400 text-sm">{t('cv.errLoad')}</p>
        </div>
      )}
      {cv && pdfUrl && (
        <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-3xl glass rounded-2xl p-6
                          flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20
                              flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="font-display font-semibold text-white text-sm">{cv.filename}</p>
                <p className="text-xs font-mono">
                  {new Date(cv.upload_date).toLocaleDateString(
                    i18n.language.startsWith('fr') ? 'fr-FR' : 'en-GB'
                  )}
                </p>
              </div>
            </div>
            <a href={pdfUrl} download={cv.filename} className="btn-primary">
              <Download className="w-4 h-4" />
              {t('cv.download')}
            </a>
          </div>
          <div className="w-full max-w-3xl">
            {numPages > 1 && (
              <div className="flex items-center justify-center gap-4 mb-4">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg glass glass-hover disabled:opacity-30 hover:text-white transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-mono">
                  {t('cv.page')} {currentPage} {t('cv.of')} {numPages}
                </span>
                <button onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                        disabled={currentPage === numPages}
                        className="p-2 rounded-lg glass glass-hover disabled:opacity-30 hover:text-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="rounded-2xl overflow-hidden border border-white/[0.06]
                            flex justify-center bg-ink-800/30">
              {pdfLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-accent-400" />
                </div>
              )}
              <Document file={pdfUrl}
                onLoadSuccess={({ numPages: n }) => { setNumPages(n); setPdfLoading(false) }}
                onLoadError={() => setPdfLoading(false)}
                loading="">
                <Page pageNumber={currentPage}
                      width={Math.min(window.innerWidth - 80, 800)}
                      renderTextLayer={true}
                      renderAnnotationLayer={true} />
              </Document>
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}
