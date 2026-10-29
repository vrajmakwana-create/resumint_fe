import ThemeToggle from './common/ThemeToggle'

export default function Header({ onNavigateLogin, onNavigateSignup, onNavigateHome }) {
  return (
    <header className="bg-surface-container-lowest sticky top-0 z-50 border-b border-outline-variant shadow-sm transition-all duration-150">
      <div className="flex justify-between items-center w-full px-space-lg md:px-margin max-w-[1440px] mx-auto h-[72px]">
        {/* Brand Logo Anchor */}
        <button
          onClick={onNavigateHome}
          className="text-headline-section font-headline-section font-bold text-on-surface flex items-center gap-space-xs tracking-tight text-[#102544] cursor-pointer bg-transparent border-none p-0 text-left"
          type="button"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              description
            </span>
          </div>
          <span>Resumint</span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-space-xl">
          <a
            className="text-on-surface-variant font-body-medium text-body-medium hover:text-primary transition-colors duration-150 active:scale-[0.98]"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-on-surface-variant font-body-medium text-body-medium hover:text-primary transition-colors duration-150 active:scale-[0.98]"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="text-on-surface-variant font-body-medium text-body-medium hover:text-primary transition-colors duration-150 active:scale-[0.98]"
            href="#templates"
          >
            Templates
          </a>
          <a
            className="text-on-surface-variant font-body-medium text-body-medium hover:text-primary transition-colors duration-150 active:scale-[0.98]"
            href="#pricing"
          >
            Pricing
          </a>
        </nav>

        {/* Trailing Action Buttons */}
        <div className="flex items-center gap-space-sm">
          <ThemeToggle />
          <button
            onClick={onNavigateLogin}
            className="h-[44px] px-space-md text-[#102544] font-body-semibold text-body-semibold hover:text-primary-container transition-colors duration-150 active:scale-[0.98] cursor-pointer"
            type="button"
          >
            Log In
          </button>
          <button
            onClick={onNavigateSignup}
            className="h-[44px] px-5 bg-primary-container hover:bg-[#1D4ED8] text-on-primary font-body-semibold text-body-semibold rounded-lg shadow-sm transition-all duration-150 active:scale-[0.98] focus:ring-2 focus:ring-primary-container focus:ring-offset-2 cursor-pointer"
            type="button"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  )
}
