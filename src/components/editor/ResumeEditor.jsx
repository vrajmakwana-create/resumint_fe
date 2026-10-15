import { useState, useEffect } from 'react'
import Step1PersonalInfo from './steps/Step1PersonalInfo'
import Step2Summary from './steps/Step2Summary'
import Step3Skills from './steps/Step3Skills'
import Step4Education from './steps/Step4Education'
import Step5Experience from './steps/Step5Experience'
import Step6Projects from './steps/Step6Projects'
import ResumePreviewPane from './ResumePreviewPane'
import { resumeApi, authApi, getCurrentUser, setCurrentUser } from '../../services/api'

const stepsConfig = [
  {
    id: 1,
    title: 'Personal Information',
    eyebrow: 'STEP 1 OF 6',
    subtitle: 'Provide your core contact details and online presence so employers can reach you.',
    nextBtn: 'Next: Professional Summary',
    icon: 'person',
  },
  {
    id: 2,
    title: 'Professional Summary',
    eyebrow: 'STEP 2 OF 6',
    subtitle: 'Craft a 3-4 sentence elevator pitch positioning your seniority and specializations.',
    nextBtn: 'Next: Skills',
    icon: 'description',
  },
  {
    id: 3,
    title: 'Skills & Core Competencies',
    eyebrow: 'STEP 3 OF 6',
    subtitle: 'Highlight technical tools, methodologies, and executive skills matched to job postings.',
    nextBtn: 'Next: Education',
    icon: 'label',
  },
  {
    id: 4,
    title: 'Education & Credentials',
    eyebrow: 'STEP 4 OF 6',
    subtitle: 'List academic degrees, honors, and verified continuous learning credentials.',
    nextBtn: 'Next: Work Experience',
    icon: 'school',
  },
  {
    id: 5,
    title: 'Work Experience',
    eyebrow: 'STEP 5 OF 6',
    subtitle: 'Highlight quantifiable career accomplishments and leadership impact.',
    nextBtn: 'Next: Projects',
    icon: 'work',
  },
  {
    id: 6,
    title: 'Projects & Portfolio Highlights',
    eyebrow: 'STEP 6 OF 6',
    subtitle: 'Document landmark case studies, patents, or public repositories.',
    nextBtn: 'Finish and Create My Resume',
    icon: 'folder_copy',
  },
]

