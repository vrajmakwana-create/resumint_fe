import { useState, useEffect } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import ThemeToggle from '../common/ThemeToggle'
import {
  resumeApi,
  authApi,
  getCurrentUser,
  setCurrentUser,
} from '../../services/api'
import { normalizeSkills, SKILL_CATEGORIES } from '../editor/skillsConfig'

// Step Components for In-Place Editing
import Step1PersonalInfo from '../editor/steps/Step1PersonalInfo'
import Step2Summary from '../editor/steps/Step2Summary'
import Step3Skills from '../editor/steps/Step3Skills'
import Step4Education from '../editor/steps/Step4Education'
import Step5Experience from '../editor/steps/Step5Experience'
import Step6Projects from '../editor/steps/Step6Projects'
import ResumePreviewModal from '../common/ResumePreviewModal'
import { toDateMilliseconds, formatDateDisplay } from '../../utils/dateUtils'

const RESUME_SECTIONS = [
  { id: 'personal', name: 'Personal Information', icon: 'person', step: 1 },
  { id: 'summary', name: 'Professional Summary', icon: 'description', step: 2 },
  { id: 'skills', name: 'Skills & Competencies', icon: 'label', step: 3 },
  { id: 'education', name: 'Education & Credentials', icon: 'school', step: 4 },
  { id: 'experience', name: 'Work Experience', icon: 'work', step: 5 },
  { id: 'projects', name: 'Projects & Highlights', icon: 'folder_copy', step: 6 },
]

