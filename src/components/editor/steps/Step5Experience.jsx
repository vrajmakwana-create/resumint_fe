export default function Step5Experience({ data, onChange, errors = {} }) {
  const blankExperience = {
    job_title: '',
    title: '',
    company_name: '',
    company: '',
    city: '',
    state: '',
    country: '',
    location_type: 'Hybrid',
    employment_type: 'Full-time',
    type: 'Full-time',
    is_currently_work_here: false,
    isCurrent: false,
    start_date: '',
    startDate: '',
    end_date: '',
    endDate: '',
    responsibilities: '',
    achievements: '',
    bullets: [''],
    order: 1,
  }

  const isFresher = Boolean(data.noExperience)
  const items = data.experience && data.experience.length > 0 ? data.experience : [blankExperience]

  const handleUpdate = (index, field, value) => {
    const updated = [...items]
    const item = { ...updated[index], [field]: value }

    // Sync aliases
    if (field === 'job_title') item.title = value
    if (field === 'title') item.job_title = value
    if (field === 'company_name') item.company = value
    if (field === 'company') item.company_name = value
    if (field === 'employment_type') item.type = value
    if (field === 'type') item.employment_type = value
    if (field === 'is_currently_work_here') {
      item.isCurrent = Boolean(value)
      if (value) {
        item.end_date = ''
        item.endDate = 'Present'
      }
    }
    if (field === 'isCurrent') {
      item.is_currently_work_here = Boolean(value)
      if (value) {
        item.end_date = ''
        item.endDate = 'Present'
      }
    }
    if (field === 'start_date') item.startDate = value
    if (field === 'startDate') item.start_date = value
    if (field === 'end_date') item.endDate = value
    if (field === 'endDate') item.end_date = value

    updated[index] = item
    onChange('experience', updated)
  }

  const handleAddExperience = () => {
    onChange('experience', [
      ...items,
      {
        job_title: '',
        title: '',
        company_name: '',
        company: '',
        city: '',
        state: '',
        country: '',
        location_type: 'Hybrid',
        employment_type: 'Full-time',
        type: 'Full-time',
        is_currently_work_here: false,
        isCurrent: false,
        start_date: '',
        startDate: '',
        end_date: '',
        endDate: '',
        responsibilities: '',
        achievements: '',
        bullets: [''],
        order: items.length + 1,
      },
    ])
  }

  const handleDeleteExperience = (index) => {
    onChange(
      'experience',
      items.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <span className="font-label-form text-[13px] text-[#14243B] font-semibold flex items-center gap-1.5">
            <span>Professional Experience &amp; Employment History</span>
            {!isFresher && <span className="text-red-500 font-bold">*</span>}
          </span>
          <p className="font-body-default text-[12px] text-[#64748B] mt-0.5">
            Highlight career accomplishments and impact. Job Title and Company are required.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="inline-flex items-center gap-2 cursor-pointer bg-white border border-[#DCE5F0] hover:border-[#CBD5E1] px-3 py-1.5 rounded-lg text-[13px] text-[#14243B] shadow-sm transition-all select-none">
            <input
              type="checkbox"
              checked={isFresher}
              onChange={(e) => onChange('noExperience', e.target.checked)}
              className="rounded border-[#DCE5F0] text-[#2563EB] focus:ring-[#2563EB] w-4 h-4 cursor-pointer"
            />
            <span className="font-body-medium text-[12.5px]">I have no work experience (Fresher)</span>
          </label>

          {!isFresher && (
            <button
              onClick={handleAddExperience}
              className="h-9 px-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-body-semibold text-[12.5px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">add</span>
              <span>+ Add Experience</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Error Notice */}
      {errors.experience && (
        <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 rounded-lg text-[#B91C1C] text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-medium">{errors.experience}</span>
        </div>
      )}

      {/* Fresher Empty State Banner */}
      {isFresher ? (
        <div className="p-6 rounded-xl bg-[#F8FAFC] border border-[#DCE5F0] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
          <h4 className="font-body-semibold text-[#14243B] text-[14px]">Fresher / Student Mode Active</h4>
          <p className="text-[13px] text-[#64748B] max-w-md mx-auto">
            You have marked that you currently do not have full-time work experience. Your resume will emphasize your education, skills, and portfolio projects.
          </p>
          <button
            type="button"
            onClick={() => onChange('noExperience', false)}
            className="text-[12px] text-[#2563EB] hover:underline font-semibold pt-1 cursor-pointer"
          >
            Switch back to add work experience
          </button>
        </div>
      ) : (
        /* Experience Entries */
        <div className="space-y-6">
          {items.map((exp, expIdx) => {
            const isCurrent = exp.is_currently_work_here ?? exp.isCurrent ?? false
            const titleError = errors[`exp_${expIdx}_title`]
            const companyError = errors[`exp_${expIdx}_company`]

            return (
              <div
                key={expIdx}
                className={`bg-white border rounded-xl p-6 shadow-sm transition-all ${
                  titleError || companyError
                    ? 'border-red-400 ring-1 ring-red-400/20'
                    : 'border-[#DCE5F0] hover:border-[#2563EB]/40'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#DCE5F0] mb-5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#64748B] cursor-grab text-[20px]">
                      drag_indicator
                    </span>
                    <h3 className="text-headline-card font-headline-card text-[#14243B] font-semibold">
                      Experience #{expIdx + 1} • {exp.job_title || exp.title || 'Role'} at{' '}
                      {exp.company_name || exp.company || 'Company'}
                    </h3>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] tracking-wide ml-1 border border-[#2563EB]/20">
                        CURRENT ROLE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {items.length > 1 && (
                      <button
                        onClick={() => handleDeleteExperience(expIdx)}
                        className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Experience"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">
                        Job Title <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default outline-none transition-all ${
                          titleError
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                        }`}
                        type="text"
                        placeholder="e.g. Software Engineer"
                        value={exp.job_title || exp.title || ''}
                        onChange={(e) => handleUpdate(expIdx, 'job_title', e.target.value)}
                      />
                      {titleError && (
                        <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
                          <span className="material-symbols-outlined text-[15px]">error</span>
                          <span>{titleError}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">
                        Company Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default outline-none transition-all ${
                          companyError
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                        }`}
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={exp.company_name || exp.company || ''}
                        onChange={(e) => handleUpdate(expIdx, 'company_name', e.target.value)}
                      />
                      {companyError && (
                        <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
                          <span className="material-symbols-outlined text-[15px]">error</span>
                          <span>{companyError}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">City</label>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                        type="text"
                        placeholder="e.g. San Francisco"
                        value={exp.city || ''}
                        onChange={(e) => handleUpdate(expIdx, 'city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">State</label>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                        type="text"
                        placeholder="e.g. CA"
                        value={exp.state || ''}
                        onChange={(e) => handleUpdate(expIdx, 'state', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">Country</label>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                        type="text"
                        placeholder="e.g. USA"
                        value={exp.country || ''}
                        onChange={(e) => handleUpdate(expIdx, 'country', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">Location Type</label>
                      <select
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all cursor-pointer"
                        value={exp.location_type || 'Hybrid'}
                        onChange={(e) => handleUpdate(expIdx, 'location_type', e.target.value)}
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">Employment Type</label>
                      <select
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all cursor-pointer"
                        value={exp.employment_type || exp.type || 'Full-time'}
                        onChange={(e) => handleUpdate(expIdx, 'employment_type', e.target.value)}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract / Freelance">Contract / Freelance</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">Start Date</label>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                        type="text"
                        placeholder="e.g. 2022-01"
                        value={exp.start_date || exp.startDate || ''}
                        onChange={(e) => handleUpdate(expIdx, 'start_date', e.target.value)}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[13px] font-medium text-[#14243B]">End Date</label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-[#64748B]">
                          <input
                            type="checkbox"
                            checked={isCurrent}
                            onChange={(e) => handleUpdate(expIdx, 'is_currently_work_here', e.target.checked)}
                            className="rounded border-[#DCE5F0] text-[#2563EB] focus:ring-[#2563EB]"
                          />
                          <span>I currently work here</span>
                        </label>
                      </div>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all disabled:bg-[#F8FAFC]"
                        type="text"
                        placeholder="e.g. 2023-12"
                        disabled={isCurrent}
                        value={isCurrent ? '' : exp.end_date || exp.endDate || ''}
                        onChange={(e) => handleUpdate(expIdx, 'end_date', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Key Responsibilities & Achievements */}
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[13px] font-semibold text-[#14243B] mb-1.5">
                        Responsibilities
                      </label>
                      <textarea
                        rows={3}
                        className="w-full p-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg text-[13.5px] text-[#14243B] font-body-default focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y"
                        placeholder="e.g. Led end-to-end delivery of scalable services and collaborated with cross-functional teams."
                        value={exp.responsibilities || ''}
                        onChange={(e) => handleUpdate(expIdx, 'responsibilities', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-semibold text-[#14243B] mb-1.5">
                        Key Quantified Achievements
                      </label>
                      <textarea
                        rows={3}
                        className="w-full p-3 bg-[#F8FAFC] border border-[#DCE5F0] rounded-lg text-[13.5px] text-[#14243B] font-body-default focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all resize-y"
                        placeholder="e.g. Improved performance by 35% and reduced operational overhead."
                        value={exp.achievements || ''}
                        onChange={(e) => handleUpdate(expIdx, 'achievements', e.target.value)}
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
