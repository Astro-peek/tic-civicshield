import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const val = value instanceof Function ? value(storedValue) : value
      setStoredValue(val)
      window.localStorage.setItem(key, JSON.stringify(val))
    } catch (err) {
      console.error('localStorage error:', err)
    }
  }

  return [storedValue, setValue]
}

export function getLS(key, fallback = null) {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function setLS(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('localStorage error:', err)
  }
}
