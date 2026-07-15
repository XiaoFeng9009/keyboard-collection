export default function Pagination({ current, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const btn = (active) => ({
    padding: active ? '4px 12px' : '4px 12px',
    fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: active ? 600 : 400,
    background: active ? 'var(--accent)' : 'var(--bg-primary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-base)',
    transition: 'all .15s'
  })

  const pages = []
  const start = Math.max(1, current - 2)
  const end = Math.min(totalPages, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,marginTop:24,padding:'8px 0',flexWrap:'wrap'}}>
      <button disabled={current <= 1} onClick={() => onChange(current - 1)}
        style={{...btn(false), opacity: current <= 1 ? 0.4 : 1}}
        onMouseEnter={e=>{if(current>1){e.target.style.borderColor='var(--text-primary)'}}}
        onMouseLeave={e=>{e.target.style.borderColor='var(--border-base)'}}>{'\u4E0A\u4E00\u9875'}</button>
      {start > 1 && <span style={{color:'var(--text-muted)',fontSize:12,padding:'0 4px'}}>...</span>}
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)} style={btn(p === current)}
          onMouseEnter={e=>{if(p!==current)e.target.style.borderColor='var(--text-primary)'}}
          onMouseLeave={e=>{if(p!==current)e.target.style.borderColor='var(--border-base)'}}>{p}</button>
      ))}
      {end < totalPages && <span style={{color:'var(--text-muted)',fontSize:12,padding:'0 4px'}}>...</span>}
      <button disabled={current >= totalPages} onClick={() => onChange(current + 1)}
        style={{...btn(false), opacity: current >= totalPages ? 0.4 : 1}}
        onMouseEnter={e=>{if(current<totalPages){e.target.style.borderColor='var(--text-primary)'}}}
        onMouseLeave={e=>{e.target.style.borderColor='var(--border-base)'}}>{'\u4E0B\u4E00\u9875'}</button>
      <span style={{color:'var(--text-muted)',fontSize:11,marginLeft:8}}>{current}/{totalPages}</span>
    </div>
  )
}
