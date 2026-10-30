/**
 * Centralized API Service Module for Resumint
 * Handles base URL configuration, headers, token attachment, and response error formatting.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

// Token & Session Management
// Cookie Helpers for resilient cross-tab persistence
function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

// Token & Session Management
export const getToken = () => {
  const token =
    localStorage.getItem('resumint_token') ||
    localStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    getCookie('resumint_token') ||
    getCookie('access_token') ||
    null

  // Sync back to localStorage if cookie has it
  if (token && !localStorage.getItem('resumint_token')) {
    localStorage.setItem('resumint_token', token)
  }
  return token
}

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('resumint_token', token)
    localStorage.setItem('access_token', token)
    localStorage.setItem('token', token)
    setCookie('resumint_token', token)
    setCookie('access_token', token)
  }
}

export const getRefreshToken = () =>
  localStorage.getItem('resumint_refresh_token') ||
  localStorage.getItem('refresh_token') ||
  getCookie('resumint_refresh_token') ||
  null

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('resumint_refresh_token', token)
    localStorage.setItem('refresh_token', token)
    setCookie('resumint_refresh_token', token)
  }
}

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('resumint_user') || localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setCurrentUser = (user) => {
  if (user) {
    const serialized = JSON.stringify(user)
    localStorage.setItem('resumint_user', serialized)
    localStorage.setItem('user', serialized)
  } else {
    localStorage.removeItem('resumint_user')
    localStorage.removeItem('user')
  }
}

export const clearSession = () => {
  localStorage.removeItem('resumint_token')
  localStorage.removeItem('access_token')
  localStorage.removeItem('token')
  localStorage.removeItem('resumint_refresh_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('resumint_user')
  localStorage.removeItem('user')
  localStorage.removeItem('resumint_is_verified')
  deleteCookie('resumint_token')
  deleteCookie('access_token')
  deleteCookie('resumint_refresh_token')
}

export const getDeviceId = () => {
  let devId = localStorage.getItem('resumint_device_id')
  if (!devId) {
    devId = 'dev-' + Math.random().toString(36).substring(2, 10)
    localStorage.setItem('resumint_device_id', devId)
  }
  return devId
}

// Refresh Token Management Queue (prevents multiple concurrent refresh calls)
let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

/**
 * Refresh access token using current refresh_token
 * cURL: POST /users/refresh-token
 * @param {string} [explicitRefreshToken]
 */
export async function refreshAccessToken(explicitRefreshToken) {
  const currentRefreshToken = explicitRefreshToken || getRefreshToken()
  if (!currentRefreshToken) {
    clearSession()
    throw new Error('No refresh token available')
  }

  const normalizedUrl = `${API_BASE_URL.replace(/\/+$/, '')}/users/refresh-token`

  const response = await fetch(normalizedUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: currentRefreshToken }),
  })

  let data = null
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  if (!response.ok) {
    clearSession()
    const errorMsg =
      (data && (data.msg || data.detail || data.message)) ||
      'Session expired. Please log in again.'
    const error = new Error(errorMsg)
    error.status = response.status
    throw error
  }

  const resData = data?.data || data
  const newAccessToken = resData?.access_token || data?.access_token
  const newRefreshToken = resData?.refresh_token || data?.refresh_token

  if (newAccessToken) {
    setToken(newAccessToken)
  }
  if (newRefreshToken) {
    setRefreshToken(newRefreshToken)
  }

  return newAccessToken
}

/**
 * Core HTTP Request Wrapper with automatic 401 Token Refresh Interceptor
 */
