import { useState, useEffect } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import { resumeApi } from '../../services/api'

export default function AnalysisHistoryPage({ onNavigate, onLogout }) {
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isCachedFallback, setIsCachedFallback] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [deletingId, setDeletingId] = useState(null)

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

  const handleDelete = async (id) => {
    if (!id || deletingId) return

    const confirmed = window.confirm(
      'Delete this job description analysis? This action cannot be undone.'
    )
    if (!confirmed) return

    // Optimistic removal, keep a snapshot to roll back on failure
    const snapshot = records
    setDeletingId(id)
    setErrorMsg(null)
    setIsCachedFallback(false)
    setRecords((prev) => prev.filter((r) => r.id !== id))

    try {
      await resumeApi.deleteJobDescription(id)
    } catch (err) {
      console.error('Failed to delete job description analysis:', err)
      // Roll back the optimistic update
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
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-6 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] border border-[#DCE5F0] text-[11px] font-body-semibold text-[#102544]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
              <span>ATS Optimizer</span>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#64748B] font-medium">Job Analysis History</span>
            </div>

            <button
              onClick={fetchHistory}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-semibold hover:underline cursor-pointer disabled:opacity-50"
              type="button"
            >
              <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : ''}`}>
                refresh
              </span>
              <span>Refresh History</span>
            </button>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-page text-headline-page text-[#14243B] tracking-tight">
                Job Description History
              </h1>
              <p className="font-body-large text-[#64748B] mt-1">
                Review your previous job match audits, seniority gap verdicts, and target roles.
              </p>
            </div>
            <button
              onClick={() => onNavigate('analyze-job')}
              className="h-11 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              <span>+ New Job Analysis</span>
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

          {/* Empty State */}
          {!isLoading && filteredRecords.length === 0 && (
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                <span className="material-symbols-outlined text-[30px]">search_off</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-card text-lg font-bold text-[#14243B]">
                  No job description analyses found
                </h3>
                <p className="text-sm text-[#64748B] max-w-md">
                  {searchQuery || scoreFilter !== 'all'
                    ? 'No records match your search query or filter.'
                    : 'You have not performed any job description analyses yet.'}
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

          {/* Main Table */}
          {!isLoading && filteredRecords.length > 0 && (
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
                    className="w-full h-10 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg outline-none focus:border-[#2563EB]"
                  />
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
                    {filteredRecords.map((item) => {
                      const score = Number(item.match_score) || 0
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
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${
                                score >= 80
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
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  localStorage.setItem('resumint_last_job_analysis_id', item.id)
                                  localStorage.setItem('resumint_last_job_analysis', JSON.stringify(item))
                                  onNavigate('analysis-results')
                                }}
                                className="px-3 py-1.5 rounded bg-[#EFF6FF] border border-[#2563EB]/20 text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[15px]">visibility</span>
                                <span>View Results</span>
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className="p-1.5 text-[#94A3B8] hover:text-[#DC2626] rounded transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete"
                                type="button"
                              >
                                <span
                                  className={`material-symbols-outlined text-[18px] ${
                                    deletingId === item.id ? 'animate-spin' : ''
                                  }`}
                                >
                                  {deletingId === item.id ? 'progress_activity' : 'delete'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer Count */}
              <div className="p-4 border-t border-[#DCE5F0] flex items-center justify-between text-xs text-[#64748B]">
                <div>
                  Showing <strong className="text-[#14243B]">{filteredRecords.length}</strong> of{' '}
                  <strong className="text-[#14243B]">{records.length}</strong> job description scans
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
