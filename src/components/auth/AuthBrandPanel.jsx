export default function AuthBrandPanel({ onNavigateHome }) {
  return (
    <section className="hidden lg:flex lg:w-1/2 bg-[#102544] relative overflow-hidden flex-col justify-between p-space-lg lg:p-margin xl:p-space-2xl text-white order-2 lg:order-1 min-h-[560px] lg:min-h-screen">
      {/* Subtle Decorative Atmospheric Glows */}
      <div className="absolute inset-0 glow-radial pointer-events-none"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-surface-tint/25 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header / Logo */}
      <header className="relative z-10">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-space-xs group text-left cursor-pointer"
          type="button"
        >
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-white shadow-md">
            <span className="material-symbols-outlined text-[24px]">description</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <span className="font-headline-section text-headline-section font-bold tracking-tight text-white">
              Resumint
            </span>
            <span className="font-badge-label text-badge-label bg-white/10 text-primary-fixed px-2 py-0.5 rounded border border-white/10 tracking-wider">
              AI CAREER PLATFORM
            </span>
          </div>
        </button>
      </header>

      {/* Middle Showcase: Headlines & High-End Career UI Mockup */}
      <div className="relative z-10 py-space-xl flex flex-col justify-center w-full max-w-[540px] mx-auto lg:translate-x-1">
        <div className="space-y-space-xs mb-space-xl">
          <h1 className="font-display-hero text-display-hero text-white tracking-tight">
            Your Resume. Smarter.
          </h1>
          <p className="font-body-large text-body-large text-[#94A3B8]">
            Create, optimize and get matched with your dream job.
          </p>
        </div>

        {/* Career Intelligence Visual Layout (Bento / Floating Glass Panels) */}
        <div className="relative w-full max-w-[480px] mx-auto">
          {/* Background Base Resume Card */}
          <div className="bg-white/[0.07] backdrop-blur-md rounded-xl border border-white/15 p-space-md shadow-2xl relative">
            <div className="flex items-center justify-between pb-space-sm border-b border-white/10">
              <div className="flex items-center gap-space-xs">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-body-semibold text-white">
                  AM
                </div>
                <div>
                  <div className="font-body-semibold text-body-semibold text-white">Alex Morgan</div>
                  <div className="font-caption-helper text-caption-helper text-[#94A3B8]">
                    Staff Product Designer
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-badge-label text-badge-label uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ready to Apply
              </div>
            </div>

            {/* Experience Snippet with AI Diff */}
            <div className="pt-space-sm space-y-space-xs">
              <div className="flex justify-between items-center">
                <span className="font-label-form text-label-form text-[#CBD5E1]">Work History • Stripe Inc.</span>
                <span className="font-caption-helper text-caption-helper text-white/60">2021 – Present</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/25 border border-white/10 font-body-default text-[13px] leading-relaxed text-[#E2E8F0]">
                Spearheaded design system adoption across 14 teams,{' '}
                <span className="bg-emerald-500/25 text-emerald-200 px-1 py-0.5 rounded font-medium underline decoration-emerald-400">
                  reducing time-to-market by 42%
                </span>{' '}
                and boosting conversion rates.
              </div>
            </div>
          </div>

          {/* Floating ATS Match Score Widget (Top Right Overlap) */}
          <div className="absolute -top-8 -right-4 sm:-right-6 bg-white/[0.95] text-on-surface rounded-xl p-space-sm border border-[#DCE5F0] shadow-xl backdrop-blur-md flex items-center gap-space-sm transform hover:-translate-y-1 transition-transform">
            {/* Circular Progress Indicator Mini */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" fill="transparent" r="20" stroke="#E2E8F0" strokeWidth="4"></circle>
                <circle
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="#2563EB"
                  strokeDasharray="125.6"
                  strokeDashoffset="2.5"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></circle>
              </svg>
              <span className="absolute font-headline-card text-[13px] font-bold text-[#102544]">98%</span>
            </div>
            <div>
              <div className="font-body-semibold text-[13px] text-[#102544] flex items-center gap-1">
                <span>ATS Match</span>
                <span
                  className="material-symbols-outlined text-[16px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
              <div className="font-caption-helper text-[11px] text-[#64748B]">Key Skills: 14/15 Aligned</div>
            </div>
          </div>

          {/* Floating AI Bullet Enhancer Pill (Bottom Left Overlap) */}
          <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-gradient-to-r from-primary-container to-[#1D4ED8] text-white rounded-full py-2 px-3.5 shadow-lg border border-white/20 flex items-center gap-2 transform hover:-translate-y-1 transition-transform">
            <span
              className="material-symbols-outlined text-[18px] text-amber-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bolt
            </span>
            <span className="font-body-semibold text-[12px] tracking-wide">AI Bullet Enhancer:</span>
            <span className="bg-white/20 text-white font-badge-label text-[11px] px-2 py-0.5 rounded-full font-bold">
              +38% Impact
            </span>
          </div>
        </div>
      </div>

      {/* Left Panel Footer */}
      <footer className="relative z-10 pt-space-md border-t border-white/10 flex items-center gap-space-xs text-[#94A3B8]">
        <span
          className="material-symbols-outlined text-[20px] text-primary-fixed"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          lock
        </span>
        <p className="font-caption-helper text-caption-helper">
          Trusted by candidates landing offers at top tech &amp; Fortune 500 companies.
        </p>
      </footer>
    </section>
  )
}
