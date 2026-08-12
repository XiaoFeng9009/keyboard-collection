import { useState, useEffect } from 'react'

export default function KeyboardDetail({ keyboard, onClose, onShowStudio }) {
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
        <div data-testid="fullscreen-preview" style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.3)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20,animation:(previewClosing?'previewOut .25s ease':'previewIn .25s ease')}} onClick={closePreview}>
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
      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'blur(6px)',padding:20,animation:'overlayIn .3s ease'}} onClick={onClose}>
        <div style={{background:'var(--bg-primary)',borderRadius:12,width:'100%',maxWidth:660,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',animation:'popupIn .35s cubic-bezier(0.16,1,0.3,1)'}} onClick={e=>e.stopPropagation()}>

          {/* Image carousel */}
          {images.length > 0 && (
            <div style={{position:'relative',background:'var(--bg-secondary)',borderRadius:'12px 12px 0 0'}}>
              <img src={img} alt={keyboard.name} style={{width:'100%',maxHeight:420,objectFit:'cover',display:'block',cursor:'zoom-in'}}
                onClick={() => setPreviewOpen(true)}
                onError={e=>{e.target.style.display='none'}} />
              {images.length > 1 && (
                <>
                  <button onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)} style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'8px 12px',cursor:'pointer',fontSize:16,opacity:0.9,boxShadow:'0 2px 6px rgba(0,0,0,0.1)'}}>{'\u25C0'}</button>
                  <button onClick={()=>setImgIdx(i=>(i+1)%images.length)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'8px 12px',cursor:'pointer',fontSize:16,opacity:0.9,boxShadow:'0 2px 6px rgba(0,0,0,0.1)'}}>{'\u25B6'}</button>
                  <div style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',background:'rgba(24,24,27,0.8)',color:'#fff',padding:'3px 12px',fontSize:11,borderRadius:6}}>{(imgIdx+1)+'/'+images.length}</div>
                </>
              )}
            </div>
          )}

          {/* Keyboard Info */}
          <div style={{padding:'40px 44px'}}>
            {/* Title row */}
            <div style={{display:'flex',alignItems:'baseline',gap:12,marginBottom:6}}>
              <h2 style={{fontSize:22,fontWeight:700,color:'var(--text-primary)'}}>{keyboard.name}</h2>
              <button onClick={() => onShowStudio && onShowStudio(keyboard.studio)}
                style={{background:'var(--accent)',border:'none',color:'#18181b',padding:'2px 8px',borderRadius:4,fontSize:12,cursor:'pointer',fontWeight:600,fontFamily:'inherit',letterSpacing:0.3,whiteSpace:'nowrap'}}>
                {keyboard.studio}
              </button>
            </div>

            {/* Divider */}
            <div style={{height:1,background:'var(--border-base)',margin:'20px 0'}} />

            {/* Info rows */}
            {keyboard.layout && <div style={row}><span style={{...label,width:80}}>{'配列'}</span><span style={value}>{keyboard.layout}</span></div>}
            {statusLabel && <div style={row}><span style={{...label,width:80}}>{'状态'}</span><span style={value}>{statusLabel}</span></div>}            {(keyboard.icTime || icLinks.length > 0) && <div style={row}><span style={{...label,width:80}}>IC {'\u65F6\u95F4'}</span><span style={value}>{keyboard.icTime || '\u2014'}{icLinks.length > 0 ? ' \u00B7' : ''} {icLinks.map(function(l, idx) {return <span key={idx}>{idx > 0 && ' '}<a href={l} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600,marginRight:4}}>{'\u67E5\u770B\u8BE6\u60C5' + (icLinks.length > 1 ? (idx+1) : '')}</a></span>})}</span></div>}            {(keyboard.gbTime || gbLinks.length > 0) && <div style={row}><span style={{...label,width:80}}>GB {'\u65F6\u95F4'}</span><span style={value}>{keyboard.gbTime || '\u2014'}{gbLinks.length > 0 ? ' \u00B7' : ''} {gbLinks.map(function(l, idx) {return <span key={idx}>{idx > 0 && ' '}<a href={l} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600,marginRight:4}}>{'\u67E5\u770B\u8BE6\u60C5' + (gbLinks.length > 1 ? (idx+1) : '')}</a></span>})}</span></div>}
            {keyboard.description && <div style={row}><span style={{...label,width:80}}>{'备注'}</span><span style={value}>{keyboard.description}</span></div>}

            {/* Close button */}
            <div style={{textAlign:'center',marginTop:28}}>
              <button onClick={onClose} style={{background:'none',border:'1px solid var(--border-base)',borderRadius:6,fontSize:18,cursor:'pointer',padding:'4px 12px',color:'var(--text-muted)',lineHeight:1}}>{'\u2715'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
