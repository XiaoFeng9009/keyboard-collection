import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import KeyboardForm from '../components/KeyboardForm'
import Pagination from '../components/Pagination'
import useData from '../lib/useData'

const PAGE_SIZE = 15

export default function Admin() {
  const { keyboards, loading } = useData()
  const [data, setData] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => { if (keyboards.length > 0) setData(keyboards) }, [keyboards])
  useEffect(() => { setPage(1) }, [data.length])

  const save = (kb) => {
    let updated = editData ? data.map(k => k.id === kb.id ? kb : k) : [...data, kb]
    setData(updated); sessionStorage.setItem('keyboardData', JSON.stringify(updated))
    setShowForm(false); setEditData(null)
  }
  const remove = (id) => {
    if (!confirm('\u786E\u5B9A\u5220\u9664?')) return
    const updated = data.filter(k => k.id !== id)
    setData(updated); sessionStorage.setItem('keyboardData', JSON.stringify(updated))
  }
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({keyboards:data},null,2)], {type:'application/json'})
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'keyboard_data.json'; a.click()
  }
  const importJSON = (e) => {
    const file = e.target.files[0]; if (!file) return
    const r = new FileReader()
    r.onload = (ev) => { try { const d = JSON.parse(ev.target.result); if (d.keyboards) { setData(d.keyboards); sessionStorage.setItem('keyboardData',JSON.stringify(d.keyboards)) } } catch(err) {} }
    r.readAsText(file); e.target.value = ''
  }
  const sl = (s) => s === 'ic' ? 'IC' : s === 'gb' ? 'GB' : s === 'completed' ? '\u5B8C\u6210' : '-'

  if (loading) return <Layout><div style={{textAlign:'center',padding:'60px',color:'var(--text-muted)',fontSize:13}}>{'\u52A0\u8F7D\u4E2D...'}</div></Layout>

  const start = (page - 1) * PAGE_SIZE
  const paged = data.slice(start, start + PAGE_SIZE)

  const btn = {padding:'8px 20px',fontSize:12,cursor:'pointer',fontWeight:600,letterSpacing:0.5}
  const cell = {padding:'10px 12px',borderBottom:'1px solid var(--border-base)'}
  const th = {...cell,color:'var(--text-muted)',fontWeight:600,fontSize:10,textTransform:'uppercase',letterSpacing:1,background:'var(--bg-secondary)'}

  return (
    <Layout>
      <div style={{display:'flex',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        <button onClick={() => { setEditData(null); setShowForm(true) }} style={{...btn,background:'var(--accent)',color:'var(--text-primary)',border:'2px solid var(--text-primary)'}}>{'+ '}<span>{'\u6DFB\u52A0\u952E\u76D8'}</span></button>
        <button onClick={exportJSON} style={{...btn,background:'var(--bg-primary)',color:'var(--text-primary)',border:'1px solid var(--border-base)'}}>{'\u5BFC\u51FA JSON'}</button>
        <button onClick={() => document.getElementById('importFile').click()} style={{...btn,background:'var(--bg-primary)',color:'var(--text-primary)',border:'1px solid var(--border-base)'}}>{'\u5BFC\u5165 JSON'}</button>
        <input type="file" id="importFile" accept=".json" style={{display:'none'}} onChange={importJSON} />
      </div>
      <div style={{overflowX:'auto',background:'var(--bg-primary)',border:'1px solid var(--border-base)',boxShadow:'var(--shadow-base)'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead>
            <tr>{['\u540D\u79F0','\u5DE5\u4F5C\u5BA4','\u914D\u5217','\u72B6\u6001','IC \u65F6\u95F4','GB \u65F6\u95F4','\u64CD\u4F5C'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {paged.map(k => (
              <tr key={k.id} style={{transition:'background .15s'}} onMouseEnter={e=>e.currentTarget.style.background='var(--bg-secondary)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <td style={cell}>{k.name}</td>
                <td style={cell}>{k.studio}</td>
                <td style={cell}>{k.layout || '-'}</td>
                <td style={cell}>{sl(k.status)}</td>
                <td style={cell}>{k.icTime || '-'}</td>
                <td style={cell}>{k.gbTime || '-'}</td>
                <td style={cell}>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={() => { setEditData(k); setShowForm(true) }} style={{padding:'4px 12px',border:'1px solid var(--border-base)',fontSize:11,cursor:'pointer',background:'var(--bg-primary)'}}>{'\u7F16\u8F91'}</button>
                    <button onClick={() => remove(k.id)} style={{padding:'4px 12px',border:'1px solid var(--border-base)',fontSize:11,cursor:'pointer',background:'var(--bg-primary)'}}>{'\u5220\u9664'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination current={page} total={data.length} pageSize={PAGE_SIZE} onChange={setPage} />
      <KeyboardForm show={showForm} onClose={() => { setShowForm(false); setEditData(null) }} onSave={save} editData={editData} />
    </Layout>
  )
}
