
export default function TimelineView({ keyboards }) {
  const sorted = [...keyboards].filter(k => k.icTime).sort((a,b) => b.icTime.localeCompare(a.icTime))
  if (!sorted.length) {
    return <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
      <h3 style={{fontSize:16,marginBottom:8,color:'var(--text-primary)'}}>暂无时间线数据</h3>
    </div>
  }
  const groups = {}
  sorted.forEach(k => {
    const y = k.icTime.slice(0,4), m = parseInt(k.icTime.slice(5,7)) + '月'
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
              {groups[y][m].map((k,i) => (
                <div key={i} style={{position:'relative',marginBottom:24}}>
                  <div style={{position:'absolute',left:-26,top:4,width:10,height:10,background:'var(--accent)',border:'2px solid var(--text-primary)'}} />
                  <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',padding:'12px 16px',
                    boxShadow:'var(--shadow-base)',borderLeft:'3px solid var(--text-primary)'}}>
                    <h4 style={{fontSize:13,fontWeight:600}}>{k.name}</h4>
                    <p style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>
                      {k.studio}{k.layout ? ' · ' + k.layout : ''}{k.status==='ic' ? ' · IC' : k.status==='gb' ? ' · GB' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
