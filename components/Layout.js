import { useState } from 'react'
import { useRouter } from 'next/router'
import BackToTop from './BackToTop'
import useBreakpoint from '../lib/useBreakpoint'

export default function Layout({ children }) {
  const router = useRouter()
  var isDesktop = false, isMobile = false, isTablet = false;
  try { var bp = useBreakpoint(); isDesktop = bp.isDesktop; isMobile = bp.isMobile; isTablet = bp.isTablet; } catch(e) {}

  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const tabs = [
    { path: '/', label: '\u952E\u76D8', icon: 'fas fa-home' },
    { path: '/studios', label: '\u5DE5\u4F5C\u5BA4', icon: 'fas fa-th' },
    { path: '/timeline', label: '\u65F6\u95F4\u7EBF', icon: 'fas fa-archive' },
    { path: '/admin', label: '\u7BA1\u7406', icon: 'fas fa-tag' },
  ]

  var sidebarW = expanded ? 260 : 90

  var renderSidebar = function(isOpenStyle) {
    return (
      <>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'20px 16px',minHeight:64,borderBottom:'1px solid var(--border-base)',whiteSpace:'nowrap',overflow:'hidden'}}>
          <span style={{fontSize:24,fontWeight:800,flexShrink:0,width:28,textAlign:'center',letterSpacing:0}}>K</span>
          <span style={{fontSize:14,fontWeight:700,letterSpacing:1.5,background:'var(--accent)',color:'#18181b',padding:'2px 8px',borderRadius:3,opacity:(isOpenStyle||expanded)?1:0,transition:'opacity .2s ease',whiteSpace:'nowrap',overflow:'hidden',maxWidth:200}}>COLLECTION</span>
        </div>
        <div style={{flex:1,padding: isOpenStyle ? '8px 0' : '32px 0'}}>
          {tabs.map(function(t) {
            var isActive = router.pathname === t.path
            return (
              <button key={t.path} onClick={function(){ router.push(t.path); if(!isDesktop) setMenuOpen(false) }}
                style={{width:'100%',display:'flex',alignItems:'center',padding:'14px 20px',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:15,letterSpacing:0.5,background:isActive?'var(--accent)':'transparent',color:isActive?'#18181b':'var(--text-primary)',fontWeight:600,transition:'all .15s',whiteSpace:'nowrap',textAlign:'left'}}>
                <i className={t.icon} style={{fontSize:16,width:22,textAlign:'center',lineHeight:1}}></i>
                <span style={{marginLeft:12,opacity:(isOpenStyle||expanded)?1:0,transition:'opacity .2s ease',whiteSpace:'nowrap',overflow:'hidden'}}>{t.label}</span>
              </button>
            )
          })}
        </div>
        <div style={{padding:'16px 20px',borderTop:'1px solid var(--border-base)',fontSize:10,color:'var(--text-muted)',whiteSpace:'nowrap',overflow:'hidden'}}>
          {isOpenStyle ? '\u00A9 2025-2026 XIAOFENG. All Rights Reserved.' : 'XIAOFENG'}
        </div>
      </>
    )
  }

  return (
    <div style={{minHeight:'100vh',display:'flex'}}>
      {/* Desktop sidebar */}
      {isDesktop && (
        <nav style={{position:'fixed',left:0,top:0,bottom:0,zIndex:100,width:sidebarW,display:'flex',flexDirection:'column',background:'var(--bg-primary)',borderRight:'1px solid var(--border-base)',boxShadow:'var(--shadow-base)',overflow:'hidden',transition:'width .25s ease,transform .25s ease',transform:'translateZ(0)',willChange:'width',backfaceVisibility:'hidden'}}
          onMouseEnter={function(){setExpanded(true)}}
          onMouseLeave={function(){setExpanded(false)}}>
          {renderSidebar(false)}
        </nav>
      )}

      {/* Mobile/Tablet: hamburger button */}
      {(!isDesktop) && (
        <button onClick={function(){setMenuOpen(true)}}
          style={{position:'fixed',top:12,left:12,zIndex:90,width:36,height:36,background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:8,cursor:'pointer',fontSize:18,color:'var(--text-primary)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'var(--shadow-base)'}}>
          {'\u2630'}
        </button>
      )}

      {/* Mobile/Tablet: sidebar overlay */}
      {(!isDesktop) && menuOpen && (
        <div style={{position:'fixed',inset:0,zIndex:200,background:'rgba(0,0,0,0.4)'}} onClick={function(){setMenuOpen(false)}}>
          <nav style={{position:'fixed',left:0,top:0,bottom:0,width:260,background:'var(--bg-primary)',display:'flex',flexDirection:'column',boxShadow:'0 0 40px rgba(0,0,0,0.2)',animation:'popupIn .25s ease'}} onClick={function(e){e.stopPropagation()}}>
            {renderSidebar(true)}
          </nav>
        </div>
      )}

      {/* Main content */}
      <div style={{marginLeft:(isDesktop?sidebarW:0),width:'100%',minHeight:'100vh'}}>
        <main style={{maxWidth:1200,margin:'0 auto',padding:isMobile?'60px 12px 32px':(isTablet?'60px 20px 32px':'32px 28px')}}>
          {children}
        </main>
      </div>

      <BackToTop />
    </div>
  )
}
