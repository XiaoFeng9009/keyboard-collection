import { useState, useEffect } from 'react'

const DATA_CACHE_KEY = 'keyboardData'
const ADMIN_EDITS_KEY = 'keyboardAdminEdits'
const ADMIN_DELETED_KEY = 'keyboardDeletedIds'

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

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed || fallback
  } catch (err) {
    return fallback
  }
}

function mergeServerWithAdminEdits(serverKbs, adminEdits, deletedIds) {
  const editMap = adminEdits || {}
  const deletedSet = new Set(deletedIds || [])
  const serverIds = new Set()
  const result = []

  serverKbs.forEach(function(kb) {
    serverIds.add(kb.id)
    if (deletedSet.has(kb.id)) return

    const admin = editMap[kb.id]
    if (!admin) {
      result.push(kb)
      return
    }

    const next = { ...kb }
    Object.keys(admin).forEach(function(key) {
      if (key === 'id') return
      const value = admin[key]
      if (value === '' || value === null || value === undefined) return
      next[key] = value
    })
    result.push(next)
  })

  Object.keys(editMap).forEach(function(id) {
    if (!serverIds.has(id) && !deletedSet.has(id)) result.push(editMap[id])
  })

  return result
}

export default function useData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      const cached = readCache()
      const adminEdits = readJson(ADMIN_EDITS_KEY, {})
      const deletedIds = readJson(ADMIN_DELETED_KEY, [])

      try {
        const payload = await fetch('/data.json', { cache: 'no-cache' }).then(r => r.json())
        const serverKbs = payload.keyboards || []
        const merged = mergeServerWithAdminEdits(serverKbs, adminEdits, deletedIds)

        localStorage.setItem(DATA_CACHE_KEY, JSON.stringify(merged))

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
