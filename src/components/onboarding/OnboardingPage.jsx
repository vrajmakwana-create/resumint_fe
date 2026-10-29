import { useState, useRef } from 'react'
import { resumeApi, parseExtractedResumeData } from '../../services/api'

export default function OnboardingPage({ onStartScratch, onUploadResume, onSignOut }) {
  const [uploadState, setUploadState] = useState('ready') // 'ready' | 'processing' | 'extracted'
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const [extractedCounts, setExtractedCounts] = useState({
    skills: 0,
    experience: 0,
    education: 0,
  })

  const fileInputRef = useRef(null)

  const processUpload = async (file) => {
    if (!file) return
    setUploadState('processing')
    setUploadProgress(25)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      setUploadProgress(50)
      const response = await resumeApi.uploadResume(formData)
      setUploadProgress(85)

      const extractedData = response?.data?.extracted_data || response?.extracted_data
      const parsed = parseExtractedResumeData(extractedData)

      if (parsed) {
        localStorage.setItem('resumint_extracted_resume', JSON.stringify(parsed))
        setExtractedCounts({
          skills: parsed.skills?.length || 0,
          experience: parsed.experience?.length || 0,
          education: parsed.education?.length || 0,
        })
      }

      setUploadProgress(100)
      setUploadState('extracted')
    } catch (err) {
      console.error('Resume upload error:', err)
      setUploadError(err.message || 'Failed to upload and extract resume information.')
      setUploadState('ready')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      processUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] antialiased min-h-screen flex flex-col justify-between selection:bg-[#c1d5fd] selection:text-[#041b3a]">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.docx,.doc"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* TOP BAR (Focused Setup Shell) */}
      <header className="bg-white border-b border-[#DCE5F0] h-[64px] sm:h-[72px] w-full sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-margin h-full flex items-center justify-between">
          {/* Left: Logo & Tag */}
          <div className="flex items-center gap-2 sm:gap-space-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[20px] sm:text-[24px]">task</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline-section text-base sm:text-headline-section font-bold tracking-tight text-[#102544]">
                  Resumint
                </span>
                <span className="bg-[#d6e3ff] text-[#344768] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider hidden xs:inline">
                  AI CAREER PLATFORM
                </span>
              </div>
            </div>
          </div>

          {/* Center: Setup Step Indicator Pill */}
          <div className="hidden sm:flex items-center gap-space-sm bg-[#f1f4f8] px-space-md py-1.5 rounded-full border border-[#DCE5F0]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-[#dbe1ff]" />
              <span className="w-2 h-2 rounded-full bg-[#c3c6d7]" />
            </div>
            <span className="font-body-semibold text-body-semibold text-[#181c1f]">Step 1 of 2:</span>
            <span className="font-body-medium text-body-medium text-[#434655]">Setup Method</span>
          </div>

          {/* Right: User Email / Support & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-space-md">
            <button
              onClick={() => alert('Support team is ready to help you at support@resumint.ai')}
              className="hidden md:flex items-center gap-1 text-[#434655] hover:text-[#2563EB] transition-colors font-body-medium text-body-medium cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span>Need Help?</span>
            </button>
            <div className="h-5 w-px bg-[#DCE5F0] hidden md:block" />
            <button
              onClick={onSignOut}
              className="text-[#434655] hover:text-[#ba1a1a] transition-colors font-body-medium text-body-medium text-xs px-2 py-1 cursor-pointer"
              type="button"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN ONBOARDING WORKSPACE */}
      <main className="flex-grow flex items-center justify-center py-8 sm:py-space-2xl px-4 sm:px-6 md:px-margin bg-[#F5F8FC]">
        <div className="w-full max-w-[1020px] mx-auto">
          {/* Hero Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d6e3ff] text-[#004ac6] font-badge-label text-badge-label tracking-wider uppercase mb-space-xs">
              <span className="material-symbols-outlined text-[14px]">spark</span>
              GETTING STARTED
            </div>
            <h1 className="font-headline-page text-headline-page md:text-[32px] text-[#14243B] tracking-tight mb-space-xs">
              Let's build your professional story.
            </h1>
            <p className="font-body-large text-body-large text-[#4c5f81]">
              Start with an existing resume or create one from scratch.
            </p>
          </div>

          {/* TWO SELECTION CARDS CONTAINER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl items-stretch">
            {/* CARD 1: Upload Existing Resume */}
            <div className="bg-white border border-[#DCE5F0] hover:border-[#2563EB] rounded-xl p-space-lg custom-shadow-ambient hover:custom-shadow-elevated transition-all duration-200 flex flex-col justify-between relative group">
              <div>
                {/* Header Badge & Icon Cluster */}
                <div className="flex items-center justify-between mb-space-md">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#d6e3ff] text-[#004ac6] text-[11px] font-semibold tracking-wide">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    RECOMMENDED • FASTER
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                  </div>
                </div>

                {/* Title & Pitch */}
                <h2 className="font-headline-section text-headline-section text-[#14243B] mb-space-2xs">
                  Upload Your Resume
                </h2>
                <p className="font-body-default text-body-default text-[#4c5f81] mb-space-lg">
                  Extract your existing experience, skills and education automatically.
                </p>

                {uploadError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center justify-between">
                    <span>{uploadError}</span>
                    <button
                      type="button"
                      onClick={() => setUploadError(null)}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* INTERACTIVE STATE 1: Ready / Drag-and-Drop Area */}
                {uploadState === 'ready' && (
                  <div className="block transition-all">
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="border-2 border-dashed border-[#93C5FD] bg-[#F8FAFC] hover:bg-[#EFF6FF]/40 rounded-[10px] p-space-lg text-center flex flex-col items-center justify-center min-h-[190px] transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center mb-space-xs">
                        <span className="material-symbols-outlined text-[22px]">upload_file</span>
                      </div>
                      <p className="font-body-medium text-body-medium text-[#14243B] mb-space-2xs">
                        Drag and drop your file here, or
                      </p>
                      <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="h-[44px] px-space-md rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-semibold text-body-semibold hover:bg-[#F8FAFC] active:scale-[0.98] transition-all mb-space-xs shadow-sm cursor-pointer"
                        type="button"
                      >
                        Browse Files
                      </button>
                      <span className="font-caption-helper text-caption-helper text-[#4c5f81]">
                        Supports PDF and DOCX (Max 10MB)
                      </span>
                    </div>
                  </div>
                )}

                {/* INTERACTIVE STATE 2: Uploading / Processing */}
                {uploadState === 'processing' && (
                  <div className="block transition-all">
                    <div className="border border-[#93C5FD] bg-[#EFF6FF] rounded-[10px] p-space-lg min-h-[190px] flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-space-xs">
                        <div className="flex items-center gap-space-xs">
                          <span className="material-symbols-outlined text-[#2563EB] animate-spin">
                            progress_activity
                          </span>
                          <span className="font-body-semibold text-body-semibold text-[#14243B]">
                            Extracting resume details...
                          </span>
                        </div>
                        <span className="font-body-semibold text-body-semibold text-[#2563EB]">
                          {uploadProgress}%
                        </span>
                      </div>
                      {/* Animated Progress Bar */}
                      <div className="w-full bg-[#DBEAFE] h-2 rounded-full overflow-hidden mb-space-sm">
                        <div
                          className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="font-caption-helper text-caption-helper text-[#4c5f81] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#2563EB]">psychology</span>
                        Extracting contact, skills, education, and work experience...
                      </p>
                    </div>
                  </div>
                )}

                {/* INTERACTIVE STATE 3: Extracted State */}
                {uploadState === 'extracted' && (
                  <div className="block transition-all">
                    <div className="border border-[#BBF7D0] bg-[#F0FDF4] rounded-[10px] p-space-md min-h-[190px] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-space-xs text-[#16A34A] mb-space-xs">
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                          <span className="font-body-semibold text-body-semibold">Resume extracted &amp; parsed!</span>
                        </div>
                        <p className="font-body-default text-body-default text-[#4c5f81] mb-space-sm">
                          Ready for your step-by-step review:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-white border border-[#DCE5F0] text-xs font-medium text-[#14243B]">
                            {extractedCounts.skills || 14} Core Skills
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white border border-[#DCE5F0] text-xs font-medium text-[#14243B]">
                            {extractedCounts.experience || 1} Work Positions
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white border border-[#DCE5F0] text-xs font-medium text-[#14243B]">
                            {extractedCounts.education || 1} Education Credentials
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#BBF7D0]/60">
                        <div className="text-[12px] text-[#16A34A] font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">done_all</span>
                          High fidelity match score: 98%
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadState('ready')}
                          className="text-xs text-[#64748B] hover:text-[#14243B] underline cursor-pointer"
                        >
                          Change File
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Button Action */}
              <div className="mt-space-lg pt-space-md border-t border-[#DCE5F0]">
                <button
                  onClick={() => {
                    if (uploadState === 'ready') {
                      if (fileInputRef.current) fileInputRef.current.click()
                    } else {
                      onUploadResume()
                    }
                  }}
                  className="w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold rounded-lg flex items-center justify-center gap-space-xs shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                  type="button"
                >
                  <span>{uploadState === 'extracted' ? 'Review & Save Step-by-Step' : 'Upload & Continue'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* CARD 2: Build From Scratch */}
            <div className="bg-white border border-[#DCE5F0] hover:border-[#2563EB] rounded-xl p-space-lg custom-shadow-ambient hover:custom-shadow-elevated transition-all duration-200 flex flex-col justify-between relative group">
              <div>
                {/* Header Badge & Icon Cluster */}
                <div className="flex items-center justify-between mb-space-md">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebeef2] text-[#434655] text-[11px] font-semibold tracking-wide border border-[#DCE5F0]">
                    <span className="material-symbols-outlined text-[13px]">format_list_bulleted</span>
                    STEP-BY-STEP GUIDED
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">edit_document</span>
                  </div>
                </div>

                {/* Title & Pitch */}
                <h2 className="font-headline-section text-headline-section text-[#14243B] mb-space-2xs">
                  Create From Scratch
                </h2>
                <p className="font-body-default text-body-default text-[#4c5f81] mb-space-md">
                  Enter your details through six simple guided sections.
                </p>

                {/* Feature bullets / Section checklist container */}
                <div className="bg-[#F8FAFC] border border-[#DCE5F0] rounded-[10px] p-space-md space-y-2 mb-space-md">
                  <div className="flex items-center gap-space-xs text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center text-[11px] font-bold">
                      1
                    </span>
                    <span className="font-body-medium text-body-medium text-[#14243B]">
                      Personal Information &amp; Contact
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center text-[11px] font-bold">
                      2
                    </span>
                    <span className="font-body-medium text-body-medium text-[#14243B] flex items-center gap-1">
                      Professional Summary
                      <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-semibold px-1 rounded">
                        AI assist
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center text-[11px] font-bold">
                      3
                    </span>
                    <span className="font-body-medium text-body-medium text-[#14243B]">
                      Skills &amp; Core Competencies
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center text-[11px] font-bold">
                      4
                    </span>
                    <span className="font-body-medium text-body-medium text-[#14243B]">
                      Education &amp; Certifications
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center text-[11px] font-bold">
                      5
                    </span>
                    <span className="font-body-medium text-body-medium text-[#14243B]">
                      Work Experience &amp; Impact Metrics
                    </span>
                  </div>
                  <div className="flex items-center gap-space-xs text-sm">
                    <span className="w-5 h-5 rounded-full bg-[#d6e3ff] text-[#004ac6] flex items-center justify-center text-[11px] font-bold">
                      6
                    </span>
                    <span className="font-body-medium text-body-medium text-[#14243B]">
                      Featured Projects &amp; Portfolio
                    </span>
                  </div>
                </div>

                {/* Estimated time tag */}
                <div className="flex items-center gap-1.5 text-[#4c5f81] font-caption-helper text-caption-helper">
                  <span className="material-symbols-outlined text-[16px] text-[#2563EB]">schedule</span>
                  <span>Takes ~8-10 minutes with AI recommendations</span>
                </div>
              </div>

              {/* Bottom Button Action */}
              <div className="mt-space-lg pt-space-md border-t border-[#DCE5F0]">
                <button
                  onClick={onStartScratch}
                  className="w-full h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold rounded-lg flex items-center justify-center gap-space-xs shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                  type="button"
                >
                  <span>Start Building</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* SUBTLE PRIVACY REASSURANCE */}
          <div className="mt-space-xl text-center">
            <div className="inline-flex items-center justify-center gap-2 px-space-md py-2 rounded-lg bg-[#f1f4f8] border border-[#DCE5F0] text-[#4c5f81] max-w-xl mx-auto">
              <span className="material-symbols-outlined text-[18px] text-[#16A34A] shrink-0">lock</span>
              <p className="font-caption-helper text-caption-helper text-left leading-tight">
                Your data is strictly private and encrypted with enterprise 256-bit SSL. We never sell your career information or share your resume without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER (Minimal docked for focused setup) */}
      <footer className="bg-white border-t border-[#DCE5F0] py-4">
        <div className="max-w-[1440px] mx-auto px-space-md md:px-margin flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4c5f81] font-body-default">
          <div>© 2024 Resumint AI Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-[#2563EB] transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-[#2563EB] transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-[#2563EB] transition-colors" href="#">
              Security Architecture
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
