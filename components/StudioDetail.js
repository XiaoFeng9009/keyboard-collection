import { useState, useEffect } from 'react'

export default function StudioDetail({ studio, keyboards, onClose }) {
  const [fullscreenImg, setFullscreenImg] = useState(null)
  const list = [...keyboards].filter(k => k.studio === studio)
    .sort((a, b) => (b.sortTime || '').localeCompare(a.sortTime || ''))

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function getImg(kb) {
    if (kb.images && kb.images.length > 0) return kb.images[0]
    return kb.image || ''
  }

  return (
    <>
      {/* Fullscreen image viewer */}
      {fullscreenImg && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.92)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20}} onClick={() => setFullscreenImg(null)}>
          <img src={fullscreenImg} style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}} />
        </div>
      )}

      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',justifyContent:'center',alignItems:'flex-start',padding:'40px 20px',backdropFilter:'blur(6px)',overflowY:'auto'}} onClick={onClose}>
        <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:12,width:'100%',maxWidth:720,boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}} onClick={e=>e.stopPropagation()}>

          {/* Header */}
          <div style={{position:'sticky',top:0,background:'var(--bg-primary)',zIndex:1,borderRadius:'12px 12px 0 0',padding:'16px 24px',borderBottom:'1px solid var(--border-base)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <h2 style={{fontSize:18,fontWeight:700}}>{studio}</h2>
              <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{'\u5171 ' + list.length + ' \u628A\u952E\u76D8'}</p>
            </div>
            <button onClick={onClose} style={{background:'none',border:'1px solid var(--border-base)',borderRadius:6,fontSize:18,cursor:'pointer',padding:'4px 12px',color:'var(--text-muted)',lineHeight:1}}>{'\u2715'}</button>
          </div>

          {/* Markdown article style */}
          <div style={{padding:'24px 28px'}}>
            {list.map((k, idx) => {
              const img = getImg(k)
              return (
                <div key={k.id} style={{marginBottom: idx < list.length - 1 ? 32 : 0}}>
                  {/* ### Keyboard Name */}
                  <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'var(--text-primary)',paddingBottom:6}}>{k.name}</h3>

                  {/* !Image */}
                  {img && (
                    <img src={img} alt={k.name}
                      style={{width:'100%',maxHeight:360,objectFit:'contain',display:'block',margin:'0 auto 12px',cursor:'zoom-in',background:'var(--bg-secondary)'}}
                      onClick={() => setFullscreenImg(img)}
                      onError={e=>e.target.style.display='none'} />
                  )}

                  {/* Keyboard Name (text) */}
                  <p style={{fontSize:14,fontWeight:600,marginBottom:12,color:'var(--text-primary)'}}>{k.name}</p>

                  {/* IC phase */}
                  <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                    <strong style={{color:'var(--text-primary)'}}>{'IC\u9636\u6BB5'}</strong>: {k.icTime || '\u2014'}
                    {k.icLink && <> | <a href={k.icLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'\u67E5\u770B\u8BE6\u60C5'}</a></>}
                  </p>

                  {/* GB phase */}
                  <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                    <strong style={{color:'var(--text-primary)'}}>{'GB\u9636\u6BB5'}</strong>: {k.gbTime || '\u2014'}
                    {k.gbLink && <> | <a href={k.gbLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'\u67E5\u770B\u8BE6\u60C5'}</a></>}
                  </p>

                  {/* Description - aside style */}
                  {k.description && (
                    <div style={{background:'var(--bg-secondary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'12px 16px',margin:'12px 0',fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>
                      {'\uD83D\uDCDD'} {k.description}
                    </div>
                  )}

                  {/* Separator */}
                  {idx < list.length - 1 && <hr style={{border:'none',borderTop:'1px solid var(--border-base)',margin:'32px 0'}} />}
                </div>
              )
            })}
            {list.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>{'\u6682\u65E0\u6570\u636E'}</div>}
          </div>
        </div>
      </div>
    </>
  )
}
