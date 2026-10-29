import { StrictMode, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, useTheme } from './context/ThemeContext'

function ThemedApp() {
  const { resolvedTheme } = useTheme()

  const muiTheme = useMemo(() => {
    const isDark = resolvedTheme === 'dark'

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: isDark ? '#3b82f6' : '#2563eb',
          light: isDark ? '#60a5fa' : '#3b82f6',
          dark: '#1d4ed8',
          contrastText: '#ffffff',
        },
        secondary: {
          main: isDark ? '#1e293b' : '#102544',
          light: isDark ? '#334155' : '#1e3a8a',
          dark: '#081423',
        },
        background: {
          default: isDark ? '#0b1120' : '#f5f8fc',
          paper: isDark ? '#151e32' : '#ffffff',
        },
        text: {
          primary: isDark ? '#f1f5f9' : '#14243b',
          secondary: isDark ? '#94a3b8' : '#64748b',
        },
      },
      typography: {
        fontFamily: '"Inter", "Manrope", system-ui, -apple-system, sans-serif',
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 8,
            },
          },
        },
      },
    })
  }, [resolvedTheme])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
)
