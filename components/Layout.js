import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import BackToTop from './BackToTop'
import useBreakpoint from '../lib/useBreakpoint'

export default function Layout({ children, onGoHome }) {
  const router = useRouter()
  var isDesktop = false, isMobile = false, isTablet = false;
  try { var bp = useBreakpoint(); isDesktop = bp.isDesktop; isMobile = bp.isMobile; isTablet = bp.isTablet; } catch(e) {}

  const [expanded, setExpanded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLocal, setIsLocal] = useState(true)

  useEffect(function() {
    if (typeof window !== 'undefined') {
      setIsLocal(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    }
  }, [])

  const tabs = [
    { path: '/', label: 'HOME', icon: 'fas fa-home' },
    { path: '/studios', label: 'STUDIO', icon: 'fas fa-th' },
    { path: '/timeline', label: 'TIMELINE', icon: 'fas fa-archive' },
    { path: '/admin', label: 'SETTING', icon: 'fas fa-tag' },
  ]

  var renderSidebar = function(isOpenStyle) {
    return (
      <>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'20px 16px',height:64,borderBottom:'1px solid var(--border-base)',whiteSpace:'nowrap',overflow:'hidden'}}>
          <img src='/images/logo.png' alt='logo' style={{height:56,width:'auto',transform:'scale(1.33)',transformOrigin:'center center',flexShrink:0,cursor:'pointer'}} onClick={function(){ if(onGoHome){onGoHome()}else{router.push('/')} }} />
        </div>
        <div style={{flex:1,padding: isOpenStyle ? '8px 0' : '32px 0'}}>
          {tabs.map(function(t) {
            var isActive = router.pathname === t.path
            return (
              <button key={t.path} onClick={function(){ if(t.path==='/'&&onGoHome){onGoHome()}else{router.push(t.path)} if(!isDesktop) setMenuOpen(false) }}
                style={{width:'100%',display:'flex',alignItems:'center',padding:'14px 34px',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:15,letterSpacing:0.5,background:isActive?'var(--accent)':'transparent',color:isActive?'#18181b':'var(--text-primary)',fontWeight:600,transition:'all .15s',whiteSpace:'nowrap',textAlign:'left'}}>
                <i className={t.icon} style={{fontSize:16,width:22,textAlign:'center',lineHeight:1}}></i>
                <span style={{opacity:(isOpenStyle||expanded)?1:0,maxWidth:(isOpenStyle||expanded)?200:0,marginLeft:(isOpenStyle||expanded)?14:0,overflow:'hidden',whiteSpace:'nowrap',transition:(isOpenStyle||expanded)?'opacity .3s ease .075s,maxWidth .3s ease .075s,marginLeft .3s ease .075s':'opacity .2s ease,maxWidth .2s ease,marginLeft .2s ease'}}>{t.label}</span>
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
            {/* Desktop top navbar */}
      {isDesktop && (
        <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:100,height:56,background:'var(--bg-primary)',borderBottom:'1px solid var(--border-base)',boxShadow:'var(--shadow-base)',display:'flex',alignItems:'center',padding:'0 24px',gap:8}}>
          <img src='/images/logo.png' alt='logo' style={{height:46,cursor:'pointer'}} onClick={function(){if(onGoHome)onGoHome();else router.push('/')}} />
          <div style={{flex:1}} />
          {tabs.filter(function(t){return !(t.path==='/admin'&&!isLocal)}).map(function(t){
            var isActive = router.pathname === t.path
            return (
              <button key={t.path} onClick={function(){if(t.path==='/'&&onGoHome)onGoHome();else router.push(t.path)}}
                style={{padding:'0 18px',height:56,border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:13,fontWeight:isActive?600:400,letterSpacing:0.5,borderRadius:0,background:isActive?'var(--accent)':'transparent',color:isActive?'#18181b':'var(--text-primary)',transition:'all .15s',display:'flex',alignItems:'center',gap:8}}
                onMouseEnter={function(e){if(!isActive)e.target.style.background='var(--bg-secondary)'}}
                onMouseLeave={function(e){if(!isActive)e.target.style.background='transparent'}}>
                <i className={t.icon} style={{fontSize:14}}></i>
                <span>{t.label}</span>
              </button>
            )
          })}
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
      <div style={{marginLeft:0,width:'100%',minHeight:'100vh'}}>
        <main style={{maxWidth:'85rem',margin:'0 auto',padding:isMobile?'60px 12px 32px':(isTablet?'60px 20px 32px':'80px 40px 32px')}}>
          {children}
        </main>
      </div>

      <BackToTop />
    </div>
  )
}
