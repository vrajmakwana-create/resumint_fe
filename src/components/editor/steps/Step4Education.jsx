export default function Step4Education({ data, onChange, errors = {} }) {
  const blankEducation = {
    degree: '',
    school_name: '',
    school: '',
    field_of_study: '',
    field: '',
    start_date: '',
    startDate: '',
    end_date: '',
    endDate: '',
    gpa: '',
    url: '',
    is_current: false,
  }

  const items = data.education && data.education.length > 0 ? data.education : [blankEducation]

  const handleUpdate = (index, field, value) => {
    const updated = [...items]
    const item = { ...updated[index], [field]: value }
    // Keep legacy alias fields in sync
    if (field === 'school_name') item.school = value
    if (field === 'school') item.school_name = value
    if (field === 'field_of_study') item.field = value
    if (field === 'field') item.field_of_study = value
    if (field === 'start_date') item.startDate = value
    if (field === 'startDate') item.start_date = value
    if (field === 'end_date') item.endDate = value
    if (field === 'endDate') item.end_date = value

    updated[index] = item
    onChange('education', updated)
  }

  const handleAdd = () => {
    onChange('education', [
      ...items,
      {
        degree: '',
        school_name: '',
        school: '',
        field_of_study: '',
        field: '',
        start_date: '',
        startDate: '',
        end_date: '',
        endDate: '',
        gpa: '',
        url: '',
        is_current: false,
      },
    ])
  }

  const handleDelete = (index) => {
    onChange(
      'education',
      items.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Autofill */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <span className="font-label-form text-[13px] text-[#14243B] font-semibold flex items-center gap-1.5">
            <span>Academic Background &amp; Qualifications</span>
            <span className="text-red-500 font-bold">*</span>
          </span>
          <p className="font-body-default text-[12px] text-[#64748B] mt-0.5">
            Add higher education degrees, credentials, and institution details. Degree and Institution are required.
          </p>
        </div>
      </div>

      {/* Top Error Notice */}
      {errors.education && (
        <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 rounded-lg text-[#B91C1C] text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-medium">{errors.education}</span>
        </div>
      )}

      {/* Education Cards */}
      <div className="space-y-5">
        {items.map((edu, index) => {
          const degreeError = errors[`edu_${index}_degree`]
          const schoolError = errors[`edu_${index}_school`]

          return (
            <div
              key={index}
              className={`bg-white rounded-xl border shadow-sm transition-all ${
                degreeError || schoolError ? 'border-red-400 ring-1 ring-red-400/20' : 'border-[#DCE5F0] hover:border-[#2563EB]/40'
              }`}
            >
              {/* Card Header Bar */}
              <div className="px-6 py-4 border-b border-[#DCE5F0] flex items-center justify-between bg-[#F8FAFC] rounded-t-xl">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#64748B] cursor-grab text-[20px]">
                    drag_indicator
                  </span>
                  <h3 className="font-headline-card text-headline-card text-[#14243B] font-semibold">
                    Education #{index + 1} • {edu.degree || 'Degree Entry'}
                  </h3>
                  {index === 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-badge-label text-[10px] font-semibold uppercase">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 1 && (
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-[#64748B] hover:text-[#DC2626] p-1 rounded-md transition-colors cursor-pointer"
                      title="Delete entry"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      Degree or Qualification <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default transition-all outline-none ${
                        degreeError
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                      }`}
                      placeholder="e.g. Bachelor of Science in Computer Science"
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => handleUpdate(index, 'degree', e.target.value)}
                    />
                    {degreeError && (
                      <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
                        <span className="material-symbols-outlined text-[15px]">error</span>
                        <span>{degreeError}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      Institution / University Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default transition-all outline-none ${
                        schoolError
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20'
                      }`}
                      placeholder="e.g. Stanford University"
                      type="text"
                      value={edu.school_name || edu.school || ''}
                      onChange={(e) => handleUpdate(index, 'school_name', e.target.value)}
                    />
                    {schoolError && (
                      <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
                        <span className="material-symbols-outlined text-[15px]">error</span>
                        <span>{schoolError}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      Field of Study
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                      placeholder="e.g. Computer Science / Engineering"
                      type="text"
                      value={edu.field_of_study || edu.field || ''}
                      onChange={(e) => handleUpdate(index, 'field_of_study', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      Institution URL / Website
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                      placeholder="e.g. https://university.edu"
                      type="url"
                      value={edu.url || ''}
                      onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      Start Date / Year
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                      placeholder="e.g. 2020"
                      type="text"
                      value={edu.start_date || edu.startDate || ''}
                      onChange={(e) => handleUpdate(index, 'start_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      End Date / Year
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none disabled:bg-[#F8FAFC]"
                      placeholder="e.g. 2024"
                      type="text"
                      value={edu.end_date || edu.endDate || ''}
                      disabled={Boolean(edu.is_current)}
                      onChange={(e) => handleUpdate(index, 'end_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      GPA
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                      placeholder="e.g. 3.8"
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => handleUpdate(index, 'gpa', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`isCurrent-${index}`}
                    checked={Boolean(edu.is_current)}
                    onChange={(e) => handleUpdate(index, 'is_current', e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] border-[#DCE5F0] rounded focus:ring-[#2563EB]"
                  />
                  <label htmlFor={`isCurrent-${index}`} className="text-[13px] text-[#14243B] cursor-pointer">
                    Currently studying here
                  </label>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Button */}
      <button
        onClick={handleAdd}
        className="w-full h-11 rounded-lg border-2 border-dashed border-[#DCE5F0] hover:border-[#2563EB] text-[#2563EB] font-body-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-[#EFF6FF] transition-all cursor-pointer"
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
        <span>+ Add Another Degree or Educational Credential</span>
      </button>
    </div>
  )
}
