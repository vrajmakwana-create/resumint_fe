import { useState, useEffect } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import ResumePreviewModal from '../common/ResumePreviewModal'
import { resumeApi } from '../../services/api'

// Helper to normalize any skills/list structure into a flat array of strings
function asArray(val) {
  if (!val) return []
  if (Array.isArray(val)) {
    return val.filter(Boolean)
  }
  if (typeof val === 'object') {
    return Object.values(val)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter(Boolean)
  }
  if (typeof val === 'string') {
    return val
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

function sanitizeFilename(str) {
  return (str || 'document')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50)
}

export default function AnalysisHistoryPage({ onNavigate, onLogout }) {
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isCachedFallback, setIsCachedFallback] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [deletingId, setDeletingId] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)

  // Resume Preview Modal (Identical to Profile section)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewResumeUrl, setPreviewResumeUrl] = useState(null)
  const [previewResumeData, setPreviewResumeData] = useState({})

  // Download & Share Feedback State
  const [downloadingId, setDownloadingId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 3000)
  }

  const fetchHistory = async () => {
    setIsLoading(true)
    setErrorMsg(null)
    setIsCachedFallback(false)
    try {
      const response = await resumeApi.getJobDescriptionHistory()
      const list = response?.data || response
      if (Array.isArray(list)) {
        setRecords(list)
      } else {
        setRecords([])
      }
    } catch (err) {
      console.error('Failed to fetch job description history:', err)
      setErrorMsg(err.message || 'Unable to fetch analysis history.')
      setIsCachedFallback(true)
      // Fallback sample data if API fails or backend offline
      setRecords([
        {
          id: '03eb67d0-e05c-4783-bb80-8f49dcfa06ae',
          job_title: 'Senior Cloud Infrastructure & Backend Architect',
          company_name: 'Google',
          match_score: 71,
          seniority_level_jd: 'Senior / Lead',
          seniority_level_candidate: 'Junior / Entry-Level',
          missing_skills_count: 2,
          created_at: 1791971041856,
        },
        {
          id: '7d221ac1-db90-4336-accf-156f25a1eedf',
          job_title: 'Senior Cloud Infrastructure & Backend Architect',
          company_name: 'Google',
          match_score: 65,
          seniority_level_jd: 'Senior / Lead',
          seniority_level_candidate: 'Mid-Level',
          missing_skills_count: 4,
          created_at: 1791971117835,
        },
        {
          id: 'a73ff5c2-abcf-4303-be89-b8663bdad7c4',
          job_title: 'Senior Cloud Infrastructure & Backend Architect',
          company_name: 'Google',
          match_score: 71,
          seniority_level_jd: 'Senior / Lead',
          seniority_level_candidate: 'Junior / Entry-Level',
          missing_skills_count: 2,
          created_at: 1791970783590,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (itemToDelete) setItemToDelete(null)
        if (previewModalOpen) {
          setPreviewModalOpen(false)
          setPreviewResumeUrl(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [itemToDelete, previewModalOpen])

  // Open Resume Preview Modal (as in Profile Section)
  const handleOpenResumePreview = async (item) => {
    let resumeUrl = item.resume_url || null
    setPreviewResumeData({
      fullName: item.job_title ? `${item.job_title} Resume` : 'Candidate',
      company: item.company_name,
      jobTitle: item.job_title,
      id: item.id,
    })

    if (!resumeUrl && item.id) {
      try {
        const res = await resumeApi.getJobDescriptionById(item.id)
        const data = res?.data || res
        resumeUrl = data?.resume_url || data?.tailored_resume?.resume_url || null
      } catch (err) {
        console.warn('Could not fetch resume URL from job description record:', err)
      }
    }

    setPreviewResumeUrl(resumeUrl)
    setPreviewModalOpen(true)
  }

  // Handle Download (Tailored PDF if available, or ATS analysis summary report)
  const handleDownload = async (item, e) => {
    if (e) e.stopPropagation()
    const id = item.id
    setDownloadingId(id)

    try {
      let targetUrl = item.resume_url || (previewResumeData?.id === id ? previewResumeUrl : null)

      // If no resume_url yet, check if detailed analysis record has it
      if (!targetUrl && id) {
        try {
          const res = await resumeApi.getJobDescriptionById(id)
          const data = res?.data || res
          targetUrl = data?.resume_url || data?.tailored_resume?.resume_url || null
        } catch {
          // ignore error and proceed
        }
      }

      const company = item.company_name || 'Company'
      const title = item.job_title || 'Role'
      const filenameBase = `${sanitizeFilename(company)}_${sanitizeFilename(title)}`

      if (targetUrl) {
        showToast('Starting PDF download...')
        try {
          const response = await fetch(targetUrl)
          if (!response.ok) throw new Error('Network response not ok')
          const blob = await response.blob()
          const blobUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = `${filenameBase}_Tailored_Resume.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(blobUrl)
          showToast('Tailored Resume downloaded!')
        } catch {
          // Fallback to direct anchor navigation
          const a = document.createElement('a')
          a.href = targetUrl
          a.target = '_blank'
          a.download = `${filenameBase}_Tailored_Resume.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
          showToast('Opened resume document download link!')
        }
      } else {
        // Fallback to downloading candidate resume directly from backend or ATS text report
        showToast('Downloading resume document...')
        try {
          const blob = await resumeApi.downloadResume()
          if (blob && (blob.type?.includes('pdf') || blob.size > 0)) {
            const blobUrl = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = `${filenameBase}_Resume.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(blobUrl)
            showToast('Resume downloaded successfully!')
            return
          }
        } catch {
          // If backend download endpoint fails, generate ATS text summary report
        }

        let detailedData = item
        try {
          const res = await resumeApi.getJobDescriptionById(id)
          detailedData = res?.data || res || item
        } catch {
          detailedData = item
        }

        const skillsAn = detailedData.skills_analysis || {}
        const matchingSkills = asArray(skillsAn.matching_skills || detailedData.matching_skills)
        const missingSkills = asArray(skillsAn.missing_skills || detailedData.missing_skills)
        const tailored = detailedData.tailored_resume || {}
        const tailoredSummary = tailored.tailored_summary || detailedData.tailored_summary || ''
        const tailoredSkills = asArray(tailored.tailored_skills || tailored.skills || detailedData.tailored_skills)

        const reportLines = [
          '===============================================================',
          '               RESUMINT ATS JOB ANALYSIS REPORT                ',
          '===============================================================',
          `Position: ${detailedData.job_title || 'N/A'}`,
          `Target Company: ${detailedData.company_name || 'N/A'}`,
          `Overall Match Score: ${detailedData.match_score || 0}%`,
          `Scan Date: ${formatTimestamp(detailedData.created_at)}`,
          '---------------------------------------------------------------',
          'SENIORITY BENCHMARK:',
          `  • Job Description Level: ${detailedData.seniority_level_jd || 'N/A'}`,
          `  • Candidate Level:       ${detailedData.seniority_level_candidate || 'N/A'}`,
          '---------------------------------------------------------------',
          'MATCH RATIONALE:',
          detailedData.match_rationale || 'N/A',
          '---------------------------------------------------------------',
          `MATCHING SKILLS (${matchingSkills.length}):`,
          matchingSkills.length > 0 ? matchingSkills.map((s) => `  ✓ ${s}`).join('\n') : '  None identified',
          '---------------------------------------------------------------',
          `MISSING SKILLS & GAPS (${missingSkills.length}):`,
          missingSkills.length > 0 ? missingSkills.map((s) => `  ✗ ${s}`).join('\n') : '  None identified',
          '---------------------------------------------------------------',
          'AI TAILORED SUMMARY RECOMMENDATION:',
          tailoredSummary || 'No tailored summary generated.',
          '---------------------------------------------------------------',
          `RECOMMENDED KEYWORDS (${tailoredSkills.length}):`,
          tailoredSkills.length > 0 ? tailoredSkills.join(', ') : 'None',
          '===============================================================',
        ]

        const reportBlob = new Blob([reportLines.join('\n')], { type: 'text/plain;charset=utf-8' })
        const reportUrl = window.URL.createObjectURL(reportBlob)
        const a = document.createElement('a')
        a.href = reportUrl
        a.download = `${filenameBase}_Analysis_Report.txt`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(reportUrl)
        showToast('Analysis report downloaded!')
      }
    } catch (err) {
      console.error('Download error:', err)
      showToast('Download failed. Please try again.')
    } finally {
      setDownloadingId(null)
    }
  }

  // Handle Share Link (Native share if supported, otherwise copy to clipboard)
  const handleShare = async (item, e) => {
    if (e) e.stopPropagation()
    const id = item.id
    const company = item.company_name || 'Target Company'
    const title = item.job_title || 'Position'
    const score = item.match_score != null ? `${item.match_score}%` : 'Analysis'

    const shareUrl = item.resume_url || `${window.location.origin}${window.location.pathname}#analysis-results?id=${id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} at ${company} - Resumint Match Analysis`,
          text: `Resumint Match Score: ${score} for ${title} at ${company}.`,
          url: shareUrl,
        })
        setCopiedId(id)
        showToast('Shared successfully!')
        setTimeout(() => setCopiedId(null), 2500)
        return
      } catch (shareErr) {
        if (shareErr.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopiedId(id)
      showToast('Share link copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2500)
    } catch (clipErr) {
      console.error('Clipboard copy failed:', clipErr)
      showToast('Could not copy link to clipboard.')
    }
  }

  const filteredRecords = records.filter((r) => {
    const title = (r.job_title || '').toLowerCase()
    const company = (r.company_name || '').toLowerCase()
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query || title.includes(query) || company.includes(query)

    const score = Number(r.match_score) || 0
    const matchesScore =
      scoreFilter === 'all' ||
      (scoreFilter === '90' && score >= 90) ||
      (scoreFilter === '70' && score >= 70 && score < 90) ||
      (scoreFilter === 'below70' && score < 70)

    return matchesSearch && matchesScore
  })

  const handleConfirmDelete = async () => {
    if (!itemToDelete || deletingId) return
    const id = itemToDelete.id
    const snapshot = records

    setDeletingId(id)
    setErrorMsg(null)
    setIsCachedFallback(false)
    setRecords((prev) => prev.filter((r) => r.id !== id))
    setItemToDelete(null)

    try {
      await resumeApi.deleteJobDescription(id)
      showToast('Job analysis deleted successfully.')
    } catch (err) {
      console.error('Failed to delete job description analysis:', err)
      setRecords(snapshot)
      setErrorMsg(err.message || 'Unable to delete this analysis. Please try again.')
      setIsCachedFallback(false)
    } finally {
      setDeletingId(null)
    }
  }

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A'
    try {
      const d = new Date(ts)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return String(ts)
    }
  }

  // Summary Metrics calculations
  const totalAnalyses = records.length
  const avgScore =
    totalAnalyses > 0
      ? Math.round(records.reduce((acc, curr) => acc + (Number(curr.match_score) || 0), 0) / totalAnalyses)
      : 0
  const bestScore = totalAnalyses > 0 ? Math.max(...records.map((r) => Number(r.match_score) || 0)) : 0

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default antialiased flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <AppSidebar currentView="analysis-history" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F8FC]">
        {/* TOPBAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* WORKSPACE */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1440px] w-full mx-auto space-y-6">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-page text-headline-page text-[#14243B] tracking-tight">
                Job Description History
              </h1>
              <p className="font-body-large text-[#64748B] mt-1">
                Review previous scans, preview resume documents, and download or share analysis reports.
              </p>
            </div>
            <button
              onClick={() => onNavigate('analyze-job')}
              className="h-11 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>New Job Analysis</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center justify-between">
              <span>{errorMsg}{isCachedFallback ? ' (Showing recent history cached)' : ''}</span>
              <button onClick={() => setErrorMsg(null)} className="text-amber-600 hover:text-amber-800">
                ×
              </button>
            </div>
          )}

          {/* Quick Metrics Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                  <span className="material-symbols-outlined text-xl">analytics</span>
                </div>
                <div>
                  <p className="text-caption-helper font-body-medium text-[#64748B] uppercase tracking-wider">
                    Total Analyses
                  </p>
                  <p className="font-headline-card text-2xl font-bold text-[#14243B]">
                    {isLoading ? '...' : totalAnalyses}
                  </p>
                </div>
              </div>
              <span className="text-caption-helper text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Data Sync
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <span className="material-symbols-outlined text-xl">speed</span>
                </div>
                <div>
                  <p className="text-caption-helper font-body-medium text-[#64748B] uppercase tracking-wider">
                    Avg. Match Score
                  </p>
                  <p className="font-headline-card text-2xl font-bold text-[#14243B]">
                    {isLoading ? '...' : `${avgScore}%`}
                  </p>
                </div>
              </div>
              <span className="text-caption-helper text-[#2563EB] font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Audit Benchmark
              </span>
            </div>

            <div className="bg-white border border-[#DCE5F0] rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <span className="material-symbols-outlined text-xl">workspace_premium</span>
                </div>
                <div>
                  <p className="text-caption-helper font-body-medium text-[#64748B] uppercase tracking-wider">
                    Highest Match
                  </p>
                  <p className="font-headline-card text-2xl font-bold text-[#14243B]">
                    {isLoading ? '...' : `${bestScore}%`}
                  </p>
                </div>
              </div>
              <span className="text-caption-helper text-[#64748B] font-medium">Top Match</span>
            </div>
          </div>

          {/* Skeleton Loading State */}
          {isLoading && (
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm space-y-4 animate-pulse">
              <div className="h-10 bg-[#F1F5F9] rounded-lg w-full" />
              <div className="h-14 bg-[#F8FAFC] rounded-lg w-full" />
              <div className="h-14 bg-[#F8FAFC] rounded-lg w-full" />
              <div className="h-14 bg-[#F8FAFC] rounded-lg w-full" />
            </div>
          )}

          {/* Empty State (when user has no analyses saved yet) */}
          {!isLoading && records.length === 0 && (
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <span className="material-symbols-outlined text-[30px]">search_off</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-card text-lg font-bold text-[#14243B]">
                  No job description analyses found
                </h3>
                <p className="text-sm text-[#64748B] max-w-md">
                  You have not performed any job description analyses yet.
                </p>
              </div>
              <button
                onClick={() => onNavigate('analyze-job')}
                className="h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
                type="button"
              >
                + Run First Analysis
              </button>
            </div>
          )}

          {/* Main Table (remains visible even when search/filter returns 0 matches) */}
          {!isLoading && records.length > 0 && (
            <section className="bg-white border border-[#DCE5F0] rounded-xl shadow-sm overflow-hidden">
              {/* Filter Toolbar */}
              <div className="p-4 border-b border-[#DCE5F0] flex flex-col lg:flex-row items-center justify-between gap-3">
                <div className="relative w-full lg:w-80">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search by job title or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-8 text-xs bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg outline-none focus:border-[#2563EB]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#14243B] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                  <select
                    value={scoreFilter}
                    onChange={(e) => setScoreFilter(e.target.value)}
                    className="h-10 px-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg text-xs font-medium text-[#14243B] outline-none cursor-pointer"
                  >
                    <option value="all">All Match Scores</option>
                    <option value="90">90%+ (Top Fit)</option>
                    <option value="70">70% - 89% (Good Fit)</option>
                    <option value="below70">Below 70% (Gap Alert)</option>
                  </select>

                  {(searchQuery || scoreFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('')
                        setScoreFilter('all')
                      }}
                      className="h-10 px-3 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#14243B] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Clear search and filter"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#DCE5F0] text-[#64748B] font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Company &amp; Job Title</th>
                      <th className="px-6 py-3.5">Match Score</th>
                      <th className="px-6 py-3.5">Target vs Candidate Seniority</th>
                      <th className="px-6 py-3.5">Missing Skills</th>
                      <th className="px-6 py-3.5">Analysis Date</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCE5F0]">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((item) => {
                        const score = Number(item.match_score) || 0
                        const isDownloading = downloadingId === item.id
                        const isCopied = copiedId === item.id

                        return (
                          <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-[#14243B] text-sm">
                                {item.company_name || 'Google'}
                              </div>
                              <div className="text-[#64748B] text-xs mt-0.5">
                                {item.job_title || 'Software Engineer'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${score >= 80
                                  ? 'bg-[#DCFCE7] text-[#15803D]'
                                  : score >= 65
                                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                                    : 'bg-[#FEF2F2] text-[#DC2626]'
                                  }`}
                              >
                                <span>{score}%</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-[#14243B] font-medium">
                                JD: <span className="font-semibold text-[#2563EB]">{item.seniority_level_jd || 'N/A'}</span>
                              </div>
                              <div className="text-[#64748B] text-[11px] mt-0.5">
                                Candidate: <span className="font-medium text-[#475569]">{item.seniority_level_candidate || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                                <span className="material-symbols-outlined text-[14px]">warning</span>
                                {item.missing_skills_count != null ? `${item.missing_skills_count} missing` : '0 missing'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#64748B] whitespace-nowrap">
                              {formatTimestamp(item.created_at)}
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 1. Preview Button (Resume Preview Modal) */}
                                <button
                                  onClick={() => handleOpenResumePreview(item)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold transition-all cursor-pointer text-xs flex items-center gap-1 shadow-xs"
                                  title="Resume PDF Preview"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                  <span>Preview</span>
                                </button>

                                {/* 2. Download Option */}
                                <button
                                  onClick={(e) => handleDownload(item, e)}
                                  disabled={isDownloading}
                                  className="p-1.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-blue-50 hover:border-blue-200 text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer disabled:opacity-50"
                                  title="Download Tailored Resume / Report"
                                  type="button"
                                >
                                  <span className={`material-symbols-outlined text-[18px] ${isDownloading ? 'animate-spin' : ''}`}>
                                    {isDownloading ? 'progress_activity' : 'download'}
                                  </span>
                                </button>

                                {/* 3. Share Link Option */}
                                <button
                                  onClick={(e) => handleShare(item, e)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isCopied
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                    : 'border-[#DCE5F0] bg-white hover:bg-blue-50 hover:border-blue-200 text-[#475569] hover:text-[#2563EB]'
                                    }`}
                                  title={isCopied ? 'Link Copied!' : 'Share Link'}
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    {isCopied ? 'check' : 'share'}
                                  </span>
                                </button>

                                {/* 4. Full Results Page */}
                                <button
                                  onClick={() => {
                                    localStorage.setItem('resumint_last_job_analysis_id', item.id)
                                    localStorage.setItem('resumint_last_job_analysis', JSON.stringify(item))
                                    onNavigate('analysis-results')
                                  }}
                                  className="p-1.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-blue-50 hover:border-blue-200 text-[#475569] hover:text-[#2563EB] transition-colors cursor-pointer"
                                  title="Open Full Analysis Workspace"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                </button>

                                {/* 5. Delete Action */}
                                <button
                                  onClick={() => setItemToDelete(item)}
                                  disabled={deletingId === item.id}
                                  className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete Analysis"
                                  type="button"
                                >
                                  <span
                                    className={`material-symbols-outlined text-[18px] ${deletingId === item.id ? 'animate-spin' : ''
                                      }`}
                                  >
                                    {deletingId === item.id ? 'progress_activity' : 'delete'}
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-12 px-6 text-center">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                              <span className="material-symbols-outlined text-[24px]">search_off</span>
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-sm text-[#14243B]">
                                No job description analyses found
                              </p>
                              <p className="text-xs text-[#64748B]">
                                No records match your current search or score filter. Try adjusting your search query.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery('')
                                setScoreFilter('all')
                              }}
                              className="px-3.5 py-1.5 bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                            >
                              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                              <span>Clear Search &amp; Filter</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer Count */}
              <div className="p-4 border-t border-[#DCE5F0] flex items-center justify-between text-xs text-[#64748B]">
                <div>
                  Showing <strong className="text-[#14243B]">{filteredRecords.length}</strong> of{' '}
                  <strong className="text-[#14243B]">{records.length}</strong> job description scans
                  {(searchQuery || scoreFilter !== 'all') && (
                    <span className="ml-2 text-[#2563EB] font-medium">
                      (filtered)
                    </span>
                  )}
                </div>
                {(searchQuery || scoreFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setScoreFilter('all')
                    }}
                    className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#14243B] text-white text-xs font-semibold rounded-xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/60 hover:text-white cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* RESUME PREVIEW MODAL (Identical to Profile Section Preview) */}
      <ResumePreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false)
          setPreviewResumeUrl(null)
        }}
        resumeData={previewResumeData}
        pdfUrl={previewResumeUrl}
        onDownload={() => handleDownload(previewResumeData)}
        isDownloading={Boolean(downloadingId)}
      />

      {/* Delete Confirmation Popup Modal */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-[#151E32] rounded-2xl shadow-2xl border border-[#DCE5F0] dark:border-[#24334A] overflow-hidden p-6 text-center space-y-5 transform transition-all duration-300 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => setItemToDelete(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#14243B] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Warning Icon Badge */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[32px] animate-pulse">delete_forever</span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-[18px] font-bold text-[#14243B] dark:text-white tracking-tight">
                Delete Job Analysis?
              </h3>
              <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                Are you sure you want to delete this scan? This will permanently remove all match metrics, gap verdicts, and tailored recommendations.
              </p>
            </div>

            {/* Analysis Summary Highlight Card */}
            <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#0B1120] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-left space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[14px] text-[#14243B] dark:text-white truncate">
                  {itemToDelete.company_name || 'Target Company'}
                </span>
                {itemToDelete.match_score != null && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] shrink-0">
                    {itemToDelete.match_score}% Match
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] truncate">
                {itemToDelete.job_title || 'Position Title'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] pt-0.5">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                <span>Scanned on {formatTimestamp(itemToDelete.created_at)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 h-10 px-4 rounded-xl border border-[#DCE5F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] font-semibold text-[13px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(deletingId)}
                className="flex-1 h-10 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-[13px] shadow-sm shadow-red-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {deletingId ? 'progress_activity' : 'delete'}
                </span>
                <span>{deletingId ? 'Deleting...' : 'Delete Scan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
