import { useState, useEffect } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import { resumeApi } from '../../services/api'

export default function JobAnalysisResultsPage({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('matched') // 'matched' | 'missing' | 'interview' | 'tailored'
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    const fetchAnalysisData = async () => {
      setIsLoading(true)
      setErrorMsg(null)

      let cachedData = null
      let targetId = localStorage.getItem('resumint_last_job_analysis_id')

      try {
        const stored = localStorage.getItem('resumint_last_job_analysis')
        if (stored) {
          cachedData = JSON.parse(stored)
          if (!targetId && cachedData?.id) {
            targetId = cachedData.id
          }
        }
      } catch (err) {
        console.warn('Failed to parse cached analysis:', err)
      }

      if (targetId) {
        try {
          const response = await resumeApi.getJobDescriptionById(targetId)
          const fetchedItem = response?.data || response
          if (fetchedItem && fetchedItem.id) {
            setAnalysis(fetchedItem)
            localStorage.setItem('resumint_last_job_analysis', JSON.stringify(fetchedItem))
            setIsLoading(false)
            return
          }
        } catch (apiErr) {
          console.warn('Failed to fetch individual job description by ID:', apiErr)
          setErrorMsg(apiErr.message || 'Could not refresh latest job description analysis from server.')
        }
      }

      if (cachedData) {
        setAnalysis(cachedData)
      }
      setIsLoading(false)
    }

    fetchAnalysisData()
  }, [])

  // Default fallback matching sample response if nothing in storage
  const data = analysis || {
    id: '7d221ac1-db90-4336-accf-156f25a1eedf',
    job_title: 'Senior Cloud Infrastructure & Backend Architect',
    company_name: 'Google',
    match_score: 65,
    match_rationale:
      'The candidate has strong foundational skills in the core tech stack (Python, FastAPI, PostgreSQL, AWS, Docker), which aligns well with the technical requirements. However, the candidate lacks the architectural leadership experience and deep Kubernetes orchestration expertise required for a Senior Architect role.',
    experience_analysis: {
      jd_experience_years: 7,
      candidate_experience_years: 2,
      seniority_level_jd: 'Senior / Lead',
      seniority_level_candidate: 'Mid-Level',
      experience_gap_verdict:
        'Seniority Alert: This position requires Senior-level experience (7+ years) while your current profile reflects ~2 years. Focus heavily on demonstrating high-impact ownership, system design decisions, and cloud-native architecture in your resume bullets, and prepare to discuss complex distributed systems challenges beyond standard CRUD development.',
    },
    skills_analysis: {
      total_jd_skills_count: 10,
      matching_skills_count: 5,
      missing_skills_count: 4,
      extracted_jd_skills: [
        'Python',
        'FastAPI',
        'PostgreSQL',
        'Kubernetes',
        'AWS',
        'Docker',
        'Microservices Architecture',
        'Cloud-native Deployment',
        'Data Pipeline Optimization',
        'High-availability Systems',
      ],
      matching_skills: ['Python', 'FastAPI', 'PostgreSQL', 'AWS', 'Docker'],
      missing_skills: [
        'Kubernetes',
        'Microservices Architecture',
        'Data Pipeline Optimization',
        'High-availability Systems',
      ],
    },
    interview_preparation: [
      {
        skill: 'Kubernetes',
        priority: 'High',
        why_important:
          'Essential for managing containerized microservices at scale in a cloud-native environment.',
        key_concepts_to_revise: [
          'Pods, Deployments, and Services',
          'ConfigMaps and Secrets',
          'Horizontal Pod Autoscaling',
          'Ingress Controllers',
        ],
        likely_interview_questions: [
          'How do you manage service discovery in a Kubernetes cluster?',
          'Explain the difference between a Deployment and a StatefulSet.',
          'How would you troubleshoot a pod that is stuck in a CrashLoopBackOff state?',
        ],
      },
      {
        skill: 'Microservices Architecture',
        priority: 'High',
        why_important:
          'The role requires designing resilient, decoupled systems rather than just building monolithic APIs.',
        key_concepts_to_revise: [
          'Service Mesh (Istio/Linkerd)',
          'API Gateways',
          'Event-driven communication (Kafka/RabbitMQ)',
          'Circuit Breaker Pattern',
        ],
        likely_interview_questions: [
          'How do you handle distributed transactions across microservices?',
          'What strategies do you use for inter-service communication?',
          'How do you ensure data consistency in a microservices architecture?',
        ],
      },
      {
        skill: 'Data Pipeline Optimization',
        priority: 'Medium',
        why_important:
          'The JD emphasizes optimizing data pipelines, requiring knowledge of ETL processes and performance tuning.',
        key_concepts_to_revise: [
          'Batch vs Stream processing',
          'Database indexing strategies',
          'Query execution plans',
          'Caching layers (Redis)',
        ],
        likely_interview_questions: [
          'How do you optimize a slow-running PostgreSQL query?',
          'Describe your experience with ETL pipelines and handling large datasets.',
          'How do you handle data partitioning for high-volume tables?',
        ],
      },
    ],
    tailored_resume: {
      tailored_summary:
        'Results-driven Backend Developer with extensive experience in Python, FastAPI, and PostgreSQL, seeking to leverage expertise in cloud-native development as a Senior Cloud Infrastructure & Backend Architect. Proven track record in designing scalable APIs, implementing asynchronous task processing, and optimizing database performance. Committed to building resilient, high-availability microservices and leveraging AWS and Docker to drive robust infrastructure solutions.',
      tailored_skills: [
        'Python',
        'FastAPI',
        'PostgreSQL',
        'AWS',
        'Docker',
        'Kubernetes',
        'Microservices',
        'System Design',
        'CI/CD',
        'Async Programming',
        'SQLAlchemy',
        'Redis',
        'REST APIs',
      ],
      professional_summary_id: 'd52b7dff-823a-40d7-9100-0ccde6920033',
      skill_id: '4829ecce-46ed-4737-884f-58cb6613a591',
    },
  }

  const matchScore = data.match_score || 65
  const skillsAn = data.skills_analysis || {}
  const expAn = data.experience_analysis || {}
  const interviewPrep = data.interview_preparation || []
  const tailored = data.tailored_resume || {}

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default antialiased flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <AppSidebar currentView="analyze-job" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F8FC]">
        {/* TOPBAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* WORKSPACE */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1440px] w-full mx-auto space-y-6">
          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center justify-between">
              <span>{errorMsg} (Displaying cached preview data)</span>
              <button onClick={() => setErrorMsg(null)} className="text-amber-600 hover:text-amber-800 font-bold">
                ×
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="bg-white border border-[#DCE5F0] rounded-xl p-8 shadow-sm space-y-6 animate-pulse">
              <div className="h-8 bg-[#F1F5F9] rounded-lg w-1/2" />
              <div className="h-4 bg-[#F8FAFC] rounded w-3/4" />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                <div className="lg:col-span-5 h-36 bg-[#F1F5F9] rounded-xl" />
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="h-24 bg-[#F8FAFC] rounded-xl" />
                  <div className="h-24 bg-[#F8FAFC] rounded-xl" />
                  <div className="h-24 bg-[#F8FAFC] rounded-xl" />
                  <div className="h-24 bg-[#F8FAFC] rounded-xl" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Breadcrumbs & Title */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('analyze-job')}
                    className="inline-flex items-center gap-1.5 text-body-medium font-body-medium text-[#4c5f81] hover:text-[#2563EB] transition-colors cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Back to Job Analyzer</span>
                  </button>

                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-1">
                  <div>
                    <h1 className="font-headline-page text-headline-page text-[#14243B] tracking-tight">
                      {data.job_title || 'Senior Cloud Infrastructure & Backend Architect'}{' '}
                      <span className="text-[#2563EB]">@ {data.company_name || 'Google'}</span>
                    </h1>
                    <p className="text-sm text-[#64748B] mt-1  leading-relaxed">
                      {data.match_rationale}
                    </p>
                  </div>


                </div>
              </div>

              {/* MAIN COMPATIBILITY SCORE CARD */}
              <section className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Radial Score Indicator */}
                  <div className="lg:col-span-5 flex flex-col sm:flex-row items-center gap-6 lg:border-r lg:border-[#DCE5F0] lg:pr-8">
                    <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" fill="transparent" r="50" stroke="#E2E8F0" strokeWidth="10" />
                        <circle
                          cx="60"
                          cy="60"
                          fill="transparent"
                          r="50"
                          stroke={matchScore >= 80 ? '#16A34A' : matchScore >= 60 ? '#2563EB' : '#DC2626'}
                          strokeDasharray="314.16"
                          strokeDashoffset={314.16 - (314.16 * matchScore) / 100}
                          strokeLinecap="round"
                          strokeWidth="10"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-headline-page text-[20px] leading-tight font-extrabold text-[#14243B] tracking-tight">
                          {matchScore}%
                        </span>
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider ${matchScore >= 80 ? 'text-[#16A34A]' : matchScore >= 60 ? 'text-[#2563EB]' : 'text-[#DC2626]'
                            }`}
                        >
                          {matchScore >= 80 ? 'Strong' : matchScore >= 60 ? 'Moderate' : 'Gap'}
                        </span>
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider ${matchScore >= 80 ? 'text-[#16A34A]' : matchScore >= 60 ? 'text-[#2563EB]' : 'text-[#DC2626]'
                            }`}
                        >
                          {matchScore >= 80 ? 'Match' : matchScore >= 60 ? 'Match' : 'Alert'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${matchScore >= 80
                          ? 'bg-[#DCFCE7] text-[#15803D]'
                          : 'bg-[#EFF6FF] text-[#2563EB]'
                          }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {matchScore >= 80 ? 'check_circle' : 'insights'}
                        </span>
                        {matchScore >= 80 ? 'High Compatibility' : 'Optimization Potential'}
                      </span>
                      <h3 className="font-headline-card text-lg font-bold text-[#14243B]">
                        {data.job_title}
                      </h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {skillsAn.matching_skills_count || 5} of {skillsAn.total_jd_skills_count || 10} required skills matched.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: 4 Pillar Metrics */}
                  <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5F0] text-center">
                      <div className="text-xl font-bold text-[#14243B]">
                        {skillsAn.matching_skills_count || 5} / {skillsAn.total_jd_skills_count || 10}
                      </div>
                      <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Matching Skills</div>
                      <div className="text-[10px] text-[#16A34A] font-medium mt-1">Core Stack Safe</div>
                    </div>

                    <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5F0] text-center">
                      <div className="text-xl font-bold text-[#DC2626]">
                        {expAn.candidate_experience_years || 2}y / {expAn.jd_experience_years || 7}y
                      </div>
                      <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Experience Gap</div>
                      <div className="text-[10px] text-[#DC2626] font-medium mt-1">Seniority Gap</div>
                    </div>

                    <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5F0] text-center">
                      <div className="text-xl font-bold text-[#2563EB]">
                        {interviewPrep.length} Topics
                      </div>
                      <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Interview Prep</div>
                      <div className="text-[10px] text-[#2563EB] font-medium mt-1">Ready to Study</div>
                    </div>

                    <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5F0] text-center">
                      <div className="text-xl font-bold text-[#16A34A]">100%</div>
                      <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">Format Pass</div>
                      <div className="text-[10px] text-[#16A34A] font-medium mt-1">ATS Compliant</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SENIORITY GAP VERDICT BANNER */}
              {expAn.experience_gap_verdict && (
                <div className="p-5 rounded-xl bg-[#FFFBEB] border border-[#FCD34D] text-[#92400E] flex items-start gap-3 shadow-sm">
                  <span className="material-symbols-outlined text-[24px] text-[#D97706] shrink-0 mt-0.5">
                    warning
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-[#78350F]">Seniority Analysis Verdict</h4>
                    <p className="text-xs text-[#92400E] leading-relaxed">{expAn.experience_gap_verdict}</p>
                  </div>
                </div>
              )}

              {/* TABS & DETAILED BREAKDOWN */}
              <section className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DCE5F0] pb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-card text-lg font-bold text-[#14243B]">
                      Detailed Analysis &amp; Action Plan
                    </h2>
                  </div>

                  {/* Tab Toggles */}
                  <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg border border-[#DCE5F0]">
                    <button
                      onClick={() => setActiveTab('matched')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${activeTab === 'matched' ? 'bg-white text-[#16A34A] shadow-xs' : 'text-[#64748B]'
                        }`}
                      type="button"
                    >
                      Matching Skills ({skillsAn.matching_skills?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('missing')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${activeTab === 'missing' ? 'bg-white text-[#DC2626] shadow-xs' : 'text-[#64748B]'
                        }`}
                      type="button"
                    >
                      Missing Skills ({skillsAn.missing_skills?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab('interview')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${activeTab === 'interview' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-[#64748B]'
                        }`}
                      type="button"
                    >
                      Interview Prep ({interviewPrep.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('tailored')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all ${activeTab === 'tailored' ? 'bg-white text-[#7C3AED] shadow-xs' : 'text-[#64748B]'
                        }`}
                      type="button"
                    >
                      AI Tailored Summary
                    </button>
                  </div>
                </div>

                {/* TAB 1: Matched Skills */}
                {activeTab === 'matched' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#64748B]">
                      Your resume explicitly matches these core competencies requested in the job description:
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {(skillsAn.matching_skills || []).map((skill, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] px-3.5 py-2 rounded-lg text-xs"
                        >
                          <span className="material-symbols-outlined text-[16px] text-[#16A34A]">check_circle</span>
                          <span className="font-bold text-[#14243B]">{skill}</span>
                          <span className="text-[10px] font-semibold text-[#15803D] bg-white px-2 py-0.5 rounded border border-[#BBF7D0]">
                            Matched
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: Missing Skills */}
                {activeTab === 'missing' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#DC2626] shrink-0 mt-0.5">
                        warning
                      </span>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-[#991B1B]">
                          Adding these missing competencies can significantly increase your ATS score
                        </p>
                        <p className="text-[#B91C1C]">
                          These skills are highlighted as crucial criteria for {data.job_title} @ {data.company_name}.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(skillsAn.missing_skills || []).map((skill, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#DC2626] text-[18px]">add_circle</span>
                            <span className="font-bold text-sm text-[#14243B]">{skill}</span>
                          </div>
                          <span className="px-2.5 py-1 bg-[#FEF2F2] text-[#DC2626] text-[11px] font-semibold rounded-full border border-[#FECACA]">
                            Missing Keyword
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: Interview Preparation */}
                {activeTab === 'interview' && (
                  <div className="space-y-6">
                    <p className="text-xs text-[#64748B]">
                      Key topics and expected technical interview questions tailored for {data.job_title}:
                    </p>

                    <div className="space-y-5">
                      {interviewPrep.map((prep, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#2563EB] text-[20px]">
                                psychology
                              </span>
                              <h3 className="font-bold text-base text-[#14243B]">{prep.skill}</h3>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${prep.priority === 'High'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}
                            >
                              {prep.priority} Priority
                            </span>
                          </div>

                          <p className="text-xs text-[#475569] leading-relaxed">
                            <strong className="text-[#14243B]">Why it matters:</strong> {prep.why_important}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            {/* Key Concepts */}
                            <div className="p-3.5 bg-white rounded-lg border border-[#DCE5F0] space-y-2">
                              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
                                Key Concepts to Revise
                              </span>
                              <ul className="list-disc list-inside text-xs text-[#475569] space-y-1">
                                {(prep.key_concepts_to_revise || []).map((concept, cIdx) => (
                                  <li key={cIdx}>{concept}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Likely Questions */}
                            <div className="p-3.5 bg-white rounded-lg border border-[#DCE5F0] space-y-2">
                              <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider block">
                                Likely Interview Questions
                              </span>
                              <ul className="list-disc list-inside text-xs text-[#475569] space-y-1">
                                {(prep.likely_interview_questions || []).map((q, qIdx) => (
                                  <li key={qIdx}>{q}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: AI Tailored Resume */}
                {activeTab === 'tailored' && (
                  <div className="space-y-5">
                    {/* <div className="p-4 bg-[#F3E8FF] border border-[#DDD6FE] rounded-xl text-[#6B21A8] flex items-start gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#7C3AED] shrink-0 mt-0.5">
                        auto_awesome
                      </span>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-[#581C87]">AI-Generated Tailored Content</p>
                        <p className="text-[#6B21A8]">
                          Use this tailored summary and optimized skill list to increase your response rate for this position.
                        </p>
                      </div>
                    </div> */}

                    {/* Tailored Summary Card */}
                    {tailored.tailored_summary && (
                      <div className="p-5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl space-y-2">
                        <h3 className="font-bold text-sm text-[#14243B]">Optimized Professional Summary</h3>
                        <p className="text-xs text-[#475569] leading-relaxed bg-white p-4 rounded-lg border border-[#DCE5F0]">
                          {tailored.tailored_summary}
                        </p>
                      </div>
                    )}

                    {/* Tailored Skills List */}
                    {tailored.tailored_skills && (
                      <div className="p-5 bg-[#F8FAFC] border border-[#DCE5F0] rounded-xl space-y-3">
                        <h3 className="font-bold text-sm text-[#14243B]">Tailored Skills &amp; Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {tailored.tailored_skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-[#2563EB]/30 text-[#2563EB] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

            </>
          )}
        </main>
      </div>
    </div>
  )
}
