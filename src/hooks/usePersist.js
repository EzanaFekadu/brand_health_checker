import { useState, useEffect } from 'react'

export function usePersist(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem('bhc.' + key)
      return raw != null ? JSON.parse(raw) : initial
    } catch (e) {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('bhc.' + key, JSON.stringify(val))
    } catch (e) {}
  }, [key, val])

  return [val, setVal]
}
