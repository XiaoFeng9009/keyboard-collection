import { useState, useEffect } from 'react'

export default function KeyboardDetail({ keyboard, onClose, onShowStudio }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [fullscreenImg, setFullscreenImg] = useState(null)
  const images = keyboard.images || (keyboard.image ? [keyboard.image] : [])
  const img = images.length > 0 ? images[imgIdx] : null

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const label = { fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:1 }
  const value = { fontSize:13, color:'var(--text-primary)' }
  const row = { padding:'8px 0', display:'flex', gap:8, borderBottom:'1px solid var(--border-base)' }

  const statusLabel = keyboard.status === 'ic' ? 'IC' : keyboard.status === 'gb' ? 'GB' : keyboard.status === 'completed' ? '已完成' : ''

  return (
    <>
      {/* Fullscreen image viewer */}
      {fullscreenImg && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20}} onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} />
        </div>
      )}

      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'blur(6px)',padding:20}} onClick={onClose}>
        <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:12,width:'100%',maxWidth:700,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>

          {/* Close button */}
          <div style={{position:'sticky',top:0,right:0,textAlign:'right',padding:'8px 12px',background:'var(--bg-primary)',zIndex:1,borderRadius:'12px 12px 0 0'}}>
            <button onClick={onClose} style={{background:'none',border:'1px solid var(--border-base)',borderRadius:6,fontSize:18,cursor:'pointer',padding:'4px 12px',color:'var(--text-muted)',lineHeight:1}}>{'\u2715'}</button>
          </div>

          {/* Image carousel */}
          {images.length > 0 && (
            <div style={{position:'relative',background:'var(--bg-secondary)'}}>
              <img src={img} alt={keyboard.name} style={{width:'100%',maxHeight:420,objectFit:'contain',display:'block',cursor:'zoom-in'}}
                onClick={() => setFullscreenImg(img)}
                onError={e=>{e.target.style.display='none'}} />
              {images.length > 1 && (
                <>
                  <button onClick={()=>setImgIdx(i=>(i-1+images.length)%images.length)} style={{position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:6,padding:'8px 12px',cursor:'pointer',fontSize:16,opacity:0.9}}>{'\u25C0'}</button>
                  <button onClick={()=>setImgIdx(i=>(i+1)%images.length)} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:6,padding:'8px 12px',cursor:'pointer',fontSize:16,opacity:0.9}}>{'\u25B6'}</button>
                  <div style={{position:'absolute',bottom:8,left:'50%',transform:'translateX(-50%)',background:'rgba(24,24,27,0.8)',color:'#fff',padding:'2px 10px',fontSize:11,borderRadius:4}}>{(imgIdx+1)+'/'+images.length}</div>
                </>
              )}
            </div>
          )}

          {/* Keyboard Info */}
          <div style={{padding:'20px 28px'}}>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:4,color:'var(--text-primary)'}}>{keyboard.name}</h2>
            <button onClick={() => onShowStudio && onShowStudio(keyboard.studio)}
              style={{background:'var(--accent)',border:'none',color:'#18181b',padding:'2px 6px',borderRadius:4,fontSize:13,cursor:'pointer',fontWeight:600,marginBottom:16,fontFamily:'inherit',letterSpacing:0.3}}>
              {keyboard.studio}
            </button>

            {/* Info rows */}
            {keyboard.layout && <div style={row}><span style={{...label,width:80}}>{'配列'}</span><span style={value}>{keyboard.layout}</span></div>}
            {statusLabel && <div style={row}><span style={{...label,width:80}}>{'状态'}</span><span style={value}>{statusLabel}</span></div>}
            {keyboard.icTime && <div style={row}><span style={{...label,width:80}}>IC {'时间'}</span><span style={value}>{keyboard.icTime}{keyboard.icLink ? ' ·' : ''} {keyboard.icLink && <a href={keyboard.icLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a>}</span></div>}
            {keyboard.gbTime && <div style={row}><span style={{...label,width:80}}>GB {'时间'}</span><span style={value}>{keyboard.gbTime}{keyboard.gbLink ? ' ·' : ''} {keyboard.gbLink && <a href={keyboard.gbLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a>}</span></div>}
            {keyboard.description && <div style={row}><span style={{...label,width:80}}>{'备注'}</span><span style={value}>{keyboard.description}</span></div>}
          </div>
        </div>
      </div>
    </>
  )
}