export async function apiClient(endpoint, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    _retry = false,
    ...customConfig
  } = options

  const token = getToken()
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const config = {
    method,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  }

  if (body !== undefined) {
    config.body = isFormData ? body : (typeof body === 'string' ? body : JSON.stringify(body))
  }

  const normalizedUrl = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`

  try {
    const response = await fetch(normalizedUrl, config)

    let data = null
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Intercept 401 Unauthorized: token expired
    if (
      response.status === 401 &&
      !_retry &&
      !endpoint.includes('/users/login') &&
      !endpoint.includes('/users/refresh-token')
    ) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const newAccessToken = await refreshAccessToken()
          isRefreshing = false
          onRefreshed(newAccessToken)
        } catch (refreshErr) {
          isRefreshing = false
          refreshSubscribers = []
          clearSession()
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth:unauthorized'))
          }
          throw refreshErr
        }
      }

      // Retry request once new token is ready
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newToken) => {
          resolve(
            apiClient(endpoint, {
              ...options,
              _retry: true,
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            })
          )
        })
      })
    }

    if (!response.ok) {
      const errorMessage =
        (data && (data.msg || data.detail || data.message || data.error)) ||
        `Request failed with status ${response.status}`
      const error = new Error(errorMessage)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const netError = new Error(
        'Unable to connect to server. Please ensure the backend is running at ' +
          API_BASE_URL
      )
      netError.status = 0
      throw netError
    }
    throw error
  }
}

/**
 * ==========================================
 * Centralized Endpoint Definitions
 * ==========================================
 */

export const ONBOARDING_STEPS = {
  personal_info: 1,
  professional_summary: 2,
  skills: 3,
  educational_info: 4,
  work_experience: 5,
  projects: 6,
}

/**
 * Determine view and resume editor step from user onboarding status
 * @param {{ onboarding_completed?: boolean, step_count?: number }} user
 * @returns {{ view: 'dashboard' | 'onboarding' | 'editor', step: number }}
 */
export function getOnboardingDestination(user) {
  if (!user) return { view: 'dashboard', step: 1 }

  if (user.onboarding_completed === true) {
    return { view: 'dashboard', step: 1 }
  }

  const stepCount = typeof user.step_count === 'number' ? user.step_count : Number(user.step_count) || 0
  if (stepCount <= 0) {
    return { view: 'onboarding', step: 1 }
  }

  // step_count represents completed steps count.
  // step_count = 1 means Step 1 (Personal Info) is completed -> open Step 2 directly.
  const nextStep = stepCount + 1
  if (nextStep > 6) {
    return { view: 'dashboard', step: 1 }
  }

  return { view: 'editor', step: Math.min(Math.max(nextStep, 1), 6) }
}

export const authApi = {
  /**
   * Fetch current authenticated user profile & onboarding progress
   * cURL: GET /users/me
   */
  getMe: async () => {
    const response = await apiClient('/users/me', {
      method: 'GET',
    })

    const user = response?.data || response
    if (user && user.id) {
      setCurrentUser(user)
      if (user.id) localStorage.setItem('resumint_user_id', user.id)
      if (user.email) localStorage.setItem('resumint_email', user.email)
      localStorage.setItem('resumint_is_verified', user.is_verified ? 'true' : 'false')
      if (typeof user.step_count !== 'undefined') {
        localStorage.setItem('resumint_step_count', String(user.step_count))
      }
      if (typeof user.onboarding_completed !== 'undefined') {
        localStorage.setItem('resumint_onboarding_completed', String(user.onboarding_completed))
      }
    }

    return response
  },

  /**
   * User Login
   * cURL: POST /users/login
   * @param {{ email: string, password: string, device_id?: string }} payload
   */
  login: async (payload) => {
    const response = await apiClient('/users/login', {
      method: 'POST',
      body: {
        device_id: payload.device_id || getDeviceId(),
        ...payload,
      },
    })

    // Automatically extract and persist tokens & user info from any response format
    const resData = response?.data || response
    const accessToken = resData?.access_token || response?.access_token
    const refreshToken = resData?.refresh_token || response?.refresh_token
    const user = resData?.user || response?.user

    if (accessToken) {
      setToken(accessToken)
    }
    if (refreshToken) {
      setRefreshToken(refreshToken)
    }
    if (user) {
      setCurrentUser(user)
      if (user.id) localStorage.setItem('resumint_user_id', user.id)
      if (user.email) localStorage.setItem('resumint_email', user.email)
      localStorage.setItem('resumint_is_verified', user.is_verified ? 'true' : 'false')
      if (typeof user.step_count !== 'undefined') {
        localStorage.setItem('resumint_step_count', String(user.step_count))
      }
      if (typeof user.onboarding_completed !== 'undefined') {
        localStorage.setItem('resumint_onboarding_completed', String(user.onboarding_completed))
      }
    }

    return response
  },

  /**
   * Refresh User Session & Tokens
   * cURL: POST /users/refresh-token
   * @param {{ refresh_token?: string }} [payload]
   */
  refreshToken: async (payload) => {
    const tokenToUse = payload?.refresh_token || getRefreshToken()
    return refreshAccessToken(tokenToUse)
  },

  /**
   * Register with email and password
   * cURL: POST /users/email-signup
   * @param {{ first_name: string, last_name: string, email: string, password: string }} payload
   */
  register: (payload) =>
    apiClient('/users/email-signup', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Verify User OTP
   * cURL: POST /users/verify-otp
   * @param {{ user_id: string, otp: string }} payload
   */
  verifyOtp: (payload) =>
    apiClient('/users/verify-otp', {
      method: 'POST',
      body: payload,
    }),
}

/**
 * Parse extracted resume data from upload response into local form state structure
 * @param {object} extractedData
 * @returns {object}
 */
export function parseExtractedResumeData(extractedData) {
  if (!extractedData) return null

  const pi = extractedData.personal_info || {}
  const summaryObj = extractedData.professional_summary || {}
  const skillsObj = extractedData.skills || {}
  const eduObj = extractedData.educational_info || {}
  const workObj = extractedData.work_experience || {}
  const projObj = extractedData.projects_info || {}

  const firstName = pi.first_name || ''
  const lastName = pi.last_name || ''
  const fullName = `${firstName} ${lastName}`.trim()

  const city = pi.city || ''
  const state = pi.state || ''
  const country = pi.country || ''
  const location = pi.address || [city, state, country].filter(Boolean).join(', ')

  const skillsList = Array.isArray(skillsObj.skills) ? skillsObj.skills : []

  return {
    first_name: firstName,
    last_name: lastName,
    fullName: fullName || 'Candidate',
    email: pi.email || '',
    phone: pi.phone || '',
    address: pi.address || '',
    city: city,
    state: state,
    zip_code: pi.zip_code || '',
    country: country,
    website: pi.website || '',
    portfolio: pi.website || '',
    github: pi.github || '',
    linkedin: pi.linkedin || '',
    location: location,

    summary: summaryObj.summary || '',

    skills: skillsList,
    tools: skillsList.slice(0, 8),
    technical: skillsList.slice(8, 18),
    leadership: skillsList.slice(18),

    education: (eduObj.educations || []).map((e) => ({
      degree: e.degree || '',
      school_name: e.school_name || e.institution || '',
      school: e.school_name || e.institution || '',
      start_date: e.start_date || '',
      startDate: e.start_date || '',
      end_date: e.end_date || '',
      endDate: e.end_date || '',
      gpa: e.gpa != null ? String(e.gpa) : '',
      field_of_study: e.field_of_study || '',
      field: e.field_of_study || '',
      url: e.url || '',
      is_current: Boolean(e.is_current),
    })),

    experience: (workObj.work_experience || []).map((w, idx) => ({
      job_title: w.job_title || '',
      title: w.job_title || '',
      company_name: w.company_name || '',
      company: w.company_name || '',
      city: w.city || '',
      state: w.state || '',
      country: w.country || '',
      location_type: w.location_type || 'Onsite',
      employment_type: w.employment_type || 'Full-time',
      type: w.employment_type || 'Full-time',
      is_currently_work_here: Boolean(w.is_currently_work_here),
      isCurrent: Boolean(w.is_currently_work_here),
      start_date: w.start_date || '',
      startDate: w.start_date || '',
      end_date: w.end_date || '',
      endDate: w.end_date || 'Present',
      responsibilities: w.responsibilities || '',
      achievements: w.achievements || '',
      bullets: [w.responsibilities, w.achievements].filter(Boolean),
      order: w.order || idx + 1,
    })),

    projects: (projObj.projects || []).map((p, idx) => ({
      name: p.name || '',
      description: p.description || '',
      url: p.url || '',
      liveUrl: p.url || '',
      githubUrl: p.url || '',
      start_date: p.start_date || 20230101,
      end_date: p.end_date || 20230830,
      status: p.status || 'Completed',
      responsibilities: p.responsibilities || '',
      achievements: p.achievements || '',
      bullets: [p.description, p.responsibilities, p.achievements].filter(Boolean),
      order: p.order || idx + 1,
    })),
  }
}

export const resumeApi = {
  /**
   * Get Personal Information
   * cURL: GET /resume/personal-info
   */
  getPersonalInfo: () =>
    apiClient('/resume/personal-info', {
      method: 'GET',
    }),
  /**
   * Save Personal Information
   * cURL: POST /resume/save-personal-info
   * @param {{
   *   first_name: string,
   *   last_name: string,
   *   email: string,
   *   phone: string,
   *   address: string,
   *   city: string,
   *   state: string,
   *   zip_code: string,
   *   country: string,
   *   website: string,
   *   github: string,
   *   linkedin: string
   * }} payload
   */
  savePersonalInfo: (payload) =>
    apiClient('/resume/save-personal-info', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Save Professional Summary
   * cURL: POST /resume/save-professional-summary
   * @param {{ summary: string }} payload
   */
  /**
   * Update (Edit) Personal Information
   * cURL: PATCH /resume/update-personal-info
   * @param {object} payload
   */
  updatePersonalInfo: (payload) =>
    apiClient('/resume/update-personal-info', {
      method: 'PATCH',
      body: payload,
    }),

  /**
   * Get Professional Summary
   * cURL: GET /resume/professional-summary
   */
  getProfessionalSummary: () =>
    apiClient('/resume/professional-summary', {
      method: 'GET',
    }),

  saveProfessionalSummary: (payload) =>
    apiClient('/resume/save-professional-summary', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Save Skills
   * cURL: POST /resume/save-skills
   * @param {{ skills: string[] }} payload
   */
  /**
   * Update (Edit) Professional Summary
   * cURL: PATCH /resume/update-professional-summary
   * @param {{ summary: string }} payload
   */
  updateProfessionalSummary: (payload) =>
    apiClient('/resume/update-professional-summary', {
      method: 'PATCH',
      body: payload,
    }),

  /**
   * Improve Professional Summary with AI
   * cURL: POST /resume/improve-summary
   * @param {{ tone?: string, summary: string }} payload
   */
  improveSummary: (payload) =>
    apiClient('/resume/improve-summary', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Get Skills
   * cURL: GET /resume/skills
   */
  getSkills: () =>
    apiClient('/resume/skills', {
      method: 'GET',
    }),

  saveSkills: (payload) =>
    apiClient('/resume/save-skills', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Update (Edit) Skills
   * cURL: PATCH /resume/update-skills
   * @param {{ skills: string[] }} payload
   */
  updateSkills: (payload) =>
    apiClient('/resume/update-skills', {
      method: 'PATCH',
      body: payload,
    }),

  /**
   * Save Educational Information
   * cURL: POST /resume/save-educational-info
   * @param {{ educations: Array<{
   *   degree: string,
   *   school_name: string,
   *   start_date: string,
   *   end_date: string,
   *   gpa: string,
   *   field_of_study: string,
   *   url?: string,
   *   is_current?: boolean
   * }> }} payload
   */
  /**
   * Get Educational Information
   * cURL: GET /resume/educational-info
   */
  getEducationalInfo: () =>
    apiClient('/resume/educational-info', {
      method: 'GET',
    }),

  saveEducationalInfo: (payload) =>
    apiClient('/resume/save-educational-info', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Update Educational Information
   * cURL: PATCH /resume/update-educational-info
   * @param {{ educations: Array<object> }} payload
   */
  updateEducationalInfo: (payload) =>
    apiClient('/resume/update-educational-info', {
      method: 'PATCH',
      body: payload,
    }),

  /**
   * Get Work Experience
   * cURL: GET /resume/work-experience
   */
  getWorkExperience: () =>
    apiClient('/resume/work-experience', {
      method: 'GET',
    }),

  saveWorkExperience: (payload) =>
    apiClient('/resume/save-work-experience', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Update Work Experience
   * cURL: PATCH /resume/update-work-experience
   * @param {{ work_experience: Array<object> }} payload
   */
  updateWorkExperience: (payload) =>
    apiClient('/resume/update-work-experience', {
      method: 'PATCH',
      body: payload,
    }),

  /**
   * Get Projects Information
   * cURL: GET /resume/projects-info
   */
  getProjectsInfo: () =>
    apiClient('/resume/projects-info', {
      method: 'GET',
    }),

  saveProjectsInfo: (payload) =>
    apiClient('/resume/save-projects-info', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Update Projects Information
   * cURL: PATCH /resume/update-projects-info
   * @param {{ projects: Array<object> }} payload
   */
  updateProjectsInfo: (payload) =>
    apiClient('/resume/update-projects-info', {
      method: 'PATCH',
      body: payload,
    }),

  /**
   * Analyze Job Description against Resume
   * cURL: POST /job-description/analyze
   * @param {{ job_title: string, company_name: string, job_description: string }} payload
   */
  analyzeJobDescription: (payload) =>
    apiClient('/job-description/analyze', {
      method: 'POST',
      body: payload,
    }),

  /**
   * Upload Resume file & Extract Information
   * cURL: POST /resume/upload
   * @param {FormData} formData
   */
  uploadResume: (formData) =>
    apiClient('/resume/upload', {
      method: 'POST',
      body: formData,
    }),

  /**
   * Get History of Job Description Analyses
   * cURL: GET /job-description/
   */
  getJobDescriptionHistory: () =>
    apiClient('/job-description/', {
      method: 'GET',
    }),

  /**
   * Get Individual Job Description Analysis Preview Data
   * cURL: GET /job-description/:id
   * @param {string} id
   */
  getJobDescriptionById: (id) =>
    apiClient(`/job-description/${id}`, {
      method: 'GET',
    }),

  /**
   * Delete a Job Description Analysis from history
   * cURL: DELETE /job-description/:id
   * Response: { status: 200, msg: 'Job description analysis deleted successfully', data: null }
   * @param {string} id
   */
  deleteJobDescription: (id) =>
    apiClient(`/job-description/${id}`, {
      method: 'DELETE',
    }),
}

export default {
  client: apiClient,
  auth: authApi,
  resume: resumeApi,
  refreshAccessToken,
  getOnboardingDestination,
  ONBOARDING_STEPS,
}
