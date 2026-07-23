import { useState, useEffect } from 'react'

export default function useData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => {
        const kbs = d.keyboards || []
        const version = String(d.version || 0)
        const serverTime = String(d.updatedAt || '')
        const stored = localStorage.getItem('keyboardData')
        const storedVer = localStorage.getItem('keyboardDataVersion')
        const storedTime = localStorage.getItem('keyboardDataUpdatedAt')

        // Check if server data matches cache
        if (stored && storedVer === version && storedTime === serverTime) {
          const cached = JSON.parse(stored)
          if (cached.length > 0 && cached[0].sortTime !== undefined) {
            // Admin edits exist - overlay them on fresh server data
            const editMap = {}
            cached.forEach(function(kb) { if (kb.id) editMap[kb.id] = kb })
            kbs.forEach(function(kb, i) {
              if (kb.id && editMap[kb.id]) {
                // Only overwrite non-empty fields from admin edits
                var admin = editMap[kb.id]
                for (var key in admin) {
                  if (admin[key] !== '' && admin[key] !== null && admin[key] !== undefined) {
                    if ((key==='images'||key==='image') && kbs[i][key] && kbs[i][key].length>0) continue;
                    kbs[i][key] = admin[key]
                  }
                }
              }
            })
          }
          setData(kbs)
        } else {
          setData(kbs)
          localStorage.setItem('keyboardData', JSON.stringify(kbs))
          localStorage.setItem('keyboardDataVersion', version)
          localStorage.setItem('keyboardDataUpdatedAt', serverTime)
        }
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  return { keyboards: data, loading }
}
