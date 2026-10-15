export default function Step6Projects({ data, onChange }) {
  const defaultProjects = [
    {
      name: 'Real-Time AI Resume Screener',
      description: 'Distributed semantic evaluation engine for ATS resume parsing and candidate ranking.',
      url: 'https://github.com/johndoe/resume-screener',
      start_date: 20230101,
      end_date: 20230830,
      status: 'Completed',
      responsibilities: 'Designed async pipeline using FastAPI, SQLAlchemy, and Celery.',
      achievements: 'Processed 100K+ resumes in test benchmark.',
      order: 1,
    },
  ]

  const items = data.projects && data.projects.length > 0 ? data.projects : defaultProjects

  const handleUpdate = (index, field, value) => {
    const updated = [...items]
    const item = { ...updated[index], [field]: value }

    // Sync aliases
    if (field === 'url') {
      item.liveUrl = value
      item.githubUrl = value
    }

    updated[index] = item
    onChange('projects', updated)
  }

  const handleAddProject = () => {
    onChange('projects', [
      ...items,
      {
        name: '',
        description: '',
        url: '',
        liveUrl: '',
        githubUrl: '',
        start_date: 20230101,
        end_date: 20230830,
        status: 'Completed',
        responsibilities: '',
        achievements: '',
        order: items.length + 1,
      },
    ])
  }

  const handleDeleteProject = (index) => {
    onChange(
      'projects',
      items.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      {/* Form Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <span className="font-label-form text-[13px] text-[#14243B] font-semibold">
            Featured Projects &amp; Portfolio Highlights
          </span>
          <p className="font-body-default text-[12px] text-[#64748B] mt-0.5">
            Highlight projects that demonstrate practical skills and real-world impact.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Imported public repository from GitHub!')}
            className="inline-flex items-center gap-2 h-10 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[13px] font-body-semibold text-[#14243B] hover:bg-[#F8FAFC] transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#64748B]">code</span>
            <span>Import from GitHub</span>
          </button>
          <button
            onClick={handleAddProject}
            className="inline-flex items-center gap-1.5 h-10 px-4 bg-[#2563EB] text-white rounded-lg text-[13px] font-body-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {items.map((proj, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#DCE5F0] p-6 shadow-sm space-y-4 hover:border-[#2563EB]/40 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#DCE5F0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#64748B] cursor-grab text-[20px]">
                  drag_indicator
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-headline-card font-headline-card text-[#14243B] font-semibold">
                    Project #{idx + 1} • {proj.name || 'Project Name'}
                  </h3>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold rounded uppercase border border-[#2563EB]/20">
                      FEATURED PROJECT
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {items.length > 1 && (
                  <button
                    onClick={() => handleDeleteProject(idx)}
                    className="p-1 hover:text-[#DC2626] rounded transition-colors text-[#64748B] cursor-pointer"
                    title="Delete project"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-[#14243B] block">Project Name *</label>
                  <input
                    className="w-full h-11 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                    type="text"
                    placeholder="e.g. Real-Time AI Resume Screener"
                    value={proj.name || ''}
                    onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-[#14243B] block">Status</label>
                  <select
                    className="w-full h-11 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all cursor-pointer"
                    value={proj.status || 'Completed'}
                    onChange={(e) => handleUpdate(idx, 'status', e.target.value)}
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Maintained">Maintained</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#14243B] block">Project URL / Repository</label>
                <div className="relative">
                  <input
                    className="w-full h-11 pl-3.5 pr-10 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all"
                    type="url"
                    placeholder="e.g. https://github.com/johndoe/resume-screener"
                    value={proj.url || proj.githubUrl || proj.liveUrl || ''}
                    onChange={(e) => handleUpdate(idx, 'url', e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3 text-[18px] text-[#64748B] pointer-events-none">
                    link
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[13px] font-medium text-[#14243B] block">Description</label>
                <textarea
                  rows={2}
                  className="w-full p-3 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y"
                  placeholder="Distributed semantic evaluation engine for ATS resume parsing and candidate ranking."
                  value={proj.description || ''}
                  onChange={(e) => handleUpdate(idx, 'description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-[#14243B] block">Responsibilities</label>
                  <textarea
                    rows={2}
                    className="w-full p-3 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y"
                    placeholder="Designed async pipeline using FastAPI, SQLAlchemy, and Celery."
                    value={proj.responsibilities || ''}
                    onChange={(e) => handleUpdate(idx, 'responsibilities', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-[#14243B] block">Achievements</label>
                  <textarea
                    rows={2}
                    className="w-full p-3 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y"
                    placeholder="Processed 100K+ resumes in test benchmark."
                    value={proj.achievements || ''}
                    onChange={(e) => handleUpdate(idx, 'achievements', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
