import { useState, useEffect, useRef } from 'react'
import Step1PersonalInfo from './steps/Step1PersonalInfo'
import Step2Summary from './steps/Step2Summary'
import Step3Skills from './steps/Step3Skills'
import Step4Education from './steps/Step4Education'
import Step5Experience from './steps/Step5Experience'
import Step6Projects from './steps/Step6Projects'
import ResumePreviewPane from './ResumePreviewPane'
import ThemeToggle from '../common/ThemeToggle'
import { resumeApi, authApi, getCurrentUser, setCurrentUser } from '../../services/api'
import { normalizeSkills, getTotalSkillsCount } from './skillsConfig'

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
  const [stepCount, setStepCount] = useState(() => {
    const user = getCurrentUser()
    const sc = user?.step_count ?? localStorage.getItem('resumint_step_count')
    return typeof sc === 'number' ? sc : Number(sc) || 0
  })

  const allowedMaxStep = Math.min(6, (stepCount || 0) + 1)

  const [currentStep, setCurrentStep] = useState(() => {
    const user = getCurrentUser()
    const sc = user?.step_count ?? localStorage.getItem('resumint_step_count')
    const calculatedAllowed = Math.min(6, (Number(sc) || 0) + 1)
    const storedStep = Number(localStorage.getItem('resumint_current_editor_step'))
    const preferred = (storedStep && storedStep >= 1 && storedStep <= 6) ? storedStep : (initialStep || 1)
    return Math.min(preferred, calculatedAllowed)
  })

  useEffect(() => {
    if (currentStep >= 1 && currentStep <= 6) {
      localStorage.setItem('resumint_current_editor_step', String(currentStep))
    }
  }, [currentStep])

  const completedSteps = Array.from({ length: Math.min(6, stepCount || 0) }, (_, i) => i + 1)

  // Sync /me on mount to get exact real-time backend step_count
  useEffect(() => {
    let isMounted = true

    const syncUserStepCount = async () => {
      try {
        const meRes = await authApi.getMe()
        const user = meRes?.data || meRes
        if (user && typeof user.step_count !== 'undefined' && isMounted) {
          const sc = typeof user.step_count === 'number' ? user.step_count : Number(user.step_count) || 0
          setStepCount(sc)
          const maxAllowed = Math.min(6, sc + 1)
          setCurrentStep((prev) => (prev > maxAllowed ? maxAllowed : prev))
        }
      } catch (err) {
        console.warn('Failed to sync user step_count from /me:', err)
      }
    }

    syncUserStepCount()

    return () => {
      isMounted = false
    }
  }, [])

  const prevInitialStepRef = useRef(initialStep)
  useEffect(() => {
    if (initialStep !== prevInitialStepRef.current && initialStep >= 1 && initialStep <= 6) {
      prevInitialStepRef.current = initialStep
      const maxAllowed = Math.min(6, (stepCount || 0) + 1)
      setCurrentStep(Math.min(initialStep, maxAllowed))
    }
  }, [initialStep, stepCount])

  const [resumeTitle, setResumeTitle] = useState('Untitled Resume')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [saveState, setSaveState] = useState(0) // 0: saved, 1: saving, 2: unsaved
  const [isSaving, setIsSaving] = useState(false)
  const [apiFeedback, setApiFeedback] = useState(null)
  const [errors, setErrors] = useState({})
  const [showCongratsModal, setShowCongratsModal] = useState(false)
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false)
  const [isMobileStepsOpen, setIsMobileStepsOpen] = useState(false)
  const [hasExistingPersonalInfo, setHasExistingPersonalInfo] = useState(false)
  const [hasExistingSummary, setHasExistingSummary] = useState(false)
  const [hasExistingSkills, setHasExistingSkills] = useState(false)
  const [hasExistingEducation, setHasExistingEducation] = useState(false)
  const [hasExistingExperience, setHasExistingExperience] = useState(false)
  const [hasExistingProjects, setHasExistingProjects] = useState(false)

  const [resumeData, setResumeData] = useState(() => {
    try {
      const draft = localStorage.getItem('resumint_resume_draft')
      if (draft) {
        const parsedDraft = JSON.parse(draft)
        if (parsedDraft && typeof parsedDraft === 'object') {
          return {
            ...parsedDraft,
            skills: normalizeSkills(parsedDraft.skills),
          }
        }
      }
      const stored = localStorage.getItem('resumint_extracted_resume')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && typeof parsed === 'object') {
          return {
            ...parsed,
            skills: normalizeSkills(parsed.skills),
          }
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored resume data:', err)
    }

    return {
      first_name: '',
      last_name: '',
      fullName: '',
      profTitle: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      website: '',
      portfolio: '',
      linkedin: '',
      github: '',
      location: '',
      summary: '',
      skills: normalizeSkills(null),
      tools: [],
      technical: [],
      leadership: [],
      education: [],
      experience: [],
      projects: [],
      noExperience: false,
      noProjects: false,
    }
  })

  const handleFieldChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }))
    setSaveState(2) // unsaved modification

    // Clear corresponding error(s) in real time
    setErrors((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev
      const newErr = { ...prev }
      delete newErr[field]

      if (field === 'education') {
        Object.keys(newErr).forEach((k) => {
          if (k.startsWith('edu_')) delete newErr[k]
        })
        delete newErr.education
      }
      if (field === 'experience' || field === 'noExperience') {
        Object.keys(newErr).forEach((k) => {
          if (k.startsWith('exp_')) delete newErr[k]
        })
        delete newErr.experience
      }
      if (field === 'projects' || field === 'noProjects') {
        Object.keys(newErr).forEach((k) => {
          if (k.startsWith('proj_')) delete newErr[k]
        })
        delete newErr.projects
      }
      if (field === 'tools' || field === 'technical' || field === 'leadership' || field === 'skills') {
        delete newErr.skills
      }
      return newErr
    })
  }

  // Keep local draft in sync with latest resumeData so page refresh never loses in-progress form edits
  useEffect(() => {
    try {
      localStorage.setItem('resumint_resume_draft', JSON.stringify(resumeData))
    } catch (err) {
      console.warn('Failed to save draft to localStorage:', err)
    }
  }, [resumeData])

  // Fetch already filled data from backend on mount and arrange into form state
  useEffect(() => {
    let isMounted = true

    const fetchExistingSections = async () => {
      try {
        const [personalRes, summaryRes, skillsRes, eduRes, expRes, projRes] = await Promise.allSettled([
          resumeApi.getPersonalInfo(),
          resumeApi.getProfessionalSummary(),
          resumeApi.getSkills(),
          resumeApi.getEducationalInfo(),
          resumeApi.getWorkExperience(),
          resumeApi.getProjectsInfo(),
        ])

        if (!isMounted) return

        if (personalRes.status === 'fulfilled' && personalRes.value) {
          const pi = personalRes.value?.data || personalRes.value
          if (pi && typeof pi === 'object') {
            const hasData = Boolean(
              pi.first_name || pi.last_name || pi.email || pi.address || pi.city || pi.country || pi.linkedin
            )
            if (hasData) {
              setResumeData((prev) => ({
                ...prev,
                first_name: pi.first_name || prev.first_name || '',
                last_name: pi.last_name || prev.last_name || '',
                fullName: `${pi.first_name || prev.first_name || ''} ${pi.last_name || prev.last_name || ''}`.trim(),
                email: pi.email || prev.email || '',
                phone: pi.phone || prev.phone || '',
                address: pi.address || prev.address || '',
                city: pi.city || prev.city || '',
                state: pi.state || prev.state || '',
                zip_code: pi.zip_code || prev.zip_code || '',
                country: pi.country || prev.country || '',
                website: pi.website || prev.website || '',
                portfolio: pi.website || prev.portfolio || '',
                linkedin: pi.linkedin || prev.linkedin || '',
                github: pi.github || prev.github || '',
                location: [pi.city || prev.city, pi.state || prev.state, pi.country || prev.country].filter(Boolean).join(', '),
              }))
              setHasExistingPersonalInfo(true)
            }
          }
        }

        if (summaryRes.status === 'fulfilled' && summaryRes.value) {
          const ps = summaryRes.value?.data || summaryRes.value
          if (ps && ps.summary) {
            setResumeData((prev) => ({
              ...prev,
              summary: ps.summary || prev.summary || '',
            }))
            setHasExistingSummary(true)
          }
        }

        if (skillsRes.status === 'fulfilled' && skillsRes.value) {
          const sData = skillsRes.value?.data || skillsRes.value
          const rawSkills = sData?.skills || sData?.data?.skills || sData?.data || sData
          const normalized = normalizeSkills(rawSkills)
          const totalCount = getTotalSkillsCount(normalized)

          if (totalCount > 0) {
            setResumeData((prev) => ({
              ...prev,
              skills: normalized,
            }))
            setHasExistingSkills(true)
          }
        }

        if (eduRes.status === 'fulfilled' && eduRes.value) {
          const eData = eduRes.value?.data || eduRes.value
          let rawEducations = []
          if (Array.isArray(eData)) {
            rawEducations = eData
          } else if (Array.isArray(eData?.educations)) {
            rawEducations = eData.educations
          } else if (Array.isArray(eData?.data?.educations)) {
            rawEducations = eData.data.educations
          } else if (Array.isArray(eData?.data)) {
            rawEducations = eData.data
          }

          if (rawEducations.length > 0) {
            const mappedEducations = rawEducations.map((edu) => ({
              degree: edu.degree || '',
              school_name: edu.school_name || edu.school || edu.institution || '',
              school: edu.school_name || edu.school || edu.institution || '',
              field_of_study: edu.field_of_study || edu.field || '',
              field: edu.field_of_study || edu.field || '',
              start_date: edu.start_date != null ? String(edu.start_date) : '',
              startDate: edu.start_date != null ? String(edu.start_date) : '',
              end_date: edu.end_date != null ? String(edu.end_date) : '',
              endDate: edu.end_date != null ? String(edu.end_date) : '',
              gpa: edu.gpa != null ? String(edu.gpa) : '',
              url: edu.url || '',
              is_current: Boolean(edu.is_current),
            }))

            const hasValidEdu = mappedEducations.some((e) => e.degree.trim() || e.school_name.trim())
            if (hasValidEdu) {
              setResumeData((prev) => ({
                ...prev,
                education: mappedEducations,
              }))
              setHasExistingEducation(true)
            }
          }
        }

        if (expRes.status === 'fulfilled' && expRes.value) {
          const expData = expRes.value?.data || expRes.value
          let rawExperiences = []
          if (Array.isArray(expData)) {
            rawExperiences = expData
          } else if (Array.isArray(expData?.work_experience)) {
            rawExperiences = expData.work_experience
          } else if (Array.isArray(expData?.data?.work_experience)) {
            rawExperiences = expData.data.work_experience
          } else if (Array.isArray(expData?.data)) {
            rawExperiences = expData.data
          }

          if (rawExperiences.length > 0) {
            const mappedExperiences = rawExperiences.map((exp, idx) => ({
              job_title: exp.job_title || exp.title || '',
              title: exp.job_title || exp.title || '',
              company_name: exp.company_name || exp.company || '',
              company: exp.company_name || exp.company || '',
              city: exp.city || '',
              state: exp.state || '',
              country: exp.country || '',
              location_type: exp.location_type || 'Hybrid',
              employment_type: exp.employment_type || exp.type || 'Full-time',
              type: exp.employment_type || exp.type || 'Full-time',
              is_currently_work_here: Boolean(exp.is_currently_work_here ?? exp.isCurrent),
              isCurrent: Boolean(exp.is_currently_work_here ?? exp.isCurrent),
              start_date: exp.start_date || exp.startDate || '',
              startDate: exp.start_date || exp.startDate || '',
              end_date: (exp.is_currently_work_here ?? exp.isCurrent) ? '' : exp.end_date || exp.endDate || '',
              endDate: (exp.is_currently_work_here ?? exp.isCurrent) ? 'Present' : exp.end_date || exp.endDate || '',
              responsibilities: exp.responsibilities || (exp.bullets && exp.bullets[0]) || '',
              achievements: exp.achievements || (exp.bullets && exp.bullets[1]) || '',
              bullets: [exp.responsibilities, exp.achievements].filter(Boolean),
              order: exp.order || idx + 1,
            }))

            const hasValidExp = mappedExperiences.some((e) => e.job_title.trim() || e.company_name.trim())
            if (hasValidExp) {
              setResumeData((prev) => ({
                ...prev,
                experience: mappedExperiences,
                noExperience: false,
              }))
              setHasExistingExperience(true)
            }
          }
        }

        if (projRes.status === 'fulfilled' && projRes.value) {
          const pData = projRes.value?.data || projRes.value
          let rawProjects = []
          if (Array.isArray(pData)) {
            rawProjects = pData
          } else if (Array.isArray(pData?.projects)) {
            rawProjects = pData.projects
          } else if (Array.isArray(pData?.data?.projects)) {
            rawProjects = pData.data.projects
          } else if (Array.isArray(pData?.data)) {
            rawProjects = pData.data
          }

          if (rawProjects.length > 0) {
            const mappedProjects = rawProjects.map((proj, idx) => ({
              name: proj.name || '',
              description: proj.description || '',
              url: proj.url || proj.githubUrl || proj.liveUrl || '',
              liveUrl: proj.url || proj.liveUrl || '',
              githubUrl: proj.url || proj.githubUrl || '',
              start_date: Number(proj.start_date) || 20230101,
              end_date: Number(proj.end_date) || 20230830,
              status: proj.status || 'Completed',
              responsibilities: proj.responsibilities || '',
              achievements: proj.achievements || '',
              order: proj.order || idx + 1,
            }))

            const hasValidProj = mappedProjects.some((p) => p.name.trim())
            if (hasValidProj) {
              setResumeData((prev) => ({
                ...prev,
                projects: mappedProjects,
                noProjects: false,
              }))
              setHasExistingProjects(true)
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching existing resume sections from backend:', err)
      }
    }

    fetchExistingSections()

    return () => {
      isMounted = false
    }
  }, [])

  // =========================================================================
  // STEP VALIDATION LOGIC
  // =========================================================================
  const validateStep = (stepNumber) => {
    const newErrors = {}

    if (stepNumber === 1) {
      if (!resumeData.first_name || !resumeData.first_name.trim()) {
        newErrors.first_name = 'First name is required.'
      }
      if (!resumeData.last_name || !resumeData.last_name.trim()) {
        newErrors.last_name = 'Last name is required.'
      }
      if (!resumeData.email || !resumeData.email.trim()) {
        newErrors.email = 'Email address is required.'
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(resumeData.email.trim())) {
          newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).'
        }
      }
      if (!resumeData.address || !resumeData.address.trim()) {
        newErrors.address = 'Street address is required.'
      }
      if (!resumeData.city || !resumeData.city.trim()) {
        newErrors.city = 'City is required.'
      }
      if (!resumeData.state || !resumeData.state.trim()) {
        newErrors.state = 'State / Region is required.'
      }
      if (!resumeData.zip_code || !resumeData.zip_code.trim()) {
        newErrors.zip_code = 'ZIP / Postal code is required.'
      }
      if (!resumeData.country || !resumeData.country.trim()) {
        newErrors.country = 'Country is required.'
      }
      if (!resumeData.linkedin || !resumeData.linkedin.trim()) {
        newErrors.linkedin = 'LinkedIn URL is required.'
      }
    } else if (stepNumber === 2) {
      if (!resumeData.summary || !resumeData.summary.trim()) {
        newErrors.summary = 'Professional summary is required.'
      } else if (resumeData.summary.trim().length < 20) {
        newErrors.summary = 'Professional summary should be at least 20 characters long.'
      }
    } else if (stepNumber === 3) {
      const skillsObj = normalizeSkills(resumeData.skills)
      const totalSkills = getTotalSkillsCount(skillsObj)

      if (totalSkills === 0) {
        newErrors.skills = 'Please add at least one skill or core competency.'
      }
    } else if (stepNumber === 4) {
      const educations = resumeData.education || []
      if (educations.length === 0) {
        newErrors.education = 'Please add at least one education credential.'
        newErrors['edu_0_degree'] = 'Degree or qualification is required.'
        newErrors['edu_0_school'] = 'Institution / University name is required.'
      } else {
        educations.forEach((edu, idx) => {
          const hasDegree = Boolean(edu.degree && edu.degree.trim())
          const hasSchool = Boolean((edu.school_name && edu.school_name.trim()) || (edu.school && edu.school.trim()))
          if (!hasDegree) {
            newErrors[`edu_${idx}_degree`] = 'Degree or qualification is required.'
          }
          if (!hasSchool) {
            newErrors[`edu_${idx}_school`] = 'Institution / University name is required.'
          }
        })
        if (Object.keys(newErrors).length > 0) {
          newErrors.education = 'Please fill in all required education fields (Degree and Institution).'
        }
      }
    } else if (stepNumber === 5) {
      if (!resumeData.noExperience) {
        const experiences = resumeData.experience || []
        if (experiences.length === 0) {
          newErrors.experience = 'Please add at least one work experience or check "I have no work experience".'
          newErrors['exp_0_title'] = 'Job title is required.'
          newErrors['exp_0_company'] = 'Company name is required.'
        } else {
          experiences.forEach((exp, idx) => {
            const hasTitle = Boolean((exp.job_title && exp.job_title.trim()) || (exp.title && exp.title.trim()))
            const hasCompany = Boolean((exp.company_name && exp.company_name.trim()) || (exp.company && exp.company.trim()))
            if (!hasTitle) {
              newErrors[`exp_${idx}_title`] = 'Job title is required.'
            }
            if (!hasCompany) {
              newErrors[`exp_${idx}_company`] = 'Company name is required.'
            }
          })
          if (Object.keys(newErrors).length > 0) {
            newErrors.experience = 'Please fill in all required experience fields (Job Title and Company).'
          }
        }
      }
    } else if (stepNumber === 6) {
      if (!resumeData.noProjects) {
        const projects = resumeData.projects || []
        if (projects.length === 0) {
          newErrors.projects = 'Please add at least one project or check "No projects to highlight right now".'
          newErrors['proj_0_name'] = 'Project name is required.'
        } else {
          projects.forEach((proj, idx) => {
            const hasName = Boolean(proj.name && proj.name.trim())
            if (!hasName) {
              newErrors[`proj_${idx}_name`] = 'Project name is required.'
            }
          })
          if (Object.keys(newErrors).length > 0) {
            newErrors.projects = 'Please provide a project name for all added projects.'
          }
        }
      }
    }

    const isValid = Object.keys(newErrors).length === 0
    return { isValid, errors: newErrors }
  }

  // =========================================================================
  // STEP SAVE HANDLERS (WITH DEFENSIVE VALIDATION GUARDS)
  // =========================================================================
  const saveStep1PersonalInfo = async () => {
    if (
      !resumeData.first_name?.trim() ||
      !resumeData.last_name?.trim() ||
      !resumeData.email?.trim() ||
      !resumeData.address?.trim() ||
      !resumeData.city?.trim() ||
      !resumeData.state?.trim() ||
      !resumeData.zip_code?.trim() ||
      !resumeData.country?.trim() ||
      !resumeData.linkedin?.trim()
    ) {
      return false
    }

    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        first_name: resumeData.first_name.trim(),
        last_name: resumeData.last_name.trim(),
        email: resumeData.email.trim(),
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
      const response = hasExistingPersonalInfo
        ? await resumeApi.updatePersonalInfo(payload)
        : await resumeApi.savePersonalInfo(payload)
      setHasExistingPersonalInfo(true)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || (hasExistingPersonalInfo ? 'Personal information updated successfully!' : 'Personal information saved successfully!'),
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
    if (!resumeData.summary?.trim()) {
      return false
    }

    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        summary: resumeData.summary.trim(),
      }
      const response = hasExistingSummary
        ? await resumeApi.updateProfessionalSummary(payload)
        : await resumeApi.saveProfessionalSummary(payload)
      setHasExistingSummary(true)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || (hasExistingSummary ? 'Professional summary updated successfully!' : 'Professional summary saved successfully!'),
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
    const normalized = normalizeSkills(resumeData.skills)
    const totalSkills = getTotalSkillsCount(normalized)

    if (totalSkills === 0) {
      return false
    }

    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        skills: normalized,
      }

      const response = hasExistingSkills
        ? await resumeApi.updateSkills(payload)
        : await resumeApi.saveSkills(payload)
      setHasExistingSkills(true)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || (hasExistingSkills ? 'Skills updated successfully!' : 'Skills saved successfully!'),
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
    const rawList = resumeData.education || []
    const educations = rawList
      .filter((edu) => (edu.degree && edu.degree.trim()) || (edu.school_name && edu.school_name.trim()) || (edu.school && edu.school.trim()))
      .map((edu) => ({
        degree: (edu.degree || '').trim(),
        school_name: (edu.school_name || edu.school || '').trim(),
        start_date: edu.start_date || edu.startDate || '',
        end_date: edu.end_date || edu.endDate || '',
        gpa: edu.gpa || '',
        field_of_study: edu.field_of_study || edu.field || '',
        url: edu.url || '',
        is_current: Boolean(edu.is_current),
      }))

    if (educations.length === 0) {
      return false
    }

    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        educations,
      }

      const response = hasExistingEducation
        ? await resumeApi.updateEducationalInfo(payload)
        : await resumeApi.saveEducationalInfo(payload)
      setHasExistingEducation(true)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || (hasExistingEducation ? 'Educational information updated successfully!' : 'Educational information saved successfully!'),
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
    if (resumeData.noExperience) {
      setSaveState(0)
      return true
    }

    const rawList = resumeData.experience || []
    const workExperience = rawList
      .filter((exp) => (exp.job_title && exp.job_title.trim()) || (exp.company_name && exp.company_name.trim()))
      .map((exp, idx) => ({
        job_title: (exp.job_title || exp.title || '').trim(),
        company_name: (exp.company_name || exp.company || '').trim(),
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

    if (workExperience.length === 0) {
      return false
    }

    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        work_experience: workExperience,
      }

      const response = hasExistingExperience
        ? await resumeApi.updateWorkExperience(payload)
        : await resumeApi.saveWorkExperience(payload)
      setHasExistingExperience(true)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || (hasExistingExperience ? 'Work experience updated successfully!' : 'Work experience saved successfully!'),
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
    if (resumeData.noProjects) {
      setSaveState(0)
      return true
    }

    const rawList = resumeData.projects || []
    const projects = rawList
      .filter((proj) => proj.name && proj.name.trim())
      .map((proj, idx) => ({
        name: proj.name.trim(),
        description: proj.description || '',
        url: proj.url || proj.githubUrl || proj.liveUrl || '',
        start_date: Number(proj.start_date) || 20230101,
        end_date: Number(proj.end_date) || 20230830,
        status: proj.status || 'Completed',
        responsibilities: proj.responsibilities || (proj.bullets && proj.bullets[0]) || '',
        achievements: proj.achievements || (proj.bullets && proj.bullets[1]) || '',
        order: proj.order || idx + 1,
      }))

    if (projects.length === 0) {
      return false
    }

    setIsSaving(true)
    setSaveState(1)
    setApiFeedback(null)
    try {
      const payload = {
        projects,
      }

      const response = hasExistingProjects
        ? await resumeApi.updateProjectsInfo(payload)
        : await resumeApi.saveProjectsInfo(payload)
      setHasExistingProjects(true)
      setSaveState(0)
      setApiFeedback({
        type: 'success',
        message: response?.msg || (hasExistingProjects ? 'Projects updated successfully!' : 'Projects information saved successfully!'),
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

  // =========================================================================
  // ACTIONS: SAVE STEP, NEXT, PREV, STEP CLICK
  // =========================================================================
  const handleSaveCurrentStep = async () => {
    const validation = validateStep(currentStep)
    if (!validation.isValid) {
      setErrors(validation.errors)
      const firstErrorMsg = Object.values(validation.errors)[0]
      setApiFeedback({
        type: 'error',
        message: firstErrorMsg || `Please fill in all required fields for Step ${currentStep} before proceeding.`,
      })
      return false
    }

    setErrors({})

    let saved = false
    if (currentStep === 1) saved = await saveStep1PersonalInfo()
    else if (currentStep === 2) saved = await saveStep2Summary()
    else if (currentStep === 3) saved = await saveStep3Skills()
    else if (currentStep === 4) saved = await saveStep4Education()
    else if (currentStep === 5) saved = await saveStep5Experience()
    else if (currentStep === 6) saved = await saveStep6Projects()

    return saved
  }

  const handleNext = async () => {
    const saved = await handleSaveCurrentStep()
    if (!saved) return

    // Advance stepCount to reflect completion of currentStep
    const updatedStepCount = Math.max(stepCount, currentStep)
    setStepCount(updatedStepCount)
    localStorage.setItem('resumint_step_count', String(updatedStepCount))

    try {
      const meRes = await authApi.getMe()
      const user = meRes?.data || meRes
      if (user && typeof user.step_count !== 'undefined') {
        const sc = Math.max(
          updatedStepCount,
          typeof user.step_count === 'number' ? user.step_count : Number(user.step_count) || 0
        )
        setStepCount(sc)
      }
    } catch (err) {
      console.warn('Failed to refresh /me profile on next step:', err)
    }

    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1)
      setErrors({})
      setApiFeedback(null)
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
      setErrors({})
      setApiFeedback(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleStepClick = (targetStep) => {
    if (targetStep === currentStep || isSaving) return

    // Block any attempt to jump ahead beyond the user's unlocked progress
    if (targetStep > allowedMaxStep) {
      setApiFeedback({
        type: 'error',
        message: `Please complete Step ${allowedMaxStep} first before accessing Step ${targetStep}.`,
      })
      return
    }

    setCurrentStep(targetStep)
    setErrors({})
    setApiFeedback(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const stepMeta = stepsConfig[currentStep - 1]
  const progressPercent = Math.round((Math.min(6, stepCount || 0) / 6) * 100)

  return (
    <div className="h-screen bg-[#F5F8FC] text-[#14243B] font-body-default flex flex-col antialiased selection:bg-[#2563EB]/20 selection:text-[#102544] overflow-hidden">
      {/* TOP BAR (Global Workspace Header) */}
      <header className="h-16 bg-white border-b border-[#DCE5F0] px-3 sm:px-6 flex items-center justify-between shrink-0 z-30 select-none">
        {/* Left: Brand, Divider, Active Resume Title & Target Pill */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <div onClick={onExitSetup} className="flex items-center gap-2 cursor-pointer group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[19px]">assignment_turned_in</span>
            </div>
            <span className="font-headline-section text-[17px] sm:text-[19px] font-bold text-[#102544] tracking-tight hidden xs:inline">
              Resumint
            </span>
          </div>

          {/* <div className="h-5 w-[1px] bg-[#DCE5F0] hidden sm:block shrink-0" /> */}

          {/* <div className="flex items-center gap-2 truncate">
            {isEditingTitle ? (
              <input
                type="text"
                value={resumeTitle}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="font-body-semibold text-[13px] sm:text-[14px] text-[#14243B] border border-[#2563EB] rounded px-2 py-0.5 outline-none max-w-[150px] sm:max-w-none"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 group cursor-pointer truncate"
              >
                <span className="font-body-semibold text-[13px] sm:text-[14px] text-[#14243B] group-hover:text-[#2563EB] transition-colors truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                  {resumeTitle}
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#64748B] group-hover:text-[#2563EB] transition-colors shrink-0">
                  edit
                </span>
              </div>
            )}
          </div> */}
        </div>


        {/* Right: Preview Resume & Exit Setup Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />
          <button
            onClick={() => setIsMobilePreviewOpen(true)}
            className="xl:hidden h-[36px] sm:h-[40px] px-2.5 rounded-lg border border-[#DCE5F0] bg-white text-[#102544] font-body-semibold text-xs flex items-center gap-1 hover:bg-[#F8FAFC] transition-colors shadow-sm cursor-pointer"
            type="button"
            title="Preview Resume"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => alert('Opening full screen high-resolution preview...')}
            className="hidden xl:flex h-[40px] px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#102544] font-body-semibold text-xs items-center gap-2 hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Preview</span>
          </button>
          <button
            onClick={onExitSetup}
            className="h-[36px] sm:h-[40px] px-2.5 sm:px-3 rounded-lg flex items-center gap-1 text-[#64748B] font-body-semibold text-xs hover:text-[#102544] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
            type="button"
          >
            <span className="hidden sm:inline">Exit Setup</span>
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY (3-Column Layout: Sidebar, Form Canvas, Live Preview) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* A. EDITOR STEP SIDEBAR (Hidden on mobile/tablet, shown on lg+) */}
        <aside className="hidden lg:flex w-[260px] bg-white border-r border-[#DCE5F0] flex-col justify-between shrink-0 select-none">
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
                const isCompleted = s.id <= (stepCount || 0) && !isActive
                const isAccessible = s.id <= allowedMaxStep

                return (
                  <button
                    key={s.id}
                    onClick={() => handleStepClick(s.id)}
                    type="button"
                    disabled={!isAccessible || isSaving}
                    title={s.title}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg border-l-[3px] transition-all font-body-semibold text-[14px] ${isActive
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : isAccessible
                        ? 'border-transparent text-[#64748B] hover:text-[#14243B] hover:bg-[#F8FAFC] cursor-pointer'
                        : 'border-transparent text-[#94A3B8] cursor-not-allowed select-none filter blur-[1.5px] opacity-40'
                      }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span
                        className={`material-symbols-outlined text-[20px] ${isActive
                          ? 'text-[#2563EB]'
                          : isCompleted
                            ? 'text-[#16A34A]'
                            : 'text-[#64748B]'
                          }`}
                      >
                        {isCompleted ? 'check_circle' : s.icon}
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
        <main className="flex-1 overflow-y-auto bg-[#F5F8FC] p-3.5 sm:p-6 md:p-8 custom-scrollbar">
          <div className="max-w-[760px] mx-auto pb-12">
            {/* Mobile Step Selector Banner (visible on < lg) */}
            <div className="lg:hidden mb-4 bg-white p-3 rounded-xl border border-[#DCE5F0] shadow-sm flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#14243B] truncate">
                    Step {currentStep} of 6: {stepMeta.title}
                  </span>
                  <span className="text-[#2563EB] font-semibold ml-2 shrink-0">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => setIsMobileStepsOpen(true)}
                className="h-8 px-2.5 rounded-lg border border-[#DCE5F0] text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] shrink-0"
                type="button"
              >
                Sections
              </button>
            </div>

            {/* Step Header */}
            <div className="mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#2563EB] mb-1.5">
                <span className="material-symbols-outlined text-[14px]">flag</span>
                <span>{stepMeta.eyebrow}</span>
              </div>
              <h1 className="font-headline-page text-[24px] sm:text-[30px] font-bold text-[#14243B] tracking-tight leading-tight">
                {stepMeta.title}
              </h1>
              <p className="text-xs sm:text-[15px] font-body-default text-[#64748B] mt-1">{stepMeta.subtitle}</p>
            </div>

            {/* API Feedback Notification */}
            {apiFeedback && (
              <div
                className={`mb-4 p-3.5 rounded-lg text-[13px] font-medium flex items-center justify-between ${apiFeedback.type === 'success'
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
            <div className="bg-white rounded-xl border border-[#DCE5F0] p-4 sm:p-6 md:p-8 shadow-sm">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {currentStep === 1 && (
                  <Step1PersonalInfo data={resumeData} onChange={handleFieldChange} errors={errors} />
                )}
                {currentStep === 2 && (
                  <Step2Summary data={resumeData} onChange={handleFieldChange} errors={errors} />
                )}
                {currentStep === 3 && (
                  <Step3Skills data={resumeData} onChange={handleFieldChange} errors={errors} />
                )}
                {currentStep === 4 && (
                  <Step4Education data={resumeData} onChange={handleFieldChange} errors={errors} />
                )}
                {currentStep === 5 && (
                  <Step5Experience data={resumeData} onChange={handleFieldChange} errors={errors} />
                )}
                {currentStep === 6 && (
                  <Step6Projects data={resumeData} onChange={handleFieldChange} errors={errors} />
                )}

                {/* Bottom Navigation Controls */}
                <div className="flex flex-wrap items-center justify-between pt-6 border-t border-[#DCE5F0] mt-8 gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`h-[40px] sm:h-[44px] px-4 sm:px-6 rounded-lg border border-[#DCE5F0] text-[#14243B] font-body-semibold text-[13px] sm:text-[14px] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] flex items-center gap-1.5 transition-all shadow-sm ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={handleSaveCurrentStep}
                      disabled={isSaving}
                      type="button"
                      className="h-[40px] sm:h-[44px] px-3.5 sm:px-5 rounded-lg border border-[#2563EB] bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white font-body-semibold text-[13px] sm:text-[14px] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>{isSaving ? 'Saving...' : `Save ${stepMeta.title.split(' ')[0]}`}</span>
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={isSaving}
                      className={`h-[40px] sm:h-[44px] px-4 sm:px-7 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-body-semibold text-[13px] sm:text-[14px] flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.99] ${isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      type="button"
                    >
                      <span className="truncate max-w-[130px] sm:max-w-none">{isSaving ? 'Saving...' : stepMeta.nextBtn}</span>
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

        {/* C. LIVE PREVIEW PANE (Desktop layout, width 420px, flex shrink-0) */}
        <div className="hidden xl:flex w-[430px] border-l border-[#DCE5F0] bg-white flex-col shrink-0 select-none">
          <ResumePreviewPane resumeData={resumeData} currentStep={currentStep} />
        </div>
      </div>

      {/* MOBILE SECTIONS DRAWER (for screens < lg) */}
      {isMobileStepsOpen && (
        <div className="fixed inset-0 z-50 bg-[#102544]/60 backdrop-blur-sm flex justify-start animate-fadeIn select-none lg:hidden">
          <div className="w-full max-w-[280px] bg-white h-full shadow-2xl flex flex-col relative overflow-hidden">
            <div className="h-14 px-4 bg-[#F8FAFC] border-b border-[#DCE5F0] flex items-center justify-between shrink-0">
              <span className="font-headline-section font-bold text-sm text-[#102544]">Resume Sections</span>
              <button
                onClick={() => setIsMobileStepsOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#102544]"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-1">
              {stepsConfig.map((s) => {
                const isActive = s.id === currentStep
                const isCompleted = s.id <= (stepCount || 0) && !isActive
                const isAccessible = s.id <= allowedMaxStep

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (!isAccessible) return
                      handleStepClick(s.id)
                      setIsMobileStepsOpen(false)
                    }}
                    type="button"
                    disabled={!isAccessible || isSaving}
                    title={s.title}
                    className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg border-l-[3px] transition-all font-body-semibold text-[13px] ${isActive
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : isAccessible
                        ? 'border-transparent text-[#64748B] hover:text-[#14243B] hover:bg-[#F8FAFC] cursor-pointer'
                        : 'border-transparent text-[#94A3B8] cursor-not-allowed select-none filter blur-[1.5px] opacity-40'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className={`material-symbols-outlined text-[18px] ${isActive
                          ? 'text-[#2563EB]'
                          : isCompleted
                            ? 'text-[#16A34A]'
                            : 'text-[#64748B]'
                          }`}
                      >
                        {isCompleted ? 'check_circle' : s.icon}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </div>
                    {isCompleted && (
                      <span className="material-symbols-outlined text-[16px] text-[#16A34A]">check</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE LIVE RESUME PREVIEW MODAL (for screens < xl) */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-[#102544]/60 backdrop-blur-sm flex justify-end animate-fadeIn select-none xl:hidden">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col relative overflow-hidden">
            <div className="h-14 px-4 bg-[#F8FAFC] border-b border-[#DCE5F0] flex items-center justify-between shrink-0">
              <span className="font-headline-section font-bold text-sm text-[#102544]">Live Resume Preview</span>
              <button
                onClick={() => setIsMobilePreviewOpen(false)}
                className="p-1 rounded-lg text-[#64748B] hover:text-[#102544]"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ResumePreviewPane resumeData={resumeData} currentStep={currentStep} />
            </div>
          </div>
        </div>
      )}

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
                Congratulations{resumeData.first_name ? `, ${resumeData.first_name}` : ''}! 🎉
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
