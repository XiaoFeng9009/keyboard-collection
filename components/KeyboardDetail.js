import { useState, useEffect } from 'react'

export default function KeyboardDetail({ keyboard, onClose, onShowStudio }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [previewImg, setPreviewImg] = useState(null)
  const [previewClosing, setPreviewClosing] = useState(false)
  const images = keyboard.images || (keyboard.image ? [keyboard.image] : [])
  const img = images.length > 0 ? images[imgIdx] : null

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const closePreview = () => {
    setPreviewClosing(true)
    setTimeout(() => { setPreviewImg(null); setPreviewClosing(false) }, 250)
  }

  const label = { fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:1 }
  const value = { fontSize:13, color:'var(--text-primary)' }
  const row = { padding:'10px 0', display:'flex', gap:12 }

  const statusLabel = keyboard.status === 'ic' ? 'IC' : keyboard.status === 'gb' ? 'GB' : keyboard.status === 'completed' ? '已完成' : ''

  return (
    <>
      {previewImg && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.3)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20,animation:(previewClosing?'previewOut .25s ease':'previewIn .25s ease')}} onClick={closePreview}>
          <img src={previewImg} style={{maxWidth:'95%',maxHeight:'95%',objectFit:'contain'}} />
        </div>
      )}
      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'blur(6px)',padding:20,animation:'overlayIn .3s ease'}} onClick={onClose}>
        <div style={{background:'var(--bg-primary)',borderRadius:12,width:'100%',maxWidth:660,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',animation:'popupIn .35s cubic-bezier(0.16,1,0.3,1)'}} onClick={e=>e.stopPropagation()}>

          {/* Image carousel */}
          {images.length > 0 && (
            <div style={{position:'relative',background:'var(--bg-secondary)',borderRadius:'12px 12px 0 0'}}>
              <img src={img} alt={keyboard.name} style={{width:'100%',maxHeight:420,objectFit:'cover',display:'block',cursor:'zoom-in'}}
                onClick={() => setPreviewImg(img)}
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
            {statusLabel && <div style={row}><span style={{...label,width:80}}>{'状态'}</span><span style={value}>{statusLabel}</span></div>}
            {keyboard.icTime && <div style={row}><span style={{...label,width:80}}>IC {'时间'}</span><span style={value}>{keyboard.icTime}{keyboard.icLink ? ' ·' : ''} {keyboard.icLink && <a href={keyboard.icLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a>}</span></div>}
            {keyboard.gbTime && <div style={row}><span style={{...label,width:80}}>GB {'时间'}</span><span style={value}>{keyboard.gbTime}{keyboard.gbLink ? ' ·' : ''} {keyboard.gbLink && <a href={keyboard.gbLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a>}</span></div>}
            {keyboard.description && <div style={row}><span style={{...label,width:80}}>{'备注'}</span><span style={value}>{keyboard.description}</span></div>}

            {/* Close button */}
            <div style={{textAlign:'center',marginTop:28}}>
              <button onClick={onClose} style={{background:'none',border:'1px solid var(--border-base)',borderRadius:8,fontSize:13,cursor:'pointer',padding:'10px 32px',color:'var(--text-secondary)',fontFamily:'inherit',letterSpacing:0.5}}>{'关闭'}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
