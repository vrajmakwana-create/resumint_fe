import { toDateInputValue } from '../../../utils/dateUtils'

export default function Step6Projects({ data, onChange, errors = {} }) {
  const blankProject = {
    name: '',
    description: '',
    url: '',
    liveUrl: '',
    githubUrl: '',
    start_date: '',
    end_date: '',
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
        start_date: '',
        end_date: '',
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <h2 className="font-headline-section text-headline-section text-[#14243B] font-bold">
            Projects &amp; Portfolio
          </h2>
          <p className="font-body-default text-body-default text-[#64748B] mt-0.5">
            Highlight technical projects, open-source work, or enterprise deliverables.
          </p>
        </div>

        {/* No Projects Toggle Checkbox */}
        <label className="inline-flex items-center gap-2 cursor-pointer bg-[#F8FAFC] border border-[#DCE5F0] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#14243B] hover:border-[#2563EB] transition-colors shrink-0">
          <input
            type="checkbox"
            checked={noProjects}
            onChange={(e) => {
              onChange('noProjects', e.target.checked)
              if (e.target.checked) {
                onChange('projects', [])
              } else if (items.length === 0) {
                onChange('projects', [blankProject])
              }
            }}
            className="w-4 h-4 rounded border-[#DCE5F0] text-[#2563EB] focus:ring-[#2563EB]"
          />
          <span>No projects to highlight right now</span>
        </label>
      </div>

      {noProjects ? (
        <div className="p-8 text-center bg-[#F8FAFC] rounded-2xl border-2 border-dashed border-[#DCE5F0] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">folder_off</span>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <p className="font-bold text-[#14243B] text-[15px]">Projects Skipped</p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Your resume will dedicate more space to your professional experience and technical competencies.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((proj, idx) => {
            const nameError = errors[`proj_${idx}_name`]

            return (
              <div
                key={idx}
                className="bg-white border border-[#DCE5F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-all"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="text-[15px] font-bold text-[#14243B]">
                      {proj.name || `Project #${idx + 1}`}
                    </h3>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold rounded uppercase border border-[#2563EB]/20">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {items.length > 1 && (
                      <button
                        onClick={() => handleDeleteProject(idx)}
                        className="p-1.5 hover:text-[#DC2626] rounded-lg transition-colors text-[#64748B] hover:bg-red-50 cursor-pointer"
                        title="Delete project"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[13px] font-medium text-[#14243B] block">
                        Project Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        className={`w-full h-11 px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] font-body-default outline-none transition-all ${nameError
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

                  {/* Calendar Date Inputs: Start Date & End Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[13px] font-medium text-[#14243B] block">Start Date</label>
                      <input
                        className="w-full h-11 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all cursor-pointer"
                        type="date"
                        value={toDateInputValue(proj.start_date)}
                        onChange={(e) => handleUpdate(idx, 'start_date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[13px] font-medium text-[#14243B] block">End Date</label>
                      <input
                        className="w-full h-11 px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] font-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all cursor-pointer"
                        type="date"
                        value={toDateInputValue(proj.end_date)}
                        onChange={(e) => handleUpdate(idx, 'end_date', e.target.value)}
                      />
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
          {!noProjects && (
            <button
              onClick={handleAddProject}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white border border-[#DCE5F0] hover:border-[#2563EB] text-[#2563EB] text-xs font-semibold shadow-2xs hover:bg-[#EFF6FF] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Another Project</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
