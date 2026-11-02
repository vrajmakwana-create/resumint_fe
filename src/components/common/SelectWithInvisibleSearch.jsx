import { useState, useRef, useEffect, useMemo } from 'react'

export default function SelectWithInvisibleSearch({
  id,
  value = '',
  options = [], // [{ value, label }] or [string]
  placeholder = 'Select option',
  disabled = false,
  onChange,
  error = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)
  const listRef = useRef(null)
  const itemRefs = useRef([])
  const searchBufferRef = useRef('')
  const searchTimeoutRef = useRef(null)

  // Normalize options to [{ value, label }]
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt }
      }
      return { value: opt.value || opt.label, label: opt.label || opt.value }
    })
  }, [options])

  // Current selected label
  const selectedOption = useMemo(() => {
    if (!value) return null
    return (
      normalizedOptions.find(
        (opt) => opt.value.toLowerCase() === value.toLowerCase() || opt.label.toLowerCase() === value.toLowerCase()
      ) || null
    )
  }, [value, normalizedOptions])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // When opened, scroll to currently selected item
  useEffect(() => {
    if (isOpen) {
      const idx = normalizedOptions.findIndex(
        (opt) => opt.value.toLowerCase() === (value || '').toLowerCase()
      )
      if (idx !== -1) {
        setHighlightedIndex(idx)
        setTimeout(() => {
          itemRefs.current[idx]?.scrollIntoView({ block: 'nearest' })
        }, 20)
      } else {
        setHighlightedIndex(0)
      }
    }
  }, [isOpen, value, normalizedOptions])

  // Invisible Typeahead Search & Keyboard Navigation
  const handleKeyDown = (e) => {
    if (disabled) return

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault()
        setIsOpen(true)
        return
      }
    }

    if (isOpen) {
      if (e.key === 'Escape' || e.key === 'Tab') {
        setIsOpen(false)
        return
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          onChange(normalizedOptions[highlightedIndex].value)
          setIsOpen(false)
        }
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev < normalizedOptions.length - 1 ? prev + 1 : 0
          itemRefs.current[next]?.scrollIntoView({ block: 'nearest' })
          return next
        })
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : normalizedOptions.length - 1
          itemRefs.current[next]?.scrollIntoView({ block: 'nearest' })
          return next
        })
        return
      }
    }

    // Capture alphanumeric keys for invisible search & instant scroll
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      if (!isOpen) setIsOpen(true)

      clearTimeout(searchTimeoutRef.current)
      searchBufferRef.current += e.key.toLowerCase()

      searchTimeoutRef.current = setTimeout(() => {
        searchBufferRef.current = ''
      }, 700)

      const query = searchBufferRef.current

      // Check if user is repeatedly typing the same single character (e.g. 'i', 'i', 'i' to cycle)
      const isRepeatedChar = query.length > 1 && query.split('').every((c) => c === query[0])

      let matchIndex = -1

      if (isRepeatedChar) {
        const char = query[0]
        const startIndex = highlightedIndex + 1
        // Look ahead
        matchIndex = normalizedOptions.findIndex(
          (opt, idx) => idx >= startIndex && opt.label.toLowerCase().startsWith(char)
        )
        // Wrap around if not found ahead
        if (matchIndex === -1) {
          matchIndex = normalizedOptions.findIndex((opt) =>
            opt.label.toLowerCase().startsWith(char)
          )
        }
      } else {
        // Find first item that starts with the typed query
        matchIndex = normalizedOptions.findIndex((opt) =>
          opt.label.toLowerCase().startsWith(query)
        )
        // Fallback: search anywhere in the label
        if (matchIndex === -1) {
          matchIndex = normalizedOptions.findIndex((opt) =>
            opt.label.toLowerCase().includes(query)
          )
        }
      }

      if (matchIndex !== -1) {
        setHighlightedIndex(matchIndex)
        itemRefs.current[matchIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        })
      }
    }
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Dropdown Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full h-[44px] px-3.5 bg-white dark:bg-[#1E293B] border rounded-lg text-[14px] text-left outline-none transition-all flex items-center justify-between cursor-pointer ${
          disabled
            ? 'bg-[#F8FAFC] dark:bg-[#0B1120] text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] cursor-not-allowed opacity-75'
            : error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#DCE5F0] dark:border-[#334155] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
        }`}
      >
        <span className={`truncate ${selectedOption ? 'text-[#14243B] dark:text-white' : 'text-[#94A3B8]'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span
          className={`material-symbols-outlined text-[20px] text-[#94A3B8] transition-transform duration-200 shrink-0 ml-1.5 ${
            isOpen ? 'rotate-180 text-[#2563EB]' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Options Popup */}
      {isOpen && !disabled && (
        <div
          ref={listRef}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] rounded-xl shadow-xl py-1 custom-scrollbar animate-in fade-in zoom-in-95 duration-100"
        >
          {normalizedOptions.length === 0 ? (
            <div className="px-3.5 py-2.5 text-[13px] text-[#94A3B8] text-center">
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt, idx) => {
              const isSelected = selectedOption && selectedOption.value === opt.value
              const isHighlighted = idx === highlightedIndex

              return (
                <div
                  key={`${opt.value}-${idx}`}
                  ref={(el) => (itemRefs.current[idx] = el)}
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`px-3.5 py-2 text-[13px] cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#EFF6FF] dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] font-semibold'
                      : isHighlighted
                        ? 'bg-[#F1F5F9] dark:bg-[#283548] text-[#14243B] dark:text-white'
                        : 'text-[#334155] dark:text-[#CBD5E1]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-[#2563EB] dark:text-[#60A5FA] shrink-0 ml-2">
                      check
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

