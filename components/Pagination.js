import { useState } from 'react'

export default function Pagination({ current, total, pageSize, onChange }) {
  const [jumpInput, setJumpInput] = useState('')
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const base = {
    btn: (active) => ({
      padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
      fontWeight: active ? 600 : 400,
      background: active ? 'var(--accent)' : 'var(--bg-primary)',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: active ? '2px solid var(--text-primary)' : '1px solid var(--border-base)',
      transition: 'all .15s', borderRadius: 0, lineHeight: 1, minWidth: 32,
    }),
    nav: (disabled) => ({
      padding: '6px 10px', fontSize: 12, cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'inherit', fontWeight: 500,
      background: 'var(--bg-primary)',
      color: disabled ? 'var(--text-muted)' : 'var(--text-primary)',
      border: '1px solid var(--border-base)',
      opacity: disabled ? 0.4 : 1, transition: 'all .15s', borderRadius: 0, lineHeight: 1,
    }),
    input: {
      width: 48, padding: '6px 8px', fontSize: 12, textAlign: 'center',
      background: 'var(--bg-base)', border: '1px solid var(--border-base)',
      color: 'var(--text-primary)', fontFamily: 'inherit', borderRadius: 0,
    }
  }

  const go = (p) => {
    if (p >= 1 && p <= totalPages) onChange(p)
    setJumpInput('')
  }

  const handleJump = (e) => {
    e.preventDefault()
    const p = parseInt(jumpInput)
    if (!isNaN(p)) go(p)
  }

  const pages = []
  let start = Math.max(1, current - 2)
  let end = Math.min(totalPages, current + 2)
  if (current <= 3) { start = 1; end = Math.min(5, totalPages) }
  if (current > totalPages - 3) { start = Math.max(1, totalPages - 4); end = totalPages }
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:4,marginTop:24,padding:'8px 0',flexWrap:'wrap'}}>
      <button disabled={current <= 1} onClick={() => go(1)} style={base.nav(current <= 1)}
        onMouseEnter={e=>{if(current>1)e.target.style.borderColor='var(--text-primary)'}}
        onMouseLeave={e=>{e.target.style.borderColor='var(--border-base)'}}>{'\u00AB'}</button>
      <button disabled={current <= 1} onClick={() => go(current - 1)} style={base.nav(current <= 1)}
        onMouseEnter={e=>{if(current>1)e.target.style.borderColor='var(--text-primary)'}}
        onMouseLeave={e=>{e.target.style.borderColor='var(--border-base)'}}>{'\u2039'}</button>

      {start > 1 && <span style={{color:'var(--text-muted)',fontSize:12,padding:'0 2px'}}>...</span>}
      {pages.map(p => (
        <button key={p} onClick={() => go(p)} style={base.btn(p === current)}
          onMouseEnter={e=>{if(p!==current)e.target.style.borderColor='var(--text-primary)'}}
          onMouseLeave={e=>{if(p!==current)e.target.style.borderColor='var(--border-base)'}}>{p}</button>
      ))}
      {end < totalPages && <span style={{color:'var(--text-muted)',fontSize:12,padding:'0 2px'}}>...</span>}

      <button disabled={current >= totalPages} onClick={() => go(current + 1)} style={base.nav(current >= totalPages)}
        onMouseEnter={e=>{if(current<totalPages)e.target.style.borderColor='var(--text-primary)'}}
        onMouseLeave={e=>{e.target.style.borderColor='var(--border-base)'}}>{'\u203A'}</button>
      <button disabled={current >= totalPages} onClick={() => go(totalPages)} style={base.nav(current >= totalPages)}
        onMouseEnter={e=>{if(current<totalPages)e.target.style.borderColor='var(--text-primary)'}}
        onMouseLeave={e=>{e.target.style.borderColor='var(--border-base)'}}>{'\u00BB'}</button>

      <form onSubmit={handleJump} style={{display:'flex',alignItems:'center',gap:4,marginLeft:8}}>
        <input type="text" value={jumpInput} onChange={e=>setJumpInput(e.target.value)}
          placeholder={''+totalPages} style={base.input} />
        <button type="submit" style={{padding:'6px 10px',fontSize:12,cursor:'pointer',
          fontFamily:'inherit',fontWeight:500,background:'var(--bg-primary)',
          color:'var(--text-primary)',border:'1px solid var(--border-base)',borderRadius:0,
          lineHeight:1}} onMouseEnter={e=>e.target.style.borderColor='var(--text-primary)'}
          onMouseLeave={e=>e.target.style.borderColor='var(--border-base)'}>GO</button>
      </form>

      <span style={{color:'var(--text-muted)',fontSize:11,marginLeft:4}}>{current}/{totalPages}</span>
    </div>
  )
}
