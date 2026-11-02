import { toDateInputValue } from '../../../utils/dateUtils'

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

    // Sync aliases
    if (field === 'school_name') item.school = value
    if (field === 'school') item.school_name = value
    if (field === 'field_of_study') item.field = value
    if (field === 'field') item.field_of_study = value
    if (field === 'start_date') item.startDate = value
    if (field === 'startDate') item.start_date = value
    if (field === 'end_date') item.endDate = value
    if (field === 'endDate') item.end_date = value
    if (field === 'is_current') {
      if (value) {
        item.end_date = ''
        item.endDate = 'Present'
      }
    }

    updated[index] = item
    onChange('education', updated)
  }

  const handleAddEducation = () => {
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

  const handleDeleteEducation = (index) => {
    onChange(
      'education',
      items.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#F1F5F9]">
        <div>
          <h2 className="font-headline-section text-headline-section text-[#14243B] font-bold">
            Education &amp; Qualifications
          </h2>
          <p className="font-body-default text-body-default text-[#64748B] mt-0.5">
            Add your degrees, universities, academic achievements, or certifications.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((edu, index) => {
          const degreeError = errors[`edu_${index}_degree`]
          const schoolError = errors[`edu_${index}_school`]

          return (
            <div
              key={index}
              className="bg-white border border-[#DCE5F0] rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 bg-[#F8FAFC] border-b border-[#DCE5F0] flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-[15px] text-[#14243B]">
                    {edu.degree || `Qualification #${index + 1}`}
                    {(edu.school_name || edu.school) && (
                      <span className="font-normal text-[#64748B]"> • {edu.school_name || edu.school}</span>
                    )}
                  </h3>
                  {edu.is_current && (
                    <span className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold rounded uppercase border border-[#2563EB]/20">
                      CURRENTLY ENROLLED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {items.length > 1 && (
                    <button
                      onClick={() => handleDeleteEducation(index)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete entry"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      Degree or Qualification <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default transition-all outline-none ${degreeError
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
                      className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default transition-all outline-none ${schoolError
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

                {/* Calendar Date Inputs: Start Date & End Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      Start Date
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none cursor-pointer"
                      type="date"
                      value={toDateInputValue(edu.start_date || edu.startDate)}
                      onChange={(e) => handleUpdate(index, 'start_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-label-form text-[13px] font-medium text-[#14243B]">
                        End Date / Graduation
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-[#64748B]">
                        <input
                          type="checkbox"
                          checked={Boolean(edu.is_current)}
                          onChange={(e) => handleUpdate(index, 'is_current', e.target.checked)}
                          className="rounded border-[#DCE5F0] text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <span>Currently enrolled</span>
                      </label>
                    </div>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none disabled:bg-[#F8FAFC] disabled:cursor-not-allowed cursor-pointer"
                      type="date"
                      value={edu.is_current ? '' : toDateInputValue(edu.end_date || edu.endDate)}
                      disabled={Boolean(edu.is_current)}
                      onChange={(e) => handleUpdate(index, 'end_date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-label-form text-[13px] font-medium text-[#14243B] mb-1.5">
                      GPA / Honors (Optional)
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all outline-none"
                      placeholder="e.g. 3.8 / 4.0 or First Class"
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => handleUpdate(index, 'gpa', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <button
          onClick={handleAddEducation}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white border border-[#DCE5F0] hover:border-[#2563EB] text-[#2563EB] text-xs font-semibold shadow-2xs hover:bg-[#EFF6FF] transition-all cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Another Degree or School</span>
        </button>
      </div>
    </div>
  )
}
