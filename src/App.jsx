import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import HowItWorks from './components/HowItWorks/HowItWorks'
import Templates from './components/Templates/Templates'
import AtsAudit from './components/AtsAudit/AtsAudit'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import AuthPage from './components/auth/AuthPage'

// Newly Implemented Screens matching Stitch Spec
import OnboardingPage from './components/onboarding/OnboardingPage'
import DashboardPage from './components/dashboard/DashboardPage'
import ResumeEditor from './components/editor/ResumeEditor'
import MyResumesPage from './components/resumes/MyResumesPage'
import AnalyzeJobPage from './components/analyzer/AnalyzeJobPage'
import JobAnalysisResultsPage from './components/analyzer/JobAnalysisResultsPage'
import AnalysisHistoryPage from './components/history/AnalysisHistoryPage'
import ProfileSettingsPage from './components/settings/ProfileSettingsPage'
import {
  getToken,
  clearSession,
  getCurrentUser,
  authApi,
  getOnboardingDestination,
} from './services/api'

// Screens that strictly require authentication
const PROTECTED_VIEWS = new Set([
  'onboarding',
  'dashboard',
  'editor',
  'my-resumes',
  'analyze-job',
  'analysis-results',
  'analysis-history',
  'profile-settings',
])

const VALID_VIEWS = new Set([
  'landing',
  'auth',
  'onboarding',
  'dashboard',
  'editor',
  'my-resumes',
  'analyze-job',
  'analysis-results',
  'analysis-history',
  'profile-settings',
])

