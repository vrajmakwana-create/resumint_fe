import StepCard from './StepCard'

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-[#F5F8FC]" id="how-it-works">
      <div className="max-w-[1440px] mx-auto px-space-lg md:px-margin">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="font-headline-section text-headline-section md:text-[32px] md:leading-[40px] text-[#14243B] font-bold">
            Three Steps to Interview Readiness
          </h2>
          <p className="font-body-large text-body-large text-[#64748B] mt-2">
            A methodical workflow designed for rapid, measurable career advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <StepCard
            number="01"
            title="Upload or Build from Scratch"
            description="Start fresh with our guided step-by-step editor or import your existing PDF/Word resume to parse your history in seconds."
            footerBadge="Supports .PDF, .DOCX, .TXT"
          />
          <StepCard
            number="02"
            title="Scan Against Target Job"
            description="Paste any job description to instantly see your compatibility score, identify missing skills, and reveal recruiter focus areas."
            footerBadge="Contextual Semantic Matching"
          />
          <StepCard
            number="03"
            title="Optimize & Export"
            description="Apply 1-click tailored suggestions and download an ATS-compliant PDF ready to submit directly through enterprise career portals."
            footerBadge="Recruiter-Standard Typography"
          />
        </div>
      </div>
    </section>
  )
}
