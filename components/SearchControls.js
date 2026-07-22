import { useState, useEffect } from 'react'

export default function SearchControls({ data, onFilter }) {
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState('')
  const [filteredCount, setFilteredCount] = useState(data.length)
  const layouts = [...new Set(data.filter(k => k.layout).map(k => k.layout))].sort()

  function getAbbr(text) {
    return text.split(/\s+/).map(function(w) { return w.charAt(0) }).join('').toLowerCase()
  }

  useEffect(function() {
    var filtered = data.filter(function(k) {
      if (query) {
        var q = query.toLowerCase()
        var text = (k.name + ' ' + k.studio).toLowerCase()
        var abbr = getAbbr(k.name + ' ' + k.studio)
        if (text.indexOf(q) === -1 && abbr.indexOf(q) === -1) return false
      }
      if (layout && k.layout !== layout) return false
      return true
    })
    setFilteredCount(filtered.length)
    onFilter(filtered)
  }, [query, layout, data, onFilter])

  return (
    <div style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap',alignItems:'center'}}>
      <div style={{position:'relative',flex:2,minWidth:260}}>
        <i className="fas fa-search" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',fontSize:14,pointerEvents:'none'}}></i>
        <input
          type="text"
          value={query}
          onChange={function(e){setQuery(e.target.value)}}
          placeholder={'\u641C\u7D22\u952E\u76D8\u540D\u79F0\u3001\u5DE5\u4F5C\u5BA4...'}
          style={{width:'100%',background:'var(--bg-primary)',border:'1px solid var(--border-base)',color:'var(--text-primary)',padding:'10px 14px 10px 40px',borderRadius:8,fontSize:14,boxShadow:'var(--shadow-base)',outline:'none'}}
        />
        {query && <button onClick={function(){setQuery('')}} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:14,color:'var(--text-muted)',padding:'4px 6px',lineHeight:1}}>{'\u2715'}</button>}
      </div>
      <select
        value={layout}
        onChange={function(e){setLayout(e.target.value)}}
        style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',color:'var(--text-primary)',padding:'10px 14px',fontSize:13,borderRadius:8,cursor:'pointer',boxShadow:'var(--shadow-base)',minWidth:120}}
      >
        <option value="">{'\u5168\u90E8\u914D\u5217'}</option>
        {layouts.map(function(l) { return <option key={l} value={l}>{l}</option> })}
      </select>
      <span style={{color:'var(--text-muted)',fontSize:12,whiteSpace:'nowrap'}}>
        {'\u5171 ' + filteredCount + ' \u628A\u952E\u76D8'}
      </span>
    </div>
  )
}
