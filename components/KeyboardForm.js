import { useState, useEffect } from 'react'

export default function KeyboardForm({ show, onClose, onSave, editData }) {
  const [name, setName] = useState('')
  const [studio, setStudio] = useState('')
  const [layout, setLayout] = useState('')
  const [status, setStatus] = useState('')
  const [image, setImage] = useState('')
  const [icTime, setIcTime] = useState('')
  const [icLink, setIcLink] = useState('')
  const [gbTime, setGbTime] = useState('')
  const [gbLink, setGbLink] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    if (editData) {
      setName(editData.name || '')
      setStudio(editData.studio || '')
      setLayout(editData.layout || '')
      setStatus(editData.status || '')
      setImage(editData.image || '')
      setIcTime(editData.icTime || '')
      setIcLink(editData.icLink || '')
      setGbTime(editData.gbTime || '')
      setGbLink(editData.gbLink || '')
      setDesc(editData.description || '')
    } else {
      setName(''); setStudio(''); setLayout(''); setStatus('')
      setImage(''); setIcTime(''); setIcLink(''); setGbTime(''); setGbLink(''); setDesc('')
    }
  }, [editData, show])

  const handleSave = () => {
    if (!name.trim() || !studio.trim()) return
    onSave({ id: editData?.id || 'kb_' + Date.now(), name: name.trim(), studio: studio.trim(),
      layout, status, image, icTime, icLink, gbTime, gbLink, description: desc })
  }

  if (!show) return null

  const label = { display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }
  const input = { width: '100%', padding: '8px 10px', background: 'var(--bg-base)', border: '1px solid var(--border-base)', color: 'var(--text-primary)', fontSize: 13 }
  const row = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }
  const grp = { marginBottom: 14 }

  return (
    <div style={{display:'flex',position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,justifyContent:'center',alignItems:'center',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <div style={{background:'var(--bg-primary)',border:'1px solid var(--border-base)',padding:28,width:'90%',maxWidth:560,maxHeight:'85vh',overflowY:'auto',boxShadow:'var(--shadow-hover)',borderTop:'4px solid var(--text-primary)'}} onClick={e => e.stopPropagation()}>
        <h2 style={{marginBottom:20,fontSize:16,fontWeight:600,letterSpacing:0.5}}>{editData ? '\u7F16\u8F91\u952E\u76D8' : '\u6DFB\u52A0\u952E\u76D8'}</h2>

        <div style={grp}><label style={label}>{'\u952E\u76D8\u540D\u79F0'} *</label>
          <input value={name} onChange={e=>setName(e.target.value)} style={input} /></div>
        <div style={grp}><label style={label}>{'\u5DE5\u4F5C\u5BA4'} *</label>
          <input value={studio} onChange={e=>setStudio(e.target.value)} style={input} /></div>

        <div style={row}>
          <div style={grp}><label style={label}>{'\u914D\u5217'}</label>
            <select value={layout} onChange={e=>setLayout(e.target.value)} style={input}>
              <option value="">{'\u9009\u62E9\u914D\u5217'}</option>
              {['40%','60%','65%','75%','TKL','Full','Alice','Ortholinear','Split','\u5176\u4ED6'].map(o=><option key={o} value={o}>{o}</option>)}
            </select></div>
          <div style={grp}><label style={label}>{'\u72B6\u6001'}</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={input}>
              <option value="">{'\u9009\u62E9\u72B6\u6001'}</option>
              <option value="ic">IC</option>
              <option value="gb">GB</option>
              <option value="completed">{'\u5DF2\u5B8C\u6210'}</option>
            </select></div>
        </div>

        <div style={grp}><label style={label}>{'\u56FE\u7247 URL'}</label>
          <input value={image} onChange={e=>setImage(e.target.value)} style={input} /></div>

        <div style={row}>
          <div style={grp}><label style={label}>IC {'\u65F6\u95F4'}</label>
            <input type="date" value={icTime} onChange={e=>setIcTime(e.target.value)} style={input} /></div>
          <div style={grp}><label style={label}>GB {'\u65F6\u95F4'}</label>
            <input type="date" value={gbTime} onChange={e=>setGbTime(e.target.value)} style={input} /></div>
        </div>

        <div style={row}>
          <div style={grp}><label style={label}>IC {'\u94FE\u63A5'}</label>
            <input value={icLink} onChange={e=>setIcLink(e.target.value)} placeholder="https://..." style={input} /></div>
          <div style={grp}><label style={label}>GB {'\u94FE\u63A5'}</label>
            <input value={gbLink} onChange={e=>setGbLink(e.target.value)} placeholder="https://..." style={input} /></div>
        </div>

        <div style={grp}><label style={label}>{'\u5907\u6CE8'}</label>
          <input value={desc} onChange={e=>setDesc(e.target.value)} style={input} /></div>

        <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:20}}>
          <button onClick={onClose} style={{padding:'8px 20px',fontSize:12,cursor:'pointer',fontWeight:600,letterSpacing:0.5,background:'var(--bg-primary)',color:'var(--text-primary)',border:'1px solid var(--border-base)'}}>{'\u53D6\u6D88'}</button>
          <button onClick={handleSave} style={{padding:'8px 20px',fontSize:12,cursor:'pointer',fontWeight:600,letterSpacing:0.5,background:'var(--accent)',color:'var(--text-primary)',border:'2px solid var(--text-primary)'}}>{'\u4FDD\u5B58'}</button>
        </div>
      </div>
    </div>
  )
}
