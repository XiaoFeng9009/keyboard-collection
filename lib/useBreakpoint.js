import { useState, useEffect } from 'react'

export default function useBreakpoint() {
  const [bp, setBp] = useState({ isMobile: false, isTablet: false, isDesktop: true })

  useEffect(() => {
    const queries = {
      mobile: window.matchMedia('(max-width: 639px)'),
      tablet: window.matchMedia('(min-width: 640px) and (max-width: 1023px)'),
      desktop: window.matchMedia('(min-width: 1024px)')
    }

    const check = () => {
      setBp({
        isMobile: queries.mobile.matches,
        isTablet: queries.tablet.matches,
        isDesktop: queries.desktop.matches
      })
    }

    check()
    queries.mobile.addEventListener('change', check)
    queries.tablet.addEventListener('change', check)
    queries.desktop.addEventListener('change', check)

    return function() {
      queries.mobile.removeEventListener('change', check)
      queries.tablet.removeEventListener('change', check)
      queries.desktop.removeEventListener('change', check)
    }
  }, [])

  return bp
}
