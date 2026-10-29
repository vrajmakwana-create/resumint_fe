import { useState } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import { resumeApi } from '../../services/api'

export default function AnalyzeJobPage({ onNavigate, onLogout, onAnalysisDone }) {
  const [inputTab, setInputTab] = useState('paste') // 'paste' | 'upload'
  const [jobTitle, setJobTitle] = useState('Senior Cloud Infrastructure & Backend Architect')
  const [companyName, setCompanyName] = useState('Google')
  const [selectedResume, setSelectedResume] = useState('primary')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const [jobDesc, setJobDesc] = useState(
    'We are seeking a Senior Backend Architect with 7+ years of experience in Python, FastAPI, PostgreSQL, Kubernetes, AWS, and Docker. The ideal candidate will architect resilient cloud-native microservices, optimize data pipelines, and lead high-availability deployments.'
  )

  const handleRunAnalysis = async () => {
    if (!jobDesc.trim()) {
      setErrorMessage('Please enter or paste a job description.')
      return
    }

    setIsAnalyzing(true)
    setErrorMessage(null)

    try {
      const payload = {
        job_title: jobTitle.trim() || 'Senior Cloud Infrastructure & Backend Architect',
        company_name: companyName.trim() || 'Google',
        job_description: jobDesc.trim(),
      }

      const response = await resumeApi.analyzeJobDescription(payload)
      const analysisData = response?.data || response

      if (analysisData) {
        localStorage.setItem('resumint_last_job_analysis', JSON.stringify(analysisData))
      }

      if (onAnalysisDone) {
        onAnalysisDone(analysisData)
      } else {
        onNavigate('analysis-results')
      }
    } catch (err) {
      console.error('Failed to analyze job description:', err)
      setErrorMessage(err.message || 'Failed to analyze job description. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default antialiased flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <AppSidebar currentView="analyze-job" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F8FC]">
        {/* TOPBAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* WORKSPACE */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Main Content Heading */}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
                  ATS Optimizer
                </span>
                <span className="text-xs text-[#64748B]">Step 1 of 2</span>
              </div>
              <h1 className="font-headline-page text-headline-page font-bold text-[#14243B] tracking-tight">
                Analyze Job Description
              </h1>
              <p className="font-body-large text-body-large text-[#64748B]">
                Paste the job description or upload a file to see how well your resume matches the role.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-red-600 text-base"
                >
                  ×
                </button>
              </div>
            )}

            {/* Centered White Form Card */}
            <div className="bg-white border border-[#DCE5F0] rounded-xl shadow-sm p-8 space-y-6">
              {/* Input Method Tab Bar */}
              <div className="border-b border-[#DCE5F0] flex gap-8">
                <button
                  onClick={() => setInputTab('paste')}
                  className={`flex items-center gap-2 pb-3.5 text-sm transition-colors focus:outline-none cursor-pointer ${
                    inputTab === 'paste'
                      ? 'font-body-semibold text-[#2563EB] border-b-2 border-[#2563EB]'
                      : 'font-body-medium text-[#64748B] hover:text-[#14243B]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">content_paste</span>
                  <span>Paste Job Description</span>
                </button>
                <button
                  onClick={() => setInputTab('upload')}
                  className={`flex items-center gap-2 pb-3.5 text-sm transition-colors focus:outline-none cursor-pointer ${
                    inputTab === 'upload'
                      ? 'font-body-semibold text-[#2563EB] border-b-2 border-[#2563EB]'
                      : 'font-body-medium text-[#64748B] hover:text-[#14243B]'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  <span>Upload File (.pdf, .docx, .txt)</span>
                </button>
              </div>

              {/* Optional Metadata Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block font-label-form text-label-form text-[#14243B] font-medium">
                    Job Title <span className="text-[#64748B] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-11 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-sm text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
                      placeholder="e.g. Senior Cloud Infrastructure & Backend Architect"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-label-form text-label-form text-[#14243B] font-medium">
                    Company Name <span className="text-[#64748B] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-11 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-sm text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
                      placeholder="e.g. Google, Stripe, Linear"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Target Resume Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block font-label-form text-label-form text-[#14243B] font-medium">
                    Target Resume to Audit Against
                  </label>
                  <button
                    onClick={() => onNavigate('editor')}
                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                    type="button"
                  >
                    + Create New Version
                  </button>
                </div>
                <select
                  value={selectedResume}
                  onChange={(e) => setSelectedResume(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-sm text-[#14243B] font-body-medium focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all cursor-pointer"
                >
                  <option value="primary">
                    Primary Resume — Python Backend Developer (98% Base ATS Score)
                  </option>
                  <option value="senior">
                    Senior Cloud & Backend Architect Draft (92% Base ATS Score)
                  </option>
                </select>
              </div>

              {/* Input Area */}
              {inputTab === 'paste' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-label-form text-label-form text-[#14243B] font-medium">
                      Job Description Text <span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-[#64748B]">
                      {jobDesc.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    className="w-full p-4 bg-white border border-[#DCE5F0] rounded-lg text-sm text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y leading-relaxed"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the full job posting requirements, role overview, and qualifications..."
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#93C5FD] bg-[#F8FAFC] rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                  <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[26px]">upload_file</span>
                  </div>
                  <p className="font-body-semibold text-[#14243B] mb-1">
                    Drag and drop job specification file here
                  </p>
                  <p className="text-xs text-[#64748B] mb-4">Supports PDF, DOCX, and TXT files up to 10MB</p>
                  <button
                    onClick={() => setInputTab('paste')}
                    className="h-10 px-4 rounded-lg bg-white border border-[#DCE5F0] text-xs font-semibold text-[#14243B] hover:bg-[#F8FAFC] shadow-sm cursor-pointer"
                    type="button"
                  >
                    Browse Files
                  </button>
                </div>
              )}

              {/* Analysis Features Toggles */}
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE5F0] space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  Included in this Audit:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-medium text-[#14243B]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
                    <span>Keyword Match Ratio</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
                    <span>Seniority Gap Analysis</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-[#2563EB]" />
                    <span>Interview Preparation Guide</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className="w-full h-12 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-75"
                  type="button"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        progress_activity
                      </span>
                      <span>Auditing Resume Against Job Specification...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                      <span>Run AI Match Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
