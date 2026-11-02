import { useMemo, useState } from 'react'
import { Country, State, City } from 'country-state-city'
import SelectWithInvisibleSearch from '../../common/SelectWithInvisibleSearch'

export default function Step1PersonalInfo({ data, onChange, errors = {} }) {
  const allCountries = useMemo(() => Country.getAllCountries(), [])

  // Find country by isoCode or name (case-insensitive)
  const selectedCountry = useMemo(() => {
    if (!data.country) return null
    const cNorm = data.country.trim().toLowerCase()
    return (
      allCountries.find(
        (c) => c.isoCode.toLowerCase() === cNorm || c.name.toLowerCase() === cNorm
      ) || null
    )
  }, [data.country, allCountries])

  // States available for the selected country
  const availableStates = useMemo(() => {
    if (!selectedCountry) return []
    return State.getStatesOfCountry(selectedCountry.isoCode)
  }, [selectedCountry])

  // Find state by isoCode or name (case-insensitive)
  const selectedState = useMemo(() => {
    if (!data.state || availableStates.length === 0) return null
    const sNorm = data.state.trim().toLowerCase()
    return (
      availableStates.find(
        (s) => s.isoCode.toLowerCase() === sNorm || s.name.toLowerCase() === sNorm
      ) || null
    )
  }, [data.state, availableStates])

  // Cities available for the selected country & state
  const availableCities = useMemo(() => {
    if (!selectedCountry || !selectedState) return []
    return City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
  }, [selectedCountry, selectedState])

  const [isManualCity, setIsManualCity] = useState(false)

  // Options for Country (Names only - NO Country Codes)
  const countryOptions = useMemo(() => {
    return allCountries.map((c) => ({
      value: c.isoCode,
      label: c.name, // Pure country name (e.g. India, United States)
    }))
  }, [allCountries])

  // Options for State
  const stateOptions = useMemo(() => {
    return availableStates.map((s) => ({
      value: s.isoCode,
      label: s.name,
    }))
  }, [availableStates])

  // Options for City
  const cityOptions = useMemo(() => {
    const list = availableCities.map((c) => ({
      value: c.name,
      label: c.name,
    }))
    // Preserve current city if not in the official list
    if (
      data.city &&
      !list.some((item) => item.value.toLowerCase() === data.city.toLowerCase())
    ) {
      list.unshift({ value: data.city, label: data.city })
    }
    return list
  }, [availableCities, data.city])

  // Handle Country selection
  const handleCountryChange = (countryIsoCode) => {
    const countryObj = allCountries.find((c) => c.isoCode === countryIsoCode)
    const countryName = countryObj ? countryObj.name : ''
    onChange('country', countryName)
    // Clear state and city when country changes
    onChange('state', '')
    onChange('city', '')
    setIsManualCity(false)
    const loc = [data.address, countryName].filter(Boolean).join(', ')
    onChange('location', loc)
  }

  // Handle State selection
  const handleStateChange = (stateIsoCode) => {
    const stateObj = availableStates.find((s) => s.isoCode === stateIsoCode)
    const stateName = stateObj ? stateObj.name : ''
    onChange('state', stateName)
    // Clear city when state changes
    onChange('city', '')
    setIsManualCity(false)
    const loc = [stateName, data.country].filter(Boolean).join(', ')
    onChange('location', loc)
  }

  // Handle City selection
  const handleCityChange = (cityName) => {
    onChange('city', cityName)
    const loc = [cityName, data.state, data.country].filter(Boolean).join(', ')
    onChange('location', loc)
  }

  return (
    <div className="space-y-5">
      {/* Row 1: First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="firstName">
              First Name <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.first_name ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.first_name
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="firstName"
              placeholder="John"
              type="text"
              value={data.first_name || ''}
              onChange={(e) => {
                onChange('first_name', e.target.value)
                const fullName = `${e.target.value} ${data.last_name || ''}`.trim()
                onChange('fullName', fullName)
              }}
            />
          </div>
          {errors.first_name && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.first_name}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="lastName">
              Last Name <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.last_name ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.last_name
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="lastName"
              placeholder="Doe"
              type="text"
              value={data.last_name || ''}
              onChange={(e) => {
                onChange('last_name', e.target.value)
                const fullName = `${data.first_name || ''} ${e.target.value}`.trim()
                onChange('fullName', fullName)
              }}
            />
          </div>
          {errors.last_name && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.last_name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Email Address & Phone Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="emailAddr">
              Email Address <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.email ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="emailAddr"
              placeholder="alex.morgan@design.io"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="phoneNum">
              Phone Number
            </label>
            <span className="text-[12px] text-[#64748B]">Optional</span>
          </div>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="phoneNum"
              placeholder="+1 (555) 234-5678"
              type="tel"
              value={data.phone || ''}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Row 3: Country, State / Region, City (Cascading with Invisible Search) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Country Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="country">
              Country <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.country ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <SelectWithInvisibleSearch
              id="country"
              value={selectedCountry?.isoCode || ''}
              options={countryOptions}
              placeholder="Select Country"
              onChange={(val) => handleCountryChange(val)}
              error={Boolean(errors.country)}
            />
          </div>
          {errors.country && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.country}</span>
            </p>
          )}
        </div>

        {/* State / Region Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="state">
              State / Region <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.state ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            {selectedCountry && availableStates.length === 0 ? (
              <input
                className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                  errors.state
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
                }`}
                id="state"
                placeholder="State / Region"
                type="text"
                value={data.state || ''}
                onChange={(e) => {
                  onChange('state', e.target.value)
                  const loc = [data.city, e.target.value, data.country].filter(Boolean).join(', ')
                  onChange('location', loc)
                }}
              />
            ) : (
              <SelectWithInvisibleSearch
                id="state"
                value={selectedState?.isoCode || ''}
                options={stateOptions}
                placeholder={selectedCountry ? 'Select State / Region' : 'Select Country First'}
                disabled={!selectedCountry}
                onChange={(val) => handleStateChange(val)}
                error={Boolean(errors.state)}
              />
            )}
          </div>
          {errors.state && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.state}</span>
            </p>
          )}
        </div>

        {/* City Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="city">
              City <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="flex items-center gap-2">
              {availableCities.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualCity((prev) => !prev)}
                  className="text-[11px] text-[#2563EB] hover:underline font-medium cursor-pointer"
                >
                  {isManualCity ? 'Select from list' : '+ Enter custom'}
                </button>
              )}
              <span
                className={`text-[12px] ${
                  errors.city ? 'text-red-600 font-semibold' : 'text-[#64748B]'
                }`}
              >
                Required
              </span>
            </div>
          </div>
          <div className="relative">
            {isManualCity || (selectedState && availableCities.length === 0) ? (
              <input
                className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                  errors.city
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
                }`}
                id="city"
                placeholder="Enter city name"
                type="text"
                value={data.city || ''}
                onChange={(e) => handleCityChange(e.target.value)}
              />
            ) : (
              <SelectWithInvisibleSearch
                id="city"
                value={data.city || ''}
                options={cityOptions}
                placeholder={selectedState ? 'Select City' : 'Select State First'}
                disabled={!selectedState}
                onChange={(val) => handleCityChange(val)}
                error={Boolean(errors.city)}
              />
            )}
          </div>
          {errors.city && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.city}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 4: Street Address & ZIP / Postal Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="streetAddr">
              Street Address <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.address ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.address
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="streetAddr"
              placeholder="123 Market St, Apt 4B"
              type="text"
              value={data.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
            />
          </div>
          {errors.address && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.address}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="zipCode">
              ZIP / Postal Code <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.zip_code ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.zip_code
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="zipCode"
              placeholder="94105"
              type="text"
              value={data.zip_code || ''}
              onChange={(e) => onChange('zip_code', e.target.value)}
            />
          </div>
          {errors.zip_code && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.zip_code}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 5: Website, LinkedIn, GitHub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="website">
            Website / Portfolio
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="website"
              placeholder="https://yourportfolio.com"
              type="url"
              value={data.website || data.portfolio || ''}
              onChange={(e) => {
                onChange('website', e.target.value)
                onChange('portfolio', e.target.value)
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="linkedinUrl">
              LinkedIn Profile <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.linkedin ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.linkedin
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/username"
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => onChange('linkedin', e.target.value)}
            />
          </div>
          {errors.linkedin && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.linkedin}</span>
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="githubUrl">
            GitHub Profile
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="githubUrl"
              placeholder="https://github.com/username"
              type="text"
              value={data.github || ''}
              onChange={(e) => onChange('github', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contextual Tip */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#2563EB]/20 flex items-start gap-3 mt-4">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
        </div>
        <div className="text-[13px] space-y-1">
          <p className="font-body-semibold text-[#102544]">ATS Parsing Rule for Location</p>
          <p className="text-[#64748B] leading-relaxed">
            Selecting standard country, state, and city ensures ATS engines such as Taleo, Workday, and Greenhouse accurately index your location for remote and local matching.
          </p>
        </div>
      </div>
    </div>
  )
}
