export default function Step5Experience({ data, onChange }) {
  const defaultExperience = [
    {
      job_title: 'Senior Backend Engineer',
      title: 'Senior Backend Engineer',
      company_name: 'Acme Cloud Services',
      company: 'Acme Cloud Services',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      location_type: 'Hybrid',
      employment_type: 'Full-time',
      type: 'Full-time',
      is_currently_work_here: true,
      isCurrent: true,
      start_date: '2022-01',
      startDate: '2022-01',
      end_date: '',
      endDate: 'Present',
      responsibilities:
        'Architecting asynchronous REST and gRPC microservices, managing high-throughput PostgreSQL clusters.',
      achievements: 'Decreased 99th percentile API latency by 42% across 20M daily requests.',
      bullets: [
        'Architecting asynchronous REST and gRPC microservices, managing high-throughput PostgreSQL clusters.',
        'Decreased 99th percentile API latency by 42% across 20M daily requests.',
      ],
      order: 1,
    },
  ]

  const items = data.experience && data.experience.length > 0 ? data.experience : defaultExperience

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <span className="font-label-form text-[13px] text-[#14243B] font-semibold">Work Experience</span>
          <p className="font-body-default text-[12px] text-[#64748B] mt-0.5">
            Show your professional achievements, key responsibilities, and impact.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Autofilled work experience from profile!')}
            className="h-10 px-3.5 rounded-lg border border-[#DCE5F0] bg-white hover:bg-[#F8FAFC] text-[#14243B] font-body-semibold text-[13px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[17px] text-[#64748B]">sync</span>
            <span>Autofill from LinkedIn</span>
          </button>
          <button
            onClick={handleAddExperience}
            className="h-10 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-body-semibold text-[13px] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Add Experience</span>
          </button>
        </div>
      </div>

      {/* Experience Entries */}
      <div className="space-y-6">
        {items.map((exp, expIdx) => {
          const isCurrent = exp.is_currently_work_here ?? exp.isCurrent ?? false
          return (
            <div
              key={expIdx}
              className="bg-white border border-[#DCE5F0] rounded-xl p-6 shadow-sm transition-all hover:border-[#2563EB]/40"
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
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      type="text"
                      placeholder="e.g. Senior Backend Engineer"
                      value={exp.job_title || exp.title || ''}
                      onChange={(e) => handleUpdate(expIdx, 'job_title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      type="text"
                      placeholder="e.g. Acme Cloud Services"
                      value={exp.company_name || exp.company || ''}
                      onChange={(e) => handleUpdate(expIdx, 'company_name', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">City</label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      type="text"
                      placeholder="San Francisco"
                      value={exp.city || ''}
                      onChange={(e) => handleUpdate(expIdx, 'city', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">State</label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      type="text"
                      placeholder="CA"
                      value={exp.state || ''}
                      onChange={(e) => handleUpdate(expIdx, 'state', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">Country</label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      type="text"
                      placeholder="USA"
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
                      placeholder="e.g. Architecting asynchronous REST and gRPC microservices, managing high-throughput PostgreSQL clusters."
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
                      placeholder="e.g. Decreased 99th percentile API latency by 42% across 20M daily requests."
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
    </div>
  )
}
