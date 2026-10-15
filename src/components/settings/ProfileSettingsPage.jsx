import { useState } from 'react'
import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'

export default function ProfileSettingsPage({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('general')
  const [fullName, setFullName] = useState('John Doe')
  const [profTitle, setProfTitle] = useState('Senior UX / Product Designer')
  const [email, setEmail] = useState('john.doe@example.com')
  const [phone, setPhone] = useState('+1 (555) 019-2834')
  const [location, setLocation] = useState('San Francisco, CA (Remote)')
  const [portfolio, setPortfolio] = useState('https://johndoe.design')
  const [linkedin, setLinkedin] = useState('linkedin.com/in/johndoe-ux')
  const [github, setGithub] = useState('github.com/johndoe')
  const [savedNotification, setSavedNotification] = useState(false)

  const handleSave = () => {
    setSavedNotification(true)
    setTimeout(() => setSavedNotification(false), 3000)
  }

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default antialiased flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <AppSidebar currentView="profile-settings" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F8FC]">
        {/* TOPBAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          <div className="max-w-[1140px] mx-auto space-y-6">
            {/* Header & Primary Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#DCE5F0]/60">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-badge-label font-badge-label uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                  Account &amp; Workspace • System Preferences
                </div>
                <h1 className="font-headline-page text-headline-page font-bold text-[#14243B] tracking-tight">
                  My Profile
                </h1>
                <p className="font-body-large text-body-large text-[#64748B] mt-1">
                  Manage your account information, security credentials, and platform preferences.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {savedNotification && (
                  <span className="text-xs font-bold text-[#16A34A] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Changes saved!
                  </span>
                )}
                <button
                  onClick={() => {
                    setFullName('John Doe')
                    setProfTitle('Senior UX / Product Designer')
                  }}
                  className="h-11 px-5 rounded-lg border border-[#DCE5F0] bg-white text-[#102544] font-body-semibold text-body-semibold hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                  type="button"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSave}
                  className="h-11 px-5 rounded-lg bg-[#2563EB] text-white font-body-semibold text-body-semibold hover:bg-[#1D4ED8] active:bg-[#1E40AF] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="border-b border-[#DCE5F0] flex gap-6 overflow-x-auto no-scrollbar">
              {[
                { id: 'general', label: 'General & Profile', icon: 'account_circle' },
                { id: 'security', label: 'Security & Authentication', icon: 'lock' },
                { id: 'notifications', label: 'Notifications', icon: 'notifications' },
                { id: 'billing', label: 'Subscription & Billing', icon: 'credit_card' },
                { id: 'privacy', label: 'Privacy & Data', icon: 'shield' },
              ].map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-1 border-b-2 font-body-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[#2563EB] text-[#2563EB]'
                        : 'border-transparent text-[#64748B] hover:text-[#14243B]'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* TAB: General Profile Content */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Profile Overview Card */}
                <section className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm">
                  <div className="border-b border-[#DCE5F0] pb-4 mb-6 flex justify-between items-center">
                    <div>
                      <h2 className="font-headline-card text-headline-card text-[#14243B]">
                        Profile Information
                      </h2>
                      <p className="font-body-default text-body-default text-[#64748B] mt-0.5">
                        Update your personal and professional profile details for targeted resume analyses.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-badge-label font-badge-label uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Profile 95% Complete
                    </span>
                  </div>

                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-[#DCE5F0]/70 mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#EFF6FF] border-2 border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] font-headline-card text-2xl font-bold shrink-0 shadow-inner">
                      JD
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => alert('Photo upload dialog opened')}
                          className="h-10 px-4 rounded-lg border border-[#DCE5F0] bg-white text-[#102544] font-body-semibold text-xs hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                          type="button"
                        >
                          Change Photo
                        </button>
                        <button
                          onClick={() => alert('Photo removed')}
                          className="text-xs font-semibold text-[#DC2626] hover:underline px-2 py-1 cursor-pointer"
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="font-caption-helper text-caption-helper text-[#64748B]">
                        JPG, GIF or PNG. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-label-form text-[13px] text-[#14243B] font-medium mb-1.5">
                          Full Name
                        </label>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-label-form text-[13px] text-[#14243B] font-medium mb-1.5">
                          Professional Title
                        </label>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="text"
                          value={profTitle}
                          onChange={(e) => setProfTitle(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block font-label-form text-[13px] text-[#14243B] font-medium">
                            Email Address
                          </label>
                          <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[13px]">verified</span> Verified
                          </span>
                        </div>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-label-form text-[13px] text-[#14243B] font-medium mb-1.5">
                          Phone Number
                        </label>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-label-form text-[13px] text-[#14243B] font-medium mb-1.5">
                          Location (City, Country / Remote status)
                        </label>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-label-form text-[13px] text-[#14243B] font-medium mb-1.5">
                          Portfolio / Website URL
                        </label>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="url"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block font-label-form text-[13px] text-[#14243B] font-medium mb-1.5">
                          LinkedIn Profile URL
                        </label>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="text"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-label-form text-[13px] text-[#14243B] font-medium mb-1.5">
                          GitHub / Dribbble
                        </label>
                        <input
                          className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          type="text"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                        />
                      </div>
                    </div>
                  </form>
                </section>

                {/* Career Goals & Search Parameters */}
                <section className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="font-headline-card text-headline-card text-[#14243B]">
                    Target Career Parameters &amp; Compensation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium text-[#14243B] mb-1">
                        Desired Job Titles
                      </label>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-[#F8FAFC] text-sm text-[#14243B] outline-none"
                        defaultValue="Staff Product Designer, Principal UX Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#14243B] mb-1">
                        Minimum Base Target (USD / Year)
                      </label>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-[#F8FAFC] text-sm text-[#14243B] outline-none"
                        defaultValue="$185,000"
                      />
                    </div>
                  </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-white border border-red-200 rounded-xl p-6 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#DC2626]">Delete Account &amp; Career Data</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        Permanently purge your account, generated resumes, and historical ATS match audits.
                      </p>
                    </div>
                    <button
                      onClick={() => alert('Account deletion confirmation modal')}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] border border-red-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      type="button"
                    >
                      Delete Account
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* Other Tab Placeholders */}
            {activeTab !== 'general' && (
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-10 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[24px]">tune</span>
                </div>
                <h3 className="font-headline-card text-base font-bold text-[#14243B]">
                  {activeTab.toUpperCase()} Preferences
                </h3>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Manage your advanced preferences, multi-factor authentication, and notification digests.
                </p>
                <button
                  onClick={() => setActiveTab('general')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Return to General Profile
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
