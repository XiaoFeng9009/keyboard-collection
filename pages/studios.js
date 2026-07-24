import { useState, useMemo, useRef } from 'react'
import Layout from '../components/Layout'
import StudioDetail from '../components/StudioDetail'
import useBreakpoint from '../lib/useBreakpoint'
import useData from '../lib/useData'

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'

export default function Studios() {
  const { isDesktop, isTablet, isMobile } = useBreakpoint()
  const { keyboards, loading } = useData()
  const [studioData, setStudioData] = useState(null)

  const { groups, letters } = useMemo(() => {
    const map = {}
    keyboards.forEach(k => {
      const s = k.studio
      if (!map[s]) map[s] = { name: s, count: 0, latest: '' }
      map[s].count++
      if (k.sortTime && k.sortTime > map[s].latest) map[s].latest = k.sortTime
    })
    const sorted = Object.values(map).sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    const g = {}
    sorted.forEach(s => {
      const first = s.name.charAt(0).toUpperCase()
      const key = /[A-Z]/.test(first) ? first : '#'
      if (!g[key]) g[key] = []
      g[key].push(s)
    })
    const l = Object.keys(g).sort((a, b) => {
      if (a === '#') return 1
      if (b === '#') return -1
      return a.localeCompare(b)
    })
    return { groups: g, letters: l }
  }, [keyboards])

  const [isScrubbing, setIsScrubbing] = useState(false)
  var navRef = useRef(null)

  var getLetterByY = function(clientY) {
    var el = navRef.current
    if (!el) return
    var rect = el.getBoundingClientRect()
    var y = clientY - rect.top
    var idx = Math.floor((y / rect.height) * ALL_LETTERS.length)
    idx = Math.max(0, Math.min(idx, ALL_LETTERS.length - 1))
    var ch = ALL_LETTERS[idx]
    if (letters.includes(ch)) scrollTo(ch)
  }

  const scrollTo = (letter) => {
    const el = document.getElementById('letter-' + letter)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) return <Layout><div style={{textAlign:'center',padding:'60px',color:'var(--text-muted)',fontSize:13}}>{'\u52A0\u8F7D\u4E2D...'}</div></Layout>

  const cardMin = isMobile ? 140 : isTablet ? 180 : 220
  const card = { background:'var(--bg-primary)', border:'1px solid var(--border-base)', padding:'14px 18px',
    cursor:'pointer', transition:'all .2s', boxShadow:'var(--shadow-base)' }

  return (
    <Layout>
      {/* A-Z Quick Nav */}
      <div ref={navRef}
        style={{position:'fixed',right:12,top:'calc(50% + 48px)',transform:'translateY(-50%)',zIndex:50,display:'flex',flexDirection:'column',gap:0,background:'var(--bg-primary)',border:'1px solid var(--border-base)',boxShadow:'var(--shadow-base)',padding:'4px 0',userSelect:'none',touchAction:'none'}}
        onPointerDown={function(e){setIsScrubbing(true);getLetterByY(e.clientY)}}
        onPointerMove={function(e){if(isScrubbing)getLetterByY(e.clientY)}}
        onPointerUp={function(){setIsScrubbing(false)}}
        onPointerLeave={function(){setIsScrubbing(false)}}>
        {ALL_LETTERS.split('').map(ch => {
          const has = letters.includes(ch)
          return (
            <button key={ch} onClick={() => has && scrollTo(ch)}
              style={{background:'none',border:'none',cursor:has?'pointer':'default',padding:'1px 6px',
                fontSize:10,fontWeight:has?600:400,color:has?'var(--text-primary)':'var(--text-muted)',
                fontFamily:'inherit',lineHeight:1.6,opacity:has?1:0.3,letterSpacing:0}}>{ch}</button>
          )
        })}
      </div>

      {/* Studio sections */}
      {letters.map(ch => (
        <div key={ch} id={'letter-' + ch} style={{scrollMarginTop:80, marginBottom:24}}>
          <div style={{fontSize:22,fontWeight:700,color:'var(--text-primary)',borderBottom:'2px solid var(--accent)',paddingBottom:4,marginBottom:12,letterSpacing:1}}>{ch}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax('+cardMin+'px,1fr))',gap:isMobile?10:12}}>
            {(groups[ch] || []).map(s => (
              <div key={s.name} style={card}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-hover)';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-base)';e.currentTarget.style.transform='translateY(0)'}}
                onClick={() => setStudioData(s.name)}>
                <div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{s.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--text-muted)'}}>
                  <span style={{background:'var(--bg-secondary)',padding:'1px 5px',fontWeight:600}}>{s.count}</span>
                  <span>{'\u628A\u952E\u76D8'}</span>
                  {s.latest && <span style={{marginLeft:'auto'}}>{s.latest.replace(/-/g,'/')}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {letters.length === 0 && <div style={{textAlign:'center',padding:'60px',color:'var(--text-muted)'}}><h3 style={{fontSize:16,marginBottom:8,color:'var(--text-primary)'}}>{'\u6682\u65E0\u6570\u636E'}</h3></div>}

      {studioData && <StudioDetail studio={studioData} keyboards={keyboards} onClose={() => setStudioData(null)} />}
    </Layout>
  )
}
