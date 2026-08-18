import { useState, useEffect } from 'react'
import Icon from './Icon'

export default function SearchControls({ data, onFilter }) {
  const [inputValue, setInputValue] = useState('')
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState('')
  const [status, setStatus] = useState('')
  const [filteredCount, setFilteredCount] = useState(data.length)
  var layoutOrder=["30%","40%","40%+Macro","40%+Pad","45%","50%","60%","60%+Macro","60%+Pad","AT","65%","65%+Macro","65%+Pad","65%AT","70%FRL_TKL","70%FRL_TKL+Macro","70%FRL_TKL+Pad","75%","80%TKL","80%TKL+Macro","1800","1800FRL","90%","98%","100%Full","100%Full_FRL","Pad","Alice","Split","Hub","Function","其他"];
  var layouts=layoutOrder.filter(function(o){return data.some(function(k){return k.layout===o})})

  function getAbbr(text) {
    return text.split(/\s+/).map(function(w) { return w.charAt(0) }).join('').toLowerCase()
  }

  function doSearch() {
    setQuery(inputValue)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') doSearch()
  }

  function clearSearch() {
    setInputValue('')
    setQuery('')
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
      if (status && k.status !== status) return false
      return true
    })
    setFilteredCount(filtered.length)
    onFilter(filtered)
  }, [query, layout, status, data, onFilter])

  return (
    <div className="search-controls">
      <div className="search-field">
        <Icon name="search" size={14} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}} />
        <input type="text" value={inputValue} onChange={function(e){setInputValue(e.target.value)}} onKeyDown={handleKeyDown}
          placeholder={'\u641C\u7D22\u952E\u76D8\u540D\u79F0\u3001\u5DE5\u4F5C\u5BA4...'}
          className="input-control" style={{paddingLeft:40}} />
        {inputValue && <button onClick={clearSearch} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:14,color:'var(--text-muted)',padding:'4px 6px',lineHeight:1}}>{'\u2715'}</button>}
      </div>
      <button onClick={doSearch} className="btn" style={{flexShrink:0}}>
        {'\u641C\u7D22'}
      </button>
      <select value={layout} onChange={function(e){setLayout(e.target.value)}} className="select-control search-select">
        <option value="">{'\u5168\u90E8\u914D\u5217'}</option>
        {layouts.map(function(l) { return <option key={l} value={l}>{l}</option> })}
      </select>
      <select value={status} onChange={function(e){setStatus(e.target.value)}} className="select-control search-select">
        <option value="">{'\u5168\u90E8\u72B6\u6001'}</option>
        <option value="ic">IC</option>
        <option value="gb">GB</option>
      </select>
      <span className="search-count">
        {'\u5171 ' + filteredCount + ' \u628A\u952E\u76D8'}
      </span>
    </div>
  )
}
