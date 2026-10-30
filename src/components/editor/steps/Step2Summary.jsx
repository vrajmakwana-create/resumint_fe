import { useState } from 'react'
import { resumeApi } from '../../../services/api'

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'executive', label: 'Executive' },
  { id: 'technical', label: 'Technical' },
  { id: 'creative', label: 'Creative' },
]

export default function Step2Summary({ data, onChange, errors = {} }) {
  const summary = data.summary || ''
  const [isImproving, setIsImproving] = useState(false)
  const [improvedSummary, setImprovedSummary] = useState('')
  const [selectedTone, setSelectedTone] = useState('professional')
  const [apiError, setApiError] = useState(null)
  const [isAccepted, setIsAccepted] = useState(false)

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).filter(Boolean).length : 0
  const charCount = summary.length
  const isEligibleForAi = wordCount >= 25

  const handleImproveWithAi = async (toneOverride) => {
    if (!isEligibleForAi || isImproving) return

    const toneToUse = toneOverride || selectedTone
    setIsImproving(true)
    setApiError(null)

    try {
      const response = await resumeApi.improveSummary({
        tone: toneToUse,
        summary: summary.trim(),
      })

      const improved =
        response?.data?.improved_summary ||
        response?.improved_summary ||
        response?.data?.summary ||
        ''

      if (improved) {
        setImprovedSummary(improved)
      } else {
        throw new Error('No improved summary returned from server.')
      }
    } catch (err) {
      console.error('Failed to improve summary:', err)
      setApiError(err?.message || 'Failed to improve summary. Please try again.')
    } finally {
      setIsImproving(false)
    }
  }

  const handleToneChange = (toneId) => {
    setSelectedTone(toneId)
    if (isEligibleForAi) {
      handleImproveWithAi(toneId)
    }
  }

  const handleAcceptSuggestion = () => {
    if (!improvedSummary) return
    onChange('summary', improvedSummary)
    setIsAccepted(true)
    setTimeout(() => {
      setIsAccepted(false)
    }, 2500)
  }

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <label className="font-label-form text-[13px] text-[#14243B] font-semibold" htmlFor="summaryText">
            Executive Summary <span className="text-red-500 font-bold">*</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          {
            !isEligibleForAi && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#DCE5F0] text-[11.5px] text-[#64748B]">
                <span className="material-symbols-outlined text-[14px] text-[#94A3B8]">auto_awesome</span>
                <span>Enter 25+ words to unlock AI ({wordCount}/25 words)</span>
              </div>
            )
          }
        </div>
      </div>

      {/* Textarea Area */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            className={`w-full min-h-[170px] p-4 bg-white border rounded-lg text-[14px] text-[#14243B] leading-relaxed placeholder-[#94A3B8] outline-none transition-all resize-y font-body-default ${errors.summary
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
            id="summaryText"
            rows="5"
            placeholder="Write a concise 3-4 sentence professional summary positioning your seniority, core expertise, and measurable achievements..."
            value={summary}
            onChange={(e) => onChange('summary', e.target.value)}
          />
        </div>

        {errors.summary && (
          <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
            <span className="material-symbols-outlined text-[15px]">error</span>
            <span>{errors.summary}</span>
          </p>
        )}

        <div className="flex items-center justify-between text-[12px] text-[#64748B] px-1">
          <div>
            <span className="font-body-medium text-[#14243B]">{wordCount} words</span> •{' '}
            <span>{charCount} / 600 characters</span>{' '}
            {wordCount >= 25 ? (
              <span className="text-[#16A34A] font-medium ml-1.5">✓ Ready for AI improvement &amp; ATS optimization</span>
            ) : wordCount > 0 ? (
              <span className="text-[#64748B] font-normal ml-1.5">({25 - wordCount} more words to unlock AI button)</span>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {summary && (
              <button
                onClick={() => {
                  onChange('summary', '')
                  setImprovedSummary('')
                  setApiError(null)
                }}
                className="text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer"
                type="button"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Enhancement Section */}
      {isEligibleForAi ? (
        <div className="rounded-xl border border-[#2563EB]/30 bg-[#F8FAFC] overflow-hidden shadow-sm animate-fadeIn">
          <div className="bg-[#EFF6FF] px-4 py-2.5 border-b border-[#2563EB]/20 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="font-body-semibold text-[13px] text-[#102544]">AI Enhancement</span>
              <span className="bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                ATS Score Impact +14%
              </span>
            </div>

            {/* Tone Selector Pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#64748B] mr-1 hidden sm:inline">Tone:</span>
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleToneChange(t.id)}
                  disabled={isImproving}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${selectedTone === t.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#64748B] border border-[#DCE5F0] hover:text-[#102544] hover:bg-[#F1F5F9]'
                    }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-3.5">
            {apiError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-[12.5px] flex items-center justify-between gap-2 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{apiError}</span>
                </div>
                <button
                  onClick={() => handleImproveWithAi()}
                  className="text-[12px] font-semibold underline hover:no-underline cursor-pointer"
                  type="button"
                >
                  Retry
                </button>
              </div>
            )}

            {isImproving ? (
              <div className="p-6 bg-white rounded-lg border border-[#DCE5F0] flex flex-col items-center justify-center gap-3 text-center animate-fadeIn">
                <div className="w-8 h-8 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                <div>
                  <p className="font-body-semibold text-[13px] text-[#102544]">
                    Optimizing your summary with AI ({selectedTone} tone)...
                  </p>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">
                    Analyzing phrasing, ATS keyword relevance, and impact metrics
                  </p>
                </div>
              </div>
            ) : improvedSummary ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="bg-white p-4 rounded-lg border border-[#2563EB]/40 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2563EB] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      AI-Improved Summary ({selectedTone})
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      {improvedSummary.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <p className="text-[13.5px] leading-relaxed text-[#14243B] font-body-default select-text">
                    {improvedSummary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <button
                    onClick={handleAcceptSuggestion}
                    className={`h-9 px-4 rounded-lg text-[12px] font-body-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${isAccepted
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white active:bg-[#1E40AF]'
                      }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isAccepted ? 'check_circle' : 'check'}
                    </span>
                    <span>{isAccepted ? 'Accepted & Applied!' : 'Accept Suggestion'}</span>
                  </button>

                  <button
                    onClick={() => handleImproveWithAi()}
                    disabled={isImproving}
                    className="h-9 px-3 rounded-lg text-[#2563EB] hover:bg-[#EFF6FF] text-[12px] font-body-semibold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">refresh</span>
                    <span>Regenerate alternative</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-lg border border-[#DCE5F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fadeIn">
                <div className="space-y-0.5">
                  <p className="font-body-semibold text-[13px] text-[#102544]">
                    Ready to enhance your summary
                  </p>
                  <p className="text-[12px] text-[#64748B]">
                    Click &quot;Improve with AI&quot; to transform your draft into a high-impact, ATS-optimized executive summary.
                  </p>
                </div>
                <button
                  onClick={() => handleImproveWithAi()}
                  disabled={isImproving}
                  className="h-9 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-body-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>Improve with AI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[13px] text-[#64748B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div>
              <p className="font-body-semibold text-[#102544] text-[13px]">AI Summary Polish</p>
              <p className="text-[12px] text-[#64748B] leading-snug">
                Write at least 25 words in your summary above to unlock customized AI improvement and tone analysis.
              </p>
            </div>
          </div>
          <div className="text-[12px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
            {wordCount} / 25 words
          </div>
        </div>
      )}

      {/* Pro Tip Card */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
        </div>
        <div className="text-[13px] space-y-1">
          <p className="font-body-semibold text-[#102544]">Pro Tip for Candidates</p>
          <p className="text-[#64748B] leading-relaxed">
            Lead with your core discipline and years of experience, highlight 1-2 signature impact metrics, and mention key domain specializations.
          </p>
        </div>
      </div>
    </div>
  )
}