export default function ProfileSettingsPage({ onNavigate, onLogout }) {
  const [currentUser, setLocalCurrentUser] = useState(() => getCurrentUser())
  const [activeSection, setActiveSection] = useState('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [syncedResumeUrl, setSyncedResumeUrl] = useState(() => currentUser?.resume_url || '')
  const [saveFeedback, setSaveFeedback] = useState(null)
  const [errors, setErrors] = useState({})

  // Track existing section flags in backend database
  const [existingFlags, setExistingFlags] = useState({
    personal: false,
    summary: false,
    skills: false,
    education: false,
    experience: false,
    projects: false,
  })

  // Full resume state across all 6 sections
  const [resumeData, setResumeData] = useState({
    first_name: '',
    last_name: '',
    fullName: '',
    profTitle: '',
    email: currentUser?.email || '',
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
    education: [],
    experience: [],
    projects: [],
    noExperience: false,
    noProjects: false,
  })

  // Backup of data before editing so cancel can revert cleanly
  const [originalSectionData, setOriginalSectionData] = useState(null)

  // Fetch all 6 sections from backend APIs on mount
  useEffect(() => {
    let isMounted = true

    const loadProfileData = async () => {
      setIsLoading(true)
      try {
        const [userMeRes, personalRes, summaryRes, skillsRes, eduRes, expRes, projRes] =
          await Promise.allSettled([
            authApi.getMe(),
            resumeApi.getPersonalInfo(),
            resumeApi.getProfessionalSummary(),
            resumeApi.getSkills(),
            resumeApi.getEducationalInfo(),
            resumeApi.getWorkExperience(),
            resumeApi.getProjectsInfo(),
          ])

        if (!isMounted) return

        if (userMeRes.status === 'fulfilled' && userMeRes.value) {
          const u = userMeRes.value?.data || userMeRes.value
          if (u) {
            setCurrentUser(u)
            setLocalCurrentUser(u)
            if (u.resume_url) setSyncedResumeUrl(u.resume_url)
          }
        }

        const newFlags = { ...existingFlags }
        let updatedData = { ...resumeData }

        // 1. Personal Information
        if (personalRes.status === 'fulfilled' && personalRes.value) {
          const pi = personalRes.value?.data || personalRes.value
          if (pi && typeof pi === 'object') {
            const hasData = Boolean(
              pi.first_name || pi.last_name || pi.email || pi.city || pi.country || pi.linkedin
            )
            if (hasData) {
              newFlags.personal = true
              updatedData = {
                ...updatedData,
                first_name: pi.first_name || '',
                last_name: pi.last_name || '',
                fullName: `${pi.first_name || ''} ${pi.last_name || ''}`.trim(),
                email: pi.email || updatedData.email || '',
                phone: pi.phone || '',
                address: pi.address || '',
                city: pi.city || '',
                state: pi.state || '',
                zip_code: pi.zip_code || '',
                country: pi.country || '',
                website: pi.website || '',
                portfolio: pi.website || '',
                linkedin: pi.linkedin || '',
                github: pi.github || '',
                location: [pi.city, pi.state, pi.country].filter(Boolean).join(', '),
              }
            }
          }
        }

        // 2. Summary
        if (summaryRes.status === 'fulfilled' && summaryRes.value) {
          const ps = summaryRes.value?.data || summaryRes.value
          if (ps && ps.summary) {
            newFlags.summary = true
            updatedData = { ...updatedData, summary: ps.summary }
          }
        }

        // 3. Skills
        if (skillsRes.status === 'fulfilled' && skillsRes.value) {
          const sData = skillsRes.value?.data || skillsRes.value
          const rawSkills = sData?.skills || sData?.data?.skills || sData?.data || sData
          const normalized = normalizeSkills(rawSkills)
          const totalCount = Object.values(normalized).reduce((acc, arr) => acc + (arr?.length || 0), 0)
          if (totalCount > 0) {
            newFlags.skills = true
            updatedData = { ...updatedData, skills: normalized }
          }
        }

        // 4. Education
        if (eduRes.status === 'fulfilled' && eduRes.value) {
          const eData = eduRes.value?.data || eduRes.value
          const rawList = Array.isArray(eData)
            ? eData
            : Array.isArray(eData?.educations)
              ? eData.educations
              : eData?.data?.educations || []
          if (rawList.length > 0) {
            const mapped = rawList.map((edu) => ({
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
            newFlags.education = mapped.length > 0
            updatedData = { ...updatedData, education: mapped }
          }
        }

        // 5. Work Experience
        if (expRes.status === 'fulfilled' && expRes.value) {
          const expData = expRes.value?.data || expRes.value
          const rawList = Array.isArray(expData)
            ? expData
            : Array.isArray(expData?.work_experience)
              ? expData.work_experience
              : expData?.data?.work_experience || []

          const totalExpYears =
            expData?.total_experience_years ??
            expData?.candidate_experience_years ??
            expData?.data?.total_experience_years ??
            expData?.data?.candidate_experience_years ??
            null

          if (rawList.length > 0) {
            const mapped = rawList.map((exp, idx) => ({
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
              experience_years: exp.experience_years != null ? Number(exp.experience_years) : null,
              responsibilities: exp.responsibilities || (exp.bullets && exp.bullets[0]) || '',
              achievements: exp.achievements || (exp.bullets && exp.bullets[1]) || '',
              bullets: [exp.responsibilities, exp.achievements].filter(Boolean),
              order: exp.order || idx + 1,
            }))
            newFlags.experience = mapped.length > 0
            updatedData = {
              ...updatedData,
              experience: mapped,
              total_experience_years: totalExpYears != null ? Number(totalExpYears) : null,
              candidate_experience_years: totalExpYears != null ? Number(totalExpYears) : null,
              profTitle: mapped[0]?.job_title || updatedData.profTitle || '',
            }
          }
        }

        // 6. Projects
        if (projRes.status === 'fulfilled' && projRes.value) {
          const pData = projRes.value?.data || projRes.value
          const rawList = Array.isArray(pData)
            ? pData
            : Array.isArray(pData?.projects)
              ? pData.projects
              : pData?.data?.projects || []
          if (rawList.length > 0) {
            const mapped = rawList.map((proj, idx) => ({
              name: proj.name || '',
              description: proj.description || '',
              url: proj.url || proj.githubUrl || proj.liveUrl || '',
              start_date: toDateMilliseconds(proj.start_date) || 1672531200000,
              end_date: toDateMilliseconds(proj.end_date) || 1693440000000,
              status: proj.status || 'Active',
              responsibilities: proj.responsibilities || '',
              achievements: proj.achievements || '',
              order: proj.order || idx + 1,
            }))
            newFlags.projects = mapped.length > 0
            updatedData = { ...updatedData, projects: mapped }
          }
        }

        setExistingFlags(newFlags)
        setResumeData(updatedData)
      } catch (err) {
        console.warn('Failed to load sections in profile:', err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfileData()

    return () => {
      isMounted = false
    }
  }, [])

  // Section Change Handler
  const handleSectionTabClick = (sectionId) => {
    if (isSaving) return
    setActiveSection(sectionId)
    setIsEditing(false)
    setSaveFeedback(null)
    setErrors({})
  }

  // Generic Field Change Handler for step components
  const handleFieldChange = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev
      const newErr = { ...prev }
      delete newErr[field]
      return newErr
    })
  }

  // Start Editing Active Section
  const handleStartEditing = () => {
    setOriginalSectionData(JSON.parse(JSON.stringify(resumeData)))
    setIsEditing(true)
    setSaveFeedback(null)
    setErrors({})
  }

  // Cancel Editing Active Section
  const handleCancelEditing = () => {
    if (originalSectionData) {
      setResumeData(originalSectionData)
    }
    setIsEditing(false)
    setSaveFeedback(null)
    setErrors({})
  }

  // Save Active Section with respective API
  const handleSaveActiveSection = async () => {
    setIsSaving(true)
    setSaveFeedback(null)
    setErrors({})

    try {
      if (activeSection === 'personal') {
        const payload = {
          first_name: resumeData.first_name?.trim() || '',
          last_name: resumeData.last_name?.trim() || '',
          email: resumeData.email?.trim() || '',
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

        if (!payload.first_name || !payload.last_name || !payload.email) {
          setErrors({
            first_name: !payload.first_name ? 'First name is required' : '',
            last_name: !payload.last_name ? 'Last name is required' : '',
            email: !payload.email ? 'Email is required' : '',
          })
          setIsSaving(false)
          return
        }

        const res = existingFlags.personal
          ? await resumeApi.updatePersonalInfo(payload)
          : await resumeApi.savePersonalInfo(payload)

        setExistingFlags((prev) => ({ ...prev, personal: true }))
        setSaveFeedback({
          type: 'success',
          message: res?.msg || 'Personal Information saved successfully!',
        })
      } else if (activeSection === 'summary') {
        const summaryText = resumeData.summary?.trim() || ''
        if (!summaryText) {
          setErrors({ summary: 'Professional summary cannot be empty' })
          setIsSaving(false)
          return
        }

        const payload = { summary: summaryText }
        const res = existingFlags.summary
          ? await resumeApi.updateProfessionalSummary(payload)
          : await resumeApi.saveProfessionalSummary(payload)

        setExistingFlags((prev) => ({ ...prev, summary: true }))
        setSaveFeedback({
          type: 'success',
          message: res?.msg || 'Professional Summary saved successfully!',
        })
      } else if (activeSection === 'skills') {
        const normalized = normalizeSkills(resumeData.skills)
        const totalCount = Object.values(normalized).reduce((acc, arr) => acc + (arr?.length || 0), 0)

        if (totalCount === 0) {
          setErrors({ skills: 'Please add at least one skill' })
          setIsSaving(false)
          return
        }

        const payload = { skills: normalized }
        const res = existingFlags.skills
          ? await resumeApi.updateSkills(payload)
          : await resumeApi.saveSkills(payload)

        setExistingFlags((prev) => ({ ...prev, skills: true }))
        setSaveFeedback({
          type: 'success',
          message: res?.msg || 'Skills & Competencies saved successfully!',
        })
      } else if (activeSection === 'education') {
        const rawList = resumeData.education || []
        const educations = rawList
          .filter((edu) => (edu.degree && edu.degree.trim()) || (edu.school_name && edu.school_name.trim()))
          .map((edu) => ({
            degree: (edu.degree || '').trim(),
            school_name: (edu.school_name || edu.school || '').trim(),
            start_date: toDateMilliseconds(edu.start_date || edu.startDate),
            end_date: edu.is_current ? null : toDateMilliseconds(edu.end_date || edu.endDate),
            gpa: edu.gpa || '',
            field_of_study: edu.field_of_study || edu.field || '',
            url: edu.url || '',
            is_current: Boolean(edu.is_current),
          }))

        if (educations.length === 0) {
          setErrors({ education: 'Please add at least one degree and school' })
          setIsSaving(false)
          return
        }

        const payload = { educations }
        const res = existingFlags.education
          ? await resumeApi.updateEducationalInfo(payload)
          : await resumeApi.saveEducationalInfo(payload)

        setExistingFlags((prev) => ({ ...prev, education: true }))
        setSaveFeedback({
          type: 'success',
          message: res?.msg || 'Education & Credentials saved successfully!',
        })
      } else if (activeSection === 'experience') {
        if (!resumeData.noExperience) {
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
              start_date: toDateMilliseconds(exp.start_date || exp.startDate),
              end_date: (exp.is_currently_work_here ?? exp.isCurrent) ? null : toDateMilliseconds(exp.end_date || exp.endDate),
              responsibilities: exp.responsibilities || (exp.bullets && exp.bullets[0]) || '',
              achievements: exp.achievements || (exp.bullets && exp.bullets[1]) || '',
              order: exp.order || idx + 1,
            }))

          if (workExperience.length === 0) {
            setErrors({ experience: 'Please add at least one job experience or mark as fresher' })
            setIsSaving(false)
            return
          }

          const payload = { work_experience: workExperience }
          const res = existingFlags.experience
            ? await resumeApi.updateWorkExperience(payload)
            : await resumeApi.saveWorkExperience(payload)

          const resData = res?.data || res
          const updatedTotal =
            resData?.total_experience_years ??
            resData?.candidate_experience_years ??
            resData?.data?.total_experience_years ??
            null

          if (updatedTotal != null) {
            setResumeData((prev) => ({
              ...prev,
              total_experience_years: Number(updatedTotal),
              candidate_experience_years: Number(updatedTotal),
            }))
          }

          setExistingFlags((prev) => ({ ...prev, experience: true }))
          setSaveFeedback({
            type: 'success',
            message: res?.msg || 'Work Experience saved successfully!',
          })
        }
      } else if (activeSection === 'projects') {
        if (!resumeData.noProjects) {
          const rawList = resumeData.projects || []
          const projects = rawList
            .filter((proj) => proj.name && proj.name.trim())
            .map((proj, idx) => ({
              name: proj.name.trim(),
              description: proj.description || '',
              url: proj.url || proj.githubUrl || proj.liveUrl || '',
              start_date: toDateMilliseconds(proj.start_date) || 1672531200000,
              end_date: toDateMilliseconds(proj.end_date) || 1693440000000,
              status: proj.status || 'Active',
              responsibilities: proj.responsibilities || '',
              achievements: proj.achievements || '',
              order: proj.order || idx + 1,
            }))

          if (projects.length === 0) {
            setErrors({ projects: 'Please add at least one project or check no projects' })
            setIsSaving(false)
            return
          }

          const payload = { projects }
          const res = existingFlags.projects
            ? await resumeApi.updateProjectsInfo(payload)
            : await resumeApi.saveProjectsInfo(payload)

          setExistingFlags((prev) => ({ ...prev, projects: true }))
          setSaveFeedback({
            type: 'success',
            message: res?.msg || 'Projects & Highlights saved successfully!',
          })
        }
      }

      setIsEditing(false)
    } catch (err) {
      setSaveFeedback({
        type: 'error',
        message: err.message || 'Failed to save section data. Please try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Sync Resume Changes: Generate new resume document & update URL
  // cURL: POST /resume/generate-document
  const handleSyncResume = async () => {
    setIsSyncing(true)
    setSaveFeedback(null)
    try {
      const res = await resumeApi.generateDocument()
      const newUrl = res?.data?.resume_url || res?.resume_url || ''
      if (newUrl) {
        setSyncedResumeUrl(newUrl)
      }
      setSaveFeedback({
        type: 'success',
        message: res?.msg || 'Resume document generated and synced successfully with cloud!',
      })
    } catch (err) {
      setSaveFeedback({
        type: 'error',
        message: err.message || 'Failed to sync resume document. Please ensure required sections are saved first.',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // Download Resume PDF directly to client's computer
  // cURL: GET /resume/download
  const handleDownloadResume = async () => {
    setIsDownloading(true)
    setSaveFeedback(null)
    try {
      const blob = await resumeApi.downloadResume()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const name = `${resumeData.first_name || 'candidate'}_${resumeData.last_name || 'resume'}`.trim()
      link.setAttribute('download', `${name}_resume.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setSaveFeedback({
        type: 'success',
        message: 'Resume PDF downloaded successfully to your computer!',
      })
    } catch (err) {
      setSaveFeedback({
        type: 'error',
        message: err.message || 'Failed to download resume PDF. Please check your connection and try again.',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Open Preview Modal
  const handlePreviewResume = () => {
    setShowPreviewModal(true)
  }

  // Quick initials
  const initials = (
    resumeData.fullName ||
    `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() ||
    'User'
  )
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const activeSectionMeta = RESUME_SECTIONS.find((s) => s.id === activeSection)

  return (
    <div className="bg-[#F5F8FC] dark:bg-[#0B1120] text-[#14243B] dark:text-[#F1F5F9] font-body-default antialiased flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <AppSidebar currentView="profile-settings" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F8FC] dark:bg-[#0B1120]">
        {/* TOPBAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* WORKSPACE */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-[1140px] mx-auto space-y-6">
            {/* Header & Primary Actions */}
            <div>
              <h1 className="font-headline-page text-headline-page font-bold text-[#14243B] dark:text-white tracking-tight">
                My Profile &amp; Resume Details
              </h1>
              <p className="font-body-large text-body-large text-[#64748B] dark:text-[#94A3B8] mt-1">
                Manage all 6 core sections of your resume profile with instant in-place editing and real-time synchronization.
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#DCE5F0] dark:border-[#24334A]">
              {/* Actions & Theme */}
              <ThemeToggle variant="segmented" />
            </div>

            {/* Profile Overview Card (Identity & Core Meta) */}
            <div className="bg-white dark:bg-[#151E32] border border-[#DCE5F0] dark:border-[#24334A] rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#EFF6FF] dark:bg-[#1E293B] border-2 border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] font-headline-card text-xl font-bold shrink-0 shadow-inner">
                  {initials}
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-[#14243B] dark:text-white leading-tight">
                    {resumeData.fullName || currentUser?.email || 'User Profile'}
                  </h2>
                  <p className="text-[13px] text-[#2563EB] font-medium mt-0.5">
                    {resumeData.profTitle || (resumeData.experience?.[0]?.job_title) || 'Candidate Profile'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#64748B] dark:text-[#94A3B8] mt-1.5">
                    {resumeData.email && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span>{resumeData.email}</span>
                      </span>
                    )}
                    {resumeData.phone && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">phone</span>
                        <span>{resumeData.phone}</span>
                      </span>
                    )}
                    {resumeData.location && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span>{resumeData.location}</span>
                      </span>
                    )}
                    {(resumeData.total_experience_years != null || resumeData.candidate_experience_years != null) && (
                      <span className="flex items-center gap-1 font-semibold text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 px-2 py-0.5 rounded-full border border-[#A7F3D0] dark:border-[#059669]/30">
                        <span className="material-symbols-outlined text-[13px]">work_history</span>
                        <span>{resumeData.total_experience_years ?? resumeData.candidate_experience_years} Years Experience</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:self-center shrink-0">
                {syncedResumeUrl ? (
                  <a
                    href={syncedResumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#3B82F6]/30 hover:underline"
                    title="Open synced cloud resume URL"
                  >
                    <span className="material-symbols-outlined text-[15px]">cloud_done</span>
                    <span>Cloud Synced</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#059669]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                    Active Resume
                  </span>
                )}
                <button
                  type="button"
                  onClick={handlePreviewResume}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white dark:bg-[#1E293B] text-[#14243B] dark:text-white border border-[#CBD5E1] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#24334A] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#2563EB]">visibility</span>
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  disabled={isDownloading}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-white dark:bg-[#1E293B] text-[#14243B] dark:text-white border border-[#CBD5E1] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#24334A] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[15px] text-[#059669]">download</span>
                  <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                </button>
              </div>
            </div>

            {/* Horizontal Scrollbar with the 6 Resume Sections */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Select Section to View or Edit
                </span>
                <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B]">
                  Scroll horizontally to switch sections
                </span>
              </div>

              {/* HORIZONTAL SCROLLBAR TABS */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2.5 pt-1 custom-scrollbar">
                {RESUME_SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id
                  const isSavedInDb = existingFlags[sec.id]

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => handleSectionTabClick(sec.id)}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-[13px] flex items-center gap-2.5 shrink-0 transition-all cursor-pointer ${isActive
                        ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-[#2563EB]/30'
                        : 'bg-white dark:bg-[#151E32] text-[#64748B] dark:text-[#94A3B8] hover:text-[#14243B] dark:hover:text-white border border-[#DCE5F0] dark:border-[#24334A] hover:border-[#CBD5E1]'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {sec.icon}
                      </span>
                      <span>
                        {sec.step}. {sec.name}
                      </span>
                      {isSavedInDb && (
                        <span
                          className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-[#16A34A]'
                            }`}
                          title="Synced with backend"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Save Feedback Alert */}
            {saveFeedback && (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-[13px] transition-all ${saveFeedback.type === 'success'
                  ? 'bg-[#ECFDF5] dark:bg-[#064E3B]/30 border-[#A7F3D0] dark:border-[#059669]/50 text-[#065F46] dark:text-[#34D399]'
                  : 'bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 border-[#FECACA] dark:border-[#DC2626]/50 text-[#991B1B] dark:text-[#F87171]'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {saveFeedback.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <span>{saveFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSaveFeedback(null)}
                  className="text-current opacity-70 hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* Active Section Content Container */}
            <div className="bg-white dark:bg-[#151E32] border border-[#DCE5F0] dark:border-[#24334A] rounded-xl shadow-xs overflow-hidden">
              {/* Active Section Header Bar */}
              <div className="p-5 border-b border-[#DCE5F0] dark:border-[#24334A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FBFDFF] dark:bg-[#121927]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">
                      {activeSectionMeta?.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-headline-card text-base font-bold text-[#14243B] dark:text-white flex items-center gap-2">
                      <span>{activeSectionMeta?.name}</span>
                      {existingFlags[activeSection] && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#059669]/30">
                          Saved
                        </span>
                      )}
                    </h3>
                    <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      {isEditing
                        ? 'Editing details for this section. Changes will be saved directly to your account.'
                        : 'Reviewing current saved information. Click "Edit Section" to modify.'}
                    </p>
                  </div>
                </div>

                {/* Section Controls (Edit / Save / Cancel) */}
                <div className="flex items-center gap-2 shrink-0">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={handleStartEditing}
                      className="h-10 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[13px] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px]">edit</span>
                      <span>Edit Section</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEditing}
                        disabled={isSaving}
                        className="h-10 px-4 rounded-lg bg-white dark:bg-[#1E293B] border border-[#DCE5F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:text-[#14243B] dark:hover:text-white font-medium text-[13px] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveActiveSection}
                        disabled={isSaving}
                        className="h-10 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[13px] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[17px]">save</span>
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Section Body */}
              <div className="p-6">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8]">
                      Loading section details from server...
                    </p>
                  </div>
                ) : isEditing ? (
                  /* =========================================================
                     EDIT MODE: Form Inputs for Active Section
                     ========================================================= */
                  <div className="space-y-6">
                    {activeSection === 'personal' && (
                      <Step1PersonalInfo
                        data={resumeData}
                        onChange={handleFieldChange}
                        errors={errors}
                      />
                    )}

                    {activeSection === 'summary' && (
                      <Step2Summary
                        data={resumeData}
                        onChange={handleFieldChange}
                        errors={errors}
                      />
                    )}

                    {activeSection === 'skills' && (
                      <Step3Skills
                        data={resumeData}
                        onChange={handleFieldChange}
                        errors={errors}
                      />
                    )}

                    {activeSection === 'education' && (
                      <Step4Education
                        data={resumeData}
                        onChange={handleFieldChange}
                        errors={errors}
                      />
                    )}

                    {activeSection === 'experience' && (
                      <Step5Experience
                        data={resumeData}
                        onChange={handleFieldChange}
                        errors={errors}
                      />
                    )}

                    {activeSection === 'projects' && (
                      <Step6Projects
                        data={resumeData}
                        onChange={handleFieldChange}
                        errors={errors}
                      />
                    )}

                    {/* Bottom Action Footer for Edit Mode */}
                    <div className="pt-5 border-t border-[#DCE5F0] dark:border-[#24334A] flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleCancelEditing}
                        disabled={isSaving}
                        className="h-10 px-4 rounded-lg bg-white dark:bg-[#1E293B] border border-[#DCE5F0] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] font-medium text-[13px] transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveActiveSection}
                        disabled={isSaving}
                        className="h-10 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium text-[13px] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving Changes...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[17px]">save</span>
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* =========================================================
                     VIEW MODE: Clean Formatted Cards for Active Section
                     ========================================================= */
                  <div>
                    {/* SECTION 1: PERSONAL INFORMATION */}
                    {activeSection === 'personal' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-1">
                            <span className="text-[11px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8]">
                              Full Name
                            </span>
                            <p className="text-[14px] font-bold text-[#14243B] dark:text-white">
                              {resumeData.first_name || resumeData.last_name
                                ? `${resumeData.first_name} ${resumeData.last_name}`.trim()
                                : '—'}
                            </p>
                          </div>
                          <div className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-1">
                            <span className="text-[11px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8]">
                              Email Address
                            </span>
                            <p className="text-[14px] font-bold text-[#14243B] dark:text-white break-all">
                              {resumeData.email || '—'}
                            </p>
                          </div>
                          <div className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-1">
                            <span className="text-[11px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8]">
                              Phone Number
                            </span>
                            <p className="text-[14px] font-bold text-[#14243B] dark:text-white">
                              {resumeData.phone || '—'}
                            </p>
                          </div>
                          <div className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-1">
                            <span className="text-[11px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8]">
                              Location / Address
                            </span>
                            <p className="text-[14px] font-bold text-[#14243B] dark:text-white">
                              {[resumeData.address, resumeData.city, resumeData.state, resumeData.country]
                                .filter(Boolean)
                                .join(', ') || '—'}
                            </p>
                          </div>
                        </div>

                        {/* Online Links */}
                        <div className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-3">
                          <span className="text-[11px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8]">
                            Online Presence &amp; Social Links
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Portfolio / Website</span>
                              <p className="text-[13px] font-medium text-[#2563EB] break-all">
                                {resumeData.website || resumeData.portfolio || '—'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">LinkedIn</span>
                              <p className="text-[13px] font-medium text-[#2563EB] break-all">
                                {resumeData.linkedin || '—'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">GitHub</span>
                              <p className="text-[13px] font-medium text-[#2563EB] break-all">
                                {resumeData.github || '—'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SECTION 2: PROFESSIONAL SUMMARY */}
                    {activeSection === 'summary' && (
                      <div className="space-y-4">
                        {resumeData.summary ? (
                          <div className="p-5 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8]">
                                Executive Pitch
                              </span>
                              <span className="text-[11px] font-medium text-[#2563EB]">
                                {resumeData.summary.split(/\s+/).filter(Boolean).length} words
                              </span>
                            </div>
                            <p className="text-[14px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line">
                              {resumeData.summary}
                            </p>
                          </div>
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <span className="material-symbols-outlined text-[32px] text-[#94A3B8]">description</span>
                            <p className="text-[13px] font-medium text-[#14243B] dark:text-white">
                              No professional summary added yet
                            </p>
                            <button
                              type="button"
                              onClick={handleStartEditing}
                              className="text-[13px] text-[#2563EB] hover:underline font-semibold"
                            >
                              + Add Professional Summary
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 3: SKILLS & COMPETENCIES */}
                    {activeSection === 'skills' && (
                      <div className="space-y-4">
                        {Object.values(resumeData.skills || {}).some((list) => list?.length > 0) ? (
                          <div className="p-5 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0] dark:border-[#24334A]">
                              <span className="text-[11px] font-semibold uppercase text-[#64748B] dark:text-[#94A3B8]">
                                Categorized Competencies
                              </span>
                              <span className="text-[11px] font-medium text-[#2563EB]">
                                {Object.values(resumeData.skills || {}).reduce(
                                  (acc, arr) => acc + (arr?.length || 0),
                                  0
                                )}{' '}
                                skills total
                              </span>
                            </div>
                            <div className="divide-y divide-[#E2E8F0] dark:divide-[#24334A]">
                              {SKILL_CATEGORIES.map((cat) => {
                                const list = resumeData.skills?.[cat] || []
                                if (list.length === 0) return null
                                return (
                                  <div
                                    key={cat}
                                    className="py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4"
                                  >
                                    <div className="sm:w-56 shrink-0 font-semibold text-[13px] text-[#14243B] dark:text-white">
                                      {cat}:
                                    </div>
                                    <div className="flex-1 flex flex-wrap gap-1.5">
                                      {list.map((skill, sIdx) => (
                                        <span
                                          key={sIdx}
                                          className="px-2.5 py-0.5 rounded-md bg-white dark:bg-[#151E32] border border-[#CBD5E1] dark:border-[#334155] text-black dark:text-white text-[12px] font-medium shadow-2xs"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <span className="material-symbols-outlined text-[32px] text-[#94A3B8]">label</span>
                            <p className="text-[13px] font-medium text-[#14243B] dark:text-white">
                              No skills added yet
                            </p>
                            <button
                              type="button"
                              onClick={handleStartEditing}
                              className="text-[13px] text-[#2563EB] hover:underline font-semibold"
                            >
                              + Add Skills &amp; Competencies
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 4: EDUCATION & CREDENTIALS */}
                    {activeSection === 'education' && (
                      <div className="space-y-4">
                        {resumeData.education && resumeData.education.length > 0 ? (
                          <div className="space-y-3">
                            {resumeData.education.map((edu, idx) => (
                              <div
                                key={idx}
                                className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-1.5"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <h4 className="font-bold text-[14px] text-[#14243B] dark:text-white">
                                    {edu.degree || 'Degree'}{' '}
                                    {edu.field_of_study ? `(${edu.field_of_study})` : ''}
                                  </h4>
                                  <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                                    {formatDateDisplay(edu.start_date || edu.startDate)}
                                    {(edu.start_date || edu.startDate) && ' — '}
                                    {edu.is_current ? 'Present' : formatDateDisplay(edu.end_date || edu.endDate)}
                                  </span>
                                </div>
                                <p className="text-[13px] text-[#2563EB] font-medium">
                                  {edu.school_name || edu.school || 'Institution'}
                                  {edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <span className="material-symbols-outlined text-[32px] text-[#94A3B8]">school</span>
                            <p className="text-[13px] font-medium text-[#14243B] dark:text-white">
                              No education credentials added yet
                            </p>
                            <button
                              type="button"
                              onClick={handleStartEditing}
                              className="text-[13px] text-[#2563EB] hover:underline font-semibold"
                            >
                              + Add Education Credential
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 5: WORK EXPERIENCE */}
                    {activeSection === 'experience' && (
                      <div className="space-y-4">
                        {resumeData.experience && resumeData.experience.length > 0 ? (
                          <div className="space-y-3">
                            {/* Summary bar for Total Experience Years */}
                            {(resumeData.total_experience_years != null || resumeData.candidate_experience_years != null) && (
                              <div className="p-3 bg-[#EFF6FF] dark:bg-[#1E293B]/70 rounded-xl border border-[#BFDBFE] dark:border-[#3B82F6]/30 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1E40AF] dark:text-[#93C5FD]">
                                  <span className="material-symbols-outlined text-[18px]">work_history</span>
                                  <span>Total Experience</span>
                                </div>
                                <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#2563EB] text-white shadow-xs">
                                  {resumeData.total_experience_years ?? resumeData.candidate_experience_years} Years
                                </span>
                              </div>
                            )}

                            {resumeData.experience.map((exp, idx) => (
                              <div
                                key={idx}
                                className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-2"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                  <h4 className="font-bold text-[14px] text-[#14243B] dark:text-white flex items-center gap-2 flex-wrap">
                                    <span>
                                      {exp.job_title || exp.title || 'Role'} •{' '}
                                      <span className="text-[#2563EB]">
                                        {exp.company_name || exp.company || 'Company'}
                                      </span>
                                    </span>
                                    {exp.experience_years != null && (
                                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#34D399] border border-[#A7F3D0] dark:border-[#059669]/30">
                                        {exp.experience_years} {exp.experience_years === 1 ? 'Year' : 'Years'}
                                      </span>
                                    )}
                                  </h4>
                                  <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                                    {formatDateDisplay(exp.start_date || exp.startDate)}
                                    {(exp.start_date || exp.startDate) && ' — '}
                                    {(exp.is_currently_work_here ?? exp.isCurrent)
                                      ? 'Present'
                                      : formatDateDisplay(exp.end_date || exp.endDate)}
                                  </span>
                                </div>
                                <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8] flex items-center gap-3">
                                  <span>{exp.employment_type || exp.type || 'Full-time'}</span>
                                  <span>•</span>
                                  <span>{exp.location_type || 'Hybrid'}</span>
                                  {[exp.city, exp.country].filter(Boolean).length > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>{[exp.city, exp.country].filter(Boolean).join(', ')}</span>
                                    </>
                                  )}
                                </div>
                                {exp.responsibilities && (
                                  <p className="text-[13px] text-[#334155] dark:text-[#CBD5E1] pt-1 leading-relaxed">
                                    {exp.responsibilities}
                                  </p>
                                )}
                                {exp.achievements && (
                                  <p className="text-[13px] text-[#059669] dark:text-[#34D399] leading-relaxed">
                                    <strong>Impact:</strong> {exp.achievements}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <span className="material-symbols-outlined text-[32px] text-[#94A3B8]">work</span>
                            <p className="text-[13px] font-medium text-[#14243B] dark:text-white">
                              No work experience added yet
                            </p>
                            <button
                              type="button"
                              onClick={handleStartEditing}
                              className="text-[13px] text-[#2563EB] hover:underline font-semibold"
                            >
                              + Add Work Experience
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SECTION 6: PROJECTS & HIGHLIGHTS */}
                    {activeSection === 'projects' && (
                      <div className="space-y-4">
                        {resumeData.projects && resumeData.projects.length > 0 ? (
                          <div className="space-y-3">
                            {resumeData.projects.map((proj, idx) => (
                              <div
                                key={idx}
                                className="p-4 bg-[#F8FAFC] dark:bg-[#1E293B]/50 rounded-xl border border-[#E2E8F0] dark:border-[#24334A] space-y-2"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                                  <h4 className="font-bold text-[14px] text-[#14243B] dark:text-white flex items-center gap-2">
                                    <span>{proj.name || 'Project'}</span>
                                    {proj.status && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] border border-[#BFDBFE] dark:border-[#3B82F6]/30">
                                        {proj.status}
                                      </span>
                                    )}
                                  </h4>
                                  {(proj.start_date || proj.end_date) && (
                                    <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
                                      {formatDateDisplay(proj.start_date)}
                                      {proj.start_date && proj.end_date ? ' — ' : ''}
                                      {formatDateDisplay(proj.end_date)}
                                    </span>
                                  )}
                                </div>
                                {proj.url && (
                                  <a
                                    href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[12px] text-[#2563EB] hover:underline break-all block"
                                  >
                                    {proj.url}
                                  </a>
                                )}
                                {proj.description && (
                                  <p className="text-[13px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                                    {proj.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center space-y-2">
                            <span className="material-symbols-outlined text-[32px] text-[#94A3B8]">folder_copy</span>
                            <p className="text-[13px] font-medium text-[#14243B] dark:text-white">
                              No projects added yet
                            </p>
                            <button
                              type="button"
                              onClick={handleStartEditing}
                              className="text-[13px] text-[#2563EB] hover:underline font-semibold"
                            >
                              + Add Project or Portfolio Highlight
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Resume Preview Modal (Centered modal with blurred backdrop and fluid animation) */}
        <ResumePreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          resumeData={resumeData}
          syncedResumeUrl={syncedResumeUrl}
          onSync={handleSyncResume}
          onDownload={handleDownloadResume}
          isSyncing={isSyncing}
          isDownloading={isDownloading}
        />
      </div>
    </div>
  )
}