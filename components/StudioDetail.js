import { useState } from 'react'

export default function StudioDetail({ studio, keyboards, onClose }) {
  const list = [...keyboards].filter(k => k.studio === studio)
    .sort((a, b) => (b.sortTime || '').localeCompare(a.sortTime || ''))

  function getImg(kb) {
    if (kb.images && kb.images.length > 0) return kb.images[0]
    return kb.image || ''
  }
  function timeLabel(kb) {
    if (kb.sortTime === kb.gbTime && kb.gbTime) return 'GB'
    if (kb.sortTime === kb.icTime && kb.icTime) return 'IC'
    return ''
  }
  const st = s => s === 'ic' ? 'IC' : s === 'gb' ? 'GB' : s === 'completed' ? '\u5DF2\u5B8C\u6210' : ''

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',justifyContent:'center',alignItems:'flex-start',padding:'40px 20px',backdropFilter:'blur(6px)',overflowY:'auto'}} onClick={onClose}>
      <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',width:'100%',maxWidth:720,boxShadow:'0 20px 60px rgba(0,0,0,0.3)',borderTop:'4px solid var(--text-primary)'}} onClick={e=>e.stopPropagation()}>
        
        {/* Header */}
        <div style={{position:'sticky',top:0,background:'var(--bg-primary)',zIndex:1,padding:'16px 24px',borderBottom:'1px solid var(--border-base)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <h2 style={{fontSize:18,fontWeight:700}}>{studio}</h2>
            <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{'\u5171 ' + list.length + ' \u628A\u952E\u76D8'}</p>
          </div>
          <button onClick={onClose} style={{background:'none',border:'1px solid var(--border-base)',fontSize:18,cursor:'pointer',padding:'4px 12px',color:'var(--text-muted)',lineHeight:1}}>{'\u2715'}</button>
        </div>

        {/* Keyboard list */}
        <div style={{padding:'16px 24px'}}>
          {list.map(k => {
            const img = getImg(k)
            const tl = timeLabel(k)
            return (
              <div key={k.id} style={{display:'flex',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border-base)',alignItems:'center'}}>
                {/* Thumbnail */}
                <div style={{width:72,height:54,background:'var(--bg-secondary)',flexShrink:0,overflow:'hidden'}}>
                  {img ? <img src={img} alt={k.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'} /> : null}
                </div>
                {/* Info */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:1}}>{k.name}</div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap',fontSize:10}}>
                    {k.layout && <span style={{background:'var(--bg-secondary)',padding:'1px 6px',color:'var(--text-secondary)'}}>{k.layout}</span>}
                    {st(k.status) && <span style={{background:k.status==='gb'?'#18181b':'var(--accent-dim)',color:k.status==='gb'?'#fff':'#18181b',padding:'1px 6px'}}>{st(k.status)}</span>}
                    {tl && <span style={{background:'var(--bg-secondary)',padding:'1px 6px',color:'var(--text-secondary)',fontWeight:600}}>{'[' + tl + ']'}</span>}
                  </div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginTop:3}}>
                    {k.sortTime && <span>{k.sortTime}</span>}
                    {(k.icTime && k.icTime !== k.sortTime) ? ' IC:' + k.icTime : ''}
                    {(k.gbTime && k.gbTime !== k.sortTime) ? ' GB:' + k.gbTime : ''}
                  </div>
                </div>
                {/* Links */}
                <div style={{display:'flex',gap:8,fontSize:10,flexShrink:0}}>
                  {k.icLink && <a href={k.icLink} target="_blank" rel="noopener" style={{color:'var(--text-secondary)',textDecoration:'underline'}} onClick={e=>e.stopPropagation()}>IC</a>}
                  {k.gbLink && <a href={k.gbLink} target="_blank" rel="noopener" style={{color:'var(--text-secondary)',textDecoration:'underline'}} onClick={e=>e.stopPropagation()}>GB</a>}
                </div>
              </div>
            )
          })}
          {list.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>{'\u6682\u65E0\u6570\u636E'}</div>}
        </div>
      </div>
    </div>
  )
}
