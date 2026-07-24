import { useState } from 'react'
function getImg(kb) {
  if (kb.images && kb.images.length > 0) return kb.images[0]
  return kb.image || ''
}

export default function KeyboardCard({ kb, onClick }) {
  var sc = {
    ic: { label: 'IC' },
    gb: { label: 'GB' },
    completed: { label: '\u5DF2\u5B8C\u6210' }
  }[kb.status]
  var img = getImg(kb)
  var multi = kb.images && kb.images.length > 1
  var [hovered, setHovered] = useState(false)
  var t = hovered ? 1 : 0
  var handleEnter = function() { setHovered(true) }
  var handleLeave = function() { setHovered(false) }
  var handleClick = function() { onClick && onClick(kb) }

  var s = {
    card: { background:'var(--bg-primary)', overflow:'hidden', borderRadius:10, cursor:'pointer', position:'relative' },
    imgWrap: { width:'100%', aspectRatio:'16/12', background:'var(--bg-secondary)', position:'relative', overflow:'hidden' },
    body: { padding:'1.25rem' },
    name: { fontSize:15, fontWeight:600, marginBottom:2 },
    studio: { fontSize:12, color:'var(--text-secondary)', marginBottom:10, letterSpacing:0.3 }
  }

  return (
        <div style={s.card}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      >
      
      {/* Yellow accent bar - sweeps from left on hover */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:3,zIndex:2,background:'var(--accent)',transform:'scaleX(' + t + ')',transformOrigin:'left',transition:'transform .3s ease'}} />
      
      <div style={s.imgWrap}>
        {img ? <img src={img} alt={kb.name} style={{width:'100%',height:'100%',objectFit:'cover',transform:'scale(' + (1 + t * 0.05) + ')',transition:'transform .7s ease'}}
          onError={function(e){e.target.style.display='none';if(e.target.nextSibling)e.target.nextSibling.style.display='flex'}} /> : null}
        <div style={{display:img?'none':'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-muted)',fontSize:12}}>{kb.name}</div>
        {multi && <div style={{position:'absolute',top:8,right:8,background:'var(--bg-primary)',padding:'2px 6px',fontSize:10,borderRadius:4}}>{'+'+(kb.images.length-1)}</div>}
      </div>
      <div style={s.body}>
        <div style={s.name}>{kb.name}</div>
        <div style={s.studio}>{kb.studio}</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {kb.layout && <span style={{fontSize:10,padding:'2px 8px',fontWeight:600,letterSpacing:0.5,textTransform:'uppercase',background:'var(--bg-secondary)',color:'var(--text-secondary)',borderRadius:4}}>{kb.layout}</span>}
          {sc && <span style={{fontSize:10,padding:'2px 8px',fontWeight:600,letterSpacing:0.5,textTransform:'uppercase',borderRadius:4,background:kb.status==='gb'?'#18181b':'var(--accent-dim)',color:kb.status==='gb'?'#fff':'#18181b'}}>{sc.label}</span>}
        </div>
                 </div>
    </div>
  )
}
