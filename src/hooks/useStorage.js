import { useState, useCallback } from 'react'

export function useStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : initial
    } catch { return initial }
  })

  const save = useCallback((v) => {
    const next = typeof v === 'function' ? v(val) : v
    setVal(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }, [key, val])

  return [val, save]
}

// Helpers to read/write any key directly (for cross-component use)
export function readStorage(key, fallback = null) {
  try {
    const s = localStorage.getItem(key)
    return s ? JSON.parse(s) : fallback
  } catch { return fallback }
}

export function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}
