import AuthBrandPanel from './AuthBrandPanel'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import OtpVerificationForm from './OtpVerificationForm'

export default function AuthPage({ currentAuthTab, setCurrentAuthTab, onNavigateHome, onVerifiedSuccess }) {
  return (
    <div className="bg-[#F5F8FC] text-on-surface h-full flex flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <div className="min-h-full flex flex-col lg:flex-row w-full flex-1">
        {/* LEFT PANEL: Brand Showcase */}
        <AuthBrandPanel onNavigateHome={onNavigateHome} />

        {/* RIGHT PANEL: Authentication Form Area */}
        <main className="lg:w-1/2 bg-white flex flex-col justify-center items-center p-space-md sm:p-space-lg md:p-margin lg:p-space-xl border-l border-[#DCE5F0] order-1 lg:order-2 min-h-screen">
          {/* Responsive Mobile-Only Header Brand Bar */}
          <div className="w-full max-w-[440px] flex items-center justify-between pb-space-md mb-space-md border-b border-[#DCE5F0] lg:hidden">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-space-xs text-left cursor-pointer"
              type="button"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </div>
              <span className="font-headline-section text-[20px] font-bold text-[#102544]">Resumint</span>
            </button>
            <span className="font-badge-label text-badge-label bg-[#EFF6FF] text-primary px-2 py-0.5 rounded border border-primary/20">
              AI PLATFORM
            </span>
          </div>

          {/* Main Form Wrapper */}
          <div className="w-full max-w-[440px] flex flex-col">
            {/* Show Segmented Tab Switcher (Log In / Sign Up) only when not in OTP view */}
            {currentAuthTab !== 'otp' ? (
              <div
                aria-label="Authentication Options"
                className="bg-[#F1F5F9] p-1 rounded-lg flex items-center mb-space-lg border border-[#E2E8F0]"
                role="tablist"
              >
                <button
                  aria-controls="panel-login"
                  aria-selected={currentAuthTab === 'login'}
                  className={`flex-1 py-2 text-center rounded-md font-body-semibold text-body-semibold transition-all duration-150 cursor-pointer ${
                    currentAuthTab === 'login'
                      ? 'bg-white text-[#2563EB] shadow-sm'
                      : 'text-[#64748B] hover:text-[#102544]'
                  }`}
                  id="tab-login"
                  role="tab"
                  type="button"
                  onClick={() => setCurrentAuthTab('login')}
                >
                  Log In
                </button>
                <button
                  aria-controls="panel-signup"
                  aria-selected={currentAuthTab === 'signup'}
                  className={`flex-1 py-2 text-center rounded-md font-body-semibold text-body-semibold transition-all duration-150 cursor-pointer ${
                    currentAuthTab === 'signup'
                      ? 'bg-white text-[#2563EB] shadow-sm'
                      : 'text-[#64748B] hover:text-[#102544]'
                  }`}
                  id="tab-signup"
                  role="tab"
                  type="button"
                  onClick={() => setCurrentAuthTab('signup')}
                >
                  Sign Up
                </button>
              </div>
            ) : null}

            {/* View Switching */}
            {currentAuthTab === 'login' && (
              <LoginForm
                onSwitchToSignup={() => setCurrentAuthTab('signup')}
                onSubmitLogin={() => setCurrentAuthTab('otp')}
              />
            )}

            {currentAuthTab === 'signup' && (
              <SignupForm
                onSwitchToLogin={() => setCurrentAuthTab('login')}
                onSubmitSignup={() => setCurrentAuthTab('otp')}
              />
            )}

            {currentAuthTab === 'otp' && (
              <OtpVerificationForm
                onBackToLogin={() => setCurrentAuthTab('login')}
                onVerifiedSuccess={onVerifiedSuccess}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
