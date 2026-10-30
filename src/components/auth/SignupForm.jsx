import { useState, useMemo } from 'react'
import { authApi } from '../../services/api'

// Helper function to evaluate password strength and pattern rules
function evaluatePasswordStrength(pass) {
  if (!pass) {
    return {
      score: 0,
      label: '',
      color: '',
      barColor: 'bg-[#E2E8F0]',
      icon: '',
      rules: {
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
      },
    }
  }

  const rules = {
    minLength: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasLower: /[a-z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
    hasSpecial: /[^A-Za-z0-9]/.test(pass),
  }

  const passedCount = Object.values(rules).filter(Boolean).length

  let score = 1
  let label = 'Weak'
  let color = 'text-[#EF4444]'
  let barColor = 'bg-[#EF4444]'
  let icon = 'cancel'

  if (rules.minLength && passedCount === 5) {
    score = 4
    label = 'Strong'
    color = 'text-[#16A34A]'
    barColor = 'bg-[#16A34A]'
    icon = 'check_circle'
  } else if (rules.minLength && passedCount >= 3) {
    score = 3
    label = 'Good'
    color = 'text-[#2563EB]'
    barColor = 'bg-[#2563EB]'
    icon = 'check_circle'
  } else if (pass.length >= 6 && passedCount >= 2) {
    score = 2
    label = 'Fair'
    color = 'text-[#F59E0B]'
    barColor = 'bg-[#F59E0B]'
    icon = 'info'
  } else {
    score = 1
    label = 'Weak'
    color = 'text-[#EF4444]'
    barColor = 'bg-[#EF4444]'
    icon = 'cancel'
  }

  return { score, label, color, barColor, icon, rules }
}

export default function SignupForm({ onSwitchToLogin, onSubmitSignup }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [termsAgreed, setTermsAgreed] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const strength = useMemo(() => evaluatePasswordStrength(password), [password])

  // Confirm password real-time validation and color indicator
  const confirmStatus = useMemo(() => {
    if (!confirmPassword) {
      return {
        status: 'empty',
        label: '',
        color: '',
        bar1: 'bg-[#E2E8F0]',
        bar2: 'bg-[#E2E8F0]',
        icon: '',
        borderColor: 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20',
        message: 'Re-enter your password to confirm.',
        msgColor: 'text-[#94A3B8]',
      }
    }

    if (password && confirmPassword === password) {
      return {
        status: 'matched',
        label: 'Passwords match',
        color: 'text-[#16A34A]',
        bar1: 'bg-[#16A34A]',
        bar2: 'bg-[#16A34A]',
        icon: 'check_circle',
        borderColor: 'border-[#16A34A] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20',
        message: 'Passwords match perfectly.',
        msgColor: 'text-[#16A34A] font-medium',
      }
    }

    if (password && password.startsWith(confirmPassword)) {
      return {
        status: 'matching',
        label: 'Matching...',
        color: 'text-[#F59E0B]',
        bar1: 'bg-[#F59E0B]',
        bar2: 'bg-[#E2E8F0]',
        icon: 'pending',
        borderColor: 'border-[#F59E0B] focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20',
        message: 'Keep typing to match password.',
        msgColor: 'text-[#F59E0B]',
      }
    }

    return {
      status: 'mismatch',
      label: 'Passwords do not match',
      color: 'text-[#EF4444]',
      bar1: 'bg-[#EF4444]',
      bar2: 'bg-[#E2E8F0]',
      icon: 'cancel',
      borderColor: 'border-[#EF4444] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20',
      message: 'Passwords do not match.',
      msgColor: 'text-[#EF4444]',
    }
  }, [password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!password || password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.')
      return
    }

    if (!/[A-Z]/.test(password)) {
      setErrorMsg('Password must contain at least one uppercase letter.')
      return
    }

    if (!/[a-z]/.test(password)) {
      setErrorMsg('Password must contain at least one lowercase letter.')
      return
    }

    if (!/[0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one number.')
      return
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setErrorMsg('Password must contain at least one special character.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (!termsAgreed) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    // Split Full Name into first_name and last_name
    const nameParts = name.trim().split(/\s+/)
    const first_name = nameParts[0] || 'User'
    const last_name = nameParts.slice(1).join(' ') || ''

    setIsLoading(true)
    try {
      const response = await authApi.register({
        first_name,
        last_name,
        email: email.trim(),
        password,
      })

      setSuccessMsg(response?.msg || 'User Verification Email Sent')

      if (onSubmitSignup) {
        setTimeout(() => {
          onSubmitSignup({
            email: email.trim(),
            user: response?.data,
          })
        }, 600)
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="transition-opacity duration-200" id="panel-signup" role="tabpanel">
      <div className="mb-space-lg text-left">
        <h2 className="font-headline-page text-[28px] font-bold text-[#14243B] tracking-tight">
          Create your Account
        </h2>
        <p className="font-body-default text-body-default text-[#64748B] mt-1">
          Start building an ATS-optimized resume in minutes.
        </p>
      </div>

      {/* Social Auth Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs mb-space-md">
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
          or register with email
        </span>
        <div className="border-t border-[#DCE5F0] w-full"></div>
      </div>

      {/* Form Fields */}
      <form className="space-y-3.5" id="signup-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="space-y-space-2xs text-left">
          <label className="block font-label-form text-label-form text-[#14243B]" htmlFor="signup-name">
            Full Name
          </label>
          <input
            className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-lg font-body-default text-body-default text-[#14243B] placeholder-[#94A3B8] outline-none transition-all"
            id="signup-name"
            placeholder="Alex Morgan"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email Address */}
        <div className="space-y-space-2xs text-left">
          <label className="block font-label-form text-label-form text-[#14243B]" htmlFor="signup-email">
            Email Address
          </label>
          <input
            className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-lg font-body-default text-body-default text-[#14243B] placeholder-[#94A3B8] outline-none transition-all"
            id="signup-email"
            placeholder="alex.morgan@design.io"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password + Dynamic Strength Meter */}
        <div className="space-y-space-2xs text-left">
          <div className="flex justify-between items-center">
            <label className="block font-label-form text-label-form text-[#14243B]" htmlFor="signup-password">
              Password
            </label>
            {password && strength.label && (
              <span className={`font-caption-helper text-[11px] font-semibold ${strength.color} flex items-center gap-1 transition-all`}>
                <span className="material-symbols-outlined text-[14px]">{strength.icon}</span> {strength.label}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              className="w-full h-[44px] pl-3.5 pr-10 bg-white border border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 rounded-lg font-body-default text-body-default text-[#14243B] placeholder-[#94A3B8] outline-none transition-all"
              id="signup-password"
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

          {/* Dynamic 4-Segment Password Strength Progress Bar */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-colors duration-300 ${
                  index <= strength.score ? strength.barColor : 'bg-[#E2E8F0]'
                }`}
              />
            ))}
          </div>

          {/* Password pattern requirement feedback */}
          {password ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 text-[11px] font-caption-helper">
              <div className={`flex items-center gap-1 transition-colors ${strength.rules.minLength ? 'text-[#16A34A] font-medium' : 'text-[#94A3B8]'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {strength.rules.minLength ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>8+ characters</span>
              </div>
              <div className={`flex items-center gap-1 transition-colors ${strength.rules.hasUpper && strength.rules.hasLower ? 'text-[#16A34A] font-medium' : 'text-[#94A3B8]'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {strength.rules.hasUpper && strength.rules.hasLower ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Upper & lower case</span>
              </div>
              <div className={`flex items-center gap-1 transition-colors ${strength.rules.hasNumber ? 'text-[#16A34A] font-medium' : 'text-[#94A3B8]'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {strength.rules.hasNumber ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>At least 1 number</span>
              </div>
              <div className={`flex items-center gap-1 transition-colors ${strength.rules.hasSpecial ? 'text-[#16A34A] font-medium' : 'text-[#94A3B8]'}`}>
                <span className="material-symbols-outlined text-[13px]">
                  {strength.rules.hasSpecial ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>Special character (!@#$)</span>
              </div>
            </div>
          ) : (
            <p className="font-caption-helper text-[11px] text-[#94A3B8] pt-0.5">
              Minimum 8 characters with letters, numbers & symbols.
            </p>
          )}
        </div>

        {/* Confirm Password + Dynamic Match Progress & Color Bar */}
        <div className="space-y-space-2xs text-left">
          <div className="flex justify-between items-center">
            <label className="block font-label-form text-label-form text-[#14243B]" htmlFor="signup-confirm-password">
              Confirm Password
            </label>
            {confirmPassword && confirmStatus.label && (
              <span className={`font-caption-helper text-[11px] font-semibold ${confirmStatus.color} flex items-center gap-1 transition-all`}>
                <span className="material-symbols-outlined text-[14px]">{confirmStatus.icon}</span> {confirmStatus.label}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] pl-3.5 pr-10 bg-white border rounded-lg font-body-default text-body-default text-[#14243B] placeholder-[#94A3B8] outline-none transition-all ${confirmStatus.borderColor}`}
              id="signup-confirm-password"
              placeholder="••••••••••••"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#102544] transition-colors p-1 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] align-middle">
                {showConfirmPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Dynamic 2-Segment Confirm Password Match Progress Bar */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div className={`h-1.5 rounded-full transition-colors duration-300 ${confirmStatus.bar1}`} />
            <div className={`h-1.5 rounded-full transition-colors duration-300 ${confirmStatus.bar2}`} />
          </div>

          {/* Confirm match message feedback */}
          <div className="flex items-center gap-1 pt-0.5 text-[11px] font-caption-helper">
            {confirmPassword && (
              <span className={`material-symbols-outlined text-[13px] ${confirmStatus.color}`}>
                {confirmStatus.icon}
              </span>
            )}
            <span className={confirmStatus.msgColor}>
              {confirmStatus.message}
            </span>
          </div>
        </div>

        {/* Terms & Privacy Agreement Checkbox */}
        <div className="pt-1 text-left">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="w-[18px] h-[18px] mt-0.5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/30 cursor-pointer"
              type="checkbox"
            />
            <span className="font-body-default text-[13px] text-[#64748B] leading-snug">
              I agree to Resumint's{' '}
              <a className="text-[#2563EB] hover:underline" href="#">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="text-[#2563EB] hover:underline" href="#">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-[18px] text-[#DC2626]">error</span>
            <span className="font-caption-helper text-[12px] text-[#DC2626] font-medium">
              {errorMsg}
            </span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-[18px] text-[#16A34A]">check_circle</span>
            <span className="font-caption-helper text-[12px] text-[#15803D] font-medium">
              {successMsg}
            </span>
          </div>
        )}

        {/* Submit Sign Up */}
        <button
          disabled={isLoading}
          className="w-full h-[44px] bg-primary-container hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:opacity-75 text-white font-body-semibold text-body-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          type="submit"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Switch to Login */}
      <div className="mt-space-lg text-center font-body-default text-body-default text-[#64748B]">
        Already have an account?{' '}
        <button
          className="font-body-semibold text-body-semibold text-[#2563EB] hover:underline ml-1 cursor-pointer"
          onClick={onSwitchToLogin}
          type="button"
        >
          Log in
        </button>
      </div>
    </div>
  )
}
