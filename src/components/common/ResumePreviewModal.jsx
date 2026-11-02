import { useState, useEffect, useCallback } from 'react'
import { resumeApi } from '../../services/api'

export default function ResumePreviewModal({
  isOpen,
  onClose,
  resumeData = {},
  syncedResumeUrl = null,
  pdfUrl = null,
  onDownload = null,
  isDownloading = false,
}) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(false)
  const [pdfError, setPdfError] = useState(null)

  const activePdfUrl = pdfUrl || syncedResumeUrl

  // Fetch the PDF blob from backend or use direct URL
  const fetchPdf = useCallback(async () => {
    setIsLoadingPdf(true)
    setPdfError(null)

    if (activePdfUrl) {
      setPdfBlobUrl(activePdfUrl)
      setIsLoadingPdf(false)
      return
    }

    try {
      const blob = await resumeApi.downloadResume()
      if (blob && (blob.type?.includes('pdf') || blob.size > 0)) {
        const objectUrl = URL.createObjectURL(blob)
        setPdfBlobUrl((prev) => {
          if (prev && prev.startsWith('blob:')) {
            URL.revokeObjectURL(prev)
          }
          return objectUrl
        })
      } else {
        throw new Error('Received an empty response for resume PDF.')
      }
    } catch (err) {
      console.error('Failed to load PDF preview:', err)
      setPdfError(err.message || 'Could not load PDF document. Try syncing your changes first.')
    } finally {
      setIsLoadingPdf(false)
    }
  }, [activePdfUrl])

  // Auto fetch PDF when modal opens or active url changes
  useEffect(() => {
    if (isOpen) {
      fetchPdf()
    } else {
      if (pdfBlobUrl && pdfBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
      setPdfBlobUrl(null)
    }
  }, [isOpen, fetchPdf])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Modal Dialog Card - ONLY the PDF Page */}
      <div
        className="relative w-full max-w-4xl h-[92vh] sm:h-[95vh] bg-[#323639] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Actions: Download (if provided) + Close Button */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              className="h-8 px-3 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg backdrop-blur-sm text-xs font-semibold disabled:opacity-50"
              title="Download PDF"
            >
              <span className={`material-symbols-outlined text-[16px] ${isDownloading ? 'animate-spin' : ''}`}>
                {isDownloading ? 'progress_activity' : 'download'}
              </span>
              <span className="hidden sm:inline">Download</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm"
            title="Close Preview (Esc)"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content: Only the PDF Page */}
        {isLoadingPdf ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[#F8FAFC] dark:bg-[#0B1120]">
            <div className="w-12 h-12 rounded-full border-3 border-[#2563EB] border-t-transparent animate-spin" />
            <p className="text-[14px] font-semibold text-[#14243B] dark:text-white">
              Loading PDF Preview...
            </p>
          </div>
        ) : pdfError ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[#F8FAFC] dark:bg-[#0B1120]">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div className="max-w-md space-y-1">
              <p className="text-[15px] font-bold text-[#14243B] dark:text-white">
                Unable to load PDF preview
              </p>
              <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                {pdfError}
              </p>
            </div>
            <button
              type="button"
              onClick={fetchPdf}
              className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-semibold cursor-pointer shadow-xs"
            >
              Retry
            </button>
          </div>
        ) : pdfBlobUrl ? (
          <iframe
            src={`${pdfBlobUrl}#view=FitH`}
            className="w-full h-full border-0"
            title={`${resumeData?.fullName || 'Candidate'} Resume PDF Preview`}
          />
        ) : null}
      </div>
    </div>
  )
}
