import AppSidebar from '../common/AppSidebar'
import AppTopbar from '../common/AppTopbar'
import { getCurrentUser } from '../../services/api'

export default function DashboardPage({ onNavigate, onLogout }) {
  const user = getCurrentUser()
  const firstName = user?.first_name || 'John'

  return (
    <div className="bg-[#F5F8FC] text-[#14243B] font-body-default text-body-default antialiased flex h-screen overflow-hidden">
      {/* PERSISTENT SIDEBAR */}
      <AppSidebar currentView="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <AppTopbar onNavigate={onNavigate} />

        {/* SCROLLABLE CANVAS */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-8 py-7">
          <div className="max-w-[1360px] mx-auto space-y-7">
            {/* DASHBOARD HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-headline-page text-headline-page text-[#14243B]">Good morning, {firstName}!</h1>
                <p className="font-body-default text-[#64748B] text-body-default mt-1">
                  Here's your resume performance and job matching overview.
                </p>
              </div>
              <button
                onClick={() => onNavigate('analyze-job')}
                className="h-11 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white font-body-semibold text-body-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>+ Analyze Job Description</span>
              </button>
            </div>

            {/* METRICS ROW (3 Compact Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Metric 1: Resume Score */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 custom-shadow-ambient transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="font-body-medium text-xs font-semibold uppercase tracking-wider">
                    Overall Resume Score
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#94A3B8] cursor-pointer hover:text-[#14243B]">
                    info
                  </span>
                </div>
                <div className="flex items-baseline gap-3 my-1">
                  <span className="font-headline-page text-[36px] leading-tight font-bold text-[#14243B]">92%</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    +4% from last review
                  </span>
                </div>
                <p className="font-caption-helper text-caption-helper text-[#64748B] mt-2">
                  Based on 4 target ATS parsers
                </p>
              </div>

              {/* Metric 2: ATS Parsing Rate */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 custom-shadow-ambient transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="font-body-medium text-xs font-semibold uppercase tracking-wider">
                    ATS Parsing Rate
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#94A3B8] cursor-pointer hover:text-[#14243B]">
                    verified_user
                  </span>
                </div>
                <div className="flex items-baseline gap-3 my-1">
                  <span className="font-headline-page text-[36px] leading-tight font-bold text-[#14243B]">88%</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    Workday &amp; Taleo Ready
                  </span>
                </div>
                <div className="mt-3 w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#2563EB] h-full rounded-full w-[88%]" />
                </div>
              </div>

              {/* Metric 3: Tailored Applications */}
              <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 custom-shadow-ambient transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="font-body-medium text-xs font-semibold uppercase tracking-wider">
                    Tailored Applications
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-[#94A3B8] cursor-pointer hover:text-[#14243B]">
                    work
                  </span>
                </div>
                <div className="flex items-baseline gap-3 my-1">
                  <span className="font-headline-page text-[36px] leading-tight font-bold text-[#14243B]">12</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    Active Portfolio
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[#64748B] font-caption-helper text-caption-helper">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  <span>3 active interview stages</span>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT SPLIT (65% / 35%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* LEFT MAIN (Col 8 / ~65%) */}
              <div className="lg:col-span-8 space-y-7">
                {/* ACTIVE RESUME OVERVIEW CARD */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 custom-shadow-ambient">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCE5F0] pb-4">
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="font-headline-card text-headline-card text-[#14243B]">
                          Primary Resume: Senior Product Designer 2024
                        </h2>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] rounded">
                          Default
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-[#DCFCE7] text-[#16A34A] rounded-full">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          100% Complete
                        </span>
                      </div>
                      <p className="font-body-default text-xs text-[#64748B] mt-1.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-[#94A3B8]">schedule</span>
                        Last updated 2 hours ago • Targeted for Staff/Senior Product Design
                      </p>
                    </div>
                  </div>

                  {/* Section Completeness Status Bar */}
                  <div className="my-5">
                    <div className="flex items-center justify-between text-xs font-medium text-[#64748B] mb-2">
                      <span>Core Sections Verification</span>
                      <span className="text-[#16A34A] font-semibold">6 of 6 Verified</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1.5 text-xs text-[#14243B]">
                        <span className="material-symbols-outlined text-[14px] text-[#16A34A]">check</span>
                        <span>Personal</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1.5 text-xs text-[#14243B]">
                        <span className="material-symbols-outlined text-[14px] text-[#16A34A]">check</span>
                        <span>Summary</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1.5 text-xs text-[#14243B]">
                        <span className="material-symbols-outlined text-[14px] text-[#16A34A]">check</span>
                        <span>Skills</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1.5 text-xs text-[#14243B]">
                        <span className="material-symbols-outlined text-[14px] text-[#16A34A]">check</span>
                        <span>Education</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1.5 text-xs text-[#14243B]">
                        <span className="material-symbols-outlined text-[14px] text-[#16A34A]">check</span>
                        <span>Work Exp</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#DCE5F0] rounded px-2.5 py-1.5 text-xs text-[#14243B]">
                        <span className="material-symbols-outlined text-[14px] text-[#16A34A]">check</span>
                        <span>Projects</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button Row */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-[#DCE5F0]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('editor')}
                        className="h-9 px-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-body-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        <span>Edit Resume</span>
                      </button>
                      <button
                        onClick={() => onNavigate('my-resumes')}
                        className="h-9 px-3.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#102544] font-body-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#64748B]">visibility</span>
                        <span>Preview PDF</span>
                      </button>
                      <button
                        onClick={() => alert('Duplicated resume draft created!')}
                        className="h-9 px-3.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#102544] font-body-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#64748B]">content_copy</span>
                        <span>Duplicate</span>
                      </button>
                    </div>
                    <button
                      onClick={() => alert('Downloading ATS-Optimized (.docx) resume...')}
                      className="h-9 px-3.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#102544] font-body-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#2563EB]">download</span>
                      <span>Download ATS-Friendly (.docx)</span>
                    </button>
                  </div>
                </div>

                {/* RECENT ACTIVITY LIST */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-6 custom-shadow-ambient">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <h2 className="font-headline-card text-headline-card text-[#14243B]">
                        Recent Activity &amp; Tailored Scans
                      </h2>
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    </div>
                    <button
                      onClick={() => onNavigate('analysis-history')}
                      className="font-body-semibold text-xs text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                      type="button"
                    >
                      <span>View All (History)</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>

                  <div className="divide-y divide-[#DCE5F0]">
                    {/* Activity Item 1 */}
                    <div className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#DCE5F0] flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">apartment</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-headline-card text-sm font-semibold text-[#14243B]">
                              Senior Lead UX Designer at Stripe
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                              94% Match
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-1">Tailored resume generated • Today, 9:24 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onNavigate('analysis-results')}
                          className="px-2.5 py-1 text-xs font-body-semibold text-[#2563EB] hover:bg-[#EFF6FF] rounded border border-[#2563EB]/20 transition-colors cursor-pointer"
                          type="button"
                        >
                          View Diff
                        </button>
                        <button
                          onClick={() => alert('Downloading Stripe match report...')}
                          className="p-1 text-[#64748B] hover:text-[#14243B] rounded hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                          title="Download"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                      </div>
                    </div>

                    {/* Activity Item 2 */}
                    <div className="py-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#DCE5F0] flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">design_services</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-headline-card text-sm font-semibold text-[#14243B]">
                              Staff Product Designer at Figma
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB]">
                              89% Match
                            </span>
                          </div>
                          <p className="text-xs text-[#B45309] mt-1 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">warning</span>
                            Missing keywords identified: "Design Tokens Governance"
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">Yesterday, 4:15 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onNavigate('analyze-job')}
                          className="px-2.5 py-1 text-xs font-body-semibold text-[#2563EB] hover:bg-[#EFF6FF] rounded border border-[#2563EB]/20 transition-colors cursor-pointer"
                          type="button"
                        >
                          Optimize
                        </button>
                      </div>
                    </div>

                    {/* Activity Item 3 */}
                    <div className="py-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#DCE5F0] flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">insights</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-headline-card text-sm font-semibold text-[#14243B]">
                              Principal Product Designer at Datadog
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                              91% Match
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-1">
                            Tailored resume generated • Oct 24, 2:30 PM
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onNavigate('analysis-results')}
                          className="px-2.5 py-1 text-xs font-body-semibold text-[#2563EB] hover:bg-[#EFF6FF] rounded border border-[#2563EB]/20 transition-colors cursor-pointer"
                          type="button"
                        >
                          View Diff
                        </button>
                        <button
                          onClick={() => alert('Downloading Datadog tailored resume...')}
                          className="p-1 text-[#64748B] hover:text-[#14243B] rounded hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                          title="Download"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                      </div>
                    </div>

                    {/* Activity Item 4 */}
                    <div className="py-4 last:pb-0 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#DCE5F0] flex items-center justify-center text-[#64748B] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px]">fact_check</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-headline-card text-sm font-semibold text-[#14243B]">
                              Resume Import &amp; ATS Audit Completed
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                              98% Format Pass
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-1">System audit: 98% format pass rate • Oct 23, 11:00 AM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onNavigate('analysis-history')}
                          className="px-2.5 py-1 text-xs font-body-semibold text-[#64748B] hover:text-[#14243B] hover:bg-[#F1F5F9] rounded border border-[#DCE5F0] transition-colors cursor-pointer"
                          type="button"
                        >
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (Col 4 / ~35%) */}
              <div className="lg:col-span-4 space-y-7">
                {/* QUICK ACTIONS CARD */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 custom-shadow-ambient">
                  <h3 className="font-headline-card text-headline-card text-[#14243B] mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {/* Action Tile 1 */}
                    <button
                      onClick={() => onNavigate('analyze-job')}
                      className="w-full text-left group block p-3.5 rounded-lg border border-[#DCE5F0] hover:border-[#2563EB]/40 bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer"
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">post_add</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#14243B] group-hover:text-[#2563EB] transition-colors">
                            Analyze New Job Description
                          </div>
                          <div className="text-xs text-[#64748B] truncate">Paste JD and match resume instantly</div>
                        </div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-[18px] group-hover:translate-x-0.5 transition-transform">
                          chevron_right
                        </span>
                      </div>
                    </button>

                    {/* Action Tile 2 */}
                    <button
                      onClick={() => onNavigate('editor')}
                      className="w-full text-left group block p-3.5 rounded-lg border border-[#DCE5F0] hover:border-[#2563EB]/40 bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer"
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">note_add</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#14243B] group-hover:text-[#2563EB] transition-colors">
                            Create New Resume
                          </div>
                          <div className="text-xs text-[#64748B] truncate">
                            Start from existing template or role profile
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-[18px] group-hover:translate-x-0.5 transition-transform">
                          chevron_right
                        </span>
                      </div>
                    </button>

                    {/* Action Tile 3 */}
                    <button
                      onClick={() => onNavigate('analysis-history')}
                      className="w-full text-left group block p-3.5 rounded-lg border border-[#DCE5F0] hover:border-[#2563EB]/40 bg-white hover:bg-[#F8FAFC] transition-all cursor-pointer"
                      type="button"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          <span className="material-symbols-outlined text-[20px]">analytics</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#14243B] group-hover:text-[#2563EB] transition-colors">
                            View Audit History
                          </div>
                          <div className="text-xs text-[#64748B] truncate">Browse past ATS compatibility reports</div>
                        </div>
                        <span className="material-symbols-outlined text-[#94A3B8] text-[18px] group-hover:translate-x-0.5 transition-transform">
                          chevron_right
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* RECENT JOB MATCH RESULTS / TARGET RECOMMENDATIONS */}
                <div className="bg-white border border-[#DCE5F0] rounded-xl p-5 custom-shadow-ambient">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-headline-card text-headline-card text-[#14243B]">
                      Job Description Match Insights
                    </h3>
                    <span className="material-symbols-outlined text-[18px] text-[#2563EB]">tips_and_updates</span>
                  </div>

                  {/* AI Highlight Card */}
                  <div className="bg-[#EFF6FF] border border-[#2563EB]/20 rounded-xl p-4 border-l-4 border-l-[#2563EB] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#2563EB] text-white rounded">
                        High Priority
                      </span>
                      <span className="text-xs font-semibold text-[#14243B]">+6% Match Potential</span>
                    </div>
                    <p className="text-xs text-[#14243B] font-medium leading-relaxed">
                      Top High-Impact Keyword Gap:{' '}
                      <span className="font-bold text-[#2563EB]">"Design Systems Governance"</span>
                    </p>
                    <p className="text-[11px] text-[#64748B] leading-normal">
                      This capability is mentioned in 85% of your target Senior Product Design job listings this month.
                    </p>
                    <button
                      onClick={() => onNavigate('editor')}
                      className="w-full h-9 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-body-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors mt-2 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">magic_button</span>
                      <span>Auto-optimize Resume</span>
                    </button>
                  </div>

                  {/* Secondary Keyword Tags */}
                  <div className="mt-4 pt-4 border-t border-[#DCE5F0]">
                    <div className="text-xs font-medium text-[#64748B] mb-2.5">
                      Other missing semantic keywords:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#14243B] text-xs font-medium">
                        + Cross-functional Leadership
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#14243B] text-xs font-medium">
                        + OKR Alignment
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#14243B] text-xs font-medium">
                        + User Journey Mapping
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
