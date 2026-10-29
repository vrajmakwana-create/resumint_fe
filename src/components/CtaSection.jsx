export default function CtaSection({ onGetStarted }) {
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-white border-t border-[#DCE5F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-margin">
        <div className="rounded-2xl bg-gradient-to-br from-[#102544] to-[#1E3A8A] text-white p-6 sm:p-8 md:p-16 relative overflow-hidden shadow-xl">
          {/* Ambient decorative light spot */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-primary-container/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="font-headline-page text-headline-page md:text-[38px] md:leading-[46px] font-bold text-white tracking-tight">
              Ready to Supercharge Your Job Search?
            </h2>
            <p className="font-body-large text-body-large text-slate-200 mt-4 leading-relaxed">
              Join ambitious professionals who build smarter resumes and get hired faster with Resumint's automated career intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
              <button
                onClick={onGetStarted}
                className="h-[44px] px-6 bg-primary-container hover:bg-[#1D4ED8] text-white font-body-semibold text-body-semibold rounded-lg shadow-md transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                <span>Get Started Free</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button
                onClick={onGetStarted}
                className="h-[44px] px-6 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-body-semibold text-body-semibold rounded-lg backdrop-blur-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                <span>Try Sample Analysis</span>
              </button>
            </div>

            <div className="mt-6 text-caption-helper font-caption-helper text-slate-300">
              No credit card required • Free ATS scan included • Export to PDF
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
