import { useState, useEffect, useRef } from 'react'

export default function TimelineView({ keyboards }) {
  var [visibleCount, setVisibleCount] = useState(30)
  var sentinelRef = useRef(null)

  var sorted = [...keyboards].filter(function(k) { return k.sortTime })
    .sort(function(a, b) { return b.sortTime.localeCompare(a.sortTime) })

  var allYears = [...new Set(sorted.map(function(k) { return k.sortTime.slice(0, 4) }))]
    .sort(function(a, b) { return b - a })

  useEffect(function() {
    setVisibleCount(30)
  }, [keyboards])

  useEffect(function() {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        setVisibleCount(function(prev) { return Math.min(prev + 30, sorted.length) })
      }
    }, { rootMargin: '300px' })
    var el = sentinelRef.current
    if (el) observer.observe(el)
    return function() { observer.disconnect() }
  }, [sorted.length])

  var scrollToYear = function(year) {
    var idx = sorted.findIndex(function(k) { return k.sortTime.startsWith(year) })
    if (idx < 0) return
    if (idx >= visibleCount) {
      setVisibleCount(Math.min(idx + 30, sorted.length))
      setTimeout(function() {
        var el = document.getElementById('year-' + year)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } else {
      var el = document.getElementById('year-' + year)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!sorted.length) {
    return <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
      <h3 style={{fontSize:16,marginBottom:8,color:'var(--text-primary)'}}>{'\u6682\u65E0\u65F6\u95F4\u7EBF\u6570\u636E'}</h3>
    </div>
  }

  var groupData = sorted.slice(0, visibleCount)
  var groups = {}
  groupData.forEach(function(k) {
    var y = k.sortTime.slice(0, 4)
    var m = parseInt(k.sortTime.slice(5, 7)) + '\u6708'
    if (!groups[y]) groups[y] = {}
    if (!groups[y][m]) groups[y][m] = []
    groups[y][m].push(k)
  })

  return (
    <div style={{display:'flex', gap: 24}}>
      {/* Bookmark sidebar */}
      <div style={{position:'sticky',top:92,width:90,flexShrink:0,maxHeight:'calc(100vh - 100px)',overflowY:'auto',paddingRight:12,borderRight:'1px solid var(--border-base)',alignSelf:'flex-start'}}>
        <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>{'\u5E74\u4EFD'}</div>
        {allYears.map(function(y) {
          var isLoaded = groups[y] && Object.keys(groups[y]).length > 0
          return (
            <button key={y} onClick={function(){scrollToYear(y)}}
              style={{display:'block',width:'100%',textAlign:'left',padding:'6px 8px',border:'none',cursor:'pointer',background:isLoaded?'var(--bg-secondary)':'none',fontSize:12,fontWeight:isLoaded?600:400,color:isLoaded?'var(--text-primary)':'var(--text-secondary)',fontFamily:'inherit',borderRadius:4,transition:'all .15s',marginBottom:2}}>
              {y}
            </button>
          )
        })}
      </div>

      {/* Timeline content */}
      <div style={{flex:1,minWidth:0,position:'relative',paddingLeft:36}}>
        <div style={{position:'absolute',left:12,top:0,bottom:0,width:2,background:'var(--border-base)'}} />
        {Object.keys(groups).sort(function(a,b){return b-a}).map(function(y) {
          return (
            <div key={y} id={'year-' + y} style={{scrollMarginTop:80}}>
              {/* Year heading - more prominent */}
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:8,marginTop: y !== Object.keys(groups).sort(function(a,b){return b-a})[0] ? 32 : 0}}>
                <div style={{fontSize:22,fontWeight:800,color:'var(--text-primary)',letterSpacing:1}}>{y}</div>
                <div style={{flex:1,height:2,background:'var(--accent)'}} />
              </div>

              {Object.keys(groups[y]).sort(function(a,b){return parseInt(b)-parseInt(a)}).map(function(m) {
                return (
                  <div key={m} style={{marginBottom:16}}>
                    {/* Month heading - more prominent */}
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                      <div style={{width:8,height:8,background:'var(--accent)',borderRadius:0,flexShrink:0}} />
                      <div style={{fontSize:14,fontWeight:700,color:'var(--text-primary)',letterSpacing:0.5}}>{m}</div>
                      <div style={{flex:1,height:1,background:'var(--border-base)'}} />
                    </div>

                    {groups[y][m].map(function(k, i) {
                      var timeType = k.sortTime === k.gbTime && k.gbTime ? 'GB' : k.sortTime === k.icTime && k.icTime ? 'IC' : ''
                      return (
                        <div key={i} style={{position:'relative',marginBottom:20}}>
                          <div style={{position:'absolute',left:-24,top:4,width:10,height:10,background:'var(--accent)',border:'2px solid var(--text-primary)'}} />
                          <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',padding:'12px 16px',boxShadow:'var(--shadow-base)',borderLeft:'3px solid var(--text-primary)'}}>
                            <h4 style={{fontSize:13,fontWeight:600}}>{k.name}</h4>
                            <p style={{fontSize:11,color:'var(--text-secondary)',marginTop:2}}>
                              {k.studio}{k.layout ? ' \u00B7 ' + k.layout : ''}{k.status==='ic'?' \u00B7 IC':k.status==='gb'?' \u00B7 GB':''}
                            </p>
                            <p style={{fontSize:10,color:'var(--text-muted)',marginTop:4}}>
                              {timeType ? <span style={{background:'var(--bg-secondary)',padding:'1px 4px',fontWeight:600}}>{timeType}</span> : null}
                              {' ' + k.sortTime}
                              {(k.icTime && k.icTime !== k.sortTime) ? ' \u00B7 IC: ' + k.icTime : ''}
                              {(k.gbTime && k.gbTime !== k.sortTime) ? ' \u00B7 GB: ' + k.gbTime : ''}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Sentinel */}
        {visibleCount < sorted.length && <div ref={sentinelRef} style={{height:1}} />}
        {visibleCount >= sorted.length && (
          <div style={{textAlign:'center',padding:'24px',color:'var(--text-muted)',fontSize:11}}>
            {'\u2014 \u5DF2\u5168\u90E8\u52A0\u8F7D \u2014'}
          </div>
        )}
      </div>
    </div>
  )
}