function parseLocation() {
  // Check hash first (e.g. #/dashboard or #dashboard or #login)
  const hash = window.location.hash.replace(/^#[/]?/, '').toLowerCase().trim()
  if (hash) {
    if (hash === 'login' || hash === 'signup' || hash === 'otp') {
      return { view: 'auth', authTab: hash }
    }
    if (VALID_VIEWS.has(hash)) {
      return { view: hash, authTab: 'login' }
    }
  }

  // Check pathname (e.g. /dashboard or /login)
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().trim()
  if (!path || path === 'home' || path === 'landing') {
    return { view: 'landing', authTab: 'login' }
  }
  if (path === 'login' || path === 'signup' || path === 'otp') {
    return { view: 'auth', authTab: path }
  }
  if (path === 'auth') {
    return { view: 'auth', authTab: 'login' }
  }
  if (VALID_VIEWS.has(path)) {
    return { view: path, authTab: 'login' }
  }

  return { view: 'landing', authTab: 'login' }
}

export default function App() {
  const [authTokenState, setAuthTokenState] = useState(() => getToken())
  const [editorStep, setEditorStep] = useState(() => {
    const user = getCurrentUser()
    const dest = getOnboardingDestination(user)
    return dest.step || 1
  })

  const resolveViewWithAuth = useCallback((targetView, targetAuthTab = 'login', userProfile = null) => {
    const token = getToken()
    const isAuthenticated = Boolean(token)

    // Unauthenticated user trying to access a protected screen -> redirect to login
    if (!isAuthenticated && PROTECTED_VIEWS.has(targetView)) {
      return { view: 'auth', authTab: 'login', wasRedirected: true }
    }

    // Authenticated user
    if (isAuthenticated) {
      const activeUser = userProfile || getCurrentUser()
      const dest = getOnboardingDestination(activeUser)

      // If user has NOT completed onboarding:
      if (activeUser && activeUser.onboarding_completed === false) {
        // Only when onboarding_completed is true can user access Dashboard. Otherwise resume at step or onboarding
        if (targetView === 'dashboard' || targetView === 'landing' || targetView === 'auth') {
          return { view: dest.view, authTab: 'login', step: dest.step, wasRedirected: targetView === 'dashboard' }
        }
      }

      // If user is authenticated and visits landing or auth, route based on onboarding completion
      if (targetView === 'landing' || targetView === 'auth') {
        const destination = activeUser?.onboarding_completed === true ? 'dashboard' : dest.view
        return { view: destination, authTab: 'login', step: dest.step, wasRedirected: false }
      }
    }

    return { view: targetView, authTab: targetAuthTab, wasRedirected: false }
  }, [])

  const initialParsed = parseLocation()
  const initialResolved = resolveViewWithAuth(initialParsed.view, initialParsed.authTab)

  const [currentView, setCurrentView] = useState(initialResolved.view)
  const [currentAuthTab, setCurrentAuthTab] = useState(initialResolved.authTab)

  // Sync URL on popstate / hashchange, protect routes, and refresh /me onboarding status
  useEffect(() => {
    const handleUrlChange = () => {
      const token = getToken()
      setAuthTokenState(token)

      const loc = parseLocation()
      const resolved = resolveViewWithAuth(loc.view, loc.authTab)

      if (resolved.wasRedirected) {
        window.history.replaceState(null, '', '/login')
        setCurrentAuthTab('login')
        setCurrentView('auth')
      } else {
        if (resolved.view !== loc.view) {
          window.history.replaceState(null, '', `/${resolved.view}`)
        }
        if (resolved.step) {
          setEditorStep(resolved.step)
        }
        setCurrentView(resolved.view)
        setCurrentAuthTab(resolved.authTab)
      }
    }

    const handleUnauthorized = () => {
      setAuthTokenState(null)
      setCurrentAuthTab('login')
      setCurrentView('auth')
      window.history.replaceState(null, '', '/login')
    }

    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    window.addEventListener('auth:unauthorized', handleUnauthorized)

    // Initial check on load
    const initialLoc = parseLocation()
    const resolved = resolveViewWithAuth(initialLoc.view, initialLoc.authTab)
    if (resolved.wasRedirected) {
      window.history.replaceState(null, '', '/login')
    } else if (resolved.view !== initialLoc.view) {
      window.history.replaceState(null, '', `/${resolved.view}`)
    }

    // Call /users/me on load to synchronize onboarding state
    if (getToken()) {
      authApi.getMe().then((meRes) => {
        const user = meRes?.data || meRes
        if (user) {
          const dest = getOnboardingDestination(user)
          if (dest.step) {
            setEditorStep(dest.step)
          }

          // If onboarding is not completed, redirect away from dashboard to their resume step
          if (user.onboarding_completed === false) {
            const loc = parseLocation()
            if (loc.view === 'dashboard' || loc.view === 'landing' || loc.view === 'auth') {
              setCurrentView(dest.view)
              localStorage.setItem('resumint_current_view', dest.view)
              window.history.replaceState(null, '', `/${dest.view}`)
            }
          }
        }
      }).catch((err) => {
        console.warn('Initial /me check notice:', err)
      })
    }

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [resolveViewWithAuth])

  const handleNavigate = (view) => {
    const resolved = resolveViewWithAuth(view, 'login')
    if (resolved.wasRedirected) {
      setCurrentAuthTab('login')
      setCurrentView('auth')
      window.history.pushState(null, '', '/login')
    } else {
      localStorage.setItem('resumint_current_view', resolved.view)
      setCurrentView(resolved.view)
      window.history.pushState(null, '', `/${resolved.view}`)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateLogin = () => {
    setCurrentAuthTab('login')
    setCurrentView('auth')
    window.history.pushState(null, '', '/login')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateSignup = () => {
    setCurrentAuthTab('signup')
    setCurrentView('auth')
    window.history.pushState(null, '', '/signup')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateHome = () => {
    setCurrentView('landing')
    window.history.pushState(null, '', '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = () => {
    clearSession()
    localStorage.removeItem('resumint_current_view')
    setAuthTokenState(null)
    setCurrentAuthTab('login')
    setCurrentView('landing')
    window.history.pushState(null, '', '/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Active authentication guard for rendering
  const isAuthenticated = Boolean(authTokenState || getToken())
  const effectiveView = PROTECTED_VIEWS.has(currentView) && !isAuthenticated ? 'auth' : currentView
  const effectiveAuthTab = PROTECTED_VIEWS.has(currentView) && !isAuthenticated ? 'login' : currentAuthTab

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default text-body-default antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen relative">
      {/* 1. PUBLIC LANDING PAGE */}
      {effectiveView === 'landing' && (
        <>
          <Header
            onNavigateLogin={handleNavigateLogin}
            onNavigateSignup={handleNavigateSignup}
            onNavigateHome={handleNavigateHome}
          />
          <main>
            <Hero onGetStarted={handleNavigateSignup} />
            <Features />
            <HowItWorks />
            <Templates />
            <AtsAudit />
            <CtaSection onGetStarted={handleNavigateSignup} />
          </main>
          <Footer />
        </>
      )}

      {/* 2. AUTHENTICATION & OTP */}
      {effectiveView === 'auth' && (
        <AuthPage
          currentAuthTab={effectiveAuthTab}
          setCurrentAuthTab={setCurrentAuthTab}
          onNavigateHome={handleNavigateHome}
          onLoginSuccess={async (loginData) => {
            const token = getToken()
            setAuthTokenState(token)

            let user = loginData?.user || getCurrentUser()
            try {
              const meRes = await authApi.getMe()
              if (meRes?.data) {
                user = meRes.data
              }
            } catch (err) {
              console.warn('Failed to fetch /me profile on login:', err)
            }

            const dest = getOnboardingDestination(user)
            if (dest.step) {
              setEditorStep(dest.step)
            }
            localStorage.setItem('resumint_current_view', dest.view)
            setCurrentView(dest.view)
            window.history.pushState(null, '', `/${dest.view}`)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onVerifiedSuccess={() => {
            const token = getToken()
            if (token) {
              setAuthTokenState(token)
              setCurrentView('onboarding')
              window.history.pushState(null, '', '/onboarding')
            } else {
              setCurrentAuthTab('login')
              setCurrentView('auth')
              window.history.pushState(null, '', '/login')
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      {/* 3. FIRST-TIME ONBOARDING (PROTECTED) */}
      {effectiveView === 'onboarding' && (
        <OnboardingPage
          onStartScratch={() => {
            localStorage.removeItem('resumint_extracted_resume')
            handleNavigate('editor')
          }}
          onUploadResume={() => handleNavigate('editor')}
          onSignOut={handleLogout}
        />
      )}

      {/* 4. MAIN DASHBOARD (PROTECTED) */}
      {effectiveView === 'dashboard' && (
        <DashboardPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {/* 5. RESUME EDITOR (STEPS 1 TO 6 + LIVE PREVIEW) (PROTECTED) */}
      {effectiveView === 'editor' && (
        <ResumeEditor onExitSetup={() => handleNavigate('dashboard')} initialStep={editorStep} />
      )}

      {/* 6. MY RESUMES & PREVIEW (PROTECTED) */}
      {effectiveView === 'my-resumes' && (
        <MyResumesPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {/* 7. ANALYZE JOB DESCRIPTION (PROTECTED) */}
      {effectiveView === 'analyze-job' && (
        <AnalyzeJobPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onAnalysisDone={() => handleNavigate('analysis-results')}
        />
      )}

      {/* 8. JOB ANALYSIS RESULTS (PROTECTED) */}
      {effectiveView === 'analysis-results' && (
        <JobAnalysisResultsPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {/* 9. ANALYSIS HISTORY (PROTECTED) */}
      {effectiveView === 'analysis-history' && (
        <AnalysisHistoryPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {/* 10. PROFILE & SETTINGS (PROTECTED) */}
      {effectiveView === 'profile-settings' && (
        <ProfileSettingsPage
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

    </div>
  )
}
