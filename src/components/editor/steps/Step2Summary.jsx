import { useState } from 'react'

export default function Step2Summary({ data, onChange, errors = {} }) {
  const summary = data.summary || ''
  const [isImproving, setIsImproving] = useState(false)

  const aiSuggestion =
    'Results-oriented professional with extensive experience architecting high-impact systems and driving scalable workflows. Proven track record increasing operational efficiency and delivering robust product solutions across distributed cross-functional teams.'

  const wordCount = summary.trim() ? summary.trim().split(/\s+/).filter(Boolean).length : 0
  const charCount = summary.length
  const isEligibleForAi = wordCount >= 25

  const handleImproveWithAi = () => {
    setIsImproving(true)
    setTimeout(() => {
      // Polish user's actual summary text or provide executive template
      const polished =
        summary.trim().length > 60
          ? `${summary.trim().replace(/\.+$/, '')}. Proven track record increasing operational efficiency, delivering robust architectures, and scaling high-impact workflows across cross-functional teams.`
          : aiSuggestion

      onChange('summary', polished)
      setIsImproving(false)
    }, 450)
  }

  const handleAcceptSuggestion = () => {
    onChange('summary', aiSuggestion)
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
          {isEligibleForAi ? (
            <button
              onClick={handleImproveWithAi}
              disabled={isImproving}
              className="h-9 px-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white text-[12px] font-body-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-fadeIn"
              type="button"
            >
              <span className={`material-symbols-outlined text-[16px] ${isImproving ? 'animate-spin' : ''}`}>
                {isImproving ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isImproving ? 'Improving...' : 'Improve with AI'}</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#DCE5F0] text-[11.5px] text-[#64748B]">
              <span className="material-symbols-outlined text-[14px] text-[#94A3B8]">auto_awesome</span>
              <span>Enter 25+ words to unlock AI ({wordCount}/25 words)</span>
            </div>
          )}
        </div>
      </div>

      {/* Textarea Area */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            className={`w-full min-h-[170px] p-4 bg-white border rounded-lg text-[14px] text-[#14243B] leading-relaxed placeholder-[#94A3B8] outline-none transition-all resize-y font-body-default ${
              errors.summary
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
                onClick={() => onChange('summary', '')}
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
          <div className="bg-[#EFF6FF] px-4 py-2.5 border-b border-[#2563EB]/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span className="font-body-semibold text-[13px] text-[#102544]">AI Enhancement Ready</span>
              <span className="bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                ATS Score Impact +14%
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>Tailored for Senior / Lead Roles</span>
            </div>
          </div>
          <div className="p-4 space-y-3.5">
            <p className="text-[13.5px] leading-relaxed text-[#14243B] font-body-default bg-white p-3.5 rounded-lg border border-[#DCE5F0]">
              <span className="bg-[#DCFCE7]/60 font-semibold text-[#14243B] px-1 py-0.5 rounded">
                Results-oriented professional
              </span>{' '}
              with extensive experience architecting high-impact systems and driving scalable workflows. Proven track record{' '}
              <span className="bg-[#DCFCE7]/60 font-semibold text-[#14243B] px-1 py-0.5 rounded">
                increasing operational efficiency by 34%
              </span>{' '}
              and delivering robust product architectures across distributed cross-functional teams.
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAcceptSuggestion}
                  className="h-9 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-body-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Accept Suggestion</span>
                </button>
              </div>
              <button
                onClick={handleImproveWithAi}
                className="h-9 px-3 rounded-lg text-[#2563EB] hover:bg-[#EFF6FF] text-[12px] font-body-semibold flex items-center gap-1 transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px]">refresh</span>
                <span>Regenerate alternative</span>
              </button>
            </div>
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
