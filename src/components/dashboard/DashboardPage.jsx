import { useState, useEffect } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import ResumePreviewModal from '../common/ResumePreviewModal'
import { getCurrentUser, resumeApi, dashboardApi } from '../../services/api'

export default function DashboardPage({ onNavigate, onLogout }) {
  const user = getCurrentUser()
  const firstName = user?.first_name || 'Candidate'

  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  // Preview Modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null)
  const [previewTitle, setPreviewTitle] = useState('')

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null)
  const [downloadingUrl, setDownloadingUrl] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current))
    }, 3000)
  }

  const fetchDashboard = async () => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const response = await (dashboardApi?.getDashboardAnalytics || resumeApi?.getDashboardAnalytics)()
      const data = response?.data || response
      if (data && typeof data === 'object') {
        setDashboardData(data)
      } else {
        throw new Error('Invalid dashboard payload format.')
      }
    } catch (err) {
      console.warn('Dashboard fetch warning / fallback:', err)
      setErrorMsg(err.message || 'Could not refresh latest analytics from server.')
      // Graceful fallback data conforming to the API specification
      setDashboardData({
        kpis: {
          overall_resume_score: 92,
          ats_parsing_rate: 95,
          tailored_applications_count: 4,
          average_match_score: 83.5,
          total_experience_years: 3.5,
        },
        primary_resume: {
          target_role: 'Senior Product Designer',
          candidate_name: `${user?.first_name || 'Senior'} ${user?.last_name || 'Designer'}`.trim(),
          year: 2024,
          resume_url: null,
          last_updated_at: new Date().toISOString(),
          completeness_score: 100,
          sections_status: {
            personal_info: true,
            professional_summary: true,
            skills: true,
            work_experience: true,
            projects: true,
            education: true,
          },
        },
        skills_analytics: {
          total_skills_count: 10,
          populated_categories_count: 3,
          skills_by_category: {
            'Tools & Technologies': ['Figma', 'Wireframing', 'Prototyping'],
            'Web Development': ['React', 'HTML', 'CSS', 'Design Systems'],
            'Programming Languages': ['Python'],
          },
          top_matching_market_skills: ['Figma', 'Design Systems', 'Prototyping'],
          top_missing_skills_for_interviews: ['User Research', 'A/B Testing'],
        },
        tailored_applications_analytics: {
          total_count: 4,
          match_distribution: {
            high_match_80_plus: 3,
            moderate_match_60_to_79: 1,
            low_match_below_60: 0,
          },
          recent_tailored_applications: [
            {
              id: '2daefd41-8f20-4318-a20b-34138113f36b',
              job_title: 'Senior Product Designer',
              company_name: 'Acme Innovations',
              match_score: 88,
              seniority_level_jd: 'Senior / Lead',
              created_at: new Date().toISOString(),
              resume_url: null,
            },
          ],
        },
        actionable_recommendations: [
          {
            type: 'interview_prep',
            priority: 'Medium',
            message:
              'Review interview preparation tips for your most frequent missing skill gaps: User Research, A/B Testing.',
          },
        ],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const handleOpenPdfPreview = (url, title = 'Resume') => {
    setPreviewPdfUrl(url || null)
    setPreviewTitle(title)
    setPreviewModalOpen(true)
  }

  const handleDownloadPdf = async (url, fallbackName = 'Resume') => {
    if (downloadingUrl) return
    const sanitizedName = fallbackName.replace(/[^a-zA-Z0-9_-]/g, '_')
    showToast('Starting resume download...')
    setDownloadingUrl(url || 'default')

    try {
      if (url) {
        try {
          const res = await fetch(url)
          if (!res.ok) throw new Error('Network error')
          const blob = await res.blob()
          const blobUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = `${sanitizedName}.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(blobUrl)
          showToast('Resume downloaded successfully!')
          return
        } catch {
          const a = document.createElement('a')
          a.href = url
          a.target = '_blank'
          a.download = `${sanitizedName}.pdf`
          document.body.appendChild(a)
          a.click()
          a.remove()
          showToast('Opened download link in new tab.')
          return
        }
      }

      // Fallback backend download
      const blob = await resumeApi.downloadResume()
      if (blob && (blob.type?.includes('pdf') || blob.size > 0)) {
        const blobUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = blobUrl
        a.download = `${sanitizedName}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(blobUrl)
        showToast('Resume downloaded successfully!')
      } else {
        throw new Error('Empty PDF received')
      }
    } catch (err) {
      console.error('Download error:', err)
      showToast('Download failed. Try syncing your resume first.')
    } finally {
      setDownloadingUrl(null)
    }
  }

  const formatDate = (isoStr) => {
    if (!isoStr) return 'Recently'
    try {
      const d = new Date(isoStr)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return String(isoStr)
    }
  }

  // Safe data accessors
  const kpis = dashboardData?.kpis || {}
  const primaryResume = dashboardData?.primary_resume || {}
  const skillsAn = dashboardData?.skills_analytics || {}
  const tailoredAppsAn = dashboardData?.tailored_applications_analytics || {}
  const recommendations = dashboardData?.actionable_recommendations || []

  const sectionsStatus = primaryResume.sections_status || {}
  const verifiedSectionsCount = Object.values(sectionsStatus).filter(Boolean).length
  const totalSectionsCount = Object.keys(sectionsStatus).length || 6

  const recentApps = Array.isArray(tailoredAppsAn.recent_tailored_applications)
    ? tailoredAppsAn.recent_tailored_applications
    : []

  const skillsByCategory = skillsAn.skills_by_category || {}
  const topMarketSkills = Array.isArray(skillsAn.top_matching_market_skills)
    ? skillsAn.top_matching_market_skills
    : []
  const topMissingSkills = Array.isArray(skillsAn.top_missing_skills_for_interviews)
    ? skillsAn.top_missing_skills_for_interviews
    : []

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default text-body-default antialiased flex h-screen overflow-hidden">
      {/* PERSISTENT SIDEBAR */}
      <AppSidebar currentView="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* SCROLLABLE CANVAS */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <div className="max-w-[1360px] mx-auto space-y-7">
            {/* DASHBOARD HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-headline-page text-headline-page text-[#14243B] tracking-tight">
                  Welcome back, {firstName}!
                </h1>
                <p className="font-body-default text-[#64748B] text-body-default mt-1">
                  Real-time analytics on your resume performance, ATS compatibility, and job match insights.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={fetchDashboard}
                  disabled={isLoading}
                  className="h-11 px-4 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#14243B] font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  type="button"
                  title="Refresh Dashboard Data"
                >
                  <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
                    refresh
                  </span>
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  onClick={() => onNavigate('analyze-job')}
                  className="h-11 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  <span>Analyze Job Description</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
                  <span>{errorMsg}</span>
                </div>
                <button onClick={() => setErrorMsg(null)} className="text-amber-700 hover:text-amber-900 font-bold">
                  ×
                </button>
              </div>
            )}

            {/* TOP KPIS ROW (5 Metrics Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* KPI 1: Overall Resume Score */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm transition-all hover:border-[#2563EB]/30">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-caption-helper font-body-medium uppercase tracking-wider">
                    Resume Score
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">speed</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#14243B]">
                    {isLoading ? '...' : `${kpis.overall_resume_score ?? 92}%`}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                    ATS Ready
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-2">Overall structural &amp; content audit</p>
              </div>

              {/* KPI 2: ATS Parsing Rate */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm transition-all hover:border-[#2563EB]/30">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-caption-helper font-body-medium uppercase tracking-wider">
                    ATS Parsing Rate
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#14243B]">
                    {isLoading ? '...' : `${kpis.ats_parsing_rate ?? 95}%`}
                  </span>
                </div>
                <div className="mt-2.5 w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${kpis.ats_parsing_rate || 95}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#64748B] mt-1.5">Machine readability rate</p>
              </div>

              {/* KPI 3: Average Match Score */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm transition-all hover:border-[#2563EB]/30">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-caption-helper font-body-medium uppercase tracking-wider">
                    Avg Match Score
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">analytics</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#14243B]">
                    {isLoading ? '...' : `${kpis.average_match_score ?? 83.5}%`}
                  </span>
                  <span className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                    Scans
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-2">Across tailored JD analyses</p>
              </div>

              {/* KPI 4: Tailored Applications */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm transition-all hover:border-[#2563EB]/30">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-caption-helper font-body-medium uppercase tracking-wider">
                    Tailored Scans
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">work</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#14243B]">
                    {isLoading ? '...' : (kpis.tailored_applications_count ?? 4)}
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-2">Customized position profiles</p>
              </div>

              {/* KPI 5: Total Experience */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm transition-all hover:border-[#2563EB]/30">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-caption-helper font-body-medium uppercase tracking-wider">
                    Experience
                  </span>
                  <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#14243B]">
                    {isLoading ? '...' : `${kpis.total_experience_years ?? 3.5}y`}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">
                    Tenure
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-2">Verified professional history</p>
              </div>
            </div>

            {/* MAIN CONTENT SPLIT (8 cols left / 4 cols right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* LEFT MAIN COLUMN (Col 8) */}
              <div className="lg:col-span-8 space-y-7">
                {/* 1. PRIMARY RESUME CARD */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCE5F0] pb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="font-headline-card text-lg font-bold text-[#14243B]">
                          Primary Resume: {primaryResume.target_role || 'Senior Product Designer'}{' '}
                          {primaryResume.year ? `(${primaryResume.year})` : ''}
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] rounded">
                          Default
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#DCFCE7] text-[#15803D] rounded-full">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          <span>{primaryResume.completeness_score ?? 100}% Complete</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-[#94A3B8]">schedule</span>
                        <span>Candidate: {primaryResume.candidate_name || firstName}</span>
                        <span>&bull;</span>
                        <span>Updated {formatDate(primaryResume.last_updated_at)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleOpenPdfPreview(
                            primaryResume.resume_url,
                            `${primaryResume.target_role || 'Primary'} Resume`
                          )
                        }
                        className="h-8 px-3 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#2563EB] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Preview PDF</span>
                      </button>
                      <button
                        onClick={() =>
                          handleDownloadPdf(
                            primaryResume.resume_url,
                            `${primaryResume.candidate_name || 'Primary'}_Resume`
                          )
                        }
                        disabled={downloadingUrl === (primaryResume.resume_url || 'default')}
                        className="h-8 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                        type="button"
                      >
                        <span className={`material-symbols-outlined text-[16px] ${downloadingUrl ? 'animate-spin' : ''}`}>
                          {downloadingUrl ? 'progress_activity' : 'download'}
                        </span>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Sections Completeness Badges */}
                  <div className="my-5">
                    <div className="flex items-center justify-between text-xs font-medium text-[#64748B] mb-2.5">
                      <span className="font-semibold text-[#14243B]">Core Resume Sections Status</span>
                      <span className="text-[#15803D] font-bold">
                        {verifiedSectionsCount} of {totalSectionsCount} Sections Verified
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {[
                        { key: 'personal_info', label: 'Personal' },
                        { key: 'professional_summary', label: 'Summary' },
                        { key: 'skills', label: 'Skills' },
                        { key: 'work_experience', label: 'Experience' },
                        { key: 'projects', label: 'Projects' },
                        { key: 'education', label: 'Education' },
                      ].map((sec) => {
                        const isComplete = Boolean(sectionsStatus[sec.key])
                        return (
                          <div
                            key={sec.key}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium border ${
                              isComplete
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
                                : 'bg-[#F8FAFC] border-[#DCE5F0] text-[#64748B]'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[15px] ${
                                isComplete ? 'text-[#16A34A]' : 'text-[#94A3B8]'
                              }`}
                            >
                              {isComplete ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span className="truncate">{sec.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-[#DCE5F0] flex items-center justify-between flex-wrap gap-2 text-xs">
                    <button
                      onClick={() => onNavigate('profile-settings')}
                      className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      <span>Update Resume Details In Profile</span>
                    </button>
                    <button
                      onClick={() => onNavigate('profile-settings')}
                      className="text-[#64748B] hover:text-[#14243B] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      type="button"
                    >
                      <span>Manage Profile Settings</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* 2. SKILLS ANALYTICS & MARKET FIT */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-headline-card text-lg font-bold text-[#14243B]">
                        Skills Inventory &amp; Market Alignment
                      </h2>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {skillsAn.total_skills_count || 10} verified skills across{' '}
                        {skillsAn.populated_categories_count || 3} domain categories
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('profile-settings')}
                      className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-1"
                      type="button"
                    >
                      <span>+ Add Skills</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>

                  {/* Skills by Category Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {Object.entries(skillsByCategory).map(([category, skillsList], idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl space-y-2.5"
                      >
                        <span className="text-xs font-bold text-[#14243B] uppercase tracking-wider block">
                          {category}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(skillsList) && skillsList.length > 0 ? (
                            skillsList.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="bg-white border border-[#DCE5F0] text-[#14243B] px-2 py-0.5 rounded text-[11px] font-medium shadow-2xs"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#94A3B8]">None added</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Market Benchmark: Top Matching vs Missing Skills */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Top Matching Market Skills */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>High-Demand Market Matches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {topMarketSkills.map((sk, skIdx) => (
                          <span
                            key={skIdx}
                            className="bg-white border border-emerald-300 text-emerald-700 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                          >
                            <span>✓</span>
                            <span>{sk}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top Missing Skills for Interviews */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px]">school</span>
                        <span>Frequent Missing Interview Gaps</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {topMissingSkills.map((gap, gIdx) => (
                          <span
                            key={gIdx}
                            className="bg-white border border-amber-300 text-amber-800 px-2.5 py-1 rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                          >
                            <span>⚡</span>
                            <span>{gap}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. RECENT TAILORED APPLICATIONS LIST */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-headline-card text-lg font-bold text-[#14243B]">
                        Recent Tailored Applications &amp; Scans
                      </h2>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Total {tailoredAppsAn.total_count ?? recentApps.length} customized job applications
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('analysis-history')}
                      className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                      type="button"
                    >
                      <span>View All History</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                    </button>
                  </div>

                  {recentApps.length > 0 ? (
                    <div className="divide-y divide-[#DCE5F0]">
                      {recentApps.map((app) => {
                        const score = Number(app.match_score) || 0
                        return (
                          <div
                            key={app.id}
                            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-[#14243B]">
                                  {app.company_name || 'Target Company'}
                                </span>
                                <span className="text-xs text-[#64748B]">&bull;</span>
                                <span className="text-xs font-medium text-[#475569]">{app.job_title}</span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                    score >= 80
                                      ? 'bg-[#DCFCE7] text-[#15803D]'
                                      : score >= 65
                                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                                      : 'bg-[#FEF2F2] text-[#DC2626]'
                                  }`}
                                >
                                  {score}% Match
                                </span>
                                {app.seniority_level_jd && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                                    {app.seniority_level_jd}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#94A3B8]">
                                Analyzed on {formatDate(app.created_at)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Preview PDF */}
                              <button
                                onClick={() =>
                                  handleOpenPdfPreview(
                                    app.resume_url,
                                    `${app.company_name || 'Tailored'} Resume`
                                  )
                                }
                                className="h-8 px-2.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#2563EB] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                type="button"
                                title="Preview Tailored Resume PDF"
                              >
                                <span className="material-symbols-outlined text-[15px]">visibility</span>
                                <span>Preview</span>
                              </button>

                              {/* Download PDF */}
                              <button
                                onClick={() =>
                                  handleDownloadPdf(
                                    app.resume_url,
                                    `${app.company_name}_${app.job_title}_Tailored_Resume`
                                  )
                                }
                                className="p-1.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#2563EB] cursor-pointer transition-colors"
                                type="button"
                                title="Download Tailored Resume"
                              >
                                <span className="material-symbols-outlined text-[16px]">download</span>
                              </button>

                              {/* View Diff / Analysis */}
                              <button
                                onClick={() => {
                                  localStorage.setItem('resumint_last_job_analysis_id', app.id)
                                  localStorage.setItem('resumint_last_job_analysis', JSON.stringify(app))
                                  onNavigate('analysis-results')
                                }}
                                className="h-8 px-2.5 rounded-lg bg-[#EFF6FF] border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB] hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                type="button"
                                title="Open Full Analysis Workspace"
                              >
                                <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                                <span>View Results</span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-[#DCE5F0]">
                      No tailored applications yet. Click "Analyze Job Description" to run your first match.
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDEBAR COLUMN (Col 4) */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. ACTIONABLE AI RECOMMENDATIONS */}
                {recommendations.length > 0 && (
                  <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline-card text-base font-bold text-[#14243B] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#2563EB] text-[20px]">
                          tips_and_updates
                        </span>
                        <span>Actionable Insights</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        {recommendations[0]?.priority || 'Medium'} Priority
                      </span>
                    </div>

                    <div className="space-y-3">
                      {recommendations.map((rec, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-3.5 bg-[#EFF6FF] border-l-4 border-l-[#2563EB] border border-[#DCE5F0] rounded-r-lg space-y-2 text-xs"
                        >
                          <p className="text-[#14243B] font-medium leading-relaxed">{rec.message}</p>
                          <button
                            onClick={() => onNavigate('analyze-job')}
                            className="mt-1 text-[#2563EB] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            type="button"
                          >
                            <span>Open Interview Preparation</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MATCH DISTRIBUTION PILLARS */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="font-headline-card text-base font-bold text-[#14243B]">
                    Match Distribution
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#15803D] font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>High Fit (80%+)</span>
                        </span>
                        <span className="font-bold text-[#14243B]">
                          {tailoredAppsAn.match_distribution?.high_match_80_plus ?? 3} scans
                        </span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{
                            width: `${
                              ((tailoredAppsAn.match_distribution?.high_match_80_plus || 3) /
                                (tailoredAppsAn.total_count || 4)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#2563EB] font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                          <span>Moderate Fit (60-79%)</span>
                        </span>
                        <span className="font-bold text-[#14243B]">
                          {tailoredAppsAn.match_distribution?.moderate_match_60_to_79 ?? 1} scans
                        </span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2563EB] h-full rounded-full"
                          style={{
                            width: `${
                              ((tailoredAppsAn.match_distribution?.moderate_match_60_to_79 || 1) /
                                (tailoredAppsAn.total_count || 4)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#DC2626] font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          <span>Needs Tailoring (&lt;60%)</span>
                        </span>
                        <span className="font-bold text-[#14243B]">
                          {tailoredAppsAn.match_distribution?.low_match_below_60 ?? 0} scans
                        </span>
                      </div>
                      <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{
                            width: `${
                              ((tailoredAppsAn.match_distribution?.low_match_below_60 || 0) /
                                (tailoredAppsAn.total_count || 4)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. QUICK ACTIONS SHORTCUTS */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 shadow-sm space-y-3">
                  <h3 className="font-headline-card text-base font-bold text-[#14243B]">
                    Quick Actions
                  </h3>

                  <button
                    onClick={() => onNavigate('analyze-job')}
                    className="w-full text-left group block p-3 rounded-lg border border-[#DCE5F0] hover:border-[#2563EB]/40 bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">post_add</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#14243B] group-hover:text-[#2563EB] transition-colors">
                          Analyze New Job Description
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate">
                          Paste JD and match resume instantly
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#94A3B8] text-[16px] group-hover:translate-x-0.5 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('profile-settings')}
                    className="w-full text-left group block p-3 rounded-lg border border-[#DCE5F0] hover:border-[#2563EB]/40 bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">account_circle</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#14243B] group-hover:text-[#2563EB] transition-colors">
                          Update Resume Details (Profile)
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate">
                          Edit summary, skills, experience, projects &amp; education
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#94A3B8] text-[16px] group-hover:translate-x-0.5 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => onNavigate('analysis-history')}
                    className="w-full text-left group block p-3 rounded-lg border border-[#DCE5F0] hover:border-[#2563EB]/40 bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#14243B] group-hover:text-[#2563EB] transition-colors">
                          View Scans History
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate">
                          Review previous job matches and verdicts
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#94A3B8] text-[16px] group-hover:translate-x-0.5 transition-transform">
                        chevron_right
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
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

      {/* RESUME PREVIEW MODAL */}
      <ResumePreviewModal
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false)
          setPreviewPdfUrl(null)
        }}
        resumeData={{ fullName: previewTitle }}
        pdfUrl={previewPdfUrl}
        onDownload={() => handleDownloadPdf(previewPdfUrl, previewTitle)}
        isDownloading={Boolean(downloadingUrl)}
      />
    </div>
  )
}
