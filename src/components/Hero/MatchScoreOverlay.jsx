export default function MatchScoreOverlay() {
  return (
    <div className="relative sm:absolute sm:-bottom-6 sm:-right-4 md:-right-6 mt-4 sm:mt-0 bg-white rounded-xl border border-primary-container/20 custom-shadow-elevated p-4 w-full sm:w-80 backdrop-blur-md max-w-full">
      <div className="flex items-center gap-3 pb-3 border-b border-[#DCE5F0]">
        {/* Progress Ring */}
        <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            ></path>
            <path
              className="text-primary-container"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="95, 100"
              strokeLinecap="round"
              strokeWidth="3.5"
            ></path>
          </svg>
          <span className="absolute font-headline-card text-sm font-bold text-[#14243B]">
            95%
          </span>
        </div>
        <div>
          <div className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase tracking-wide">
            High Match
          </div>
          <div className="text-[12px] font-body-semibold text-[#102544] line-clamp-1 mt-0.5">
            Senior Product Designer
          </div>
          <div className="text-[11px] text-[#64748B]">Target: Stripe</div>
        </div>
      </div>

      {/* Skill Breakdown Progress Indicators */}
      <div className="mt-3 space-y-2 text-[11px]">
        <div>
          <div className="flex justify-between font-medium text-[#14243B] mb-0.5">
            <span>Design Systems</span>
            <span className="text-primary-container font-semibold">100%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between font-medium text-[#14243B] mb-0.5">
            <span>Figma &amp; Prototyping</span>
            <span className="text-primary-container font-semibold">98%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '98%' }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between font-medium text-[#14243B] mb-0.5">
            <span>User Research</span>
            <span className="text-primary-container font-semibold">92%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary-container h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
