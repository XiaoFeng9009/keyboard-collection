import { useState, useEffect, useRef } from 'react'

export default function StudioDetail({ studio, keyboards, onClose }) {
  const [fullscreenImg, setFullscreenImg] = useState(null)
  const [fullscreenClosing, setFullscreenClosing] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRefs = useRef([])
  const list = [...keyboards].filter(k => k.studio === studio)
    .sort((a, b) => (b.sortTime || '').localeCompare(a.sortTime || ''))

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.idx)
          if (!isNaN(idx)) setActiveIdx(idx)
        }
      })
    }, { rootMargin: '-80px 0px -60% 0px' })
    sectionRefs.current.forEach(ref => { if (ref) observer.observe(ref) })
    return () => observer.disconnect()
  }, [list.length])

  const closeFullscreen = () => {
    setFullscreenClosing(true)
    setTimeout(() => { setFullscreenImg(null); setFullscreenClosing(false) }, 250)
  }

  const getImg = (kb) => {
    if (kb.images && kb.images.length > 0) return kb.images[0]
    return kb.image || ''
  }

  const scrollTo = (idx) => {
    const el = sectionRefs.current[idx]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {fullscreenImg && (
        <div style={{position:'fixed',inset:0,zIndex:500,background:'rgba(0,0,0,0.3)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'zoom-out',padding:20,animation:(fullscreenClosing?'previewOut .25s ease':'previewIn .25s ease')}} onClick={closeFullscreen}>
          <img src={fullscreenImg} style={{maxWidth:'95%',maxHeight:'95%',objectFit:'contain'}} />
        </div>
      )}

      <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',zIndex:300,display:'flex',justifyContent:'center',alignItems:'center',backdropFilter:'blur(6px)',padding:'60px 20px'}} onClick={onClose}>

        {/* Outer: borderRadius + overflow hidden clips scrollbar at corners */}
        <div style={{background:'var(--bg-primary)',borderRadius:12,overflow:'hidden',width:'100%',maxWidth:860,boxShadow:'0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',animation:'popupIn .35s cubic-bezier(0.16,1,0.3,1)'}} onClick={e=>e.stopPropagation()}>

          {/* Inner: scrollable */}
          <div style={{overflowY:'auto',maxHeight:'75vh'}}>

            {/* Header */}
            <div style={{position:'sticky',top:0,background:'var(--bg-primary)',zIndex:2,padding:'16px 24px',borderBottom:'1px solid var(--border-base)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <h2 style={{fontSize:18,fontWeight:700}}>{studio}</h2>
                <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>{'共 ' + list.length + ' 把键盘'}</p>
              </div>
              <button onClick={onClose} style={{background:'none',border:'1px solid var(--border-base)',borderRadius:6,fontSize:18,cursor:'pointer',padding:'4px 12px',color:'var(--text-muted)',lineHeight:1}}>{'\u2715'}</button>
            </div>

            {/* Content with TOC */}
            <div style={{display:'flex', padding:'40px 44px', gap:0}}>

              {/* TOC sidebar */}
              <div style={{width:150,flexShrink:0,position:'sticky',top:80,alignSelf:'flex-start',maxHeight:'calc(70vh - 160px)',overflowY:'auto',borderRight:'1px solid var(--border-base)',paddingRight:16,marginRight:32}}>
                <div style={{fontSize:11,fontWeight:600,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>{'目录'}</div>
                {list.map((k, idx) => (
                  <button key={k.id} onClick={() => scrollTo(idx)}
                    style={{
                      display:'block',width:'100%',textAlign:'left',
                      background:'none',border:'none',padding:'4px 6px',
                      fontSize:12,fontWeight:activeIdx===idx?600:400,
                      color:activeIdx===idx?'var(--accent)':'var(--text-secondary)',
                      cursor:'pointer',fontFamily:'inherit',
                      borderLeft:activeIdx===idx?'2px solid var(--accent)':'2px solid transparent',
                      whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
                      transition:'all .15s'
                    }}
                    onMouseEnter={e=>{e.target.style.color='var(--text-primary)'}}
                    onMouseLeave={e=>{e.target.style.color=activeIdx===idx?'var(--accent)':'var(--text-secondary)'}}>
                    {k.name}
                  </button>
                ))}
              </div>

              {/* Main content */}
              <div style={{flex:1,minWidth:0}}>
                {list.map((k, idx) => {
                  const img = getImg(k)
                  return (
                    <div key={k.id} ref={el => sectionRefs.current[idx]=el} data-idx={idx}
                      style={{marginBottom: idx < list.length - 1 ? 36 : 0}}>

                      <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'var(--text-primary)',paddingBottom:6}}>{k.name}</h3>

                      {img && (
                        <img src={img} alt={k.name}
                          style={{width:'100%',height:280,objectFit:'cover',display:'block',margin:'0 auto 12px',cursor:'zoom-in',background:'var(--bg-secondary)',borderRadius:8}}
                          onClick={() => setFullscreenImg(img)}
                          onError={e=>e.target.style.display='none'} />
                      )}

                      <p style={{fontSize:14,fontWeight:600,marginBottom:12,color:'var(--text-primary)'}}>{k.name}</p>

                      <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                        <strong style={{color:'var(--text-primary)'}}>{'IC\u9636\u6BB5'}</strong>: {k.icTime || '\u2014'}
                        {k.icLink && <> | <a href={k.icLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a></>}
                      </p>

                      <p style={{fontSize:13,marginBottom:4,lineHeight:1.6,color:'var(--text-secondary)'}}>
                        <strong style={{color:'var(--text-primary)'}}>{'GB\u9636\u6BB5'}</strong>: {k.gbTime || '\u2014'}
                        {k.gbLink && <> | <a href={k.gbLink} target="_blank" rel="noopener" style={{background:'var(--accent)',color:'#18181b',padding:'0 5px',borderRadius:4,textDecoration:'none',fontWeight:600}}>{'查看详情'}</a></>}
                      </p>

                      {k.description && (
                        <div style={{background:'var(--bg-secondary)',border:'1px solid var(--border-base)',borderRadius:8,padding:'12px 16px',margin:'12px 0',fontSize:12,color:'var(--text-secondary)',lineHeight:1.6}}>
                          {'\uD83D\uDCDD'} {k.description}
                        </div>
                      )}

                      {idx < list.length - 1 && <hr style={{border:'none',borderTop:'1px solid var(--border-base)',margin:'36px 0'}} />}
                    </div>
                  )
                })}
                {list.length === 0 && <div style={{textAlign:'center',padding:'40px',color:'var(--text-muted)'}}>{'暂无数据'}</div>}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
