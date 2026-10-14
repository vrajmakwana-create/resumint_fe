export default function Templates() {
  return (
    <section className="py-20 bg-white border-y border-[#DCE5F0]" id="templates">
      <div className="max-w-[1440px] mx-auto px-space-lg md:px-margin">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-primary-container text-badge-label font-badge-label mb-2">
              <span>EXECUTIVE-READY DESIGNS</span>
            </div>
            <h2 className="font-headline-section text-headline-section md:text-[32px] md:leading-[40px] text-[#14243B] font-bold">
              Crafted for Every Career Stage
            </h2>
            <p className="font-body-large text-body-large text-[#64748B] mt-1">
              Engineered with precise typographic scales, balanced white space, and zero ATS parsing traps.
            </p>
          </div>
          <a
            className="inline-flex items-center text-primary-container font-body-semibold text-body-semibold hover:underline"
            href="#"
          >
            <span>Explore all 12 templates</span>
            <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Template 1: Executive */}
          <div className="bg-white rounded-xl border border-[#DCE5F0] overflow-hidden custom-shadow-ambient hover:custom-shadow-elevated transition-all duration-200 flex flex-col group">
            <div className="p-6 bg-slate-50 border-b border-[#DCE5F0] flex justify-center items-center">
              {/* Simplified Template Thumbnail Representation */}
              <div className="w-full h-64 bg-white rounded-md shadow-sm border border-slate-200 p-4 flex flex-col justify-between transform group-hover:scale-[1.02] transition-transform duration-200">
                <div>
                  <div className="w-1/2 h-3.5 bg-[#102544] rounded-sm mb-2"></div>
                  <div className="w-1/3 h-2 bg-slate-400 rounded-sm mb-4"></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-sm mb-1.5"></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-sm mb-1.5"></div>
                  <div className="w-3/4 h-1.5 bg-slate-200 rounded-sm mb-4"></div>
                  <div className="w-1/4 h-2.5 bg-slate-700 rounded-sm mb-2"></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-sm mb-1"></div>
                  <div className="w-5/6 h-1.5 bg-slate-200 rounded-sm mb-1"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-2 bg-slate-300 rounded"></div>
                  <div className="w-12 h-2 bg-slate-300 rounded"></div>
                  <div className="w-12 h-2 bg-slate-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline-card text-headline-card text-[#14243B] font-semibold">Executive</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-primary-container">Leadership</span>
                </div>
                <p className="font-body-default text-body-default text-[#64748B] mb-5">
                  Minimal, typography-first, structured for directors, VPs, and senior executives with deep experience.
                </p>
              </div>
              <button className="w-full h-[44px] bg-white border border-[#DCE5F0] hover:bg-slate-50 text-[#102544] font-body-semibold text-body-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                <span>Use Template</span>
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
          </div>

          {/* Template 2: Modern Tech */}
          <div className="bg-white rounded-xl border border-primary-container/30 overflow-hidden custom-shadow-elevated transition-all duration-200 flex flex-col group relative">
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-container text-white shadow-sm">MOST POPULAR</span>
            </div>
            <div className="p-6 bg-slate-50 border-b border-[#DCE5F0] flex justify-center items-center">
              <div className="w-full h-64 bg-white rounded-md shadow-sm border border-slate-200 p-4 flex gap-3 transform group-hover:scale-[1.02] transition-transform duration-200">
                {/* Sidebar Column */}
                <div className="w-1/3 bg-slate-100 rounded p-2 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                  <div className="w-full h-2 bg-slate-400 rounded"></div>
                  <div className="w-2/3 h-1.5 bg-slate-300 rounded"></div>
                  <div className="mt-4 w-full h-1 bg-slate-300 rounded"></div>
                  <div className="w-full h-1 bg-slate-300 rounded"></div>
                </div>
                {/* Main Column */}
                <div className="w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="w-2/3 h-3 bg-primary-container rounded mb-2"></div>
                    <div className="w-full h-1.5 bg-slate-200 rounded mb-1"></div>
                    <div className="w-full h-1.5 bg-slate-200 rounded mb-1"></div>
                    <div className="w-4/5 h-1.5 bg-slate-200 rounded mb-3"></div>
                    <div className="w-1/2 h-2 bg-slate-600 rounded mb-1.5"></div>
                    <div className="w-full h-1.5 bg-slate-200 rounded mb-1"></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-2 bg-blue-100 rounded"></div>
                    <div className="w-8 h-2 bg-blue-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline-card text-headline-card text-[#14243B] font-semibold">Modern Tech</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-primary-container">Engineering &amp; Design</span>
                </div>
                <p className="font-body-default text-body-default text-[#64748B] mb-5">
                  Crisp sidebar, accent headers, and dedicated modules optimized for engineering, design, and product managers.
                </p>
              </div>
              <button className="w-full h-[44px] bg-primary-container hover:bg-[#1D4ED8] text-white font-body-semibold text-body-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
                <span>Use Template</span>
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
          </div>

          {/* Template 3: Classic Professional */}
          <div className="bg-white rounded-xl border border-[#DCE5F0] overflow-hidden custom-shadow-ambient hover:custom-shadow-elevated transition-all duration-200 flex flex-col group">
            <div className="p-6 bg-slate-50 border-b border-[#DCE5F0] flex justify-center items-center">
              <div className="w-full h-64 bg-white rounded-md shadow-sm border border-slate-200 p-4 flex flex-col justify-between transform group-hover:scale-[1.02] transition-transform duration-200">
                <div className="text-center flex flex-col items-center">
                  <div className="w-2/5 h-3 bg-slate-800 rounded-sm mb-1.5"></div>
                  <div className="w-3/5 h-1.5 bg-slate-400 rounded-sm mb-3"></div>
                  <div className="w-full h-px bg-slate-300 mb-3"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-1/4 h-2 bg-slate-700 rounded-sm"></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-sm"></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-sm"></div>
                  <div className="w-5/6 h-1.5 bg-slate-200 rounded-sm"></div>
                </div>
                <div className="w-full h-px bg-slate-300"></div>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-headline-card text-headline-card text-[#14243B] font-semibold">Classic Professional</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-primary-container">Finance &amp; Consulting</span>
                </div>
                <p className="font-body-default text-body-default text-[#64748B] mb-5">
                  Traditional single-column layout preferred by financial institutions, consulting firms, and federal agencies.
                </p>
              </div>
              <button className="w-full h-[44px] bg-white border border-[#DCE5F0] hover:bg-slate-50 text-[#102544] font-body-semibold text-body-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                <span>Use Template</span>
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
