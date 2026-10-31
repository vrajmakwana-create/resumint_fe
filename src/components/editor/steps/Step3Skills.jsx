import { useState, useMemo } from 'react'
import {
  SKILL_CATEGORIES,
  CATEGORY_SUGGESTIONS,
  normalizeSkills,
  getTotalSkillsCount,
} from '../skillsConfig'

export default function Step3Skills({ data, onChange, errors = {} }) {
  const [selectedCategory, setSelectedCategory] = useState(SKILL_CATEGORIES[0])
  const [newSkillText, setNewSkillText] = useState('')

  // Always work with normalized categorized skills
  const categorizedSkills = useMemo(() => {
    return normalizeSkills(data.skills)
  }, [data.skills])

  const totalSkillsCount = useMemo(() => {
    return getTotalSkillsCount(categorizedSkills)
  }, [categorizedSkills])

  // Helper to commit changes to parent
  const commitSkills = (updated) => {
    onChange('skills', updated)
  }

  // Add skill(s) to a specific category
  const handleAddSkillsToCategory = (category, rawText) => {
    if (!rawText || !rawText.trim()) return

    const rawItems = rawText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (rawItems.length === 0) return

    const currentList = categorizedSkills[category] || []
    const existingLower = new Set(currentList.map((s) => s.toLowerCase()))
    const toAdd = rawItems.filter((item) => !existingLower.has(item.toLowerCase()))

    if (toAdd.length > 0) {
      const updated = {
        ...categorizedSkills,
        [category]: [...currentList, ...toAdd],
      }
      commitSkills(updated)
    }
  }

  // Add from top bar
  const handleTopAdd = () => {
    handleAddSkillsToCategory(selectedCategory, newSkillText)
    setNewSkillText('')
  }

  // Remove a skill from a specific category
  const handleRemoveSkill = (category, skillToRemove) => {
    const currentList = categorizedSkills[category] || []
    const updated = {
      ...categorizedSkills,
      [category]: currentList.filter((s) => s !== skillToRemove),
    }
    commitSkills(updated)
  }

  // Clear all skills across all categories
  const handleClearAll = () => {
    const empty = {}
    for (const cat of SKILL_CATEGORIES) {
      empty[cat] = []
    }
    commitSkills(empty)
  }

  return (
    <div className="space-y-6">
      {/* Header & Meta */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#F1F5F9] dark:border-[#24334A]">
        <div>
          <label className="font-label-form text-[13px] text-[#14243B] dark:text-[#F1F5F9] font-semibold flex items-center gap-1.5">
            <span>Skills &amp; Core Competencies</span>
            <span className="text-red-500 font-bold">*</span>
            <span className="text-[11px] font-normal text-[#64748B] dark:text-[#94A3B8]">
              ({totalSkillsCount} added)
            </span>
          </label>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Select a category, type your skills, and press Enter (comma-separated also supported).
          </p>
        </div>

        {totalSkillsCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[12px] text-[#64748B] dark:text-[#94A3B8] hover:text-[#DC2626] dark:hover:text-[#F87171] transition-colors cursor-pointer"
          >
            Clear all skills
          </button>
        )}
      </div>

      {/* Primary Add Skill Input Bar */}
      <div className="p-4 bg-white dark:bg-[#151E32] border border-[#DCE5F0] dark:border-[#24334A] rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Category Dropdown */}
          <div className="sm:w-60 shrink-0">
            <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-[42px] pl-3 pr-8 bg-white dark:bg-[#1E293B] border border-[#DCE5F0] dark:border-[#334155] rounded-lg text-[13px] text-[#14243B] dark:text-[#F1F5F9] font-medium outline-none focus:border-[#2563EB] transition-colors cursor-pointer appearance-none"
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] text-[18px]">
                arrow_drop_down
              </span>
            </div>
          </div>

          {/* Skill Text Input */}
          <div className="flex-1">
            <label className="block text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-1">
              Add Skills to {selectedCategory}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillText}
                onChange={(e) => setNewSkillText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleTopAdd()
                  }
                }}
                placeholder="e.g. Python, SQL (or comma-separated)..."
                className={`flex-1 h-[42px] px-3.5 bg-white dark:bg-[#1E293B] border rounded-lg text-[13px] text-[#14243B] dark:text-[#F1F5F9] placeholder-[#94A3B8] outline-none transition-all ${
                  errors.skills && totalSkillsCount === 0
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-[#DCE5F0] dark:border-[#334155] focus:border-[#2563EB]'
                }`}
              />
              <button
                type="button"
                onClick={handleTopAdd}
                className="h-[42px] px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">add</span>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick suggestions for selected category */}
        {CATEGORY_SUGGESTIONS[selectedCategory] && (
          <div className="pt-2 border-t border-[#F1F5F9] dark:border-[#24334A] flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium mr-1">
              Popular in {selectedCategory}:
            </span>
            {CATEGORY_SUGGESTIONS[selectedCategory].map((sug) => {
              const alreadyAdded = (categorizedSkills[selectedCategory] || []).some(
                (s) => s.toLowerCase() === sug.toLowerCase()
              )
              return (
                <button
                  key={sug}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => handleAddSkillsToCategory(selectedCategory, sug)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                    alreadyAdded
                      ? 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#94A3B8] dark:text-[#64748B] cursor-default'
                      : 'bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#DBEAFE] dark:hover:bg-[#2A3B53] border border-[#BFDBFE]/60 dark:border-[#3B82F6]/30 cursor-pointer'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {alreadyAdded ? 'check' : 'add'}
                  </span>
                  <span>{sug}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Unified Categorized Skills Card (SkillCategory: skill1, skill2, skill3) */}
      <div className="p-5 bg-white dark:bg-[#151E32] border border-[#DCE5F0] dark:border-[#24334A] rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9] dark:border-[#24334A]">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
            Your Skills by Category
          </span>
          <span className="text-[12px] font-medium text-[#2563EB]">
            {totalSkillsCount} total
          </span>
        </div>

        {totalSkillsCount === 0 ? (
          <div className="py-8 text-center space-y-1">
            <span className="material-symbols-outlined text-[28px] text-[#94A3B8] dark:text-[#64748B]">
              psychology
            </span>
            <p className="text-[13px] font-medium text-[#14243B] dark:text-[#F1F5F9]">
              No skills added yet
            </p>
            <p className="text-[12px] text-[#64748B] dark:text-[#94A3B8]">
              Select a category above and add your technical skills.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9] dark:divide-[#24334A]">
            {SKILL_CATEGORIES.map((category) => {
              const list = categorizedSkills[category] || []
              if (list.length === 0) return null

              return (
                <div
                  key={category}
                  className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3"
                >
                  <div className="sm:w-56 shrink-0 font-semibold text-[13px] text-[#14243B] dark:text-[#F1F5F9]">
                    {category}:
                  </div>
                  <div className="flex-1 flex flex-wrap items-center gap-1.5">
                    {list.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="editor-skill-chip inline-flex items-center gap-1.5 bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] text-[12px] font-medium px-2.5 py-1 rounded-md shadow-2xs hover:border-[#2563EB]/50 dark:hover:border-[#3B82F6]/50 transition-colors"
                      >
                        <span className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(category, skill)}
                          className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#DC2626] dark:hover:text-[#EF4444] flex items-center ml-0.5 cursor-pointer transition-colors"
                          title={`Remove ${skill}`}
                        >
                          <span className="material-symbols-outlined text-[13px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pro Tip Card */}
      <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#151E32] border border-[#DCE5F0] dark:border-[#24334A] flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-[18px]">lightbulb</span>
        </div>
        <div className="text-[13px] space-y-1">
          <p className="font-body-semibold text-[#102544] dark:text-[#F1F5F9]">Categorized Skills Boost ATS Scoring</p>
          <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Applicant Tracking Systems (ATS) index candidates by categorizing skills into Programming Languages, Frameworks, Databases, and Cloud technologies.
          </p>
        </div>
      </div>
    </div>
  )
}
