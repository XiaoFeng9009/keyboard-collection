import { useState, useEffect } from 'react'

export default function useData() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data.json?_=' + Date.now())
      .then(r => r.json())
      .then(d => {
        const kbs = d.keyboards || []
        // Check sessionStorage for admin edits that have sortTime
        const stored = sessionStorage.getItem('keyboardData')
        if (stored) {
          const edited = JSON.parse(stored)
          if (edited.length > 0 && edited[0].sortTime !== undefined) {
            // Merge fresh images from data.json into edited data
            const imgMap = {}
            kbs.forEach(kb => { if (kb.id) imgMap[kb.id] = { image: kb.image, images: kb.images } })
            edited.forEach(kb => {
              if (kb.id && imgMap[kb.id]) {
                kb.image = imgMap[kb.id].image
                kb.images = imgMap[kb.id].images
              }
            })
            setData(edited)
            setLoading(false)
            return
          }
        }
        setData(kbs)
        sessionStorage.setItem('keyboardData', JSON.stringify(kbs))
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [])

  return { keyboards: data, loading }
}
