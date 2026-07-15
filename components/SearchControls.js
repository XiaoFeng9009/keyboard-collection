import { useState, useEffect } from 'react'

export default function SearchControls({ data, onFilter }) {
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState('')
  const [filteredCount, setFilteredCount] = useState(data.length)
  const layouts = [...new Set(data.filter(k => k.layout).map(k => k.layout))].sort()

  useEffect(() => {
    const filtered = data.filter(k => {
      if (query && !k.studio.toLowerCase().includes(query.toLowerCase())) return false
      if (layout && k.layout !== layout) return false
      return true
    })
    setFilteredCount(filtered.length)
    onFilter(filtered)
  }, [query, layout, data, onFilter])

  return (
    <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap',alignItems:'center'}}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={"\u641C\u7D22\u5DE5\u4F5C\u5BA4..."}
        style={{flex:1,minWidth:200,background:'var(--bg-primary)',border:'1px solid var(--border-base)',color:'var(--text-primary)',padding:'8px 12px',borderRadius:0,fontSize:13,boxShadow:'var(--shadow-base)'}}
      />
      <select
        value={layout}
        onChange={e => setLayout(e.target.value)}
        style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',color:'var(--text-primary)',padding:'8px 12px',fontSize:13,cursor:'pointer',boxShadow:'var(--shadow-base)'}}
      >
        <option value="">{'\u5168\u90E8\u914D\u5217'}</option>
        {layouts.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <span style={{color:'var(--text-muted)',fontSize:12}}>
        {'\u5171 ' + filteredCount + ' \u628A\u952E\u76D8'}
      </span>
    </div>
  )
}