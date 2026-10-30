import { useState } from 'react'

const SUGGESTED_SKILLS = [
  'Problem Solving',
  'System Architecture',
  'Agile Methodologies',
  'Cross-functional Collaboration',
  'REST APIs',
  'Cloud Computing',
  'Git & Version Control',
  'CI/CD Pipelines',
]

export default function Step3Skills({ data, onChange, errors = {} }) {
  const [newSkill, setNewSkill] = useState('')

  // Read skills from data.skills, or fallback to legacy categorized fields if present
  const skills = Array.isArray(data.skills) && data.skills.length > 0
    ? data.skills
    : Array.from(
      new Set([
        ...(data.skills || []),
        ...(data.tools || []),
        ...(data.technical || []),
        ...(data.leadership || []),
      ])
    ).filter(Boolean)

  const handleAddSkill = () => {
    if (!newSkill.trim()) return

    // Allow adding comma-separated skills in one go
    const rawItems = newSkill
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (rawItems.length === 0) return

    const existingLower = new Set(skills.map((s) => s.toLowerCase()))
    const toAdd = rawItems.filter((item) => !existingLower.has(item.toLowerCase()))

    if (toAdd.length > 0) {
      const updated = [...skills, ...toAdd]
      onChange('skills', updated)
    }

    setNewSkill('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove)
    onChange('skills', updated)
  }

  const handleClearAll = () => {
    onChange('skills', [])
  }

  const addRecommended = (skill) => {
    if (!skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      onChange('skills', [...skills, skill])
    }
  }

  const addAllRecommended = () => {
    const existingLower = new Set(skills.map((s) => s.toLowerCase()))
    const toAdd = SUGGESTED_SKILLS.filter((s) => !existingLower.has(s.toLowerCase()))
    if (toAdd.length > 0) {
      onChange('skills', [...skills, ...toAdd])
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[#F1F5F9]">
        <div>
          <label className="font-label-form text-[13px] text-[#14243B] font-semibold flex items-center gap-1.5" htmlFor="skillInput">
            <span>Skills &amp; Core Competencies</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[11px] font-normal text-[#64748B]">({skills.length} added)</span>
          </label>
          <p className="text-[11px] text-[#64748B] mt-0.5">
            Type a skill and press Enter or click Add (comma-separated also supported, at least 1 required)
          </p>
        </div>

        {skills.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[12px] text-[#64748B] hover:text-[#DC2626] transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Input Row - Clean single field, no category dropdown */}
      <div className="flex gap-2.5">
        <div className="flex-1 relative">
          <input
            className={`w-full h-[44px] px-3.5 bg-white border rounded-lg text-[14px] text-[#14243B] placeholder-[#94A3B8] outline-none transition-all font-body-default ${errors.skills
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#DCE5F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
              }`}
            id="skillInput"
            placeholder="e.g. Python, React, PostgreSQL, Docker, AWS, Figma, Project Management..."
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
        <button
          onClick={handleAddSkill}
          className="h-[44px] px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-body-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-[17px]">add</span>
          <span>Add Skill</span>
        </button>
      </div>

      {/* Unified Skills Container - Single list without category separation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[12px] font-bold uppercase tracking-wider text-[#64748B]">
          <span>Your Skills</span>
          <span>{skills.length} total</span>
        </div>

        {skills.length === 0 ? (
          <div className="p-6 bg-white border border-dashed border-[#CBD5E1] rounded-xl text-center">
            <span className="material-symbols-outlined text-[28px] text-[#94A3B8] mb-1">psychology</span>
            <p className="text-[13px] font-body-medium text-[#14243B]">No skills added yet</p>
            <p className="text-[12px] text-[#64748B] mt-0.5">
              Add skills using the input box above or click on AI suggested skills below.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-white border border-[#DCE5F0] rounded-xl min-h-[64px] flex flex-wrap gap-2 items-center">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-[#EFF6FF] border border-[#2563EB]/30 text-[#14243B] text-[13px] font-body-medium px-3 py-1.5 rounded-lg shadow-2xs hover:border-[#2563EB]/50 transition-colors"
              >
                <span className="font-medium text-[#102544]">{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-[#DC2626] text-[#64748B] flex items-center ml-0.5 cursor-pointer transition-colors"
                  title={`Remove ${skill}`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Pro Tip Card */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE5F0] flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
        </div>
        <div className="text-[13px] space-y-1">
          <p className="font-body-semibold text-[#102544]">Pro Tip for Skills</p>
          <p className="text-[#64748B] leading-relaxed">
            ATS engines prioritize 10–18 focused skills that match the target job description over lengthy keyword stuffing.
          </p>
        </div>
      </div>
    </div>
  )
}
