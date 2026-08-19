import { useState } from 'react'

export default function Pagination({ current, total, pageSize, onChange, onPageSizeChange }) {
  const [jumpInput, setJumpInput] = useState('')
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

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
    <div className="pagination">
      <button disabled={current <= 1} onClick={() => go(1)} className="btn" style={{minHeight:0,padding:'6px 10px',fontSize:12,borderRadius:6,minWidth:32,opacity:current <= 1 ? 0.4 : 1}}>{'\u00AB'}</button>
      <button disabled={current <= 1} onClick={() => go(current - 1)} className="btn" style={{minHeight:0,padding:'6px 10px',fontSize:12,borderRadius:6,minWidth:32,opacity:current <= 1 ? 0.4 : 1}}>{'\u2039'}</button>

      {start > 1 && <span style={{color:'var(--text-muted)',fontSize:12,padding:'0 2px'}}>...</span>}
      {pages.map(p => (
        <button key={p} onClick={() => go(p)} className={'btn' + (p === current ? ' pagination-active' : '')} style={{minWidth:32,fontWeight:p === current ? 600 : 400}}>{p}</button>
      ))}
      {end < totalPages && <span style={{color:'var(--text-muted)',fontSize:12,padding:'0 2px'}}>...</span>}

      <button disabled={current >= totalPages} onClick={() => go(current + 1)} className="btn" style={{minHeight:0,padding:'6px 10px',fontSize:12,borderRadius:6,minWidth:32,opacity:current >= totalPages ? 0.4 : 1}}>{'\u203A'}</button>
      <button disabled={current >= totalPages} onClick={() => go(totalPages)} className="btn" style={{minHeight:0,padding:'6px 10px',fontSize:12,borderRadius:6,minWidth:32,opacity:current >= totalPages ? 0.4 : 1}}>{'\u00BB'}</button>

      <select value={pageSize} onChange={function(e){onPageSizeChange(parseInt(e.target.value))}}
        className="input-control" style={{width:'auto',minHeight:0,padding:'6px 8px',fontSize:12,background:'var(--bg-base)',borderRadius:6,marginLeft:8}}>
        <option value={8}>8</option>
        <option value={12}>12</option>
        <option value={16}>16</option>
      </select>
            <form onSubmit={handleJump} style={{display:'flex',alignItems:'center',gap:4,marginLeft:8}}>
        <input type="text" value={jumpInput} onChange={e=>setJumpInput(e.target.value)}
          placeholder={''+totalPages} className="input-control" style={{width:48,minHeight:0,padding:'6px 8px',fontSize:12,textAlign:'center',background:'var(--bg-base)',borderRadius:6}} />
        <button type="submit" className="btn" style={{minHeight:0,padding:'6px 10px',fontSize:12,borderRadius:6}}>GO</button>
      </form>

      <span style={{color:'var(--text-muted)',fontSize:11,marginLeft:4}}>{current}/{totalPages}</span>
    </div>
  )
}
