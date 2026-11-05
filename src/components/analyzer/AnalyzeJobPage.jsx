import { useState, useRef } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import { resumeApi } from '../../services/api'
import { extractTextFromFile } from '../../utils/fileExtractor'

export default function AnalyzeJobPage({ onNavigate, onLogout, onAnalysisDone }) {
  const [inputTab, setInputTab] = useState('paste') // 'paste' | 'upload'
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedResume, setSelectedResume] = useState('primary')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [jobDesc, setJobDesc] = useState('')

  // Client-side file extraction states
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFileInfo, setUploadedFileInfo] = useState(null)
  const fileInputRef = useRef(null)

  // Process and extract text from an uploaded file (.pdf, .docx, .txt)
  const handleProcessFile = async (file) => {
    if (!file) return

    // Max 10MB validation
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 10MB limit. Please select a smaller file.')
      return
    }

    const ext = (file.name || '').split('.').pop().toLowerCase()
    if (!['pdf', 'docx', 'txt', 'md'].includes(ext)) {
      setErrorMessage(`Unsupported format (.${ext}). Please upload a .pdf, .docx, or .txt file.`)
      return
    }

    setErrorMessage(null)
    setIsExtracting(true)

    try {
      const extractedText = await extractTextFromFile(file)

      if (!extractedText || !extractedText.trim()) {
        throw new Error('No readable text could be found in the file.')
      }

      const wordCount = extractedText.trim().split(/\s+/).filter(Boolean).length

      // Set the extracted text directly into jobDesc so it gets submitted to API
      setJobDesc(extractedText)

      // Format file size
      const sizeFormatted =
        file.size < 1024 * 1024
          ? `${Math.round(file.size / 1024)} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

      setUploadedFileInfo({
        name: file.name,
        size: sizeFormatted,
        wordCount,
        ext,
      })

      // If job title is currently empty, try inferring from clean filename
      if (!jobTitle.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b(jd|job|description|spec|req|requirements)\b/gi, '')
          .trim()
        if (cleanName.length > 3 && cleanName.length < 50) {
          setJobTitle(cleanName)
        }
      }
    } catch (err) {
      console.error('File extraction error:', err)
      setErrorMessage(err.message || 'Failed to extract text from file. Please try pasting the text manually.')
    } finally {
      setIsExtracting(false)
    }
  }

  // Handle native file input selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleProcessFile(file)
    }
    // Reset input value so same file can be re-selected if desired
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleProcessFile(file)
    }
  }

  const handleRemoveUploadedFile = () => {
    setUploadedFileInfo(null)
    setJobDesc('')
    setErrorMessage(null)
  }

  const handleRunAnalysis = async () => {
    if (!jobDesc.trim()) {
      setErrorMessage('Please enter, paste, or upload a job description.')
      return
    }

    setIsAnalyzing(true)
    setErrorMessage(null)

    try {
      const payload = {
        job_title: jobTitle.trim() || 'Untitled Job',
        company_name: companyName.trim() || 'Company',
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
        <AppTopbar onNavigate={onNavigate} onLogout={onLogout} />

        {/* WORKSPACE */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
          <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Main Content Heading */}
            <div className="flex flex-col space-y-1">
              <h1 className="font-headline-page text-headline-page font-bold text-[#14243B] tracking-tight">
                Analyze Job Description
              </h1>
              <p className="font-body-large text-body-large text-[#64748B]">
                Paste the job description or upload a file (.pdf, .docx, .txt) to extract its text and see how well your resume matches the role.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-400 hover:text-red-600 text-base cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {/* Centered White Form Card */}
            <div className="bg-white border border-[#DCE5F0] rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
              {/* Input Method Tab Bar */}
              <div className="border-b border-[#DCE5F0] flex gap-8">
                <button
                  onClick={() => setInputTab('paste')}
                  className={`flex items-center gap-2 pb-3.5 text-sm transition-colors focus:outline-none cursor-pointer ${inputTab === 'paste'
                    ? 'font-body-semibold text-[#2563EB] border-b-2 border-[#2563EB]'
                    : 'font-body-medium text-[#64748B] hover:text-[#14243B]'
                    }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">content_paste</span>
                  <span>Paste Job Description</span>
                  {inputTab !== 'paste' && jobDesc.trim() && (
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" title="Content available" />
                  )}
                </button>
                <button
                  onClick={() => setInputTab('upload')}
                  className={`flex items-center gap-2 pb-3.5 text-sm transition-colors focus:outline-none cursor-pointer ${inputTab === 'upload'
                    ? 'font-body-semibold text-[#2563EB] border-b-2 border-[#2563EB]'
                    : 'font-body-medium text-[#64748B] hover:text-[#14243B]'
                    }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  <span>Upload File (.pdf, .docx, .txt)</span>
                  {uploadedFileInfo && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      Extracted
                    </span>
                  )}
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
                      placeholder="e.g. Senior Software Engineer"
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

              {/* Input Area */}
              {inputTab === 'paste' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-label-form text-label-form text-[#14243B] font-medium">
                      Job Description Text <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {uploadedFileInfo && (
                        <span className="text-xs text-[#059669] font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Extracted from {uploadedFileInfo.name}
                        </span>
                      )}
                      <span className="text-xs text-[#64748B]">
                        {jobDesc.trim() ? jobDesc.trim().split(/\s+/).filter(Boolean).length : 0} words
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={8}
                    className="w-full p-4 bg-white border border-[#DCE5F0] rounded-lg text-sm text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y leading-relaxed font-mono text-[13px]"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the full job posting requirements, role overview, and qualifications..."
                  />
                  {uploadedFileInfo && (
                    <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
                      <span>Editing this text will update the job description used for analysis.</span>
                      <button
                        type="button"
                        onClick={() => setInputTab('upload')}
                        className="text-[#2563EB] hover:underline font-medium"
                      >
                        Back to uploaded file view
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* =========================================================
                   UPLOAD TAB: Native file input + PDF / DOCX / TXT Extraction
                   ========================================================= */
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {isExtracting ? (
                    <div className="border-2 border-dashed border-[#93C5FD] bg-[#EFF6FF]/40 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] space-y-3">
                      <div className="w-12 h-12 rounded-full border-3 border-[#2563EB] border-t-transparent animate-spin flex items-center justify-center mx-auto" />
                      <div>
                        <p className="font-body-semibold text-[#14243B] text-[15px]">
                          Extracting content from file...
                        </p>
                        <p className="text-xs text-[#64748B] mt-1">
                          Parsing paragraphs, formatting, and requirements directly in your browser using PDF.js.
                        </p>
                      </div>
                    </div>
                  ) : uploadedFileInfo ? (
                    /* Extracted File Card */
                    <div className="border border-[#CBD5E1] bg-[#F8FAFC] rounded-xl p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[24px]">
                              {uploadedFileInfo.ext === 'pdf' ? 'picture_as_pdf' : 'description'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-[14px] text-[#14243B] break-all">
                                {uploadedFileInfo.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                Ready
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
                              <span>{uploadedFileInfo.size}</span>
                              <span>•</span>
                              <span className="text-[#059669] font-medium">{uploadedFileInfo.wordCount} words extracted</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F1F5F9] text-xs font-semibold text-[#14243B] transition-colors cursor-pointer"
                          >
                            Replace File
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveUploadedFile}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Text Preview Box */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#475569]">Extracted Preview:</span>
                          <button
                            type="button"
                            onClick={() => setInputTab('paste')}
                            className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
                          >
                            <span>Review &amp; Edit Full Text</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>
                        <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-lg max-h-36 overflow-y-auto text-xs text-[#334155] leading-relaxed font-mono whitespace-pre-wrap select-text">
                          {jobDesc.slice(0, 450)}
                          {jobDesc.length > 450 ? '...' : ''}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Dropzone when no file has been selected */
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition-all ${isDragging
                        ? 'border-[#2563EB] bg-[#EFF6FF]'
                        : 'border-[#93C5FD] bg-[#F8FAFC] hover:bg-[#F1F5F9]'
                        }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 shadow-xs">
                        <span className="material-symbols-outlined text-[26px]">upload_file</span>
                      </div>
                      <p className="font-body-semibold text-[#14243B] mb-1">
                        Drag and drop job specification file here
                      </p>
                      <p className="text-xs text-[#64748B] mb-4">
                        Supports PDF, Word (.docx), and TXT files up to 10MB
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
                        type="button"
                      >
                        Browse Computer
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || isExtracting || !jobDesc.trim()}
                  className="w-full h-12 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span>
                        Run AI Match Analysis
                        {jobDesc.trim() ? ` (${jobDesc.trim().split(/\s+/).filter(Boolean).length} words)` : ''}
                      </span>
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
