import { useState, useEffect } from 'react'
import useBreakpoint from '../lib/useBreakpoint'

export default function KeyboardDetail({ keyboard, onClose, onShowStudio }) {
  const { isDesktop, isMobile } = useBreakpoint()
  const [imgIdx, setImgIdx] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewClosing, setPreviewClosing] = useState(false)
  const images = keyboard.images || (keyboard.image ? [keyboard.image] : [])
  const img = images.length > 0 ? images[imgIdx] : null

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const closePreview = () => {
    setPreviewClosing(true)
    setTimeout(() => { setPreviewOpen(false); setPreviewClosing(false) }, 250)
  }

  useEffect(() => {
    if (!previewOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        closePreview()
      } else if (images.length > 1) {
        if (e.key === 'ArrowLeft') setImgIdx(i => (i - 1 + images.length) % images.length)
        else if (e.key === 'ArrowRight') setImgIdx(i => (i + 1) % images.length)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [previewOpen, images.length])

  const label = { fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:1 }
  const value = { fontSize:13, color:'var(--text-primary)' }
  const row = { padding:'10px 0', display:'flex', gap:12 }

  const statusLabel = keyboard.status === 'ic' ? 'IC' : keyboard.status === 'gb' ? 'GB' : keyboard.status === 'completed' ? '已完成' : ''
  const getLinks = function(k, field) {
    var arr = k[field + 'Links']
    if (arr && arr.length > 0) return arr
    return k[field + 'Link'] ? [k[field + 'Link']] : []
  }
  const icLinks = getLinks(keyboard, 'ic')
  const gbLinks = getLinks(keyboard, 'gb')

  return (
    <>
      {previewOpen && images.length > 0 && (
        <div data-testid="fullscreen-preview" style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20,animation:(previewClosing?'previewOut .25s ease':'previewIn .25s ease')}} onClick={closePreview}>
          {images.length > 1 && (
            <button
              type="button"
              aria-label="上一张"
              title="上一张"
              data-testid="preview-prev"
              onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length) }}
              style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',zIndex:1,background:'rgba(24,24,27,0.72)',color:'#fff',border:'none',borderRadius:8,width:44,height:44,fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}
            >{'\u25C0'}</button>
          )}
          <img src={images[((imgIdx % images.length) + images.length) % images.length]} alt={keyboard.name} style={{maxWidth:images.length > 1 ? 'calc(100% - 104px)' : '95%',maxHeight:'calc(100% - 72px)',objectFit:'contain'}} />
          {images.length > 1 && (
            <button
              type="button"
              aria-label="下一张"
              title="下一张"
              data-testid="preview-next"
              onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length) }}
              style={{position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',zIndex:1,background:'rgba(24,24,27,0.72)',color:'#fff',border:'none',borderRadius:8,width:44,height:44,fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}
            >{'\u25B6'}</button>
          )}
          {images.length > 1 && (
            <div data-testid="preview-counter" style={{position:'absolute',bottom:16,left:'50%',transform:'translateX(-50%)',background:'rgba(24,24,27,0.72)',color:'#fff',padding:'4px 12px',fontSize:12,borderRadius:8}}>{((imgIdx % images.length) + images.length) % images.length + 1}{'/'}{images.length}</div>
          )}
          <button
            type="button"
            aria-label="关闭"
            title="关闭"
            data-testid="preview-close"
            onClick={e => { e.stopPropagation(); closePreview() }}
            style={{position:'absolute',top:16,right:16,zIndex:1,background:'rgba(24,24,27,0.72)',color:'#fff',border:'none',borderRadius:8,width:40,height:40,fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}
          >{'\u2715'}</button>
        </div>
      )}
      <div className="overlay" style={{padding:isMobile?8:20}} onClick={onClose}>
        <div style={{background:'var(--bg-primary)',borderRadius:12,width:'100%',maxWidth:1440,height:isDesktop?'min(94vh, calc(min(100vw - 40px, 1440px) * 0.465))':'auto',maxHeight:'94vh',display:'flex',flexDirection:isDesktop?'row':'column',overflow:'hidden',boxShadow:'0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',animation:'popupIn .35s cubic-bezier(0.16,1,0.3,1)'}} onClick={e=>e.stopPropagation()}>

          {/* Edge-to-edge image area */}
          <div style={{position:'relative',flex:isDesktop?'1 1 62%':'0 0 auto',minWidth:0,width:isDesktop?'auto':'100%',aspectRatio:'4/3',overflow:'hidden',background:'var(--bg-secondary)'}}>
            {images.length > 0 && (
              <img src={img} alt={keyboard.name} decoding="async" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',display:'block',cursor:'zoom-in'}}
                onClick={() => setPreviewOpen(true)}
                onError={e=>{e.target.style.display='none'}} />
            )}

            {images.length > 1 && (
              <>
                <button type="button" aria-label={'\u4E0A\u4E00\u5F20'} title={'\u4E0A\u4E00\u5F20'} onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',zIndex:2,background:'rgba(24,24,27,0.55)',color:'#fff',border:'none',borderRadius:'50%',width:40,height:40,fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>{'\u25C0'}</button>
                <button type="button" aria-label={'\u4E0B\u4E00\u5F20'} title={'\u4E0B\u4E00\u5F20'} onClick={()=>setImgIdx(i=>(i+1)%images.length)} style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',zIndex:2,background:'rgba(24,24,27,0.55)',color:'#fff',border:'none',borderRadius:'50%',width:40,height:40,fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>{'\u25B6'}</button>
                <div style={{position:'absolute',top:12,right:12,zIndex:2,background:'rgba(24,24,27,0.55)',color:'#fff',padding:'3px 10px',fontSize:11,borderRadius:6}}>{(imgIdx+1)+'/'+images.length}</div>

                <div style={{position:'absolute',left:'50%',bottom:14,transform:'translateX(-50%)',zIndex:2,display:'flex',gap:8,padding:'8px 10px',maxWidth:'92%',overflowX:'auto',background:'rgba(24,24,27,0.72)',borderRadius:10}}>
                  {images.map(function(src, idx) {
                    const active = idx === imgIdx
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImgIdx(idx)}
                        aria-label={'\u67E5\u770B\u7B2C' + (idx+1) + '\u5F20'}
                        style={{position:'relative',width:56,height:42,flexShrink:0,padding:0,borderRadius:6,overflow:'hidden',cursor:'pointer',background:'var(--bg-secondary)',border:active?'2px solid #fff':'1px solid rgba(255,255,255,0.35)'}}>
                        <img src={src} alt={keyboard.name + ' ' + (idx+1)} loading="lazy" decoding="async" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} onError={e=>{e.target.style.display='none'}} />
                        {active && <span style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.35)'}} />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Right info */}
          <div style={{flex:isDesktop?'1 1 38%':'1 1 auto',minWidth:0,minHeight:0,overflowY:'auto',padding:isMobile?'20px 18px 24px':'32px 36px'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:22}}>
              <div style={{minWidth:0}}>
                <h2 style={{fontSize:22,fontWeight:700,color:'var(--text-primary)',lineHeight:1.3}}>{keyboard.name}</h2>
                {keyboard.studio && (
                  <button onClick={() => onShowStudio && onShowStudio(keyboard.studio)}
                    style={{marginTop:8,background:'var(--accent)',border:'none',color:'#18181b',padding:'3px 10px',borderRadius:4,fontSize:12,cursor:'pointer',fontWeight:600,fontFamily:'inherit',letterSpacing:0.3,whiteSpace:'nowrap'}}>
                    {keyboard.studio}
                  </button>
                )}
              </div>
              <button onClick={onClose} aria-label={'\u5173\u95ED\u8BE6\u60C5'} style={{flexShrink:0,background:'none',border:'1px solid var(--border-base)',borderRadius:6,fontSize:16,cursor:'pointer',padding:'4px 10px',color:'var(--text-muted)',lineHeight:1}}>{'\u2715'}</button>
            </div>

            {keyboard.layout && <div style={row}><span style={{...label,width:80}}>{'\u914D\u5217'}</span><span style={value}>{keyboard.layout}</span></div>}
            {statusLabel && <div style={row}><span style={{...label,width:80}}>{'\u72B6\u6001'}</span><span style={value}>{statusLabel}</span></div>}
            {keyboard.size && <div style={row}><span style={{...label,width:80}}>{'\u5C3A\u5BF8'}</span><span style={value}>{keyboard.size}</span></div>}
            {keyboard.structure && <div style={row}><span style={{...label,width:80}}>{'\u7ED3\u6784'}</span><span style={value}>{keyboard.structure}</span></div>}
            {keyboard.frontHeight && <div style={row}><span style={{...label,width:80}}>{'\u524D\u9AD8'}</span><span style={value}>{keyboard.frontHeight}</span></div>}
            {keyboard.angle && <div style={row}><span style={{...label,width:80}}>{'\u89D2\u5EA6'}</span><span style={value}>{keyboard.angle}</span></div>}
            {keyboard.weight && <div style={row}><span style={{...label,width:80}}>{'\u91CD\u91CF'}</span><span style={value}>{keyboard.weight}</span></div>}
            {keyboard.material && <div style={row}><span style={{...label,width:80}}>{'\u6750\u8D28'}</span><span style={value}>{keyboard.material}</span></div>}
            {keyboard.gbPrice && <div style={row}><span style={{...label,width:80}}>{'\u56E2\u8D2D\u4EF7\u683C'}</span><span style={value}>{keyboard.gbPrice}</span></div>}
            {(keyboard.icTime || icLinks.length > 0) && <div style={row}><span style={{...label,width:80}}>IC {'\u65F6\u95F4'}</span><span style={value}>{keyboard.icTime || '\u2014'}{icLinks.length > 0 ? ' \u00B7' : ''} {icLinks.map(function(l, idx) {return <span key={idx}>{idx > 0 && ' '}<a href={l} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600,marginRight:4}}>{'\u67E5\u770B\u8BE6\u60C5' + (icLinks.length > 1 ? (idx+1) : '')}</a></span>})}</span></div>}
            {(keyboard.gbTime || gbLinks.length > 0) && <div style={row}><span style={{...label,width:80}}>GB {'\u65F6\u95F4'}</span><span style={value}>{keyboard.gbTime || '\u2014'}{gbLinks.length > 0 ? ' \u00B7' : ''} {gbLinks.map(function(l, idx) {return <span key={idx}>{idx > 0 && ' '}<a href={l} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600,marginRight:4}}>{'\u67E5\u770B\u8BE6\u60C5' + (gbLinks.length > 1 ? (idx+1) : '')}</a></span>})}</span></div>}
            {keyboard.description && <div style={row}><span style={{...label,width:80}}>{'\u5907\u6CE8'}</span><span style={value}>{keyboard.description}</span></div>}
          </div>
        </div>
      </div>
    </>
  )
}
