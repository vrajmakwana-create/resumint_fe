import { useState, useRef, useEffect } from 'react'

export default function OtpVerificationForm({ onBackToLogin, onVerifiedSuccess }) {
  const [digits, setDigits] = useState(['5', '8', '2', '4', '1', '9'])
  const [demoState, setDemoState] = useState('default') // 'default' | 'error' | 'success'
  const [timeLeft, setTimeLeft] = useState(582) // 09:42 in seconds
  const [resendCooldown, setResendCooldown] = useState(48)
  const inputRefs = useRef([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleInputChange = (index, value) => {
    const val = value.slice(-1)
    const newDigits = [...digits]
    newDigits[index] = val
    setDigits(newDigits)

    if (val && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d+$/.test(pastedData)) {
      const newDigits = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
      setDigits(newDigits)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const code = digits.join('')
    if (code === '582419' || code.length === 6) {
      setDemoState('success')
      if (onVerifiedSuccess) {
        setTimeout(onVerifiedSuccess, 1000)
      }
    } else {
      setDemoState('error')
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col text-left">
        <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-blue-200/60 flex items-center justify-center text-[#2563EB] mb-5 shadow-sm">
          <span className="material-symbols-outlined text-[26px]">mark_email_read</span>
        </div>
        <h2 className="font-headline-page text-[28px] font-bold text-[#14243B] tracking-tight">
          Verify Your Email
        </h2>
        <p className="font-body-default text-body-default text-[#64748B] mt-1.5 leading-relaxed">
          We've sent a 6-digit verification code to{' '}
          <span className="font-body-semibold text-[#14243B]">alex.morgan@design.io</span>
          <button
            onClick={onBackToLogin}
            className="text-[#2563EB] hover:underline text-[13px] ml-1 font-medium cursor-pointer"
            type="button"
          >
            Change
          </button>
        </p>
      </div>

      <form className="mt-6 space-y-5" id="otp-form" onSubmit={handleSubmit}>
        <div className="space-y-2 text-left">
          <label className="block font-label-form text-label-form text-[#14243B]">
            Enter 6-digit Security Code
          </label>
          <div className="flex items-center justify-between gap-2" id="otp-inputs-container" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                className={`otp-input w-12 h-12 text-center font-bold text-[20px] rounded-lg border bg-white text-[#14243B] outline-none transition-all ${
                  demoState === 'error'
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-red-600'
                    : demoState === 'success'
                    ? 'border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-emerald-600'
                    : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                }`}
                inputMode="numeric"
                maxLength={1}
                pattern="[0-9]*"
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>
        </div>

        {/* Feedback Container */}
        <div id="otp-feedback-container">
          {demoState === 'error' && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#DC2626]">error</span>
                <span className="font-caption-helper text-[12px] text-[#DC2626]">
                  Invalid verification code. Please check and try again.
                </span>
              </div>
            </div>
          )}
          {demoState === 'success' && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#16A34A]">check_circle</span>
                <span className="font-caption-helper text-[12px] text-[#16A34A] font-semibold">
                  Code verified successfully! Redirecting...
                </span>
              </div>
            </div>
          )}
          {demoState === 'default' && (
            <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-blue-200/60 flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#2563EB]">schedule</span>
                <span className="font-caption-helper text-[12px] text-[#1E40AF]">
                  Code expires in <span className="font-semibold" id="timer-text">{formatTimer(timeLeft)}</span>
                </span>
              </div>
              <span className="font-caption-helper text-[11px] text-[#2563EB] font-medium bg-white px-2 py-0.5 rounded border border-blue-200/60">
                Auto-filling
              </span>
            </div>
          )}
        </div>

        {/* Verify Button */}
        <button
          className="w-full h-[44px] bg-primary-container hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold rounded-lg shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          id="verify-btn"
          type="submit"
        >
          <span>Verify Code</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        {/* Resend Link */}
        <div className="flex items-center justify-between pt-1 text-[13px]">
          <span className="text-[#64748B]">Didn't receive code?</span>
          <button
            className="font-body-semibold text-[#2563EB] hover:underline flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            id="resend-btn"
            type="button"
            disabled={resendCooldown > 0}
            onClick={() => setResendCooldown(60)}
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>
              Resend {resendCooldown > 0 ? `(0:${resendCooldown.toString().padStart(2, '0')})` : ''}
            </span>
          </button>
        </div>

        {/* Bottom utility controls */}
        <div className="pt-2 border-t border-[#DCE5F0] flex flex-col gap-3">
          <div className="flex items-center justify-center">
            <button
              onClick={onBackToLogin}
              className="inline-flex items-center gap-1.5 text-[#64748B] hover:text-[#2563EB] font-body-medium text-body-medium transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Log In</span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-blue-200/60 flex items-center gap-2 text-left">
            <span className="material-symbols-outlined text-[18px] text-[#2563EB]">lock</span>
            <span className="font-caption-helper text-[12px] text-[#1E40AF]">
              Protected by enterprise 256-bit SSL encryption.
            </span>
          </div>

          {/* Interactive State Tester */}
          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-left">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Preview Verification States:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                className={`px-2 py-1 text-[11px] rounded border font-medium transition-colors text-center cursor-pointer ${
                  demoState === 'default'
                    ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                    : 'bg-white border-[#CBD5E1] text-[#14243B] hover:bg-[#F1F5F9]'
                }`}
                onClick={() => setDemoState('default')}
                type="button"
              >
                Default
              </button>
              <button
                className={`px-2 py-1 text-[11px] rounded border font-medium transition-colors text-center cursor-pointer ${
                  demoState === 'error'
                    ? 'bg-red-50 border-red-500 text-[#DC2626]'
                    : 'bg-white border-red-200 text-[#DC2626] hover:bg-red-50'
                }`}
                onClick={() => setDemoState('error')}
                type="button"
              >
                Error
              </button>
              <button
                className={`px-2 py-1 text-[11px] rounded border font-medium transition-colors text-center cursor-pointer ${
                  demoState === 'success'
                    ? 'bg-emerald-50 border-emerald-500 text-[#16A34A]'
                    : 'bg-white border-emerald-200 text-[#16A34A] hover:bg-emerald-50'
                }`}
                onClick={() => setDemoState('success')}
                type="button"
              >
                Success
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
