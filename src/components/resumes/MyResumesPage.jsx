import { useState } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'

export default function MyResumesPage({ onNavigate, onLogout }) {
  const [selectedPreview, setSelectedPreview] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('')

  const [resumes, setResumes] = useState([
    {
      id: 1,
      title: 'Senior Product Designer 2024',
      badge: 'Primary Resume',
      badgeType: 'primary',
      score: 94,
      targetRole: 'Staff / Senior Product Design',
      updated: '2 hours ago',
      skills: ['Figma', 'Design Systems', 'Enterprise SaaS', 'Generative UX', 'Information Architecture'],
      completeness: '100% Complete',
    },
    {
      id: 2,
      title: 'Staff UX Architect — FinTech',
      badge: 'Tailored for Stripe',
      badgeType: 'tailored',
      score: 88,
      targetRole: 'FinTech Platform Systems',
      updated: '2 days ago',
      skills: ['Systems Architecture', 'Telemetry', 'Mixpanel', 'OKR Alignment', 'Team Mentorship'],
      completeness: '95% Complete',
    },
  ])

  const handleDuplicate = (resume) => {
    const dup = {
      ...resume,
      id: resume.id + '_' + resumes.length,
      title: `${resume.title} (Copy)`,
      badge: 'Draft',
      badgeType: 'draft',
      updated: 'Just now',
    }
    setResumes([...resumes, dup])
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      setResumes(resumes.filter((r) => r.id !== id))
    }
  }

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default antialiased flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <AppSidebar currentView="my-resumes" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOPBAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* CONTENT */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F5F8FC]">
          {/* Header Banner */}
          <section className="bg-white border-b border-[#DCE5F0] px-8 py-5 shrink-0">
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
                    RESUME MANAGEMENT • WORKSPACE ARCHIVE
                  </span>
                </div>
                <h1 className="font-headline-page text-[28px] md:text-headline-page font-bold text-[#14243B] tracking-tight">
                  My Resumes
                </h1>
                <p className="font-body-default text-[#64748B]">
                  Manage, customize, and audit your ATS-optimized professional resumes.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Opening file selector for PDF or DOCX resume import...')}
                  className="h-11 px-4 bg-white hover:bg-[#F8FAFC] text-[#102544] border border-[#DCE5F0] hover:border-[#CBD5E1] rounded-lg font-body-semibold text-body-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px] text-[#64748B]">upload_file</span>
                  <span>Import Existing (.docx, .pdf)</span>
                </button>
                <button
                  onClick={() => onNavigate('editor')}
                  className="h-11 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white rounded-lg font-body-semibold text-body-semibold flex items-center gap-2 transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>Create New Resume</span>
                </button>
              </div>
            </div>
          </section>

          {/* Body Canvas */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            <div className="max-w-[1440px] mx-auto space-y-6">
              {/* Filter & Stats Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#DCE5F0] shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative w-64">
                    <span className="material-symbols-outlined text-[18px] text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Filter resumes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <span className="text-xs text-[#64748B] font-medium hidden md:inline">
                    Showing <strong className="text-[#14243B]">{resumes.length}</strong> active versions
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg border border-[#DCE5F0]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded flex items-center cursor-pointer ${
                        viewMode === 'grid' ? 'bg-white shadow-xs text-[#2563EB]' : 'text-[#64748B]'
                      }`}
                      title="Grid View"
                    >
                      <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded flex items-center cursor-pointer ${
                        viewMode === 'list' ? 'bg-white shadow-xs text-[#2563EB]' : 'text-[#64748B]'
                      }`}
                      title="List View"
                    >
                      <span className="material-symbols-outlined text-[18px]">view_list</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid Cards */}
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                }`}
              >
                {resumes
                  .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-white border border-[#DCE5F0] hover:border-[#2563EB]/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Badge & Score */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                resume.badgeType === 'primary'
                                  ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20'
                                  : 'bg-[#DCFCE7] text-[#16A34A] border border-[#16A34A]/20'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">verified</span>
                              {resume.badge}
                            </span>
                            <h3 className="font-headline-card text-lg font-bold text-[#14243B] mt-1">
                              {resume.title}
                            </h3>
                            <p className="text-xs text-[#64748B]">Target: {resume.targetRole}</p>
                          </div>

                          {/* ATS Score Ring Badge */}
                          <div className="flex flex-col items-center">
                            <div className="relative w-14 h-14 flex items-center justify-center">
                              <svg className="w-14 h-14 transform -rotate-90">
                                <circle
                                  cx="28"
                                  cy="28"
                                  fill="transparent"
                                  r="22"
                                  stroke="#E2E8F0"
                                  strokeWidth="4"
                                />
                                <circle
                                  cx="28"
                                  cy="28"
                                  fill="transparent"
                                  r="22"
                                  stroke="#2563EB"
                                  strokeDasharray="138.23"
                                  strokeDashoffset={138.23 * (1 - resume.score / 100)}
                                  strokeLinecap="round"
                                  strokeWidth="4"
                                />
                              </svg>
                              <span className="absolute font-headline-card font-bold text-xs text-[#14243B]">
                                {resume.score}%
                              </span>
                            </div>
                            <span className="text-[10px] text-[#16A34A] font-semibold mt-0.5">
                              ATS Verified
                            </span>
                          </div>
                        </div>

                        {/* Skill Tags */}
                        <div className="flex flex-wrap gap-1.5 my-4">
                          {resume.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#F1F5F9] text-[#14243B] text-[11px] font-medium border border-[#E2E8F0]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-4 border-t border-[#DCE5F0] flex flex-wrap items-center justify-between gap-2 mt-4">
                        <div className="text-xs text-[#64748B] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          <span>Updated {resume.updated}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPreview(resume)}
                            className="h-8 px-3 rounded-lg border border-[#DCE5F0] hover:bg-[#F8FAFC] text-[#14243B] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span>Quick View</span>
                          </button>
                          <button
                            onClick={() => onNavigate('editor')}
                            className="h-8 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDuplicate(resume)}
                            className="p-1.5 text-[#64748B] hover:text-[#14243B] rounded hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                            title="Duplicate"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>
                          <button
                            onClick={() => handleDelete(resume.id)}
                            className="p-1.5 text-[#64748B] hover:text-[#DC2626] rounded hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* QUICK PREVIEW MODAL */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 bg-[#102544]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#DCE5F0] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-3">
              <div>
                <h3 className="font-headline-card text-lg font-bold text-[#14243B]">
                  {selectedPreview.title}
                </h3>
                <span className="text-xs text-[#2563EB] font-semibold">
                  ATS Score: {selectedPreview.score}% • Verified Layout
                </span>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="text-[#64748B] hover:text-[#14243B] p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* A4 Sheet Simulation */}
            <div className="p-6 bg-white border border-[#DCE5F0] rounded-xl shadow-inner text-xs space-y-4">
              <div className="text-center border-b border-[#E2E8F0] pb-3">
                <h2 className="text-xl font-bold text-[#102544]">Alex Morgan</h2>
                <p className="text-sm font-semibold text-[#2563EB]">{selectedPreview.targetRole}</p>
                <p className="text-[11px] text-[#64748B] mt-1">
                  San Francisco, CA • alex.morgan@design.io • +1 (555) 234-5678 • portfolio.alexmorgan.design
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#102544] uppercase tracking-wider text-[11px] border-b pb-1">
                  Executive Summary
                </h4>
                <p className="text-[#475569] mt-1.5 leading-relaxed">
                  High-impact design leader with 10+ years architecting enterprise systems, multi-device experiences, and design systems for global SaaS platforms. Expert in 0-to-1 product strategy, generative UX workflows, and data-driven engagement.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#102544] uppercase tracking-wider text-[11px] border-b pb-1">
                  Core Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedPreview.skills.map((s, idx) => (
                    <span key={idx} className="bg-[#F1F5F9] text-[#102544] px-2 py-0.5 rounded text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPreview(null)}
                className="h-10 px-4 rounded-lg border border-[#DCE5F0] hover:bg-[#F8FAFC] text-[#14243B] text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPreview(null)
                  onNavigate('editor')
                }}
                className="h-10 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
              >
                Open in Full Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
