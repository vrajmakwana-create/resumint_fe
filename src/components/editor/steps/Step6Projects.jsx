export default function Step6Projects({ data, onChange, errors = {} }) {
  const blankProject = {
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
    order: 1,
  }

  const noProjects = Boolean(data.noProjects)
  const items = data.projects && data.projects.length > 0 ? data.projects : [blankProject]

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
          <span className="font-label-form text-[13px] text-[#14243B] font-semibold flex items-center gap-1.5">
            <span>Featured Projects &amp; Portfolio Highlights</span>
            {!noProjects && <span className="text-red-500 font-bold">*</span>}
          </span>
          <p className="font-body-default text-[12px] text-[#64748B] mt-0.5">
            Highlight projects demonstrating practical skills. Project Name is required.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="inline-flex items-center gap-2 cursor-pointer bg-white border border-[#DCE5F0] hover:border-[#CBD5E1] px-3 py-1.5 rounded-lg text-[13px] text-[#14243B] shadow-sm transition-all select-none">
            <input
              type="checkbox"
              checked={noProjects}
              onChange={(e) => onChange('noProjects', e.target.checked)}
              className="rounded border-[#DCE5F0] text-[#2563EB] focus:ring-[#2563EB] w-4 h-4 cursor-pointer"
            />
            <span className="font-body-medium text-[12.5px]">No projects to highlight right now</span>
          </label>

          {!noProjects && (
            <button
              onClick={handleAddProject}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-[#2563EB] text-white rounded-lg text-[12.5px] font-body-semibold hover:bg-[#1D4ED8] transition-colors shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>+ Add Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Error Notice */}
      {errors.projects && (
        <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 rounded-lg text-[#B91C1C] text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-medium">{errors.projects}</span>
        </div>
      )}

      {/* No Projects State Banner */}
      {noProjects ? (
        <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#DCE5F0] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[22px]">folder</span>
          </div>
          <h4 className="font-body-semibold text-[#14243B] text-[14px]">Projects Section Skipped</h4>
          <p className="text-[13px] text-[#64748B] max-w-md mx-auto">
            You can proceed without project entries. You can always add portfolio projects later from your dashboard.
          </p>
          <button
            type="button"
            onClick={() => onChange('noProjects', false)}
            className="text-[12px] text-[#2563EB] hover:underline font-semibold pt-1 cursor-pointer"
          >
            Switch back to add projects
          </button>
        </div>
      ) : (
        /* Projects List */
        <div className="space-y-6">
          {items.map((proj, idx) => {
            const nameError = errors[`proj_${idx}_name`]

            return (
              <div
                key={idx}
                className={`bg-white rounded-xl border p-6 shadow-sm space-y-4 transition-all ${
                  nameError ? 'border-red-400 ring-1 ring-red-400/20' : 'border-[#DCE5F0] hover:border-[#2563EB]/40'
                }`}
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
                      <label className="text-[13px] font-medium text-[#14243B] block">
                        Project Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        className={`w-full h-11 px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] font-body-default outline-none transition-all ${
                          nameError
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
                        }`}
                        type="text"
                        placeholder="e.g. Distributed Cloud File Storage"
                        value={proj.name || ''}
                        onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                      />
                      {nameError && (
                        <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
                          <span className="material-symbols-outlined text-[15px]">error</span>
                          <span>{nameError}</span>
                        </p>
                      )}
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
                        placeholder="e.g. https://github.com/username/project"
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
                      placeholder="e.g. Distributed file storage system with semantic metadata tagging and end-to-end encryption."
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
                        placeholder="e.g. Architected async microservices pipeline and managed distributed worker pools."
                        value={proj.responsibilities || ''}
                        onChange={(e) => handleUpdate(idx, 'responsibilities', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[13px] font-medium text-[#14243B] block">Achievements</label>
                      <textarea
                        rows={2}
                        className="w-full p-3 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y"
                        placeholder="e.g. Scaled system to process over 50,000 requests per minute with 99.9% uptime."
                        value={proj.achievements || ''}
                        onChange={(e) => handleUpdate(idx, 'achievements', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
