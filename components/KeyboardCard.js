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
  const dateStr = kb.icTime ? new Date(kb.icTime + 'T00:00:00').toLocaleDateString('zh-CN', {year:'numeric',month:'2-digit',day:'2-digit'}) : ''
  const hasLinks = kb.icLink || kb.gbLink
  const multi = kb.images && kb.images.length > 1

  const s = {
    card: { background:'var(--bg-primary)', border:'1px solid var(--border-base)', overflow:'hidden', transition:'all .25s', boxShadow:'var(--shadow-base)', borderTop:'3px solid var(--text-primary)', cursor:'pointer' },
    imgWrap: { width:'100%', aspectRatio:'16/10', background:'var(--bg-secondary)', borderBottom:'1px solid var(--border-base)', position:'relative', overflow:'hidden' },
    body: { padding:16 },
    name: { fontSize:15, fontWeight:600, marginBottom:2 },
    studio: { fontSize:12, color:'var(--text-secondary)', marginBottom:10, letterSpacing:0.3 }
  }

  return (
    <div style={s.card}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-hover)';e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.transform='translateY(-2px)'}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-base)';e.currentTarget.style.borderColor='var(--border-base)';e.currentTarget.style.transform='translateY(0)'}}
      onClick={() => onClick && onClick(kb)}>
      <div style={s.imgWrap}>
        {img ? <img src={img} alt={kb.name} style={{width:'100%',height:'100%',objectFit:'cover'}}
          onError={e=>{e.target.style.display='none';if(e.target.nextSibling)e.target.nextSibling.style.display='flex'}} /> : null}
        <div style={{display:img?'none':'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-muted)',fontSize:12}}>{kb.name}</div>
        {multi && <div style={{position:'absolute',top:8,right:8,background:'var(--bg-primary)',padding:'2px 6px',fontSize:10,border:'1px solid var(--border-base)'}}>{'+'+(kb.images.length-1)}</div>}
      </div>
      <div style={s.body}>
        <div style={s.name}>{kb.name}</div>
        <div style={s.studio}>{kb.studio}</div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {kb.layout && <span style={{fontSize:10,padding:'2px 8px',fontWeight:600,letterSpacing:0.5,textTransform:'uppercase',background:'var(--bg-secondary)',color:'var(--text-secondary)'}}>{kb.layout}</span>}
          {sc && <span style={{fontSize:10,padding:'2px 8px',fontWeight:600,letterSpacing:0.5,textTransform:'uppercase',background:kb.status==='gb'?'#18181b':'var(--accent-dim)',color:kb.status==='gb'?'#fff':'#18181b'}}>{sc.label}</span>}
        </div>
        {dateStr && <div style={{fontSize:11,color:'var(--text-muted)',marginTop:6}}>{dateStr}</div>}
        {hasLinks && <div style={{marginTop:8,display:'flex',gap:8,fontSize:11}}>
          {kb.icLink && <a href={kb.icLink} target="_blank" rel="noopener" style={{color:'var(--text-secondary)',textDecoration:'underline',textUnderlineOffset:2}} onClick={e=>e.stopPropagation()}>IC</a>}
          {kb.gbLink && <a href={kb.gbLink} target="_blank" rel="noopener" style={{color:'var(--text-secondary)',textDecoration:'underline',textUnderlineOffset:2}} onClick={e=>e.stopPropagation()}>GB</a>}
        </div>}
      </div>
    </div>
  )
}
