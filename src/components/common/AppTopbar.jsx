import { getCurrentUser } from '../../services/api'
import ThemeToggle from './ThemeToggle'

export default function AppTopbar({ onNavigate, titleSearchPlaceholder = 'Search resumes, job descriptions, analysis...' }) {
  const user = getCurrentUser()
  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : 'JD'

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#DCE5F0] px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center flex-1 max-w-md mr-2">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('resumint:toggle-sidebar'))}
          className="lg:hidden p-2 -ml-2 mr-2 rounded-lg text-[#64748B] hover:text-[#14243B] hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0"
          type="button"
          title="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Search Input */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#94A3B8]">
            <span className="material-symbols-outlined text-[18px]">search</span>
          </span>
          <input
            className="w-full h-10 pl-9 pr-3 sm:pr-4 rounded-lg border border-[#DCE5F0] bg-[#FFFFFF] text-[#14243B] placeholder-[#94A3B8] text-xs sm:text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all font-body-default"
            placeholder={titleSearchPlaceholder}
            type="text"
          />
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          onClick={() => alert('You have 2 pending ATS recommendations for Stripe.')}
          className="relative w-10 h-10 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#14243B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          type="button"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#DC2626] rounded-full ring-2 ring-white" />
        </button>

        {/* Help Quick Icon */}
        <button
          onClick={() => alert('Opening Resumint Knowledge Base & ATS Audit Guides')}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#14243B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          type="button"
          title="Support Center"
        >
          <span className="material-symbols-outlined text-[20px]">contact_support</span>
        </button>

        <div className="h-5 w-[1px] bg-[#DCE5F0] mx-1" />

        {/* User Mini Avatar with Online Status */}
        <div
          onClick={() => onNavigate && onNavigate('profile-settings')}
          className="relative cursor-pointer flex items-center gap-2 group"
          title="Profile & Settings"
        >
          <div className="w-8 h-8 rounded-full bg-[#102544] text-white flex items-center justify-center text-xs font-semibold group-hover:ring-2 group-hover:ring-[#2563EB] transition-all">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] border-2 border-white rounded-full" />
        </div>
      </div>
    </header>
  )
}
