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
        const stored = localStorage.getItem('keyboardData')
        const storedVer = localStorage.getItem('keyboardDataVersion')
        if (stored && storedVer === version) {
          const cached = JSON.parse(stored)
          if (cached.length > 0 && cached[0].sortTime !== undefined) {
            const imgMap = {}
            kbs.forEach(kb => { if (kb.id) imgMap[kb.id] = { image: kb.image, images: kb.images } })
            cached.forEach(kb => {
              if (kb.id && imgMap[kb.id]) {
                kb.image = imgMap[kb.id].image
                kb.images = imgMap[kb.id].images
              }
            })
          }
          setData(cached)
        } else {
          setData(kbs)
          localStorage.setItem('keyboardData', JSON.stringify(kbs))
          localStorage.setItem('keyboardDataVersion', version)
        }
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  return { keyboards: data, loading }
}
