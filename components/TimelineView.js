import { useState, useEffect, useRef } from 'react'
import useBreakpoint from '../lib/useBreakpoint'

export default function TimelineView({ keyboards }) {
  var [visibleCount, setVisibleCount] = useState(30)
  var [detailData, setDetailData] = useState(null)
  var [previewImg, setPreviewImg] = useState(null)
  var [previewClosing, setPreviewClosing] = useState(false)
  var sentinelRef = useRef(null)
  var { isMobile, isTablet, isDesktop } = useBreakpoint()

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

  useEffect(function() {
    if (!detailData) return
    var onScroll = function() { setDetailData(null) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return function() { window.removeEventListener('scroll', onScroll) }
  }, [detailData])

  var closePreview = function() {
    setPreviewClosing(true)
    setTimeout(function() { setPreviewImg(null); setPreviewClosing(false) }, 250)
  }

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

  var scrollToMonth = function(year, monthNum) {
    var prefix = year + '-' + String(monthNum).padStart(2, '0')
    var idx = sorted.findIndex(function(k) { return k.sortTime.startsWith(prefix) })
    if (idx < 0) return
    if (idx >= visibleCount) {
      setVisibleCount(Math.min(idx + 30, sorted.length))
      setTimeout(function() {
        var el = document.getElementById('month-' + year + '-' + monthNum)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } else {
      var el = document.getElementById('month-' + year + '-' + monthNum)
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

  var statusText = function(k) {
    return k.status === 'ic' ? 'IC' : k.status === 'gb' ? 'GB' : k.status === 'completed' ? '\u5DF2\u5B8C\u6210' : ''
  }

  var getLinks = function(k, field) {
    var arr = k[field + 'Links']
    if (arr && arr.length > 0) return arr
    return k[field + 'Link'] ? [k[field + 'Link']] : []
  }

  var detailImg = detailData && (detailData.images && detailData.images.length > 0 ? detailData.images[0] : detailData.image || '')
  var detailStatus = detailData ? statusText(detailData) : ''
  var icLinks = detailData ? getLinks(detailData, 'ic') : []
  var gbLinks = detailData ? getLinks(detailData, 'gb') : []

  var linkStyle = {background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600,marginRight:4}
  var infoRow = {padding:'8px 0',borderBottom:'1px solid var(--border-base)'}
  var infoLabel = {fontSize:10,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1,display:'block',marginBottom:3}

  var renderPanelContent = function() {
    if (!detailData) return null
    return (
      <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',borderRadius:8,overflow:'hidden',boxShadow:'var(--shadow-hover)',animation:'popupIn .3s cubic-bezier(0.16,1,0.3,1)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',borderBottom:'1px solid var(--border-base)'}}>
          <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1}}>{'\u8BE6\u60C5'}</div>
          <button onClick={function(){setDetailData(null)}} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:'var(--text-muted)',lineHeight:1,padding:'2px 6px'}}>{'\u2715'}</button>
        </div>

        {detailImg && <img src={detailImg} alt={detailData.name} style={{width:'100%',maxHeight:isMobile?260:280,objectFit:'cover',display:'block',cursor:'zoom-in'}} onClick={function(){setPreviewImg(detailImg)}} onError={function(e){e.target.style.display='none'}} />}

        <div style={{padding:isMobile?'16px 18px':'22px 24px'}}>
          <h4 style={{fontSize:isMobile?20:22,fontWeight:700,marginBottom:12,color:'var(--text-primary)'}}>{detailData.name}</h4>

          {detailData.studio && <div style={infoRow}><span style={infoLabel}>{'\u5DE5\u4F5C\u5BA4/\u8BBE\u8BA1\u5E08'}</span><span style={{fontSize:12,color:'var(--text-primary)'}}>{detailData.studio}</span></div>}
          {detailData.layout && <div style={infoRow}><span style={infoLabel}>{'\u914D\u5217'}</span><span style={{fontSize:12,color:'var(--text-primary)'}}>{detailData.layout}</span></div>}
          {detailStatus && <div style={infoRow}><span style={infoLabel}>{'\u72B6\u6001'}</span><span style={{fontSize:12,color:'var(--text-primary)'}}>{detailStatus}</span></div>}

          {(detailData.icTime || icLinks.length > 0) && (
            <div style={infoRow}>
              <span style={infoLabel}>IC {'\u65F6\u95F4'}</span>
              <span style={{fontSize:12,color:'var(--text-primary)',lineHeight:1.9}}>
                {detailData.icTime || '\u2014'}
                {icLinks.map(function(l, idx) { return <span key={idx}><a href={l} target="_blank" rel="noopener" style={linkStyle}>{'\u67E5\u770B\u8BE6\u60C5' + (icLinks.length > 1 ? (idx+1) : '')}</a></span> })}
              </span>
            </div>
          )}

          {(detailData.gbTime || gbLinks.length > 0) && (
            <div style={infoRow}>
              <span style={infoLabel}>GB {'\u65F6\u95F4'}</span>
              <span style={{fontSize:12,color:'var(--text-primary)',lineHeight:1.9}}>
                {detailData.gbTime || '\u2014'}
                {gbLinks.map(function(l, idx) { return <span key={idx}><a href={l} target="_blank" rel="noopener" style={linkStyle}>{'\u67E5\u770B\u8BE6\u60C5' + (gbLinks.length > 1 ? (idx+1) : '')}</a></span> })}
              </span>
            </div>
          )}

          {detailData.sortTime && <div style={infoRow}><span style={infoLabel}>{'\u6392\u5E8F\u65F6\u95F4'}</span><span style={{fontSize:12,color:'var(--text-primary)'}}>{detailData.sortTime}</span></div>}

          {detailData.description && (
            <div style={{marginTop:12,background:'var(--bg-secondary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'10px 14px',fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>
              {'\uD83D\uDCDD'} {detailData.description}
            </div>
          )}
        </div>
      </div>
    )
  }

  var renderTopBookmarks = function() {
    return (
      <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:10,marginBottom:16,whiteSpace:'nowrap',scrollbarWidth:'thin'}}>
        {allYears.map(function(y) {
          var yearMonths = {}
          sorted.forEach(function(k) {
            if (k.sortTime.startsWith(y)) {
              var mm = parseInt(k.sortTime.slice(5, 7))
              yearMonths[mm] = true
            }
          })
          var months = Object.keys(yearMonths).sort(function(a,b){return b-a}).map(Number)
          var isLoaded = groups[y] && Object.keys(groups[y]).length > 0
          return (
            <div key={y} style={{display:'flex',gap:4,alignItems:'center'}}>
              <button onClick={function(e){e.stopPropagation();scrollToYear(y)}}
                style={{padding:'5px 12px',border:'none',cursor:'pointer',background:isLoaded?'var(--accent)':'var(--bg-secondary)',color:isLoaded?'#18181b':'var(--text-primary)',fontSize:13,fontWeight:700,fontFamily:'inherit',borderRadius:4,whiteSpace:'nowrap',transition:'all .15s'}}>
                {y}
              </button>
              {months.map(function(m) {
                var isMonthLoaded = groups[y] && groups[y][m + '\u6708']
                return (
                  <button key={m} onClick={function(e){e.stopPropagation();scrollToMonth(y, m)}}
                    style={{padding:'5px 10px',border:'none',cursor:'pointer',background:isMonthLoaded?'var(--bg-secondary)':'none',color:isMonthLoaded?'var(--text-secondary)':'var(--text-muted)',fontSize:12,fontWeight:400,fontFamily:'inherit',borderRadius:4,whiteSpace:'nowrap',transition:'all .15s'}}>
                    {m + '\u6708'}
                  </button>
                )
              })}
              <div style={{width:1,height:22,background:'var(--border-base)',margin:'0 4px',flexShrink:0}} />
            </div>
          )
        })}
      </div>
    )
  }

  var renderSideBookmarks = function() {
    return (
      <div style={{position:'sticky',top:92,width:110,flexShrink:0,maxHeight:'calc(100vh - 100px)',overflowY:'auto',paddingRight:12,borderRight:'1px solid var(--border-base)',alignSelf:'flex-start'}}>
        <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>{'\u5E74\u4EFD / \u6708\u4EFD'}</div>
        {allYears.map(function(y) {
          var yearMonths = {}
          sorted.forEach(function(k) {
            if (k.sortTime.startsWith(y)) {
              var mm = parseInt(k.sortTime.slice(5, 7))
              yearMonths[mm] = true
            }
          })
          var months = Object.keys(yearMonths).sort(function(a,b){return b-a}).map(Number)
          var isLoaded = groups[y] && Object.keys(groups[y]).length > 0
          return (
            <div key={y} style={{marginBottom:6}}>
              <button onClick={function(e){e.stopPropagation();scrollToYear(y)}}
                style={{display:'block',width:'100%',textAlign:'left',padding:'6px 8px',border:'none',cursor:'pointer',background:isLoaded?'var(--bg-secondary)':'none',fontSize:13,fontWeight:700,color:isLoaded?'var(--text-primary)':'var(--text-secondary)',fontFamily:'inherit',borderRadius:4,transition:'all .15s'}}>
                {y}
              </button>
              {months.map(function(m) {
                var isMonthLoaded = groups[y] && groups[y][m + '\u6708']
                return (
                  <button key={m} onClick={function(e){e.stopPropagation();scrollToMonth(y, m)}}
                    style={{display:'block',width:'100%',textAlign:'left',padding:'3px 8px 3px 22px',border:'none',cursor:'pointer',background:'none',fontSize:11,fontWeight:400,color:isMonthLoaded?'var(--text-secondary)':'var(--text-muted)',fontFamily:'inherit',borderRadius:4,transition:'all .15s'}}>
                    {m + '\u6708'}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  var renderTimeline = function(cardMaxWidth) {
    return (
      <div style={{flex:1,minWidth:0,position:'relative',paddingLeft:isMobile?20:36}}>
        <div style={{position:'absolute',left:isMobile?8:12,top:0,bottom:0,width:2,background:'var(--border-base)'}} />
        {Object.keys(groups).sort(function(a,b){return b-a}).map(function(y) {
          return (
            <div key={y} id={'year-' + y} style={{scrollMarginTop:80}}>
              <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:8,marginTop: y !== Object.keys(groups).sort(function(a,b){return b-a})[0] ? 32 : 0}}>
                <div style={{fontSize:22,fontWeight:800,color:'var(--text-primary)',letterSpacing:1}}>{y}</div>
                <div style={{flex:1,height:2,background:'var(--accent)'}} />
              </div>

              {Object.keys(groups[y]).sort(function(a,b){return parseInt(b)-parseInt(a)}).map(function(m) {
                var mNum = m.replace('\u6708', '')
                return (
                  <div key={m} id={'month-' + y + '-' + mNum} style={{scrollMarginTop:80,marginBottom:16}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                      <div style={{width:8,height:8,background:'var(--accent)',borderRadius:0,flexShrink:0}} />
                      <div style={{fontSize:14,fontWeight:700,color:'var(--text-primary)',letterSpacing:0.5}}>{m}</div>
                      <div style={{flex:1,height:1,background:'var(--border-base)'}} />
                    </div>

                    {groups[y][m].map(function(k, i) {
                      var timeType = k.sortTime === k.gbTime && k.gbTime ? 'GB' : k.sortTime === k.icTime && k.icTime ? 'IC' : ''
                      var st = statusText(k)
                      return (
                        <div key={i} style={{position:'relative',marginBottom:20,maxWidth:cardMaxWidth}}>
                          <div style={{position:'absolute',left:isMobile?-16:-24,top:4,width:10,height:10,background:'var(--accent)',border:'2px solid var(--text-primary)'}} />
                          <div onClick={function(e){e.stopPropagation();setDetailData(k)}}
                            onMouseEnter={function(e){e.currentTarget.style.borderColor='var(--accent)';e.currentTarget.style.boxShadow='var(--shadow-hover)'}}
                            onMouseLeave={function(e){e.currentTarget.style.borderColor='var(--border-base)';e.currentTarget.style.boxShadow='var(--shadow-base)'}}
                            style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',padding:isMobile?'12px 14px':'16px 18px',boxShadow:'var(--shadow-base)',borderLeft:'3px solid var(--text-primary)',cursor:'pointer',transition:'all .2s ease'}}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:isMobile?10:16}}>
                              <div style={{minWidth:0}}>
                                <h4 style={{fontSize:isMobile?16:18,fontWeight:700,marginBottom:4,color:'var(--text-primary)'}}>{k.name}</h4>
                                <p style={{fontSize:11,color:'var(--text-muted)',marginTop:6}}>
                                  {timeType ? <span style={{background:'var(--bg-secondary)',padding:'1px 4px',fontWeight:600}}>{timeType}</span> : null}
                                  {' ' + k.sortTime}
                                  {(k.icTime && k.icTime !== k.sortTime) ? ' \u00B7 IC: ' + k.icTime : ''}
                                  {(k.gbTime && k.gbTime !== k.sortTime) ? ' \u00B7 GB: ' + k.gbTime : ''}
                                </p>
                              </div>
                              <div style={{flexShrink:0,textAlign:'right',fontSize:isMobile?10:11,color:'var(--text-secondary)',lineHeight:1.9}}>
                                {k.studio && <div>{'\u5DE5\u4F5C\u5BA4/\u8BBE\u8BA1\u5E08\uFF1A'}{k.studio}</div>}
                                {k.layout && <div>{'\u914D\u5217\uFF1A'}{k.layout}</div>}
                                {st && <div>{'\u72B6\u6001\uFF1A'}{st}</div>}
                              </div>
                            </div>
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

        {visibleCount < sorted.length && <div ref={sentinelRef} style={{height:1}} />}
        {visibleCount >= sorted.length && (
          <div style={{textAlign:'center',padding:'24px',color:'var(--text-muted)',fontSize:11}}>
            {'\u2014 \u5DF2\u5168\u90E8\u52A0\u8F7D \u2014'}
          </div>
        )}
      </div>
    )
  }

  var panelPlaceholder = function() {
    return (
      <div style={{textAlign:'center',padding:'40px 20px',color:'var(--text-muted)',fontSize:12,border:'1px dashed var(--border-base)',borderRadius:8}}>
        {'\u70B9\u51FB\u65F6\u95F4\u7EBF\u5361\u7247\u67E5\u770B\u8BE6\u60C5'}
      </div>
    )
  }

  var renderRightPanel = function(width) {
    return (
      <div style={{width:width,flexShrink:0,alignSelf:'flex-start',position:'sticky',top:92,maxHeight:'calc(100vh - 100px)',overflowY:'auto'}} onClick={function(e){e.stopPropagation()}}>
        {detailData ? renderPanelContent() : panelPlaceholder()}
      </div>
    )
  }

  return (
    <>
      {previewImg && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.3)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20,animation:(previewClosing?'previewOut .25s ease':'previewIn .25s ease')}} onClick={closePreview}>
          <img src={previewImg} style={{maxWidth:'95%',maxHeight:'95%',objectFit:'contain'}} />
        </div>
      )}

      {isMobile && detailData && (
        <div style={{position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(3px)',display:'flex',alignItems:'flex-end',animation:'overlayIn .25s ease'}} onClick={function(){setDetailData(null)}}>
          <div style={{background:'var(--bg-primary)',width:'100%',maxHeight:'88vh',overflowY:'auto',borderRadius:'16px 16px 0 0',animation:'slideUp .3s cubic-bezier(0.16,1,0.3,1)'}} onClick={function(e){e.stopPropagation()}}>
            {renderPanelContent()}
          </div>
        </div>
      )}

      {isMobile ? (
        <div onClick={function(){setDetailData(null)}}>
          {renderTopBookmarks()}
          {renderTimeline(undefined)}
        </div>
      ) : isTablet ? (
        <div style={{display:'flex',gap:20}} onClick={function(){setDetailData(null)}}>
          <div style={{flex:1,minWidth:0}}>
            {renderTopBookmarks()}
            {renderTimeline(undefined)}
          </div>
          {renderRightPanel(320)}
        </div>
      ) : (
        <div style={{display:'flex',gap:24}} onClick={function(){setDetailData(null)}}>
          {renderSideBookmarks()}
          {renderTimeline(660)}
          {renderRightPanel(430)}
        </div>
      )}
    </>
  )
}
