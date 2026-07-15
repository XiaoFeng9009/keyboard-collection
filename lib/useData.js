'use client'
import { useState, useEffect } from 'react'

let cached = null

export default function useData() {
  const [data, setData] = useState(cached || [])
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    if (cached) return
    const stored = sessionStorage.getItem('keyboardData')
    if (stored) {
      cached = JSON.parse(stored)
      setData(cached)
      setLoading(false)
      return
    }
    fetch('/data.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => {
        cached = d.keyboards || []
        sessionStorage.setItem('keyboardData', JSON.stringify(cached))
        setData(cached)
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  return { keyboards: data, loading }
}
