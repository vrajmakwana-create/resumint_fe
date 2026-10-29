import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
})

const STORAGE_KEY = 'resumint_theme'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEY)
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme
      }
    } catch (e) {
      console.warn('Failed to read theme from localStorage:', e)
    }
    return 'system'
  })

  // Detect system preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  const setTheme = (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark' && newTheme !== 'system') return
    setThemeState(newTheme)
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e)
    }
  }

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  // Synchronize documentElement class and color-scheme
  useEffect(() => {
    const root = document.documentElement

    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }, [resolvedTheme])

  // Listen for OS system theme changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      // Re-trigger render by setting theme to 'system'
      setThemeState('system')
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  const isDark = resolvedTheme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
