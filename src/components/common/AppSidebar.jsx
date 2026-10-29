import { useState, useEffect } from 'react'
import { getCurrentUser, clearSession } from '../../services/api'

export default function AppSidebar({ currentView, onNavigate, onLogout }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev)
    const handleClose = () => setIsMobileOpen(false)

    window.addEventListener('resumint:toggle-sidebar', handleToggle)
    window.addEventListener('resumint:close-sidebar', handleClose)
    return () => {
      window.removeEventListener('resumint:toggle-sidebar', handleToggle)
      window.removeEventListener('resumint:close-sidebar', handleClose)
    }
  }, [])

  const user = getCurrentUser()
  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
    : 'John Doe'
  const initials = user?.first_name && user?.last_name
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : 'JD'
  const roleSubtitle = user?.email || 'Senior UX / Product'

  const handleNavClick = (viewId) => {
    setIsMobileOpen(false)
    if (onNavigate) {
      onNavigate(viewId)
    }
  }

  const handleLogoutClick = () => {
    setIsMobileOpen(false)
    clearSession()
    if (onLogout) {
      onLogout()
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'analyze-job', label: 'Analyze Job Description', icon: 'document_scanner' },
    { id: 'analysis-history', label: 'History', icon: 'history' },
    { id: 'my-resumes', label: 'My Resumes', icon: 'description', badge: '2' },
  ]

  const bottomItems = [
    { id: 'profile-settings', label: 'Settings', icon: 'settings' },
  ]

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar (Fixed drawer on mobile, static on desktop) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[248px] bg-[#102544] flex flex-col justify-between shrink-0 select-none min-h-screen transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#1E3A5F]">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
              type="button"
            >
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-[19px]">description</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-section text-[18px] font-bold text-white tracking-tight">Resumint</span>
                  <span className="bg-[#2563EB]/25 text-[#93C5FD] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#2563EB]/40 tracking-wider">
                    AI
                  </span>
                </div>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-[#94A3B8] hover:text-white p-1 rounded-lg cursor-pointer"
              type="button"
              title="Close Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={`w-full relative flex items-center justify-between px-3 py-2.5 rounded-lg font-body-semibold text-body-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1E3A5F]/80 text-white shadow-sm'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#2563EB] rounded-r" />
                  )}
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-white' : 'text-[#94A3B8]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        isActive ? 'bg-[#2563EB] text-white' : 'bg-[#1E3A5F] text-[#94A3B8]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section: Utility & User Profile */}
        <div className="flex flex-col border-t border-[#1E3A5F]">
          <div className="p-3 space-y-1">
            {bottomItems.map((item) => {
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  type="button"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-body-medium text-body-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1E3A5F]/80 text-white'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )
            })}
            <button
              onClick={() => alert('Help documentation and 24/7 AI support is available at support@resumint.ai')}
              type="button"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 font-body-medium text-body-medium transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
              <span>Help &amp; Support</span>
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="p-3 bg-[#0C1D36]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#142C50]/80 hover:bg-[#142C50] border border-[#1E3A5F] transition-colors cursor-pointer">
              <div
                className="flex items-center gap-2.5 overflow-hidden flex-1 cursor-pointer"
                onClick={() => handleNavClick('profile-settings')}
              >
                <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-400/20 shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col text-left truncate">
                  <span className="text-xs font-semibold text-white leading-tight truncate">{displayName}</span>
                  <span className="text-[11px] text-[#94A3B8] truncate leading-tight">{roleSubtitle}</span>
                </div>
              </div>
              <button
                onClick={handleLogoutClick}
                className="text-[#94A3B8] hover:text-rose-400 transition-colors p-1 flex items-center justify-center cursor-pointer shrink-0"
                title="Sign Out"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
