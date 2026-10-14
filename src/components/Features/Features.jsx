import FeatureCard from './FeatureCard'

export default function Features() {
  return (
    <section className="py-20 bg-white border-y border-[#DCE5F0]" id="features">
      <div className="max-w-[1440px] mx-auto px-space-lg md:px-margin">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-primary-container text-badge-label font-badge-label mb-3">
            <span>CORE INTELLIGENCE</span>
          </div>
          <h2 className="font-headline-section text-headline-section md:text-[32px] md:leading-[40px] text-[#14243B] font-bold">
            Everything you need to land interviews
          </h2>
          <p className="font-body-large text-body-large text-[#64748B] mt-2">
            Engineered to bridge the gap between candidate qualifications and hiring algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="grid_view"
            title="ATS-Friendly Formatting"
            description="Built to breeze through Applicant Tracking Systems with clean, standard parsing. Prohibits non-readable columns and broken glyphs."
            footerText="Verified 99.8% Parse Rate"
            footerIcon="check_circle"
          />
          <FeatureCard
            icon="analytics"
            title="Deep Job Match Analysis"
            description="Compare your resume against exact job postings to discover missing keywords and critical skills prioritized by talent screeners."
            footerText="Real-Time Keyword Audit"
            footerIcon="insights"
          />
          <FeatureCard
            icon="edit_note"
            title="Actionable AI Suggestions"
            description="Instant sentence rewrites, active voice enhancements, and quantified impact metrics that transform passive lists into leadership proof."
            footerText="Impact Quantification"
            footerIcon="trending_up"
          />
        </div>
      </div>
    </section>
  )
}
