export default function ResumePreviewPane({ resumeData, currentStep }) {
  const {
    fullName = 'Alex Morgan',
    profTitle = 'Staff Product Designer',
    email = 'alex.morgan@design.io',
    phone = '+1 (555) 234-5678',
    location = 'San Francisco, CA',
    portfolio = 'portfolio.alexmorgan.design',
    summary = 'High-impact design leader with 10+ years architecting enterprise systems, multi-device experiences, and design systems for global SaaS platforms. Expert in 0-to-1 product strategy, generative UX workflows, and data-driven engagement with proven track record scaling design organizations.',
    tools = ['Figma', 'Design Systems', 'Enterprise SaaS', 'Prototyping', 'Generative UX', 'Team Mentorship'],
    skills = [],
    experience = [
      {
        title: 'Principal Designer',
        company: 'Apex Systems',
        startDate: '2021',
        endDate: 'Present',
        bullets: [
          'Led 14-person product organization across design system relaunch.',
          'Increased workspace retention by 34% through workflow simplification.',
        ],
      },
      {
        title: 'Lead UX Architect',
        company: 'Linear Labs',
        startDate: '2018',
        endDate: '2021',
        bullets: ['Shipped enterprise analytics dashboard generating $18M ARR.'],
      },
    ],
    education = [
      {
        degree: 'M.S. Human-Computer Interaction',
        school: 'Stanford University',
        startDate: '2017',
        endDate: '2019',
      },
    ],
  } = resumeData

  return (
    <aside className="w-[380px] bg-white border-l border-[#DCE5F0] flex flex-col shrink-0 select-none shadow-sm h-full">
      {/* Preview Header Controls */}
      <div className="h-14 px-5 border-b border-[#DCE5F0] flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#2563EB]">developer_board</span>
          <span className="font-headline-card text-[14px] font-semibold text-[#14243B]">Live Resume Preview</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => alert('Zoom toggled (100% / 125%)')}
            className="w-8 h-8 rounded flex items-center justify-center text-[#64748B] hover:text-[#14243B] hover:bg-[#F1F4F8] transition-colors cursor-pointer"
            title="Zoom in"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px]">zoom_in</span>
          </button>
          <button
            onClick={() => alert('Exporting live preview as ATS-compliant PDF...')}
            className="h-8 px-2.5 rounded bg-[#F8FAFC] border border-[#DCE5F0] text-[12px] font-medium text-[#102544] hover:bg-[#EFF6FF] hover:border-[#2563EB]/40 flex items-center gap-1 transition-colors cursor-pointer"
            title="Export PDF"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Preview Body (Miniature Document Canvas) */}
      <div className="flex-1 p-5 overflow-y-auto bg-[#F8FAFC] flex flex-col items-center custom-scrollbar">
        {/* Scaled Mini A4 Sheet Canvas */}
        <div className="resume-paper-canvas w-full bg-white rounded-lg border border-[#DCE5F0] shadow-md p-5 text-[10px] space-y-4 font-sans select-text">
          {/* Document Header */}
          <div
            className={`border-b border-[#E2E8F0] pb-3 text-center transition-all ${
              currentStep === 1 ? 'p-1 bg-[#EFF6FF]/40 rounded' : ''
            }`}
          >
            <h2 className="text-[17px] font-bold text-[#102544] tracking-tight leading-tight">
              {fullName || 'Alex Morgan'}
            </h2>
            <p className="text-[11px] font-medium text-[#2563EB] mt-0.5">
              {profTitle || 'Staff Product Designer'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[#64748B] text-[9.5px] mt-2">
              <span>{location || 'San Francisco, CA'}</span>
              <span>•</span>
              <span>{email || 'alex.morgan@design.io'}</span>
              <span>•</span>
              <span>{phone || '+1 (555) 234-5678'}</span>
              <span>•</span>
              <span className="text-[#2563EB] truncate max-w-[120px]">
                {portfolio || 'portfolio.alexmorgan.design'}
              </span>
            </div>
          </div>

          {/* Section: Summary Mockup */}
          <div
            className={`space-y-1 p-2 rounded-lg transition-all ${
              currentStep === 2
                ? 'bg-[#EFF6FF]/40 border border-[#2563EB]/30'
                : 'hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-0.5">
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#2563EB]">
                Executive Summary
              </div>
              {currentStep === 2 && (
                <span className="text-[8px] font-semibold text-[#2563EB] uppercase tracking-wider">
                  Active Editing
                </span>
              )}
            </div>
            <p className="text-[#475569] leading-relaxed text-[9px] pt-0.5">
              {summary}
            </p>
          </div>

          {/* Section: Experience Mockup */}
          <div
            className={`space-y-2 p-2 rounded-lg transition-all ${
              currentStep === 5
                ? 'bg-[#EFF6FF]/40 border border-[#2563EB]/30'
                : 'hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-0.5">
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#102544]">
                Experience
              </div>
              {currentStep === 5 && (
                <span className="text-[8px] font-semibold text-[#2563EB] uppercase tracking-wider">
                  Active Editing
                </span>
              )}
            </div>
            {experience.slice(0, 2).map((exp, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-semibold text-[#14243B] text-[9.5px]">
                  <span>
                    {exp.title} • {exp.company}
                  </span>
                  <span className="text-[#64748B] font-normal text-[8.5px]">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-inside text-[#475569] text-[8.5px] space-y-0.5 leading-snug">
                  {(exp.bullets || []).slice(0, 2).map((b, bI) => (
                    <li key={bI} className="truncate">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Section: Key Competencies Chips */}
          <div
            className={`space-y-1.5 p-2 rounded-lg transition-all ${
              currentStep === 3
                ? 'bg-[#EFF6FF]/40 border border-[#2563EB]/30'
                : 'hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-0.5">
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#2563EB]">
                Key Competencies
              </div>
              {currentStep === 3 && (
                <span className="text-[8px] font-semibold text-[#2563EB] uppercase tracking-wider">
                  Active Editing
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {(skills.length > 0 ? skills : tools).slice(0, 10).map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="bg-[#F1F5F9] text-[#14243B] px-1.5 py-0.5 rounded text-[8px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Education Mockup */}
          <div
            className={`space-y-1 p-2 rounded-lg transition-all ${
              currentStep === 4
                ? 'bg-[#EFF6FF]/40 border border-[#2563EB]/30'
                : 'hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-0.5">
              <div className="text-[10px] font-bold tracking-wider uppercase text-[#102544]">
                Education
              </div>
              {currentStep === 4 && (
                <span className="text-[8px] font-semibold text-[#2563EB] uppercase tracking-wider">
                  Active Editing
                </span>
              )}
            </div>
            {education.slice(0, 1).map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline text-[9px]">
                <span className="font-semibold text-[#14243B]">
                  {edu.degree} • {edu.school}
                </span>
                <span className="text-[#64748B] text-[8.5px]">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating AI Recommendation Chip */}
        <div className="w-full mt-4 p-3 bg-white border border-[#DCE5F0] rounded-lg shadow-sm flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[13px]">lightbulb</span>
          </div>
          <div>
            <p className="text-[11px] font-body-semibold text-[#14243B]">Tip for Skills Optimization</p>
            <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
              Tailor 60% of listed competencies to hard skills mentioned in the job description.
            </p>
          </div>
        </div>

        {/* ATS Match Score Ring Card */}
        <div className="w-full mt-3 p-3 bg-white border border-[#DCE5F0] rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-11 h-11 transform -rotate-90">
                <circle cx="22" cy="22" fill="transparent" r="18" stroke="#E2E8F0" strokeWidth="3" />
                <circle
                  cx="22"
                  cy="22"
                  fill="transparent"
                  r="18"
                  stroke="#2563EB"
                  strokeDasharray="113.09"
                  strokeDashoffset="2.26"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span className="absolute font-headline-card font-bold text-[11px] text-[#102544]">98%</span>
            </div>
            <div>
              <div className="text-[12px] font-body-semibold text-[#102544]">ATS Pass Rate</div>
              <div className="text-[11px] text-[#16A34A] font-medium">Format 100% Safe</div>
            </div>
          </div>
          <span className="bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Verified
          </span>
        </div>
      </div>
    </aside>
  )
}
