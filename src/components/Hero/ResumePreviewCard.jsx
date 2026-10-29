export default function ResumePreviewCard() {
  return (
    <div className="relative bg-white rounded-xl border border-[#DCE5F0] custom-shadow-elevated p-4 sm:p-6 md:p-8 max-w-[560px] w-full mx-auto lg:mr-0 transition-transform duration-300">
      {/* Document Header */}
      <div className="border-b border-[#DCE5F0] pb-4 sm:pb-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
          <div>
            <h2 className="font-headline-section text-lg sm:text-headline-section font-bold text-[#14243B]">
              Alex Morgan
            </h2>
            <p className="font-body-semibold text-xs sm:text-body-semibold text-primary-container mt-0.5">
              Senior Product Designer
            </p>
          </div>
          <div className="text-left sm:text-right text-[11px] font-caption-helper text-[#64748B] leading-tight space-y-0.5 break-all sm:break-normal">
            <div>San Francisco, CA</div>
            <div className="text-primary-container font-medium">alex.morgan@design.io</div>
            <div>portfolio.alexmorgan.design</div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="mt-4">
        <h3 className="text-[11px] font-bold tracking-wider text-[#102544] uppercase mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
          Professional Summary
        </h3>
        <p className="text-caption-helper font-body-default text-[#434655] leading-relaxed">
          Design leader with 7+ years architecting enterprise SaaS platforms. Led end-to-end design operations resulting in 34% increased workflow velocity, specialized in systems thinking and conversion optimization.
        </p>
      </div>

      {/* Experience Section */}
      <div className="mt-4">
        <h3 className="text-[11px] font-bold tracking-wider text-[#102544] uppercase mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
          Work Experience
        </h3>

        {/* Role 1 */}
        <div className="mb-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-2">
            <span className="font-body-semibold text-xs sm:text-body-semibold text-[#14243B]">
              Lead UX Architect • Watershed Systems
            </span>
            <span className="text-[11px] text-[#64748B] shrink-0">2021 – Present</span>
          </div>
          <ul className="mt-1 space-y-1 text-caption-helper font-body-default text-[#434655] list-disc list-inside">
            <li>Spearheaded multi-tenant cloud dashboard redesign, lifting trial-to-paid conversion by 22%.</li>
            <li>Unified 140+ legacy components into a coherent tokenized design system used across 6 squads.</li>
          </ul>
        </div>

        {/* Role 2 */}
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5 sm:gap-2">
            <span className="font-body-semibold text-xs sm:text-body-semibold text-[#14243B]">
              Senior Product Designer • Helix Fintech
            </span>
            <span className="text-[11px] text-[#64748B] shrink-0">2018 – 2021</span>
          </div>
          <ul className="mt-1 space-y-1 text-caption-helper font-body-default text-[#434655] list-disc list-inside">
            <li>Synthesized research findings across 48 customer interviews into actionable checkout improvements.</li>
          </ul>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="mt-4 pt-3 border-t border-[#DCE5F0]">
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-medium text-[#14243B]">
            Design Systems
          </span>
          <span className="px-2.5 py-1 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-medium text-[#14243B]">
            Figma &amp; Prototyping
          </span>
          <span className="px-2.5 py-1 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-medium text-[#14243B]">
            User Research
          </span>
          <span className="px-2.5 py-1 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[11px] font-medium text-[#14243B]">
            Information Architecture
          </span>
        </div>
      </div>
    </div>
  )
}
