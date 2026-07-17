function getImg(kb) {
  if (kb.images && kb.images.length > 0) return kb.images[0]
  return kb.image || ''
}

export default function KeyboardCard({ kb, onClick }) {
  const sc = {
    ic: { label: 'IC' },
    gb: { label: 'GB' },
    completed: { label: '\u5DF2\u5B8C\u6210' }
  }[kb.status]
  const img = getImg(kb)
  const multi = kb.images && kb.images.length > 1

  const s = {
    card: { background:'var(--bg-primary)', overflow:'hidden', transition:'all .35s ease', boxShadow:'0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04)', borderRadius:10, cursor:'pointer' },
    imgWrap: { width:'100%', aspectRatio:'16/10', background:'var(--bg-secondary)', position:'relative', overflow:'hidden' },
    body: { padding:16 },
    name: { fontSize:15, fontWeight:600, marginBottom:2 },
    studio: { fontSize:12, color:'var(--text-secondary)', marginBottom:10, letterSpacing:0.3 }
  }

  return (
    <div style={s.card}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)';e.currentTarget.style.transform='translateY(-2px) scale(1.015)'}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.04)';e.currentTarget.style.transform='translateY(0) scale(1)'}}
      onClick={() => onClick && onClick(kb)}>
      <div style={s.imgWrap}>
        {img ? <img src={img} alt={kb.name} style={{width:'100%',height:'100%',objectFit:'cover'}}
          onError={e=>{e.target.style.display='none';if(e.target.nextSibling)e.target.nextSibling.style.display='flex'}} /> : null}
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
