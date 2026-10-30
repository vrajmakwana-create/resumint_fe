import { useState } from 'react'

export default function Step3Skills({ data, onChange, errors = {} }) {
  const [newSkill, setNewSkill] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('tools')

  const tools = data.tools || []
  const technical = data.technical || []
  const leadership = data.leadership || []

  const totalSkillsCount = tools.length + technical.length + leadership.length + (data.skills?.length || 0)

  const handleAddSkill = () => {
    if (!newSkill.trim()) return
    const skill = newSkill.trim()
    if (selectedCategory === 'tools') {
      onChange('tools', [...tools, skill])
    } else if (selectedCategory === 'technical') {
      onChange('technical', [...technical, skill])
    } else {
      onChange('leadership', [...leadership, skill])
    }
    setNewSkill('')
  }

  const handleRemoveSkill = (category, item) => {
    if (category === 'tools') {
      onChange('tools', tools.filter((t) => t !== item))
    } else if (category === 'technical') {
      onChange('technical', technical.filter((t) => t !== item))
    } else {
      onChange('leadership', leadership.filter((t) => t !== item))
    }
  }

  const addRecommended = (skill, category = 'technical') => {
    if (category === 'technical' && !technical.includes(skill)) {
      onChange('technical', [...technical, skill])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#F1F5F9]">
        <div>
          <label className="font-label-form text-[13px] text-[#14243B] font-semibold flex items-center gap-1.5" htmlFor="skillInput">
            <span>Add Skills or Competencies</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[11px] font-normal text-[#64748B]">({totalSkillsCount} added)</span>
          </label>
          <p className="text-[11px] text-[#64748B] mt-0.5">Type a skill and press Enter or click Add (At least 1 skill required)</p>
        </div>
      </div>

      {/* Validation Error Banner */}
      {errors.skills && (
        <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 rounded-lg text-[#B91C1C] text-[13px] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span className="font-medium">{errors.skills}</span>
        </div>
      )}

      {/* Input Row */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 relative">
          <input
            className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${
              errors.skills
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
            }`}
            id="skillInput"
            placeholder="e.g. Python, Docker, Figma, User Research..."
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSkill()
              }
            }}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-[44px] px-3 bg-white border border-[#DCE5F0] rounded-lg text-[13px] text-[#14243B] font-body-medium focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 outline-none transition-all cursor-pointer"
          >
            <option value="tools">Tools &amp; Platforms</option>
            <option value="technical">Technical &amp; Methodologies</option>
            <option value="leadership">Leadership &amp; Professional</option>
          </select>
        </div>
        <button
          onClick={handleAddSkill}
          className="h-[44px] px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-body-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Add Skill</span>
        </button>
      </div>

      {/* Categorized Skills Chips */}
      <div className="space-y-4 pt-1">
        {/* Category 1: Tools */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">Tools &amp; Platforms</span>
            <span className="text-[11px] text-[#64748B]">{tools.length} skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tools.length === 0 ? (
              <p className="text-[12px] text-[#94A3B8] italic py-1">No tools added yet. Add above.</p>
            ) : (
              tools.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-[#EFF6FF] border border-[#2563EB]/30 text-[#14243B] text-[13px] font-body-medium px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <span className="font-semibold text-[#102544]">{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill('tools', skill)}
                    className="hover:text-[#DC2626] text-[#64748B] flex items-center ml-0.5 cursor-pointer"
                    title="Remove skill"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Category 2: Technical */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
              Technical &amp; Methodologies
            </span>
            <span className="text-[11px] text-[#64748B]">{technical.length} skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {technical.length === 0 ? (
              <p className="text-[12px] text-[#94A3B8] italic py-1">No technical skills added yet. Add above.</p>
            ) : (
              technical.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-[#F1F5F9] border border-[#DCE5F0] text-[#14243B] text-[13px] font-body-medium px-3 py-1.5 rounded-lg"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill('technical', skill)}
                    className="hover:text-[#DC2626] text-[#64748B] flex items-center ml-0.5 cursor-pointer"
                    title="Remove skill"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Category 3: Leadership */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
              Leadership &amp; Professional
            </span>
            <span className="text-[11px] text-[#64748B]">{leadership.length} skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {leadership.length === 0 ? (
              <p className="text-[12px] text-[#94A3B8] italic py-1">No leadership skills added yet. Add above.</p>
            ) : (
              leadership.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-[#F1F5F9] border border-[#DCE5F0] text-[#14243B] text-[13px] font-body-medium px-3 py-1.5 rounded-lg"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill('leadership', skill)}
                    className="hover:text-[#DC2626] text-[#64748B] flex items-center ml-0.5 cursor-pointer"
                    title="Remove skill"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Recommended Skills Card */}
      <div className="rounded-xl border border-[#2563EB]/30 bg-[#EFF6FF] p-5 space-y-3.5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#2563EB]">auto_awesome</span>
              <span className="font-body-semibold text-[13.5px] text-[#102544]">
                AI Suggested Skills
              </span>
              <span className="bg-[#DCFCE7] text-[#15803D] border border-[#16A34A]/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide">
                +8% ATS Match Impact
              </span>
            </div>
            <p className="text-[12px] text-[#64748B]">
              Commonly required skills across enterprise applicant tracking systems.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Problem Solving', 'System Architecture', 'Agile Methodologies', 'Cross-functional Collaboration'].map(
            (rec, i) => (
              <button
                key={i}
                onClick={() => addRecommended(rec)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#2563EB]/30 hover:border-[#2563EB] text-[#102544] hover:text-[#2563EB] text-[12.5px] font-medium transition-colors group shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[15px] text-[#2563EB] group-hover:scale-110 transition-transform">
                  add
                </span>
                <span>{rec}</span>
              </button>
            )
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              ;['Problem Solving', 'System Architecture', 'Agile Methodologies', 'Cross-functional Collaboration'].forEach(
                (s) => addRecommended(s)
              )
            }}
            className="h-8 px-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-body-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px]">done_all</span>
            <span>Accept All Suggestions</span>
          </button>
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE5F0] flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
        </div>
        <div className="text-[13px] space-y-1">
          <p className="font-body-semibold text-[#102544]">Pro Tip</p>
          <p className="text-[#64748B] leading-relaxed">
            ATS engines prioritize 10–18 focused skills that match the target job description over lengthy keyword stuffing.
          </p>
        </div>
      </div>
    </div>
  )
}
