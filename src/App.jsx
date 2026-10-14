import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero/Hero'
import Features from './components/Features/Features'
import HowItWorks from './components/HowItWorks/HowItWorks'
import Templates from './components/Templates/Templates'
import AtsAudit from './components/AtsAudit/AtsAudit'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import AuthPage from './components/auth/AuthPage'

export default function App() {
  // 'landing' | 'auth'
  const [currentView, setCurrentView] = useState('landing')
  // 'login' | 'signup' | 'otp'
  const [currentAuthTab, setCurrentAuthTab] = useState('login')

  const handleNavigateLogin = () => {
    setCurrentAuthTab('login')
    setCurrentView('auth')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNavigateSignup = () => {
    setCurrentAuthTab('signup')
    setCurrentView('auth')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  const handleNavigateHome = () => {
    setCurrentView('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default text-body-default antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen relative">
      {/* Screen Views */}
      {currentView === 'landing' ? (
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
      ) : (
        <AuthPage
          currentAuthTab={currentAuthTab}
          setCurrentAuthTab={setCurrentAuthTab}
          onNavigateHome={handleNavigateHome}
          onVerifiedSuccess={() => {
            alert('Email verified successfully! Welcome to Resumint.')
            setCurrentView('landing')
          }}
        />
      )}
    </div>
  )
}
