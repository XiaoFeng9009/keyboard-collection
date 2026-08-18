import { useState, useEffect } from 'react'

const DATA_CACHE_KEY = 'keyboardData'
const DATA_HASH_KEY = 'keyboardDataHash'

function readCache() {
  try {
    const raw = localStorage.getItem(DATA_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch (err) {
    return null
  }
}

function applyCachedEdits(serverKbs, cached) {
  if (!Array.isArray(cached) || cached.length === 0 || cached[0].sortTime === undefined) {
    return serverKbs
  }

  const editMap = {}
  cached.forEach(function(kb) {
    if (kb.id) editMap[kb.id] = kb
  })

  return serverKbs.map(function(kb) {
    const admin = editMap[kb.id]
    if (!admin) return kb

    const next = { ...kb }
    Object.keys(admin).forEach(function(key) {
      if (admin[key] === '' || admin[key] === null || admin[key] === undefined) return
      if (key === 'id' || key === 'name' || key === 'sortTime') return
      if ((key === 'images' || key === 'image') && next[key] && next[key].length > 0) return
      next[key] = admin[key]
    })
    return next
  })
}

export default function useData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      const cached = readCache()
      const cachedHash = localStorage.getItem(DATA_HASH_KEY)

      try {
        const meta = await fetch('/data-meta.json?_=' + Date.now()).then(r => r.json())

        if (cached && cachedHash === meta.hash) {
          if (!cancelled) setData(cached)
          return
        }

        const payload = await fetch('/data.json?_=' + Date.now()).then(r => r.json())
        const serverKbs = payload.keyboards || []
        const merged = applyCachedEdits(serverKbs, cached)

        localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(merged))
        localStorage.setItem(DATA_HASH_KEY, meta.hash || '')

        if (!cancelled) setData(merged)
      } catch (err) {
        if (cached && !cancelled) setData(cached)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()

    return function() {
      cancelled = true
    }
  }, [])

  return { keyboards: data, loading }
}
