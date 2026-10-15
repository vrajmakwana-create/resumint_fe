export default function Step2Summary({ data, onChange }) {
  const summary =
    data.summary ||
    'High-impact design leader with 10+ years architecting enterprise systems, multi-device experiences, and design systems for global SaaS platforms. Expert in 0-to-1 product strategy, generative UX workflows, and data-driven engagement with proven track record scaling design organizations.'

  const aiSuggestion =
    'Results-oriented Staff Product Designer and design leader with 10+ years scaling enterprise SaaS platforms and generative UX systems. Proven track record driving 34% increase in workflow efficiency and delivering multi-device product architectures across 14 global squads.'

  const wordCount = summary.trim().split(/\s+/).filter(Boolean).length
  const charCount = summary.length

  const handleAcceptSuggestion = () => {
    onChange('summary', aiSuggestion)
  }

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <label className="font-label-form text-[13px] text-[#14243B] font-semibold" htmlFor="summaryText">
            Executive Summary
          </label>
          <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 px-2 py-0.5 rounded-full font-badge-label text-[10px] font-semibold tracking-wide uppercase">
            Crucial ATS Section
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg px-2.5 py-1 text-[12px] text-[#14243B] gap-1.5 cursor-pointer hover:border-[#CBD5E1]">
            <span className="material-symbols-outlined text-[15px] text-[#64748B]">tune</span>
            <span className="font-medium">Tone:</span>
            <span className="font-semibold text-[#2563EB]">Executive / Leadership</span>
            <span className="material-symbols-outlined text-[14px] text-[#64748B]">expand_more</span>
          </div>
          <button
            onClick={() => handleAcceptSuggestion()}
            className="h-9 px-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-body-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Improve with AI</span>
          </button>
        </div>
      </div>

      {/* Textarea Area */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            className="w-full min-h-[170px] p-4 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] leading-relaxed placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y font-body-default"
            id="summaryText"
            rows="5"
            value={summary}
            onChange={(e) => onChange('summary', e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#64748B] px-1">
          <div>
            <span className="font-body-medium text-[#14243B]">{wordCount} words</span> •{' '}
            <span>{charCount} / 600 characters</span>{' '}
            <span className="text-[#16A34A] font-medium ml-1.5">(Optimal for ATS readability)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                onChange(
                  'summary',
                  'High-impact design leader with 10+ years architecting enterprise systems, multi-device experiences, and design systems for global SaaS platforms.'
                )
              }
              className="text-[#64748B] hover:text-[#14243B] flex items-center gap-1 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              <span>Revert to original</span>
            </button>
            <button
              onClick={() => onChange('summary', '')}
              className="text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer"
              type="button"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* AI Enhancement Ready Card */}
      <div className="rounded-xl border border-[#2563EB]/30 bg-[#F8FAFC] overflow-hidden shadow-sm">
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
              Results-oriented Staff Product Designer
            </span>{' '}
            and design leader with 10+ years scaling enterprise SaaS platforms and generative UX systems. Proven track record{' '}
            <span className="bg-[#DCFCE7]/60 font-semibold text-[#14243B] px-1 py-0.5 rounded">
              driving 34% increase in workflow efficiency
            </span>{' '}
            and delivering multi-device product architectures across 14 global squads.
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
              <button
                onClick={() => alert('Keeping current version')}
                className="h-9 px-3.5 rounded-lg bg-white border border-[#DCE5F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#14243B] text-[12px] font-body-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                type="button"
              >
                <span>Keep Original</span>
              </button>
            </div>
            <button
              onClick={() => alert('Generating fresh alternative with Gemini 1.5 Pro ATS analyzer...')}
              className="h-9 px-3 rounded-lg text-[#2563EB] hover:bg-[#EFF6FF] text-[12px] font-body-semibold flex items-center gap-1 transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[15px]">refresh</span>
              <span>Regenerate alternative</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">tips_and_updates</span>
        </div>
        <div className="text-[13px] space-y-1">
          <p className="font-body-semibold text-[#102544]">Pro Tip for Senior Candidates</p>
          <p className="text-[#64748B] leading-relaxed">
            Lead with your core discipline and years of experience, highlight 1-2 signature impact metrics (e.g., ARR driven, retention gained, efficiency improved), and mention key domain specializations.
          </p>
        </div>
      </div>
    </div>
  )
}
