import { normalizeSkills, getTotalSkillsCount } from './skillsConfig'

export default function ResumePreviewPane({ resumeData, currentStep }) {
  const {
    fullName = '',
    first_name = '',
    last_name = '',
    profTitle = '',
    job_title = '',
    email = '',
    phone = '',
    location = '',
    city = '',
    state = '',
    country = '',
    portfolio = '',
    website = '',
    linkedin = '',
    github = '',
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
    projects = [],
  } = resumeData || {}

  const displayFullName = fullName || `${first_name} ${last_name}`.trim() || 'Alex Morgan'
  const displayLocation = location || [city, state, country].filter(Boolean).join(', ') || 'San Francisco, CA'
  const displayEmail = email || 'alex.morgan@design.io'
  const displayPhone = phone || '+1 (555) 234-5678'
  const displayWebsite = website || portfolio || ''
  const categorizedSkills = normalizeSkills(skills && (typeof skills === 'object' || Array.isArray(skills)) ? skills : tools)
  const totalSkillsCount = getTotalSkillsCount(categorizedSkills)
  const hasCategorizedSkills = totalSkillsCount > 0
  const displayExperiences = experience && experience.length > 0 ? experience : []
  const displayEducation = education && education.length > 0 ? education : []
  const displayProjects = projects && projects.length > 0 ? projects : []

  // Dynamic professional title: explicit title, or current/latest role title from experience
  const latestRole = displayExperiences.length > 0 ? (displayExperiences[0].job_title || displayExperiences[0].title || '') : ''
  const displayTitle = profTitle || job_title || latestRole || ''

  // Structured contact info and links without trailing separators
  const contactItems = [
    displayLocation && { val: displayLocation, breakAll: false },
    displayEmail && { val: displayEmail, breakAll: true },
    displayPhone && { val: displayPhone, breakAll: false },
  ].filter(Boolean)

  const linkItems = [
    displayWebsite && { val: displayWebsite },
    linkedin && { val: linkedin },
    github && { val: github },
  ].filter(Boolean)

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
            <h2 className="text-[17px] font-bold text-[#102544] tracking-tight leading-tight break-words">
              {displayFullName}
            </h2>
            {displayTitle && (
              <p className="text-[11px] font-medium text-[#2563EB] mt-0.5 break-words">
                {displayTitle}
              </p>
            )}
            <div className="text-[#64748B] text-[9.5px] mt-2 space-y-1">
              {contactItems.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-y-1">
                  {contactItems.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center">
                      {idx > 0 && <span className="mx-1.5 text-[#94A3B8]">•</span>}
                      <span className={item.breakAll ? 'break-all' : ''}>{item.val}</span>
                    </span>
                  ))}
                </div>
              )}
              {linkItems.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-y-1">
                  {linkItems.map((item, idx) => (
                    <span key={idx} className="inline-flex items-center">
                      {idx > 0 && <span className="mx-1.5 text-[#94A3B8]">•</span>}
                      <span className="text-[#2563EB] break-all">{item.val}</span>
                    </span>
                  ))}
                </div>
              )}
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
            <p className="text-[#475569] leading-relaxed text-[9px] pt-0.5 break-words whitespace-pre-line">
              {summary}
            </p>
          </div>

          {/* Section: Experience Mockup */}
          {displayExperiences.length > 0 && (
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
              {displayExperiences.map((exp, idx) => {
                const jobTitle = exp.job_title || exp.title || ''
                const companyName = exp.company_name || exp.company || ''
                const startDate = exp.start_date || exp.startDate || ''
                const isCurrent = exp.is_currently_work_here ?? exp.isCurrent
                const endDate = isCurrent ? 'Present' : exp.end_date || exp.endDate || ''

                // Extract all valid, non-empty bullet points
                const bulletList = []
                if (Array.isArray(exp.bullets)) {
                  exp.bullets.forEach((b) => {
                    if (typeof b === 'string' && b.trim()) bulletList.push(b.trim())
                  })
                }
                if (bulletList.length === 0) {
                  if (typeof exp.responsibilities === 'string' && exp.responsibilities.trim()) {
                    bulletList.push(exp.responsibilities.trim())
                  }
                  if (typeof exp.achievements === 'string' && exp.achievements.trim()) {
                    bulletList.push(exp.achievements.trim())
                  }
                }

                if (!jobTitle && !companyName) return null

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline font-semibold text-[#14243B] text-[9.5px]">
                      <span className="pr-2 break-words leading-snug">
                        {jobTitle}{jobTitle && companyName ? ' • ' : ''}{companyName}
                      </span>
                      <span className="text-[#64748B] font-normal text-[8.5px] shrink-0">
                        {startDate}{startDate && endDate ? ' — ' : ''}{endDate}
                      </span>
                    </div>
                    {bulletList.length > 0 && (
                      <ul className="list-disc list-inside text-[#475569] text-[8.5px] space-y-1 leading-relaxed">
                        {bulletList.map((b, bI) => (
                          <li key={bI} className="break-words whitespace-normal">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Section: Key Competencies by Category */}
          {hasCategorizedSkills && (
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
              <div className="space-y-1 pt-0.5">
                {Object.entries(categorizedSkills).map(([cat, list]) => {
                  if (!list || list.length === 0) return null
                  return (
                    <div key={cat} className="text-[8.5px] leading-snug break-words">
                      <span className="font-semibold text-[#14243B]">{cat}: </span>
                      <span className="text-[#475569]">{list.join(', ')}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Section: Education Mockup */}
          {displayEducation.length > 0 && (
            <div
              className={`space-y-1.5 p-2 rounded-lg transition-all ${
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
              {displayEducation.map((edu, idx) => {
                const degree = edu.degree || ''
                const school = edu.school_name || edu.school || edu.institution || ''
                const startDate = edu.start_date || edu.startDate || ''
                const endDate = edu.end_date || edu.endDate || ''
                const gpa = edu.gpa ? ` • GPA: ${edu.gpa}` : ''
                const field = edu.field_of_study || edu.field ? ` (${edu.field_of_study || edu.field})` : ''

                if (!degree && !school) return null

                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline text-[9px]">
                      <span className="font-semibold text-[#14243B] break-words pr-2 leading-snug">
                        {degree}{field}{degree && school ? ' • ' : ''}{school}{gpa}
                      </span>
                      <span className="text-[#64748B] text-[8.5px] shrink-0">
                        {startDate}{startDate && endDate ? ' — ' : ''}{endDate}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Section: Projects Mockup */}
          {displayProjects.length > 0 && (
            <div
              className={`space-y-1.5 p-2 rounded-lg transition-all ${
                currentStep === 6
                  ? 'bg-[#EFF6FF]/40 border border-[#2563EB]/30'
                  : 'hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#DCE5F0] pb-0.5">
                <div className="text-[10px] font-bold tracking-wider uppercase text-[#102544]">
                  Featured Projects
                </div>
                {currentStep === 6 && (
                  <span className="text-[8px] font-semibold text-[#2563EB] uppercase tracking-wider">
                    Active Editing
                  </span>
                )}
              </div>
              {displayProjects.map((proj, pIdx) => {
                const name = proj.name || ''
                const desc = proj.description || ''
                const url = proj.url || proj.liveUrl || proj.githubUrl || ''
                if (!name) return null

                return (
                  <div key={pIdx} className="space-y-0.5">
                    <div className="flex justify-between items-baseline font-semibold text-[#14243B] text-[9.5px]">
                      <span className="pr-2 break-words leading-snug">
                        {name}
                        {url && (
                          <span className="font-normal text-[#2563EB] text-[8.5px] ml-1 break-all">
                            ({url})
                          </span>
                        )}
                      </span>
                      {proj.status && (
                        <span className="text-[#64748B] font-normal text-[8.5px] shrink-0">
                          {proj.status}
                        </span>
                      )}
                    </div>
                    {desc && (
                      <p className="text-[#475569] text-[8.5px] leading-relaxed break-words whitespace-normal">
                        {desc}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
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
