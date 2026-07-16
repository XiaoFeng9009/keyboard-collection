import { useState } from 'react'
import { useRouter } from 'next/router'
import BackToTop from './BackToTop'

export default function Layout({ children }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  const tabs = [
    { path: '/', label: '\u952E\u76D8', icon: '\u2328' },
    { path: '/studios', label: '\u5DE5\u4F5C\u5BA4', icon: '\u25A3' },
    { path: '/timeline', label: '\u65F6\u95F4\u7EBF', icon: '\u25CB' },
    { path: '/admin', label: '\u7BA1\u7406', icon: '\u2699' },
  ]

  const sidebarW = expanded ? 200 : 60

  return (
    <div style={{minHeight:'100vh', display:'flex'}}>
      {/* Sidebar */}
      <nav style={{
        position:'fixed', left:0, top:0, bottom:0, zIndex:100,
        width: expanded ? 200 : 60, display:'flex', flexDirection:'column',
        background:'var(--bg-primary)', borderRight:'1px solid var(--border-base)',
        boxShadow:'var(--shadow-base)', overflow:'hidden',
        transition:'width .25s ease',zIndex:expanded ? 200 : 100
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
          {expanded && (
            <span style={{
              fontSize:13, fontWeight:600, letterSpacing:1.5,
              background:'var(--accent)', color:'#18181b',
              padding:'2px 8px', borderRadius:3
            }}>COLLECTION</span>
          )}
        </div>

        {/* Nav items */}
        <div style={{flex:1, padding:'12px 0'}}>
          {tabs.map(t => {
            const isActive = router.pathname === t.path
            return (
              <button key={t.path} onClick={() => router.push(t.path)} style={{
                width:'100%', display:'flex', alignItems:'center', gap:14,
                padding:'14px 20px', border:'none', cursor:'pointer',
                fontFamily:'inherit', fontSize:13, letterSpacing:0.5,
                background: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#18181b' : 'var(--text-primary)',
                fontWeight: isActive ? 600 : 400,
                transition:'all .15s', whiteSpace:'nowrap',
                borderLeft: isActive ? '3px solid #18181b' : '3px solid transparent',
                textAlign:'left'
              }}
                onMouseEnter={e => { if(!isActive) e.target.style.background = 'var(--bg-secondary)' }}
                onMouseLeave={e => { if(!isActive) e.target.style.background = 'transparent' }}>
                <span style={{fontSize:18, flexShrink:0, width:20, textAlign:'center', lineHeight:1}}>{t.icon}</span>
                {expanded && <span>{t.label}</span>}
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
          {expanded ? 'KB Collection' : 'KBC'}
        </div>
      </nav>

      {/* Main content */}
      <div style={{
        marginLeft: 60, width:'100%',
        transition:'margin-left .25s ease', minHeight:'100vh'
      }}>
        <main style={{maxWidth:1200, margin:'0 auto', padding:'32px 28px'}}>
          {children}
        </main>
      </div>

      <BackToTop />
    </div>
  )
}
