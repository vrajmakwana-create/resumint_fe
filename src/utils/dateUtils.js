/**
 * Date utility helpers for calendar inputs (YYYY-MM-DD)
 * and converting to/from epoch timestamps in SECONDS for backend communication.
 */

// Converts any timestamp (seconds or ms), ISO string, YYYY-MM, or YYYYMMDD into YYYY-MM-DD for <input type="date" />
export function toDateInputValue(val) {
  if (!val) return ''

  // If already YYYY-MM-DD
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    return val
  }

  // If numeric timestamp (seconds e.g. 1704067200 or ms e.g. 1704067200000)
  const num = Number(val)
  if (!isNaN(num) && num > 100000000) {
    // If 10 digits (seconds), multiply by 1000 to get ms
    const ms = num < 10000000000 ? num * 1000 : num
    const d = new Date(ms)
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0]
    }
  }

  // If YYYYMMDD (e.g. 20230101)
  if (typeof val === 'string' && /^\d{8}$/.test(val)) {
    return `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6, 8)}`
  }
  if (typeof val === 'number' && val >= 19000101 && val <= 20991231) {
    const s = String(val)
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
  }

  // If YYYY-MM (e.g. 2023-01)
  if (typeof val === 'string' && /^\d{4}-\d{2}$/.test(val)) {
    return `${val}-01`
  }

  // If Year only (e.g. 2023)
  if (typeof val === 'string' && /^\d{4}$/.test(val)) {
    return `${val}-01-01`
  }
  if (typeof val === 'number' && val >= 1900 && val <= 2100) {
    return `${val}-01-01`
  }

  const parsed = new Date(val)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0]
  }

  return ''
}

// Converts date input value (YYYY-MM-DD or any date) to epoch TIMESTAMP IN SECONDS (integer)
export function toDateSeconds(val) {
  if (!val) return null

  if (typeof val === 'number') {
    // If already seconds (10 digits)
    if (val >= 100000000 && val < 10000000000) return Math.floor(val)
    // If in ms (13 digits), convert to seconds
    if (val >= 10000000000) return Math.floor(val / 1000)
    // If YYYYMMDD e.g. 20230101
    const s = String(val)
    if (s.length === 8) {
      return Math.floor(new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`).getTime() / 1000)
    }
    // If year only
    if (val >= 1900 && val <= 2100) {
      return Math.floor(new Date(`${val}-01-01`).getTime() / 1000)
    }
  }

  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (!trimmed || trimmed.toLowerCase() === 'present') return null

    // If numeric string in seconds
    const num = Number(trimmed)
    if (!isNaN(num) && num >= 100000000 && num < 10000000000) {
      return Math.floor(num)
    }
    if (!isNaN(num) && num >= 10000000000) {
      return Math.floor(num / 1000)
    }

    // If YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return Math.floor(new Date(trimmed).getTime() / 1000)
    }

    // If YYYY-MM
    if (/^\d{4}-\d{2}$/.test(trimmed)) {
      return Math.floor(new Date(`${trimmed}-01`).getTime() / 1000)
    }

    // If YYYYMMDD
    if (/^\d{8}$/.test(trimmed)) {
      return Math.floor(new Date(`${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`).getTime() / 1000)
    }

    const d = new Date(trimmed)
    if (!isNaN(d.getTime())) {
      return Math.floor(d.getTime() / 1000)
    }
  }

  return null
}

// Converts date input value (YYYY-MM-DD or any date) to epoch TIMESTAMP IN MILLISECONDS (integer)
export function toDateMilliseconds(val) {
  if (!val) return null

  if (typeof val === 'number') {
    // If already ms (13 digits)
    if (val >= 10000000000) return Math.floor(val)
    // If seconds (10 digits), convert to ms
    if (val >= 100000000 && val < 10000000000) return Math.floor(val * 1000)
    // If YYYYMMDD e.g. 20230101
    const s = String(val)
    if (s.length === 8) {
      return new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`).getTime()
    }
    // If year only
    if (val >= 1900 && val <= 2100) {
      return new Date(`${val}-01-01`).getTime()
    }
  }

  if (typeof val === 'string') {
    const trimmed = val.trim()
    if (!trimmed || trimmed.toLowerCase() === 'present') return null

    // If numeric string in ms
    const num = Number(trimmed)
    if (!isNaN(num) && num >= 10000000000) {
      return Math.floor(num)
    }
    // If numeric string in seconds
    if (!isNaN(num) && num >= 100000000 && num < 10000000000) {
      return Math.floor(num * 1000)
    }

    // If YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return new Date(trimmed).getTime()
    }

    // If YYYY-MM
    if (/^\d{4}-\d{2}$/.test(trimmed)) {
      return new Date(`${trimmed}-01`).getTime()
    }

    // If YYYYMMDD
    if (/^\d{8}$/.test(trimmed)) {
      return new Date(`${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}`).getTime()
    }

    const d = new Date(trimmed)
    if (!isNaN(d.getTime())) {
      return d.getTime()
    }
  }

  return null
}

// Formats timestamp in seconds or ms into human readable display (e.g. "Jan 2023" or "2023")
export function formatDateDisplay(val) {
  if (!val) return ''
  if (typeof val === 'string' && val.toLowerCase() === 'present') return 'Present'

  const sec = toDateSeconds(val)
  if (sec) {
    const d = new Date(sec * 1000)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return String(val)
}
