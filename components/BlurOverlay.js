import { useState, useEffect } from 'react'

export default function BlurOverlay({ active }) {
  const [phase, setPhase] = useState('hidden')

  useEffect(function() {
    if (active && phase === 'hidden') {
      setPhase('enter')
    } else if (!active && (phase === 'show' || phase === 'enter')) {
      setPhase('exit')
    }
  }, [active])

  useEffect(function() {
    if (phase === 'enter') {
      const raf = requestAnimationFrame(function() {
        setPhase('show')
      })
      return function() { if (raf) cancelAnimationFrame(raf) }
    }
    if (phase === 'exit') {
      const t = setTimeout(function() { setPhase('hidden') }, 800)
      return function() { clearTimeout(t) }
    }
  }, [phase])

  if (phase === 'hidden') return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99998,
      background: 'rgba(24,24,27,0.15)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(12px)',
      opacity: phase === 'show' ? 1 : 0,
      transition: 'opacity .8s cubic-bezier(0.0,0.6,0.3,1.0)'
    }} />
  )
}
