import { useMemo, useState } from 'react'
import { Country, State, City } from 'country-state-city'
import SelectWithInvisibleSearch from '../../common/SelectWithInvisibleSearch'
import { toDateInputValue } from '../../../utils/dateUtils'

/**
 * Cascading Country -> State -> City Dropdown Selector for each Experience entry.
 * Uses country-state-city with invisible search typeahead.
 */
function ExperienceLocationFields({ exp, expIdx, onLocationUpdate, allCountries }) {
  const [isManualCity, setIsManualCity] = useState(false)

  // Find country object by isoCode or name (case-insensitive)
  const selectedCountry = useMemo(() => {
    if (!exp.country) return null
    const cNorm = exp.country.trim().toLowerCase()
    return (
      allCountries.find(
        (c) => c.isoCode.toLowerCase() === cNorm || c.name.toLowerCase() === cNorm
      ) || null
    )
  }, [exp.country, allCountries])

  // States available for the selected country
  const availableStates = useMemo(() => {
    if (!selectedCountry) return []
    return State.getStatesOfCountry(selectedCountry.isoCode)
  }, [selectedCountry])

  // Find state object by isoCode or name (case-insensitive)
  const selectedState = useMemo(() => {
    if (!exp.state || availableStates.length === 0) return null
    const sNorm = exp.state.trim().toLowerCase()
    return (
      availableStates.find(
        (s) => s.isoCode.toLowerCase() === sNorm || s.name.toLowerCase() === sNorm
      ) || null
    )
  }, [exp.state, availableStates])

  // Cities available for the selected country & state
  const availableCities = useMemo(() => {
    if (!selectedCountry || !selectedState) return []
    return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
  }, [selectedCountry, selectedState])

  // Country Options (Pure Country Name, NO Country Code prefix)
  const countryOptions = useMemo(() => {
    return allCountries.map((c) => ({
      value: c.isoCode,
      label: c.name,
    }))
  }, [allCountries])

  // State Options
  const stateOptions = useMemo(() => {
    return availableStates.map((s) => ({
      value: s.isoCode,
      label: s.name,
    }))
  }, [availableStates])

  // City Options
  const cityOptions = useMemo(() => {
    const list = availableCities.map((c) => ({
      value: c.name,
      label: c.name,
    }))
    // Preserve custom/saved city if already present
    if (
      exp.city &&
      !list.some((item) => item.value.toLowerCase() === exp.city.toLowerCase())
    ) {
      list.unshift({ value: exp.city, label: exp.city })
    }
    return list
  }, [availableCities, exp.city])

  // Handle Country selection
  const handleCountryChange = (countryIsoCode) => {
    const countryObj = allCountries.find((c) => c.isoCode === countryIsoCode)
    const countryName = countryObj ? countryObj.name : ''
    // Clear state and city when country changes
    onLocationUpdate(expIdx, {
      country: countryName,
      state: '',
      city: '',
    })
    setIsManualCity(false)
  }

  // Handle State selection
  const handleStateChange = (stateIsoCode) => {
    const stateObj = availableStates.find((s) => s.isoCode === stateIsoCode)
    const stateName = stateObj ? stateObj.name : ''
    // Clear city when state changes
    onLocationUpdate(expIdx, {
      state: stateName,
      city: '',
    })
    setIsManualCity(false)
  }

  // Handle City selection
  const handleCityChange = (cityName) => {
    onLocationUpdate(expIdx, {
      city: cityName,
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Country Selection */}
      <div className="space-y-1">
        <label className="block text-[13px] font-medium text-[#14243B] mb-1.5" htmlFor={`exp_${expIdx}_country`}>
          Country
        </label>
        <SelectWithInvisibleSearch
          id={`exp_${expIdx}_country`}
          value={selectedCountry?.isoCode || ''}
          options={countryOptions}
          placeholder="Select Country"
          onChange={handleCountryChange}
        />
      </div>

      {/* 2. State / Region Selection */}
      <div className="space-y-1">
        <label className="block text-[13px] font-medium text-[#14243B] mb-1.5" htmlFor={`exp_${expIdx}_state`}>
          State / Region
        </label>
        {selectedCountry && availableStates.length === 0 ? (
          <input
            className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            id={`exp_${expIdx}_state`}
            type="text"
            placeholder="State / Region"
            value={exp.state || ''}
            onChange={(e) => onLocationUpdate(expIdx, { state: e.target.value })}
          />
        ) : (
          <SelectWithInvisibleSearch
            id={`exp_${expIdx}_state`}
            value={selectedState?.isoCode || ''}
            options={stateOptions}
            placeholder={selectedCountry ? 'Select State / Region' : 'Select Country First'}
            disabled={!selectedCountry}
            onChange={handleStateChange}
          />
        )}
      </div>

      {/* 3. City Selection */}
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[13px] font-medium text-[#14243B]" htmlFor={`exp_${expIdx}_city`}>
            City
          </label>
          {availableCities.length > 0 && (
            <button
              type="button"
              onClick={() => setIsManualCity((prev) => !prev)}
              className="text-[11px] text-[#2563EB] hover:underline font-medium cursor-pointer"
            >
              {isManualCity ? 'Select from list' : '+ Enter custom'}
            </button>
          )}
        </div>
        {isManualCity || (selectedState && availableCities.length === 0) || !selectedState ? (
          <input
            className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            id={`exp_${expIdx}_city`}
            type="text"
            placeholder={
              !selectedCountry
                ? 'City (select Country first)'
                : !selectedState
                  ? 'City (select State first)'
                  : 'Enter City name'
            }
            value={exp.city || ''}
            onChange={(e) => onLocationUpdate(expIdx, { city: e.target.value })}
          />
        ) : (
          <SelectWithInvisibleSearch
            id={`exp_${expIdx}_city`}
            value={exp.city || ''}
            options={cityOptions}
            placeholder="Select City"
            onChange={handleCityChange}
          />
        )}
      </div>
    </div>
  )
}

export default function Step5Experience({ data, onChange, errors = {} }) {
  const allCountries = useMemo(() => Country.getAllCountries(), [])
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
    bullets: [],
    order: 1,
  }

  const isFresher = Boolean(data.noExperience)
  const items = data.experience && data.experience.length > 0 ? data.experience : [blankExperience]

  const handleLocationUpdate = (index, updates) => {
    const updated = [...items]
    updated[index] = { ...updated[index], ...updates }
    onChange('experience', updated)
  }

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
        bullets: [],
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-headline-section text-headline-section text-[#14243B] font-bold">
              Work Experience
            </h2>
            {(data.total_experience_years != null || data.candidate_experience_years != null) && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center gap-1 shadow-2xs">
                <span className="material-symbols-outlined text-[14px]">work_history</span>
                <span>{data.total_experience_years ?? data.candidate_experience_years} Years Total</span>
              </span>
            )}
          </div>
          <p className="font-body-default text-body-default text-[#64748B] mt-0.5">
            List your professional roles in reverse-chronological order.
          </p>
        </div>

        {/* Fresher Toggle Checkbox */}
        <label className="inline-flex items-center gap-2 cursor-pointer bg-[#F8FAFC] border border-[#DCE5F0] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#14243B] hover:border-[#2563EB] transition-colors shrink-0">
          <input
            type="checkbox"
            checked={isFresher}
            onChange={(e) => {
              onChange('noExperience', e.target.checked)
              if (e.target.checked) {
                onChange('experience', [])
              } else if (items.length === 0) {
                onChange('experience', [blankExperience])
              }
            }}
            className="w-4 h-4 rounded border-[#DCE5F0] text-[#2563EB] focus:ring-[#2563EB]"
          />
          <span>I am a fresher / no prior work experience</span>
        </label>
      </div>

      {isFresher ? (
        <div className="p-8 text-center bg-[#F8FAFC] rounded-2xl border-2 border-dashed border-[#DCE5F0] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <p className="font-bold text-[#14243B] text-[15px]">Fresher Profile Active</p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Your resume will highlight education, projects, skills, and certifications instead of traditional job history.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((exp, expIdx) => {
            const isCurrent = Boolean(exp.is_currently_work_here ?? exp.isCurrent)
            const titleError = errors[`exp_${expIdx}_title`]
            const companyError = errors[`exp_${expIdx}_company`]

            return (
              <div
                key={expIdx}
                className="bg-white border border-[#DCE5F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 transition-all"
              >
                {/* Entry Title Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-xs font-bold shrink-0">
                      {expIdx + 1}
                    </span>
                    <h3 className="font-bold text-[15px] text-[#14243B]">
                      {exp.job_title || exp.title || `Position #${expIdx + 1}`}
                      {(exp.company_name || exp.company) && (
                        <span className="font-normal text-[#64748B]"> at {exp.company_name || exp.company}</span>
                      )}
                    </h3>
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] tracking-wide ml-1 border border-[#2563EB]/20">
                        CURRENT ROLE
                      </span>
                    )}
                    {exp.experience_years != null && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] ml-1">
                        {exp.experience_years} {exp.experience_years === 1 ? 'Year' : 'Years'}
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
                        className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default outline-none transition-all ${titleError
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
                        className={`w-full h-11 px-3.5 rounded-lg border bg-white text-[#14243B] font-body-default text-body-default outline-none transition-all ${companyError
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

                  {/* Cascading Country -> State -> City Dropdowns */}
                  <ExperienceLocationFields
                    exp={exp}
                    expIdx={expIdx}
                    onLocationUpdate={handleLocationUpdate}
                    allCountries={allCountries}
                  />

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

                  {/* Calendar Date Inputs: Start Date & End Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">
                        Start Date <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        className="w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all cursor-pointer"
                        type="date"
                        value={toDateInputValue(exp.start_date || exp.startDate)}
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
                        className={`w-full h-11 px-3.5 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        type="date"
                        disabled={isCurrent}
                        value={isCurrent ? '' : toDateInputValue(exp.end_date || exp.endDate)}
                        onChange={(e) => handleUpdate(expIdx, 'end_date', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">
                      Key Responsibilities &amp; Scope
                    </label>
                    <textarea
                      className="w-full p-3 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      rows={3}
                      placeholder="e.g. Led a team of 4 engineers delivering cloud-native APIs handling 10k requests/sec."
                      value={exp.responsibilities || (exp.bullets && exp.bullets[0]) || ''}
                      onChange={(e) => handleUpdate(expIdx, 'responsibilities', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-[#14243B] mb-1.5">
                      Key Achievements &amp; Metrics
                    </label>
                    <textarea
                      className="w-full p-3 rounded-lg border border-[#DCE5F0] bg-white text-[#14243B] font-body-default text-body-default focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      rows={2}
                      placeholder="e.g. Reduced database latency by 45% through Redis caching and query indexing."
                      value={exp.achievements || (exp.bullets && exp.bullets[1]) || ''}
                      onChange={(e) => handleUpdate(expIdx, 'achievements', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={handleAddExperience}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-white border border-[#DCE5F0] hover:border-[#2563EB] text-[#2563EB] text-xs font-semibold shadow-2xs hover:bg-[#EFF6FF] transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Another Experience</span>
          </button>
        </div>
      )}
    </div>
  )
}
