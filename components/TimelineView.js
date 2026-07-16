export default function TimelineView({ keyboards }) {
  const sorted = [...keyboards].filter(k => k.sortTime).sort((a,b) => b.sortTime.localeCompare(a.sortTime))
  if (!sorted.length) {
    return <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
      <h3 style={{fontSize:16,marginBottom:8,color:'var(--text-primary)'}}>{'\u6682\u65E0\u65F6\u95F4\u7EBF\u6570\u636E'}</h3>
    </div>
  }
  const groups = {}
  sorted.forEach(k => {
    const y = k.sortTime.slice(0,4)
    const m = parseInt(k.sortTime.slice(5,7)) + '\u6708'
    if (!groups[y]) groups[y] = {}
    if (!groups[y][m]) groups[y][m] = []
    groups[y][m].push(k)
  })
  return (
    <div style={{position:'relative',paddingLeft:36}}>
      <div style={{position:'absolute',left:12,top:0,bottom:0,width:2,background:'var(--border-base)'}} />
      {Object.keys(groups).sort((a,b)=>b-a).map(y => (
        <div key={y}>
          <div style={{fontSize:16,fontWeight:700,borderBottom:'1px solid var(--accent)',display:'inline-block',marginBottom:4}}>{y}</div>
          {Object.keys(groups[y]).sort((a,b)=>parseInt(b)-parseInt(a)).map(m => (
            <div key={m}>
              <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:8,textTransform:'uppercase',letterSpacing:1}}>{m}</div>
              {groups[y][m].map((k,i) => {
                const timeType = k.sortTime === k.gbTime && k.gbTime ? 'GB' : k.sortTime === k.icTime && k.icTime ? 'IC' : ''
                return (
                  <div key={i} style={{position:'relative',marginBottom:24}}>
                    <div style={{position:'absolute',left:-26,top:4,width:10,height:10,background:'var(--accent)',border:'2px solid var(--text-primary)'}} />
                    <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',padding:'12px 16px',
                      boxShadow:'var(--shadow-base)',borderLeft:'3px solid var(--text-primary)'}}>
                      <h4 style={{fontSize:13,fontWeight:600}}>{k.name}</h4>
                      <p style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>
                        {k.studio}{k.layout ? ' \u00B7 ' + k.layout : ''}{k.status==='ic'?' \u00B7 IC':k.status==='gb'?' \u00B7 GB':''}
                      </p>
                      <p style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>
                        {timeType && <span style={{background:'var(--bg-secondary)',padding:'1px 4px',fontWeight:600}}>{timeType}</span>}
                        {' ' + k.sortTime}
                        {(k.icTime && k.icTime !== k.sortTime) ? ' \u00B7 IC: ' + k.icTime : ''}
                        {(k.gbTime && k.gbTime !== k.sortTime) ? ' \u00B7 GB: ' + k.gbTime : ''}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
