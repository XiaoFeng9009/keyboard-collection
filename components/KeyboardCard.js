import { useState } from 'react'
import { thumbFor } from '../lib/imageUrl'
function getImg(kb) {
  if (kb.images && kb.images.length > 0) return kb.images[0]
  return kb.image || ''
}

export default function KeyboardCard({ kb, onClick }) {
  var sc = {
    ic: { label: 'IC' },
    gb: { label: 'GB' },
    completed: { label: '\u5DF2\u5B8C\u6210' }
  }[kb.status]
  var img = getImg(kb)
  var [hovered, setHovered] = useState(false)
  var [imgFallback, setImgFallback] = useState(false)
  var t = hovered ? 1 : 0
  var handleEnter = function() { setHovered(true) }
  var handleLeave = function() { setHovered(false) }
  var handleClick = function() { onClick && onClick(kb) }
  var shownImg = imgFallback ? img : thumbFor(img)
  var displayTime = (kb.gbTime || kb.icTime || '').replace(/\//g, '-')

  var s = {
    studio: { fontSize:'0.9rem', fontWeight:600, color:'var(--text-secondary)', marginTop:-2, marginBottom:6, lineHeight:'1.5', letterSpacing:0.3 }
  }

  return (
        <div className="card hover-lift" style={{cursor:'pointer'}}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      >
      
      {/* Yellow accent bar - sweeps from left on hover */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:3,zIndex:2,background:'var(--accent)',transform:'scaleX(' + t + ')',transformOrigin:'left',transition:'transform .3s ease'}} />
      
      <div className="kb-card-media">
        <div className="kb-card-zoom">
          <div className="kb-card-img">
            {img ? <img src={shownImg} alt={kb.name} loading="lazy" decoding="async" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}
              onLoad={function(e){if(!imgFallback && e.target.naturalWidth === 0){setImgFallback(true)}}}
              onError={function(e){if(!imgFallback){setImgFallback(true);return}e.target.style.display='none';if(e.target.nextSibling)e.target.nextSibling.style.display='flex'}} /> : null}
            <div style={{display:img?'none':'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--text-muted)',fontSize:'0.75rem',position:'relative',zIndex:0}}>{'\u6682\u65E0\u56FE\u7247'}</div>
          </div>
        </div>
        <div className="kb-card-gradient" />
        {displayTime && <div className="kb-card-time">{displayTime}</div>}
      </div>
      <div className="kb-card-title">{kb.name}</div>
      <div className="kb-card-body">
        <div className="kb-card-meta">
          <div style={s.studio}>{kb.studio}</div>
          <div className="kb-card-badges">
            {kb.layout && <span className="tag">{kb.layout}</span>}
            {sc && <span className={'kb-status-pill kb-status-' + kb.status}>{sc.label}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
