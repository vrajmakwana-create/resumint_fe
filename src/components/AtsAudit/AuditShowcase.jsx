export default function AuditShowcase() {
  return (
    <div className="lg:col-span-7 bg-white rounded-xl border border-[#DCE5F0] p-4 sm:p-6 md:p-8 custom-shadow-elevated w-full">
      {/* Audit Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#DCE5F0] pb-4 sm:pb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">verified</span>
            <span className="font-headline-card text-base sm:text-headline-card text-[#14243B] font-bold">
              Comprehensive ATS Audit
            </span>
          </div>
          <p className="text-caption-helper font-caption-helper text-[#64748B] mt-0.5 text-xs sm:text-sm">
            Scanned against Fortune 500 ATS benchmark engines
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-badge-label text-[10px] sm:text-badge-label font-bold">
          <span className="material-symbols-outlined text-[14px]">done_all</span>
          <span>COMPATIBLE</span>
        </div>
      </div>

      {/* Score breakdown grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 my-5 sm:my-6 text-center">
        <div className="p-2 sm:p-3 bg-slate-50 rounded-lg border border-[#DCE5F0]">
          <div className="font-headline-section text-base sm:text-headline-section font-bold text-primary-container">
            98<span className="text-[10px] sm:text-xs text-[#64748B]">/100</span>
          </div>
          <div className="text-[10px] sm:text-[12px] font-medium text-[#102544] mt-0.5 truncate">Readability</div>
        </div>
        <div className="p-2 sm:p-3 bg-slate-50 rounded-lg border border-[#DCE5F0]">
          <div className="font-headline-section text-base sm:text-headline-section font-bold text-primary-container">
            94<span className="text-[10px] sm:text-xs text-[#64748B]">/100</span>
          </div>
          <div className="text-[10px] sm:text-[12px] font-medium text-[#102544] mt-0.5 truncate">Keyword Match</div>
        </div>
        <div className="p-2 sm:p-3 bg-slate-50 rounded-lg border border-[#DCE5F0]">
          <div className="font-headline-section text-base sm:text-headline-section font-bold text-[#15803D]">
            100<span className="text-[10px] sm:text-xs text-[#64748B]">/100</span>
          </div>
          <div className="text-[10px] sm:text-[12px] font-medium text-[#102544] mt-0.5 truncate">Clean Syntax</div>
        </div>
      </div>

      {/* Before & After Diff Box */}
      <div className="space-y-3">
        <div className="text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
          Live AI Bullet Enhancement
        </div>
        {/* Original (Weak) */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-red-50/60 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded uppercase">
              Before (Passive)
            </span>
          </div>
          <p className="text-caption-helper font-body-default text-slate-700 line-through decoration-red-400 break-words">
            Responsible for managing cloud architecture updates and helping team members deliver software on time.
          </p>
        </div>
        {/* Optimized (Impactful) */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-[#EFF6FF] border border-blue-200">
          <div className="flex items-center justify-between mb-1 gap-2">
            <span className="text-[10px] font-bold text-primary-container bg-blue-100 px-1.5 py-0.5 rounded uppercase">
              Resumint AI Optimized
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-primary-container shrink-0">+38% Impact Score</span>
          </div>
          <p className="text-caption-helper font-body-default text-[#102544] font-medium break-words">
            Spearheaded{' '}
            <span className="bg-[#DCFCE7] text-[#15803D] px-1 py-0.5 rounded font-semibold">
              multi-cloud migration
            </span>{' '}
            across AWS &amp; Azure, accelerating release cycles by{' '}
            <span className="bg-[#DCFCE7] text-[#15803D] px-1 py-0.5 rounded font-semibold">
              42%
            </span>{' '}
            across 18 agile engineers.
          </p>
        </div>
      </div>
    </div>
  )
}
