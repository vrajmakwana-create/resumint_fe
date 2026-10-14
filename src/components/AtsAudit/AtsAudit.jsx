import AuditShowcase from './AuditShowcase'

export default function AtsAudit() {
  return (
    <section className="py-20 md:py-28 bg-[#F5F8FC]">
      <div className="max-w-[1440px] mx-auto px-space-lg md:px-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Interactive Audit UI Showcase */}
          <AuditShowcase />

          {/* Feature Description */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-primary-container text-badge-label font-badge-label">
              <span>ALGORITHMIC CONFIDENCE</span>
            </div>
            <h2 className="font-headline-page text-headline-page text-[#14243B] font-bold tracking-tight">
              Pass the Algorithms, Impress the Recruiter
            </h2>
            <p className="font-body-large text-body-large text-[#64748B] leading-relaxed">
              Most candidates are eliminated before human eyes review their resume. Resumint's real-time parser simulates corporate ATS parsers (Workday, Greenhouse, Lever) to ensure zero drop-off.
            </p>
            <ul className="space-y-3.5 w-full">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[20px] mt-0.5">
                  check_circle
                </span>
                <span className="font-body-medium text-body-medium text-[#102544]">
                  Standardized headers recognized by all enterprise scanning engines.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[20px] mt-0.5">
                  check_circle
                </span>
                <span className="font-body-medium text-body-medium text-[#102544]">
                  Dynamic keyword injection based on specific target job postings.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-container text-[20px] mt-0.5">
                  check_circle
                </span>
                <span className="font-body-medium text-body-medium text-[#102544]">
                  Bullet point rewrite engine focused on verified quantifiable impact.
                </span>
              </li>
            </ul>
            <div className="pt-2">
              <button className="h-[44px] px-6 bg-primary-container hover:bg-[#1D4ED8] text-white font-body-semibold text-body-semibold rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98]">
                Run Free Resume Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