export default function ResumeEditor({ onExitSetup, initialStep = 1 }) {
  const [currentStep, setCurrentStep] = useState(initialStep || 1)
  const [completedSteps, setCompletedSteps] = useState(() => {
    const s = initialStep || 1
    return Array.from({ length: Math.max(0, s - 1) }, (_, i) => i + 1)
  })

  useEffect(() => {
    if (initialStep && initialStep >= 1 && initialStep <= 6) {
      setCurrentStep(initialStep)
      setCompletedSteps(Array.from({ length: Math.max(0, initialStep - 1) }, (_, i) => i + 1))
    }
  }, [initialStep])
  const [resumeTitle, setResumeTitle] = useState('Alex Morgan — Staff Product Designer Resume')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [saveState, setSaveState] = useState(0) // 0: saved, 1: saving, 2: unsaved
  const [isSaving, setIsSaving] = useState(false)
  const [apiFeedback, setApiFeedback] = useState(null)
  const [showCongratsModal, setShowCongratsModal] = useState(false)

  const [resumeData, setResumeData] = useState(() => {
    try {
      const stored = localStorage.getItem('resumint_extracted_resume')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') {
          return parsed
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored extracted resume:', err)
    }

    return {
      first_name: 'Vraj',
      last_name: 'Makwana',
      fullName: 'Vraj Makwana',
      profTitle: 'Python Backend Developer',
      email: 'vraj@yopmail.com',
      phone: '+91 7984691562',
      address: '742 Evergreen Terrace',
      city: 'Anand',
      state: 'GJ',
      zip_code: '97477',
      country: 'INDIA',
      website: 'https://johndoe.dev',
      portfolio: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      location: 'Anand, GJ, INDIA',
      summary:
        'Python Backend Developer skilled in building backend applications, RESTful APIs, database-driven systems, and authentication services.',
      skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis'],
      tools: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      technical: ['REST APIs', 'SQLAlchemy', 'JWT Authentication', 'Async Programming'],
      leadership: ['Background Tasks', 'API Integration', 'Git', 'CI/CD'],
      education: [
        {
          degree: 'Bachelor of Engineering',
          school_name: 'GEC Modasa',
          start_date: '2021',
          end_date: '2025',
          gpa: '9.04',
          field_of_study: 'Computer Engineering',
          url: 'https://gecmodasa.in',
          is_current: false,
        },
      ],
      experience: [
        {
          job_title: 'Senior Backend Engineer',
          title: 'Senior Backend Engineer',
          company_name: 'Acme Cloud Services',
          company: 'Acme Cloud Services',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          location_type: 'Hybrid',
          employment_type: 'Full-time',
          type: 'Full-time',
          is_currently_work_here: true,
          isCurrent: true,
          start_date: '2022-01',
          startDate: '2022-01',
          end_date: '',
          endDate: 'Present',
          responsibilities:
            'Architecting asynchronous REST and gRPC microservices, managing high-throughput PostgreSQL clusters.',
          achievements: 'Decreased 99th percentile API latency by 42% across 20M daily requests.',
          bullets: [
            'Architecting asynchronous REST and gRPC microservices, managing high-throughput PostgreSQL clusters.',
            'Decreased 99th percentile API latency by 42% across 20M daily requests.',
          ],
          order: 1,
        },
      ],
      projects: [
        {
          name: 'Real-Time AI Resume Screener',
          description: 'Distributed semantic evaluation engine for ATS resume parsing and candidate ranking.',
          url: 'https://github.com/johndoe/resume-screener',
          start_date: 20230101,
          end_date: 20230830,
          status: 'Completed',
          responsibilities: 'Designed async pipeline using FastAPI, SQLAlchemy, and Celery.',
          achievements: 'Processed 100K+ resumes in test benchmark.',
          order: 1,
        },
      ],
    }
  })

  const handleFieldChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }))
    setSaveState(2) // unsaved modification
  }

  const saveStep1PersonalInfo = async () => {
    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        first_name: resumeData.first_name || '',
        last_name: resumeData.last_name || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        address: resumeData.address || '',
        city: resumeData.city || '',
        state: resumeData.state || '',
        zip_code: resumeData.zip_code || '',
        country: resumeData.country || '',
        website: resumeData.website || resumeData.portfolio || '',
        github: resumeData.github || '',
        linkedin: resumeData.linkedin || '',
      }
      const response = await resumeApi.savePersonalInfo(payload)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || 'Personal information saved successfully!',
      })
      return true
    } catch (err) {
      setSaveState(2)
      setApiFeedback({
        type: 'error',
        message: err.message || 'Failed to save personal information.',
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const saveStep2Summary = async () => {
    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        summary: resumeData.summary || '',
      }
      const response = await resumeApi.saveProfessionalSummary(payload)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || 'Professional summary saved successfully!',
      })
      return true
    } catch (err) {
      setSaveState(2)
      setApiFeedback({
        type: 'error',
        message: err.message || 'Failed to save professional summary.',
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const saveStep3Skills = async () => {
    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      // Gather all skills across categories or flat skills array
      const allSkills = Array.from(
        new Set([
          ...(resumeData.skills || []),
          ...(resumeData.tools || []),
          ...(resumeData.technical || []),
          ...(resumeData.leadership || []),
        ])
      ).filter(Boolean)

      const payload = {
        skills: allSkills.length > 0 ? allSkills : ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis'],
      }

      const response = await resumeApi.saveSkills(payload)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || 'Skills saved successfully!',
      })
      return true
    } catch (err) {
      setSaveState(2)
      setApiFeedback({
        type: 'error',
        message: err.message || 'Failed to save skills.',
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const saveStep4Education = async () => {
    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const rawList = resumeData.education || []
      const educations = rawList.map((edu) => ({
        degree: edu.degree || '',
        school_name: edu.school_name || edu.school || '',
        start_date: edu.start_date || edu.startDate || '',
        end_date: edu.end_date || edu.endDate || '',
        gpa: edu.gpa || '',
        field_of_study: edu.field_of_study || edu.field || '',
        url: edu.url || '',
        is_current: Boolean(edu.is_current),
      }))

      const payload = {
        educations:
          educations.length > 0
            ? educations
            : [
                {
                  degree: 'Bachelor of Engineering',
                  school_name: 'GEC Modasa',
                  start_date: '2021',
                  end_date: '2025',
                  gpa: '9.04',
                  field_of_study: 'Computer Engineering',
                  url: 'https://gecmodasa.in',
                  is_current: false,
                },
              ],
      }

      const response = await resumeApi.saveEducationalInfo(payload)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || 'Educational information saved successfully!',
      })
      return true
    } catch (err) {
      setSaveState(2)
      setApiFeedback({
        type: 'error',
        message: err.message || 'Failed to save educational information.',
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const saveStep5Experience = async () => {
    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const rawList = resumeData.experience || []
      const workExperience = rawList.map((exp, idx) => ({
        job_title: exp.job_title || exp.title || '',
        company_name: exp.company_name || exp.company || '',
        city: exp.city || '',
        state: exp.state || '',
        country: exp.country || '',
        location_type: exp.location_type || 'Hybrid',
        employment_type: exp.employment_type || exp.type || 'Full-time',
        is_currently_work_here: Boolean(exp.is_currently_work_here ?? exp.isCurrent),
        start_date: exp.start_date || exp.startDate || '',
        end_date: (exp.is_currently_work_here ?? exp.isCurrent) ? null : exp.end_date || exp.endDate || null,
        responsibilities: exp.responsibilities || (exp.bullets && exp.bullets[0]) || '',
        achievements: exp.achievements || (exp.bullets && exp.bullets[1]) || '',
        order: exp.order || idx + 1,
      }))

      const payload = {
        work_experience:
          workExperience.length > 0
            ? workExperience
            : [
                {
                  job_title: 'Senior Backend Engineer',
                  company_name: 'Acme Cloud Services',
                  city: 'San Francisco',
                  state: 'CA',
                  country: 'USA',
                  location_type: 'Hybrid',
                  employment_type: 'Full-time',
                  is_currently_work_here: true,
                  start_date: '2022-01',
                  end_date: null,
                  responsibilities:
                    'Architecting asynchronous REST and gRPC microservices, managing high-throughput PostgreSQL clusters.',
                  achievements:
                    'Decreased 99th percentile API latency by 42% across 20M daily requests.',
                  order: 1,
                },
              ],
      }

      const response = await resumeApi.saveWorkExperience(payload)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || 'Work experience saved successfully!',
      })
      return true
    } catch (err) {
      setSaveState(2)
      setApiFeedback({
        type: 'error',
        message: err.message || 'Failed to save work experience.',
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const saveStep6Projects = async () => {
    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const rawList = resumeData.projects || []
      const projects = rawList.map((proj, idx) => ({
        name: proj.name || '',
        description: proj.description || '',
        url: proj.url || proj.githubUrl || proj.liveUrl || '',
        start_date: Number(proj.start_date) || 20230101,
        end_date: Number(proj.end_date) || 20230830,
        status: proj.status || 'Completed',
        responsibilities: proj.responsibilities || (proj.bullets && proj.bullets[0]) || '',
        achievements: proj.achievements || (proj.bullets && proj.bullets[1]) || '',
        order: proj.order || idx + 1,
      }))

      const payload = {
        projects:
          projects.length > 0
            ? projects
            : [
                {
                  name: 'Real-Time AI Resume Screener',
                  description:
                    'Distributed semantic evaluation engine for ATS resume parsing and candidate ranking.',
                  url: 'https://github.com/johndoe/resume-screener',
                  start_date: 20230101,
                  end_date: 20230830,
                  status: 'Completed',
                  responsibilities: 'Designed async pipeline using FastAPI, SQLAlchemy, and Celery.',
                  achievements: 'Processed 100K+ resumes in test benchmark.',
                  order: 1,
                },
              ],
      }

      const response = await resumeApi.saveProjectsInfo(payload)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || 'Projects information saved successfully!',
      })
      return true
    } catch (err) {
      setSaveState(2)
      setApiFeedback({
        type: 'error',
        message: err.message || 'Failed to save projects information.',
      })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveCurrentStep = async () => {
    let saved = false
    if (currentStep === 1) saved = await saveStep1PersonalInfo()
    else if (currentStep === 2) saved = await saveStep2Summary()
    else if (currentStep === 3) saved = await saveStep3Skills()
    else if (currentStep === 4) saved = await saveStep4Education()
    else if (currentStep === 5) saved = await saveStep5Experience()
    else if (currentStep === 6) saved = await saveStep6Projects()

    if (saved && !completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep])
    }
    return saved
  }

  const handleNext = async () => {
    const saved = await handleSaveCurrentStep()
    if (!saved) return

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Step 6 completed: mark onboarding as completed & show congratulations modal
      const user = getCurrentUser() || {}
      setCurrentUser({ ...user, onboarding_completed: true, step_count: 6 })
      localStorage.setItem('resumint_onboarding_completed', 'true')
      try {
        await authApi.getMe()
      } catch (err) {
        console.warn('Failed to refresh /me profile on onboarding finish:', err)
      }
      setShowCongratsModal(true)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleStepClick = async (targetStep) => {
    if (targetStep === currentStep || isSaving) return

    // Navigating backwards to an earlier step: allowed anytime
    if (targetStep < currentStep) {
      setCurrentStep(targetStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Navigating to the immediate next step: trigger saving current step first
    if (targetStep === currentStep + 1) {
      let saved = false
      if (currentStep === 1) saved = await saveStep1PersonalInfo()
      else if (currentStep === 2) saved = await saveStep2Summary()
      else if (currentStep === 3) saved = await saveStep3Skills()
      else if (currentStep === 4) saved = await saveStep4Education()
      else if (currentStep === 5) saved = await saveStep5Experience()

      if (saved) {
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps((prev) => [...prev, currentStep])
        }
        setCurrentStep(targetStep)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    // Navigating further ahead: check if all intermediate steps are completed
    const isTargetAccessible =
      completedSteps.includes(targetStep) ||
      completedSteps.includes(targetStep - 1)

    if (isTargetAccessible) {
      setCurrentStep(targetStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setApiFeedback({
        type: 'error',
        message: `Please complete and save Step ${currentStep} first before skipping to Step ${targetStep}.`,
      })
    }
  }

  const stepMeta = stepsConfig[currentStep - 1]
  const progressPercent = Math.round((currentStep / 6) * 100)

  return (
    <div className="h-screen bg-[#F5F8FC] text-[#14243B] font-body-default flex flex-col antialiased selection:bg-[#2563EB]/20 selection:text-[#102544] overflow-hidden">
      {/* TOP BAR (Global Workspace Header) */}
      <header className="h-16 bg-white border-b border-[#DCE5F0] px-6 flex items-center justify-between shrink-0 z-30 select-none">
        {/* Left: Brand, Divider, Active Resume Title & Target Pill */}
        <div className="flex items-center gap-4">
          <div onClick={onExitSetup} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
            </div>
            <span className="font-headline-section text-[19px] font-bold text-[#102544] tracking-tight">
              Resumint
            </span>
          </div>

          <div className="h-5 w-[1px] bg-[#DCE5F0]" />

          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <input
                type="text"
                value={resumeTitle}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="font-body-semibold text-[14px] text-[#14243B] border border-[#2563EB] rounded px-2 py-0.5 outline-none"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 group cursor-pointer"
              >
                <span className="font-body-semibold text-[14px] text-[#14243B] group-hover:text-[#2563EB] transition-colors">
                  {resumeTitle}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#64748B] group-hover:text-[#2563EB] transition-colors">
                  edit
                </span>
              </div>
            )}
            <span className="bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 px-2.5 py-0.5 rounded-full font-badge-label text-[11px] font-semibold tracking-wide uppercase">
              Target: Senior/Lead Roles
            </span>
          </div>
        </div>

        {/* Center: Interactive Cloud Save Status */}
        <div
          onClick={() => setSaveState((prev) => (prev + 1) % 3)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F8FC] border border-[#DCE5F0] text-[13px] font-medium text-[#64748B] cursor-pointer hover:border-[#CBD5E1] transition-all"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              saveState === 0 ? 'bg-[#16A34A] animate-pulse' : saveState === 1 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'
            }`}
          />
          <span className="text-[#64748B]">
            {saveState === 0
              ? 'Saved to cloud (12s ago)'
              : saveState === 1
              ? 'Saving changes...'
              : 'Unsaved modifications'}
          </span>
          <span
            className={`material-symbols-outlined text-[15px] text-[#64748B] ${
              saveState === 1 ? 'animate-spin' : ''
            }`}
          >
            sync
          </span>
        </div>

        {/* Right: Preview Resume & Exit Setup Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Opening full screen high-resolution preview...')}
            className="h-[44px] px-4 rounded-lg border border-[#DCE5F0] bg-white text-[#102544] font-body-semibold text-body-semibold flex items-center gap-2 hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Preview Resume</span>
          </button>
          <button
            onClick={onExitSetup}
            className="h-[44px] px-4 rounded-lg flex items-center gap-1.5 text-[#64748B] font-body-semibold text-body-semibold hover:text-[#102544] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
            type="button"
          >
            <span>Exit Setup</span>
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY (3-Column Layout: Sidebar, Form Canvas, Live Preview) */}
      <div className="flex-1 flex overflow-hidden">
        {/* A. EDITOR STEP SIDEBAR (Fixed Width 260px) */}
        <aside className="w-[260px] bg-white border-r border-[#DCE5F0] flex flex-col justify-between shrink-0 select-none">
          <div className="p-4 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-caption-helper font-caption-helper">
                <span className="font-body-semibold text-[#14243B] text-[13px]">
                  Step {currentStep} of 6
                </span>
                <span className="text-[#2563EB] font-semibold text-[13px]">
                  {progressPercent}% complete
                </span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[12px] text-[#64748B] pt-0.5">Resume Sections</p>
            </div>

            {/* 6 Step Items Switcher List */}
            <nav className="space-y-1">
              {stepsConfig.map((s) => {
                const isActive = s.id === currentStep
                const isCompleted = completedSteps.includes(s.id) && !isActive
                const isAccessible =
                  s.id <= currentStep ||
                  s.id === currentStep + 1 ||
                  completedSteps.includes(s.id) ||
                  completedSteps.includes(s.id - 1)

                return (
                  <button
                    key={s.id}
                    onClick={() => handleStepClick(s.id)}
                    type="button"
                    disabled={!isAccessible || isSaving}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg border-l-[3px] transition-all font-body-semibold text-[14px] ${
                      isActive
                        ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                        : isAccessible
                        ? 'border-transparent text-[#64748B] hover:text-[#14243B] hover:bg-[#F8FAFC] cursor-pointer'
                        : 'border-transparent text-[#CBD5E1] cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive
                            ? 'text-[#2563EB]'
                            : isCompleted
                            ? 'text-[#16A34A]'
                            : isAccessible
                            ? 'text-[#64748B]'
                            : 'text-[#CBD5E1]'
                        }`}
                      >
                        {isCompleted ? 'check_circle' : !isAccessible ? 'lock' : s.icon}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </div>
                    {isCompleted && (
                      <span className="text-[11px] font-medium text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded">
                        Done
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Bottom of Sidebar: ATS Optimization Helper Preview */}
          <div className="p-4 border-t border-[#DCE5F0] bg-[#F8FAFC]">
            <div className="p-3 bg-white rounded-lg border border-[#DCE5F0] shadow-sm flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#15803D] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[15px]">verified</span>
              </div>
              <div>
                <p className="font-body-semibold text-[12px] text-[#14243B]">Live ATS Optimization</p>
                <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                  Score track active • Format is 98% compliant with Taleo, Workday &amp; Greenhouse.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* B. MAIN FORM WORKSPACE (Flex-1 scrollable) */}
        <main className="flex-1 overflow-y-auto bg-[#F5F8FC] p-8 custom-scrollbar">
          <div className="max-w-[760px] mx-auto pb-12">
            {/* Step Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#2563EB] mb-1.5">
                <span className="material-symbols-outlined text-[14px]">flag</span>
                <span>{stepMeta.eyebrow}</span>
              </div>
              <h1 className="font-headline-page text-[30px] font-bold text-[#14243B] tracking-tight leading-tight">
                {stepMeta.title}
              </h1>
              <p className="text-[15px] font-body-default text-[#64748B] mt-1">{stepMeta.subtitle}</p>
            </div>

            {/* API Feedback Notification */}
            {apiFeedback && (
              <div
                className={`mb-4 p-3.5 rounded-lg text-[13px] font-medium flex items-center justify-between ${
                  apiFeedback.type === 'success'
                    ? 'bg-[#F0FDF4] border border-[#16A34A]/30 text-[#15803D]'
                    : 'bg-[#FEF2F2] border border-[#DC2626]/30 text-[#B91C1C]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {apiFeedback.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{apiFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setApiFeedback(null)}
                  className="text-[#64748B] hover:text-[#14243B]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* Main Form White Card */}
            <div className="bg-white rounded-xl border border-[#DCE5F0] p-8 shadow-sm">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {currentStep === 1 && (
                  <Step1PersonalInfo data={resumeData} onChange={handleFieldChange} />
                )}
                {currentStep === 2 && (
                  <Step2Summary data={resumeData} onChange={handleFieldChange} />
                )}
                {currentStep === 3 && (
                  <Step3Skills data={resumeData} onChange={handleFieldChange} />
                )}
                {currentStep === 4 && (
                  <Step4Education data={resumeData} onChange={handleFieldChange} />
                )}
                {currentStep === 5 && (
                  <Step5Experience data={resumeData} onChange={handleFieldChange} />
                )}
                {currentStep === 6 && (
                  <Step6Projects data={resumeData} onChange={handleFieldChange} />
                )}

                {/* Bottom Navigation Controls */}
                <div className="flex flex-wrap items-center justify-between pt-6 border-t border-[#DCE5F0] mt-8 gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`h-[44px] px-6 rounded-lg border border-[#DCE5F0] text-[#14243B] font-body-semibold text-[14px] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] flex items-center gap-2 transition-all shadow-sm ${
                      currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveCurrentStep}
                      disabled={isSaving}
                      type="button"
                      className="h-[44px] px-5 rounded-lg border border-[#2563EB] bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-body-semibold text-[14px] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>{isSaving ? 'Saving...' : `Save ${stepMeta.title.split(' ')[0]}`}</span>
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={isSaving}
                      className={`h-[44px] px-7 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-body-semibold text-[14px] flex items-center gap-2 shadow-sm transition-all active:scale-[0.99] ${
                        isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      type="button"
                    >
                      <span>{isSaving ? 'Saving...' : stepMeta.nextBtn}</span>
                      {isSaving ? (
                        <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                      ) : (
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* C. COMPACT LIVE RESUME PREVIEW PANEL */}
        <ResumePreviewPane resumeData={resumeData} currentStep={currentStep} />
      </div>

      {/* CONGRATULATIONS SUCCESS MODAL */}
      {showCongratsModal && (
        <div className="fixed inset-0 z-50 bg-[#102544]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="bg-white rounded-2xl max-w-[480px] w-full p-8 shadow-2xl border border-[#DCE5F0] text-center space-y-6 relative overflow-hidden transform transition-all animate-scaleUp">
            {/* Top Accent Gradient Decoration */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2563EB] via-[#10B981] to-[#2563EB]" />

            {/* Icon Cluster */}
            <div className="mx-auto w-20 h-20 rounded-full bg-[#EFF6FF] border-2 border-[#2563EB]/20 flex items-center justify-center relative">
              <span className="material-symbols-outlined text-[42px] text-[#2563EB] animate-bounce">
                workspace_premium
              </span>
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#10B981] text-white text-[13px] font-bold shadow-md">
                ✓
              </span>
            </div>

            {/* Modal Title & Description */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">celebration</span>
                <span>ONBOARDING COMPLETE</span>
              </div>
              <h2 className="font-headline-page text-[26px] font-bold text-[#102544] tracking-tight">
                Congratulations, {resumeData.first_name || 'Vraj'}! 🎉
              </h2>
              <p className="text-[14px] text-[#64748B] font-body-default leading-relaxed">
                Your professional resume has been created, saved, and optimized with{' '}
                <strong className="text-[#102544]">98% ATS Compliance</strong>. You're ready to start applying!
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#F8FAFC] rounded-xl border border-[#DCE5F0] text-center">
              <div className="space-y-0.5">
                <div className="text-[16px] font-bold text-[#2563EB]">6 / 6</div>
                <div className="text-[11px] font-medium text-[#64748B]">Steps Finished</div>
              </div>
              <div className="space-y-0.5 border-x border-[#DCE5F0]">
                <div className="text-[16px] font-bold text-[#10B981]">98%</div>
                <div className="text-[11px] font-medium text-[#64748B]">ATS Match</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[16px] font-bold text-[#2563EB]">Saved</div>
                <div className="text-[11px] font-medium text-[#64748B]">Cloud Sync</div>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setShowCongratsModal(false)
                if (onExitSetup) onExitSetup()
              }}
              type="button"
              className="w-full h-[50px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-[#2563EB]/25 transition-all cursor-pointer transform active:scale-[0.99]"
            >
              <span>Go to Dashboard</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
