import { useState } from 'react'
import { authApi, setToken, setRefreshToken, setCurrentUser } from '../../services/api'

export default function LoginForm({ onSwitchToSignup, onSubmitLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(() => localStorage.getItem('resumint_email') || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const response = await authApi.login({
        email: email.trim(),
        password,
      })

      const resData = response?.data || response
      const accessToken = resData?.access_token || response?.access_token

      if (accessToken) {
        setToken(accessToken)
        const refreshToken = resData?.refresh_token || response?.refresh_token
        if (refreshToken) setRefreshToken(refreshToken)
        const user = resData?.user || response?.user
        if (user) setCurrentUser(user)

        setSuccessMessage(response?.msg || 'User Login Successfully!')
        if (onSubmitLogin) {
          onSubmitLogin(resData)
        }
      } else {
        setErrorMessage(response?.msg || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login Error:', err)
      setErrorMessage(err.message || 'Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="transition-opacity duration-200" id="panel-login" role="tabpanel">
      <div className="mb-space-lg text-left">
        <h2 className="font-headline-page text-[28px] font-bold text-[#14243B] tracking-tight">
          Welcome Back
        </h2>
        <p className="font-body-default text-body-default text-[#64748B] mt-1">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social Auth Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs mb-space-md">
        {/* Google Button */}
        <button
          className="h-[44px] px-3 border border-[#DCE5F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] rounded-lg text-[#14243B] font-body-medium text-body-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          type="button"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              fill="#34A853"
            ></path>
            <path
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              fill="#EA4335"
            ></path>
          </svg>
          <span>Google</span>
        </button>

        {/* LinkedIn Button */}
        <button
          className="h-[44px] px-3 border border-[#DCE5F0] hover:border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] rounded-lg text-[#14243B] font-body-medium text-body-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          type="button"
        >
          <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0-.01-3.19 1.59 1.59 0 0 0 .01 3.19M7.86 18.5V10.1h-2.8v8.4h2.8z"></path>
          </svg>
          <span>LinkedIn</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-space-md">
        <div className="border-t border-[#DCE5F0] w-full"></div>
        <span className="bg-white px-3 font-caption-helper text-caption-helper text-[#94A3B8] whitespace-nowrap">
          or sign in with email
        </span>
        <div className="border-t border-[#DCE5F0] w-full"></div>
      </div>

      {/* Form Fields */}
      <form className="space-y-space-md" id="login-form" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="space-y-space-2xs text-left">
          <label className="block font-label-form text-label-form text-[#14243B]" htmlFor="login-email">
            Work or Personal Email
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-lg font-body-default text-body-default text-[#14243B] placeholder-[#94A3B8] outline-none transition-all"
              id="login-email"
              name="email"
              placeholder="alex.morgan@design.io"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-space-2xs text-left">
          <label className="block font-label-form text-label-form text-[#14243B]" htmlFor="login-password">
            Password
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] pl-3.5 pr-10 bg-white border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-lg font-body-default text-body-default text-[#14243B] placeholder-[#94A3B8] outline-none transition-all"
              id="login-password"
              name="password"
              placeholder="••••••••••••"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#102544] transition-colors p-1 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] align-middle">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Controls Row: Remember & Forgot */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              className="w-[18px] h-[18px] rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/30 cursor-pointer"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="font-body-default text-body-default text-[#64748B]">Remember me</span>
          </label>
          <a className="font-body-semibold text-[13px] text-[#2563EB] hover:underline transition-colors" href="#">
            Forgot password?
          </a>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-left text-red-700">
            <span className="material-symbols-outlined text-[20px] text-[#DC2626] shrink-0">error</span>
            <span className="font-caption-helper text-[13px]">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-left text-emerald-700">
            <span className="material-symbols-outlined text-[20px] text-[#16A34A] shrink-0">check_circle</span>
            <span className="font-caption-helper text-[13px] font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <button
          className="w-full h-[44px] bg-primary-container hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </>
          )}
        </button>

        {/* Feedback helper / status banner */}
        <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-blue-200/60 flex items-center gap-2 text-left">
          <span className="material-symbols-outlined text-[18px] text-[#2563EB]">info</span>
          <span className="font-caption-helper text-[12px] text-[#1E40AF]">
            Protected by enterprise 256-bit SSL encryption.
          </span>
        </div>
      </form>

      {/* Footer Switch to Signup */}
      <div className="mt-space-lg text-center font-body-default text-body-default text-[#64748B]">
        Don't have an account?{' '}
        <button
          className="font-body-semibold text-body-semibold text-[#2563EB] hover:underline ml-1 cursor-pointer"
          onClick={onSwitchToSignup}
          type="button"
        >
          Create an account
        </button>
      </div>
    </div>
  )
}
