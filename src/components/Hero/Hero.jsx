import ResumePreviewCard from './ResumePreviewCard'
import MatchScoreOverlay from './MatchScoreOverlay'

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-28 overflow-hidden bg-[#F5F8FC]">
      {/* Soft Ambient Aura */}
      <div className="absolute top-10 right-1/4 w-[280px] md:w-[500px] h-[280px] md:h-[500px] bg-[#EFF6FF] rounded-full blur-3xl pointer-events-none -z-10 opacity-70"></div>
      <div className="absolute bottom-10 left-10 w-[200px] md:w-[350px] h-[200px] md:h-[350px] bg-secondary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-5 sm:space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-primary-container/20 text-primary-container max-w-full">
              <span
                className="material-symbols-outlined text-[16px] shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span className="font-badge-label text-[10px] sm:text-badge-label uppercase tracking-wider font-semibold truncate">
                AI-POWERED CAREER INTELLIGENCE
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-headline-page text-[28px] sm:text-headline-page md:text-[44px] leading-tight md:leading-[52px] text-[#14243B] font-extrabold tracking-tight">
              Build a Smarter Resume.<br className="hidden sm:inline" />{' '}
              <span className="text-primary-container">Get Hired Faster.</span>
            </h1>

            {/* Supporting Description */}
            <p className="font-body-large text-sm sm:text-body-large text-[#64748B] max-w-xl leading-relaxed">
              Create a professional resume, check its quality, and discover how well it matches your target job description. Powered by computational career intelligence.
            </p>

            {/* Dual CTA Cluster */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto pt-2">
              <button
                onClick={onGetStarted}
                className="h-[44px] px-6 bg-primary-container hover:bg-[#1D4ED8] text-white font-body-semibold text-body-semibold rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                type="button"
              >
                <span>Get Started Free</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button
                onClick={onGetStarted}
                className="h-[44px] px-6 bg-white hover:bg-slate-50 text-[#102544] border border-[#DCE5F0] font-body-semibold text-body-semibold rounded-lg custom-shadow-ambient transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-primary-container">document_scanner</span>
                <span>Analyze a Job Description</span>
              </button>
            </div>

            {/* Value Chips */}
            <div className="pt-4 flex flex-wrap items-center gap-2.5 sm:gap-4 border-t border-[#DCE5F0] w-full">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-body-medium font-body-medium text-[#102544]">
                <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary-container text-[14px] font-bold">check</span>
                </div>
                <span>ATS-Friendly Resumes</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-body-medium font-body-medium text-[#102544]">
                <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary-container text-[14px] font-bold">check</span>
                </div>
                <span>Job Match Analysis</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-body-medium font-body-medium text-[#102544]">
                <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary-container text-[14px] font-bold">check</span>
                </div>
                <span>Personalized Suggestions</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: High-Fidelity Resume & Real-Time Job Match Overlay */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0 w-full max-w-full">
            {/* Soft Layered Glow Backdrop */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#EFF6FF] to-blue-50/30 rounded-2xl filter blur-xl opacity-80 -z-10"></div>
            <ResumePreviewCard />
            <MatchScoreOverlay />
          </div>
        </div>
      </div>
    </section>
  )
}
