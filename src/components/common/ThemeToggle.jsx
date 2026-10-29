import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme()

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-[#F1F5F9] border border-[#DCE5F0] ${className}`}>
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            theme === 'light'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#14243B]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">light_mode</span>
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            theme === 'dark'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#14243B]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">dark_mode</span>
          <span>Dark</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            theme === 'system'
              ? 'bg-white text-[#2563EB] shadow-sm'
              : 'text-[#64748B] hover:text-[#14243B]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">desktop_windows</span>
          <span>System</span>
        </button>
      </div>
    )
  }

  // Default: Compact icon toggle button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#14243B] hover:bg-[#F1F5F9] transition-all duration-150 cursor-pointer active:scale-95 group ${className}`}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
    >
      {isDark ? (
        <span
          className="material-symbols-outlined text-[20px] text-amber-400 group-hover:rotate-45 transition-transform duration-300"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          light_mode
        </span>
      ) : (
        <span
          className="material-symbols-outlined text-[20px] text-[#64748B] group-hover:-rotate-12 transition-transform duration-300"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          dark_mode
        </span>
      )}
    </button>
  )
}
