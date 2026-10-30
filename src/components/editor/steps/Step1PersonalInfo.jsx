export default function Step1PersonalInfo({ data, onChange, errors = {} }) {
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

      {/* Row 3: Street Address & City */}
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
              placeholder="123 Market St"
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
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="city">
              City <span className="text-red-500 font-bold">*</span>
            </label>
            <span
              className={`text-[12px] ${
                errors.city ? 'text-red-600 font-semibold' : 'text-[#64748B]'
              }`}
            >
              Required
            </span>
          </div>
          <div className="relative">
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.city
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="city"
              placeholder="San Francisco"
              type="text"
              value={data.city || ''}
              onChange={(e) => {
                onChange('city', e.target.value)
                const loc = [e.target.value, data.state, data.country].filter(Boolean).join(', ')
                onChange('location', loc)
              }}
            />
          </div>
          {errors.city && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.city}</span>
            </p>
          )}
        </div>
      </div>

      {/* Row 4: State, Zip Code, Country */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.state
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="state"
              placeholder="CA"
              type="text"
              value={data.state || ''}
              onChange={(e) => {
                onChange('state', e.target.value)
                const loc = [data.city, e.target.value, data.country].filter(Boolean).join(', ')
                onChange('location', loc)
              }}
            />
          </div>
          {errors.state && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.state}</span>
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
            <input
              className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
                errors.country
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
              id="country"
              placeholder="United States"
              type="text"
              value={data.country || ''}
              onChange={(e) => {
                onChange('country', e.target.value)
                const loc = [data.city, data.state, e.target.value].filter(Boolean).join(', ')
                onChange('location', loc)
              }}
            />
          </div>
          {errors.country && (
            <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1 font-body-medium">
              <span className="material-symbols-outlined text-[15px]">error</span>
              <span>{errors.country}</span>
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
          <p className="font-body-semibold text-[#102544]">ATS Parsing Rule for Contact Details</p>
          <p className="text-[#64748B] leading-relaxed">
            Ensure your email, phone, and location are directly readable text. ATS engines such as Taleo and Greenhouse extract these directly into your candidate profile card.
          </p>
        </div>
      </div>
    </div>
  )
}
