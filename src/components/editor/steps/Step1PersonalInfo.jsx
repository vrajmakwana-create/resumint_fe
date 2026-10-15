export default function Step1PersonalInfo({ data, onChange }) {
  return (
    <div className="space-y-5">
      {/* Row 1: First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="firstName">
              First Name
            </label>
            <span className="text-[12px] text-[#64748B]">Required</span>
          </div>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="firstName"
              placeholder="Vraj"
              type="text"
              value={data.first_name || ''}
              onChange={(e) => {
                onChange('first_name', e.target.value)
                const fullName = `${e.target.value} ${data.last_name || ''}`.trim()
                onChange('fullName', fullName)
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="lastName">
              Last Name
            </label>
            <span className="text-[12px] text-[#64748B]">Required</span>
          </div>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="lastName"
              placeholder="Makwana"
              type="text"
              value={data.last_name || ''}
              onChange={(e) => {
                onChange('last_name', e.target.value)
                const fullName = `${data.first_name || ''} ${e.target.value}`.trim()
                onChange('fullName', fullName)
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Email Address & Phone Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="emailAddr">
              Email Address
            </label>
            <span className="text-[12px] text-[#64748B]">Required</span>
          </div>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="emailAddr"
              placeholder="vraj@yopmail.com"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </div>
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
              placeholder="+91 7984691562"
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
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="streetAddr">
            Street Address
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="streetAddr"
              placeholder="742 Evergreen Terrace"
              type="text"
              value={data.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="city">
            City
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="city"
              placeholder="Anand"
              type="text"
              value={data.city || ''}
              onChange={(e) => {
                onChange('city', e.target.value)
                const loc = [e.target.value, data.state, data.country].filter(Boolean).join(', ')
                onChange('location', loc)
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 4: State, Zip Code, Country */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="state">
            State / Region
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="state"
              placeholder="GJ"
              type="text"
              value={data.state || ''}
              onChange={(e) => {
                onChange('state', e.target.value)
                const loc = [data.city, e.target.value, data.country].filter(Boolean).join(', ')
                onChange('location', loc)
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="zipCode">
            ZIP / Postal Code
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="zipCode"
              placeholder="97477"
              type="text"
              value={data.zip_code || ''}
              onChange={(e) => onChange('zip_code', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="country">
            Country
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="country"
              placeholder="INDIA"
              type="text"
              value={data.country || ''}
              onChange={(e) => {
                onChange('country', e.target.value)
                const loc = [data.city, data.state, e.target.value].filter(Boolean).join(', ')
                onChange('location', loc)
              }}
            />
          </div>
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
              placeholder="https://johndoe.dev"
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
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="linkedinUrl">
            LinkedIn Profile
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/johndoe"
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => onChange('linkedin', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-label-form text-[13px] text-[#14243B] font-medium" htmlFor="githubUrl">
            GitHub Profile
          </label>
          <div className="relative">
            <input
              className="w-full h-[44px] px-3.5 bg-white border border-[#DCE5F0] rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all font-body-default"
              id="githubUrl"
              placeholder="https://github.com/johndoe"
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
