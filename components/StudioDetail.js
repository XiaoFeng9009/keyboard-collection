import { useState, useEffect, useRef } from 'react'
import useBreakpoint from '../lib/useBreakpoint'

export default function StudioDetail({ studio, keyboards, onClose }) {
  const { isDesktop } = useBreakpoint()
  const [fullscreenImg, setFullscreenImg] = useState(null)
  const [fullscreenClosing, setFullscreenClosing] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [tocOpen, setTocOpen] = useState(isDesktop)
  const sectionRefs = useRef([])
  const list = [...keyboards].filter(k => k.studio === studio)
    .sort((a, b) => (b.sortTime || '').localeCompare(a.sortTime || ''))

  useEffect(function() {
    document.body.style.overflow = 'hidden'
    return function() { document.body.style.overflow = '' }
  }, [])

  useEffect(function() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var idx = Number(entry.target.dataset.idx)
          if (!isNaN(idx)) setActiveIdx(idx)
        }
      })
    }, { rootMargin: '-80px 0px -60% 0px' })
    sectionRefs.current.forEach(function(ref) { if (ref) observer.observe(ref) })
    return function() { observer.disconnect() }
  }, [list.length])

  var closeFullscreen = function() {
    setFullscreenClosing(true)
    setTimeout(function() { setFullscreenImg(null); setFullscreenClosing(false) }, 250)
  }

  var getImg = function(kb) {
    if (kb.images && kb.images.length > 0) return kb.images[0]
    return kb.image || ''
  }

  var scrollTo = function(idx) {
    var el = sectionRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  var tocStyle = function(idx) {
    var isActive = activeIdx === idx
    return {
      display:'block',width:'100%',textAlign:'left',cursor:'pointer',fontFamily:'inherit',fontSize:12,letterSpacing:0,
      background: isActive ? 'var(--accent)' : 'transparent',
      color: isActive ? '#18181b' : 'var(--text-secondary)',
      fontWeight: isActive ? 600 : 400,
      border:'none',borderRadius:4,padding:'6px 10px',marginBottom:2,
      whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
      transition:'all .15s'
    }
  }

  return (
    <>
      {fullscreenImg && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.3)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20,animation:(fullscreenClosing?'previewOut .25s ease':'previewIn .25s ease')}} onClick={closeFullscreen}>
          <img src={fullscreenImg} style={{maxWidth:'95%',maxHeight:'95%',objectFit:'contain'}} />
        </div>
      )}

      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'blur(6px)',padding:'60px 20px',animation:'overlayIn .3s ease'}} onClick={onClose}>
        <div style={{background:'var(--bg-primary)',borderRadius:12,overflow:'hidden',width:'100%',maxWidth:960,boxShadow:'0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',animation:'popupIn .35s cubic-bezier(0.16,1,0.3,1)'}} onClick={function(e){e.stopPropagation()}}>
          <div style={{overflowY:'auto',maxHeight:'75vh'}}>

            {/* Header */}
            <div style={{position:'sticky',top:0,background:'var(--bg-primary)',zIndex:2,padding:'16px 24px',borderBottom:'1px solid var(--border-base)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <h2 style={{fontSize:18,fontWeight:700}}>{studio}</h2>
                <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{'共 ' + list.length + ' 把键盘'}</p>
              </div>
              <button onClick={onClose} style={{background:'none',border:'1px solid var(--border-base)',borderRadius:6,fontSize:18,cursor:'pointer',padding:'4px 12px',color:'var(--text-muted)',lineHeight:1}}>{'\u2715'}</button>
            </div>

            {/* Desktop: flex row layout */}
            {isDesktop && (
              <div style={{display:'flex', padding:'40px 44px'}}>
                <div style={{width:150,flexShrink:0,position:'sticky',top:80,alignSelf:'flex-start',maxHeight:'calc(70vh - 160px)',overflowY:'auto',paddingRight:16,marginRight:32}}>
                  <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>{'目录'}</div>
                  {list.map(function(k, idx) {
                    return (
                      <button key={k.id} onClick={function(){scrollTo(idx)}} style={tocStyle(idx)}
                        onMouseEnter={function(e){if(activeIdx!==idx)e.target.style.color='var(--text-primary)'}}
                        onMouseLeave={function(e){if(activeIdx!==idx)e.target.style.color='var(--text-secondary)'}}>
                        {k.name}
                      </button>
                    )
                  })}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  {list.map(function(k, idx) {
                    var img = getImg(k)
                    return (
                      <div key={k.id} ref={function(el){sectionRefs.current[idx]=el}} data-idx={idx}
                        style={{scrollMarginTop:80, marginBottom: idx < list.length - 1 ? 36 : 0}}>
                        <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'var(--text-primary)',paddingBottom:6}}>{k.name}</h3>
                        {img && (<img src={img} alt={k.name} style={{width:'100%',height:280,objectFit:'cover',display:'block',margin:'0 auto 12px',cursor:'zoom-in',background:'var(--bg-secondary)',borderRadius:8}} onClick={function(){setFullscreenImg(img)}} onError={function(e){e.target.style.display='none'}} />)}
                        <p style={{fontSize:14,fontWeight:600,marginBottom:12,color:'var(--text-primary)'}}>{k.name}</p>
                        <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                          <strong style={{color:'var(--text-primary)'}}>{'IC\u9636\u6BB5'}</strong>: {k.icTime || '\u2014'}
                          {k.icLink && <> | <a href={k.icLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a></>}
                        </p>
                        <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                          <strong style={{color:'var(--text-primary)'}}>{'GB\u9636\u6BB5'}</strong>: {k.gbTime || '\u2014'}
                          {k.gbLink && <> | <a href={k.gbLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a></>}
                        </p>
                        {k.description && (<div style={{background:'var(--bg-secondary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'12px 16px',margin:'12px 0',fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>{'\uD83D\uDCDD'} {k.description}</div>)}
                        {idx < list.length - 1 && <hr style={{border:'none',borderTop:'1px solid var(--border-base)',margin:'36px 0'}} />}
                      </div>
                    )
                  })}
                  {list.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>{'暂无数据'}</div>}
                </div>
              </div>
            )}

            {/* Mobile/Tablet: stacked layout */}
            {!isDesktop && (
              <div style={{padding:'24px 20px'}}>
                <button onClick={function(){setTocOpen(!tocOpen)}}
                  style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:8,cursor:'pointer',padding:'8px 14px',fontSize:12,color:'var(--text-secondary)',fontFamily:'inherit',display:'flex',alignItems:'center',gap:6,marginBottom:12,transition:'all .15s'}}>
                  <span>{tocOpen ? '\u2715' : '\u2630'}</span>
                  <span>{tocOpen ? '\u6536\u8D77\u76EE\u5F55' : '\u76EE\u5F55'}</span>
                </button>

                {tocOpen && (
                  <div style={{background:'var(--bg-secondary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'10px 12px',marginBottom:16}}>
                    {list.map(function(k, idx) {
                      return (
                        <button key={k.id} onClick={function(){scrollTo(idx);setTocOpen(false)}} style={tocStyle(idx)}
                          onMouseEnter={function(e){if(activeIdx!==idx)e.target.style.color='var(--text-primary)'}}
                          onMouseLeave={function(e){if(activeIdx!==idx)e.target.style.color='var(--text-secondary)'}}>
                          {k.name}
                        </button>
                      )
                    })}
                  </div>
                )}

                {list.map(function(k, idx) {
                  var img = getImg(k)
                  return (
                    <div key={k.id} ref={function(el){sectionRefs.current[idx]=el}} data-idx={idx}
                      style={{marginBottom: idx < list.length - 1 ? 36 : 0}}>
                      <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'var(--text-primary)',paddingBottom:6}}>{k.name}</h3>
                      {img && (<img src={img} alt={k.name} style={{width:'100%',height:220,objectFit:'cover',display:'block',margin:'0 auto 12px',cursor:'zoom-in',background:'var(--bg-secondary)',borderRadius:8}} onClick={function(){setFullscreenImg(img)}} onError={function(e){e.target.style.display='none'}} />)}
                      <p style={{fontSize:14,fontWeight:600,marginBottom:12,color:'var(--text-primary)'}}>{k.name}</p>
                      <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                        <strong style={{color:'var(--text-primary)'}}>{'IC\u9636\u6BB5'}</strong>: {k.icTime || '\u2014'}
                        {k.icLink && <> | <a href={k.icLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a></>}
                      </p>
                      <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                        <strong style={{color:'var(--text-primary)'}}>{'GB\u9636\u6BB5'}</strong>: {k.gbTime || '\u2014'}
                        {k.gbLink && <> | <a href={k.gbLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a></>}
                      </p>
                      {k.description && (<div style={{background:'var(--bg-secondary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'12px 16px',margin:'12px 0',fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>{'\uD83D\uDCDD'} {k.description}</div>)}
                      {idx < list.length - 1 && <hr style={{border:'none',borderTop:'1px solid var(--border-base)',margin:'36px 0'}} />}
                    </div>
                  )
                })}
                {list.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>{'暂无数据'}</div>}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}
