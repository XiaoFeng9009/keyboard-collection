import { useState } from 'react'
import { useRouter } from 'next/router'
import BackToTop from './BackToTop'

export default function Layout({ children }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  const tabs = [
    { path: '/', label: '\u952E\u76D8', icon: 'fas fa-home' },
    { path: '/studios', label: '\u5DE5\u4F5C\u5BA4', icon: 'fas fa-th' },
    { path: '/timeline', label: '\u65F6\u95F4\u7EBF', icon: 'fas fa-archive' },
    { path: '/admin', label: '\u7BA1\u7406', icon: 'fas fa-tag' },
  ]

  const sidebarW = expanded ? 200 : 60

  return (
    <div style={{minHeight:'100vh', display:'flex'}}>
      {/* Sidebar */}
      <nav style={{
        position:'fixed', left:0, top:0, bottom:0, zIndex:100,
        width: expanded ? 260 : 90, display:'flex', flexDirection:'column',
        background:'var(--bg-primary)', borderRight:'1px solid var(--border-base)',
        boxShadow:'var(--shadow-base)', overflow:'hidden',
        transition:'width .25s ease',zIndex:expanded ? 200 : 100,transform:'translateZ(0)',willChange:'width',backfaceVisibility:'hidden'
      }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}>

        {/* Logo */}
        <div style={{
          display:'flex', alignItems:'center', gap:10,
          padding:'20px 16px', minHeight:64,
          borderBottom:'1px solid var(--border-base)',
          whiteSpace:'nowrap', overflow:'hidden'
        }}>
          <span style={{fontSize:24, fontWeight:800, flexShrink:0, width:28, textAlign:'center', letterSpacing:0}}>K</span>
          <span style={{fontSize:14, fontWeight:700, letterSpacing:1.5, background:'var(--accent)', color:'#18181b', padding:'2px 8px', borderRadius:3, opacity:expanded ? 1 : 0, transition:'opacity .2s ease .08s', whiteSpace:'nowrap', overflow:'hidden', maxWidth:expanded ? 200 : 0}}>COLLECTION</span>
        </div>

        {/* Nav items */}
        <div style={{flex:1, padding:'32px 0'}}>
          {tabs.map(t => {
            const isActive = router.pathname === t.path
            return (
              <button key={t.path} onClick={() => router.push(t.path)} style={{
                width:'100%', display:'flex', alignItems:'center',
                padding:'16px 24px', border:'none', cursor:'pointer',
                fontFamily:'inherit', fontSize:15, letterSpacing:0.5,
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#18181b' : 'var(--text-primary)',
                fontWeight: 600,
                transition:'all .15s', whiteSpace:'nowrap',
                                textAlign:'left'
              }}
                onMouseEnter={e => { if(!isActive) e.target.style.background = 'var(--bg-secondary)' }}
                onMouseLeave={e => { if(!isActive) e.target.style.background = 'transparent' }}>
                <i className={t.icon} style={{fontSize:16, width:20, textAlign:'center', lineHeight:1}}></i>
                <span style={{opacity:expanded ? 1 : 0,transition:'opacity .2s ease .05s,marginLeft .2s ease,maxWidth .2s ease',whiteSpace:'nowrap',overflow:'hidden',marginLeft:expanded ? 14 : 0,maxWidth:expanded ? 200 : 0}}>{t.label}</span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding:'16px 20px', borderTop:'1px solid var(--border-base)',
          fontSize:10, color:'var(--text-muted)', whiteSpace:'nowrap',
          overflow:'hidden'
        }}>
          {expanded ? '© ' + (2025===new Date().getFullYear() ? '2025' : '2025-'+new Date().getFullYear()) + ' XIAOFENG. All Rights Reserved.' : 'XIAOFENG'}
        </div>
      </nav>

      {/* Main content */}
      <div style={{
        marginLeft: 90, width:'100%',
        minHeight:'100vh'
      }}>
        <main style={{maxWidth:1200, margin:'0 auto', padding:'32px 28px'}}>
          {children}
        </main>
      </div>

      <BackToTop />
    </div>
  )
}
