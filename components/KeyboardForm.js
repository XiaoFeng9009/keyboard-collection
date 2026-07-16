import { useState, useEffect } from 'react'

export default function KeyboardForm({ show, onClose, onSave, editData }) {
  const [name, setName] = useState('')
  const [studio, setStudio] = useState('')
  const [layout, setLayout] = useState('')
  const [status, setStatus] = useState('')
  const [images, setImages] = useState([])
  const [imgInput, setImgInput] = useState('')
  const [icTime, setIcTime] = useState('')
  const [icLink, setIcLink] = useState('')
  const [gbTime, setGbTime] = useState('')
  const [gbLink, setGbLink] = useState('')
  const [desc, setDesc] = useState('')
  const [sortTime, setSortTime] = useState('')
  const [allImgs, setAllImgs] = useState([])
  const [browseOpen, setBrowseOpen] = useState(false)
  const [browseFilter, setBrowseFilter] = useState('')

  useEffect(() => {
    if (editData) {
      setName(editData.name || '')
      setStudio(editData.studio || '')
      setLayout(editData.layout || '')
      setStatus(editData.status || '')
      setImages(editData.images || (editData.image ? [editData.image] : []))
      setIcTime((editData.icTime || '').replace(/\//g, '-'))
      setIcLink(editData.icLink || '')
      setGbTime((editData.gbTime || '').replace(/\//g, '-'))
      setGbLink(editData.gbLink || '')
      setDesc(editData.description || '')
    } else {
      setName(''); setStudio(''); setLayout(''); setStatus('')
      setImages([]); setIcTime(''); setIcLink(''); setGbTime(''); setGbLink(''); setDesc('')
    }
    setImgInput('')
    if (show && allImgs.length === 0) {
      fetch('/images_index.json?_=' + Date.now()).then(r=>r.json()).then(d => setAllImgs(d.images || [])).catch(()=>{})
    }
  }, [editData, show])
  useEffect(() => { setSortTime(gbTime || icTime || '') }, [icTime, gbTime])

  const addImage = (e) => {
    if (e) e.preventDefault()
    const url = imgInput.trim()
    if (url && !images.includes(url)) setImages([...images, url])
    setImgInput('')
  }

  const removeImage = (idx) => setImages(images.filter((_, i) => i !== idx))

  const setCover = (idx) => {
    const arr = [...images]
    const [item] = arr.splice(idx, 1)
    arr.unshift(item)
    setImages(arr)
  }

  const toggleImage = (url) => {
    if (images.includes(url)) setImages(images.filter(i => i !== url))
    else setImages([...images, url])
  }

  const handleSave = (e) => {
    if (e) e.preventDefault()
    if (!name.trim() || !studio.trim()) return
    onSave({ id: editData?.id || 'kb_' + Date.now(), name: name.trim(), studio: studio.trim(), sortTime: sortTime,
      layout, status, images, icTime, icLink, gbTime, gbLink, description: desc })
  }

  if (!show) return null

  const st = { label: { display:'block', fontSize:11, color:'var(--text-muted)', marginBottom:4, textTransform:'uppercase', letterSpacing:1 },
    input: { width:'100%', padding:'8px 10px', background:'var(--bg-base)', border:'1px solid var(--border-base)', color:'var(--text-primary)', fontSize:13, borderRadius:0 },
    row: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 },
    grp: { marginBottom:14 } }

  // Group images by directory for browsing
  const groups = {}
  let filteredImgs = allImgs
  if (browseFilter) {
    const f = browseFilter.toLowerCase()
    filteredImgs = allImgs.filter(i => i.path.toLowerCase().includes(f) || i.name.toLowerCase().includes(f))
  }
  filteredImgs.forEach(i => {
    if (!groups[i.group]) groups[i.group] = []
    groups[i.group].push(i)
  })

  return (
    <div style={{display:'flex',position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,justifyContent:'center',alignItems:'center',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',padding:28,width:'90%',maxWidth:620,maxHeight:'85vh',overflowY:'auto',boxShadow:'var(--shadow-hover)',borderTop:'4px solid var(--text-primary)'}} onClick={e => e.stopPropagation()}>
        <h2 style={{marginBottom:20,fontSize:16,fontWeight:600,letterSpacing:0.5}}>{editData ? '\u7F16\u8F91\u952E\u76D8' : '\u6DFB\u52A0\u952E\u76D8'}</h2>

        <div style={st.grp}><label style={st.label}>{'\u952E\u76D8\u540D\u79F0'} *</label>
          <input value={name} onChange={e=>setName(e.target.value)} style={st.input} /></div>
        <div style={st.grp}><label style={st.label}>{'\u5DE5\u4F5C\u5BA4'} *</label>
          <input value={studio} onChange={e=>setStudio(e.target.value)} style={st.input} /></div>

        <div style={st.row}>
          <div style={st.grp}><label style={st.label}>{'\u914D\u5217'}</label>
            <select value={layout} onChange={e=>setLayout(e.target.value)} style={st.input}>
              <option value="">{'\u9009\u62E9\u914D\u5217'}</option>
              {['30%','40%','40%+Macro','40%+Pad','45%','50%','60%','60%+Macro','60%+Pad','AT','65%','65%+Macro','65%+Pad','65%AT','70%FRL_TKL','70%FRL_TKL+Macro','70%FRL_TKL+Pad','75%','80%TKL','80%TKL+Macro','1800','1800FRL','90%','98%','100%Full','100%Full_FRL','Pad','Alice','Split','Hub','Function','\u5176\u4ED6'].map(o=><option key={o} value={o}>{o}</option>)}
            </select></div>
          <div style={st.grp}><label style={st.label}>{'\u72B6\u6001'}</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={st.input}>
              <option value="">{'\u9009\u62E9\u72B6\u6001'}</option>
              <option value="ic">IC</option>
              <option value="gb">GB</option>
              <option value="completed">{'\u5DF2\u5B8C\u6210'}</option>
            </select></div>
        </div>

        <div style={st.grp}>
          <label style={st.label}>{'\u56FE\u7247'}</label>
          <div style={{display:'flex',gap:8,marginBottom:8}}>
            <input value={imgInput} onChange={e=>setImgInput(e.target.value)} placeholder="/images/xxx.jpg" style={{...st.input,flex:1}} onKeyDown={e=>{if(e.key==='Enter')addImage(e)}} />
            <button onClick={addImage} type="button" style={{padding:'8px 16px',fontSize:12,cursor:'pointer',fontWeight:600,background:'var(--accent)',border:'2px solid var(--text-primary)',whiteSpace:'nowrap'}}>{'\u6DFB\u52A0'}</button>
            <button onClick={()=>setBrowseOpen(!browseOpen)} type="button" style={{padding:'8px 16px',fontSize:12,cursor:'pointer',fontWeight:600,background:'var(--bg-primary)',border:'1px solid var(--border-base)',whiteSpace:'nowrap'}}>{'\u6D4F\u89C8'}</button>
          </div>

          {/* Selected images with cover support */}
          {images.length > 0 && <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:8}}>
            {images.map((url,i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:4,background:'var(--bg-secondary)',padding:'2px 8px 2px 4px',fontSize:11,border:'1px solid ' + (i===0?'var(--accent)':'var(--border-base)')}}>
                <img src={url} alt="" style={{width:24,height:24,objectFit:'cover'}} onError={e=>e.target.style.display='none'} />
                <span style={{maxWidth:150,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{url.split('/').pop()}</span>
                <button onClick={()=>removeImage(i)} type="button" style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',fontSize:14,padding:0,lineHeight:1}}>{'\u2715'}</button>
                <button onClick={()=>setCover(i)} type="button" style={{background:'none',border:'none',cursor:'pointer',color:i===0?'var(--accent)':'var(--text-muted)',fontSize:12,padding:0,lineHeight:1}} title={'\u8BBE\u4E3A\u5C01\u9762'}>{i===0?'\u2605':'\u2606'}</button>
              </div>
            ))}
          </div>}

          {/* Image browser */}
          {browseOpen && <div style={{border:'1px solid var(--border-base)',background:'var(--bg-secondary)',padding:12,maxHeight:300,overflowY:'auto'}}>
            <input value={browseFilter} onChange={e=>setBrowseFilter(e.target.value)} placeholder={'\u641C\u7D22\u56FE\u7247...'} style={{...st.input,marginBottom:8}} />
            {Object.entries(groups).sort().map(([group, imgs]) => (
              <details key={group} style={{marginBottom:4}}>
                <summary style={{fontSize:11,fontWeight:600,cursor:'pointer',padding:'2px 0',color:'var(--text-secondary)',letterSpacing:0.5}}>{group} ({imgs.length})</summary>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minpx(60px,1fr))',gap:4,padding:4}}>
                  {imgs.sort((a,b)=>a.name.localeCompare(b.name)).map(img => {
                    const selected = images.includes(img.path)
                    return <div key={img.path} onClick={()=>toggleImage(img.path)} style={{cursor:'pointer',border:selected?'2px solid var(--accent)':'1px solid var(--border-base)',overflow:'hidden',background:'var(--bg-primary)',position:'relative',aspectRatio:1}} title={img.name}>
                      <img src={img.path} alt={img.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>e.target.style.display='none'} />
                      {selected && <div style={{position:'absolute',top:0,right:0,background:'var(--accent)',color:'var(--text-primary)',fontSize:9,padding:'1px 4px',fontWeight:700}}>{'\u2713'}</div>}
                    </div>
                  })}
                </div>
              </details>
            ))}
          </div>}
        </div>

        <div style={st.row}>
          <div style={st.grp}><label style={st.label}>IC {'\u65F6\u95F4'}</label>
            <div style={{display:'flex',gap:4,alignItems:'center'}}>
              <input type="text" value={icTime} onChange={e=>setIcTime(e.target.value)} placeholder="YYYY-MM-DD" style={{...st.input,flex:1}} />
              <button onClick={()=>{const d=document.createElement("input");d.type="date";d.style.position="fixed";d.style.left="-9999px";document.body.appendChild(d);d.addEventListener("change",()=>{if(d.value)setIcTime(d.value);document.body.removeChild(d)});try{d.showPicker()}catch(e){d.click()};setTimeout(()=>{if(document.body.contains(d))document.body.removeChild(d)},120000)}} type="button" style={{padding:"4px 6px",fontSize:14,cursor:"pointer",background:"none",border:"1px solid var(--border-base)",color:"var(--text-muted)",lineHeight:1,fontFamily:"inherit"}}>{String.fromCharCode(128197)}</button>
              {icTime && <button onClick={()=>setIcTime('')} type="button" style={{padding:'4px 6px',fontSize:11,cursor:'pointer',background:'none',border:'1px solid var(--border-base)',color:'var(--text-muted)',lineHeight:1}}>{String.fromCharCode(215)}</button>}
            </div></div>
          <div style={st.grp}><label style={st.label}>GB {'\u65F6\u95F4'}</label>
            <div style={{display:'flex',gap:4,alignItems:'center'}}>
              <input type="text" value={gbTime} onChange={e=>setGbTime(e.target.value)} placeholder="YYYY-MM-DD" style={{...st.input,flex:1}} />
              <button onClick={()=>{const d=document.createElement("input");d.type="date";d.style.position="fixed";d.style.left="-9999px";document.body.appendChild(d);d.addEventListener("change",()=>{if(d.value)setGbTime(d.value);document.body.removeChild(d)});try{d.showPicker()}catch(e){d.click()};setTimeout(()=>{if(document.body.contains(d))document.body.removeChild(d)},120000)}} type="button" style={{padding:"4px 6px",fontSize:14,cursor:"pointer",background:"none",border:"1px solid var(--border-base)",color:"var(--text-muted)",lineHeight:1,fontFamily:"inherit"}}>{String.fromCharCode(128197)}</button>
              {gbTime && <button onClick={()=>setGbTime('')} type="button" style={{padding:'4px 6px',fontSize:11,cursor:'pointer',background:'none',border:'1px solid var(--border-base)',color:'var(--text-muted)',lineHeight:1}}>{String.fromCharCode(215)}</button>}
            </div></div>
        </div>
        <div style={st.row}>
          <div style={st.grp}><label style={st.label}>IC {'\u94FE\u63A5'}</label>
            <input value={icLink} onChange={e=>setIcLink(e.target.value)} placeholder="https://..." style={st.input} /></div>
          <div style={st.grp}><label style={st.label}>GB {'\u94FE\u63A5'}</label>
            <input value={gbLink} onChange={e=>setGbLink(e.target.value)} placeholder="https://..." style={st.input} /></div>
        </div>
        <div style={st.grp}><label style={st.label}>{'\u5907\u6CE8'}</label>
          <input value={desc} onChange={e=>setDesc(e.target.value)} style={st.input} /></div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:20}}>
          <button onClick={onClose} type="button" style={{padding:'8px 20px',fontSize:12,cursor:'pointer',fontWeight:600,letterSpacing:0.5,background:'var(--bg-primary)',color:'var(--text-primary)',border:'1px solid var(--border-base)'}}>{'\u53D6\u6D88'}</button>
          <button onClick={handleSave} type="button" style={{padding:'8px 20px',fontSize:12,cursor:'pointer',fontWeight:600,letterSpacing:0.5,background:'var(--accent)',color:'var(--text-primary)',border:'2px solid var(--text-primary)'}}>{'\u4FDD\u5B58'}</button>
        </div>
      </div>
    </div>
  )
}
