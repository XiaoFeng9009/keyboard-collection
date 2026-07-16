import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!show) return null

  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 500,
        width: 40, height: 40, cursor: 'pointer',
        background: '#18181b', color: '#fff', border: '2px solid var(--accent)',
        fontSize: 18, lineHeight: '36px', textAlign: 'center',
        boxShadow: 'var(--shadow-hover)', transition: 'all .2s'
      }}
      onMouseEnter={e => { e.target.style.background = 'var(--accent)'; e.target.style.color = '#18181b' }}
      onMouseLeave={e => { e.target.style.background = '#18181b'; e.target.style.color = '#fff' }}>
      {'\u2191'}
    </button>
  )
}
