import { useState, useEffect, useMemo } from 'react'
import Layout from '../components/Layout'
import KeyboardForm from '../components/KeyboardForm'
import Pagination from '../components/Pagination'
import useData from '../lib/useData'

const ADMIN_PASSWORD = 'kb2026'
const PAGE_SIZE = 15

export default function Admin() {
  const { keyboards, loading } = useData()
  const [data, setData] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState(null)
  const [page, setPage] = useState(1)
  const [toastMsg, setToastMsg] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loginPwd, setLoginPwd] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [filterStudio, setFilterStudio] = useState('')
  const [filterLayout, setFilterLayout] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (typeof window !== "undefined") {
      const a = sessionStorage.getItem("adminAuth")
      if (a === "true") setAuthenticated(true)
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        setAuthenticated(true)
      }
    }
  }, [])

  useEffect(() => { if (keyboards.length > 0) setData(keyboards) }, [keyboards])
  useEffect(() => { if (toastMsg) { const t = setTimeout(() => setToastMsg(null), 3000); return () => clearTimeout(t) } }, [toastMsg])
  useEffect(() => { setPage(1) }, [data.length])

  const sortedData = useMemo(() => [...data].sort((a,b) => (b.sortTime || "").localeCompare(a.sortTime || "")), [data])

  const filteredData = useMemo(() => {
    return sortedData.filter(k => {
      if (filterName && !k.name.toLowerCase().includes(filterName.toLowerCase())) return false
      if (filterStudio && !k.studio.toLowerCase().includes(filterStudio.toLowerCase())) return false
      if (filterLayout && k.layout !== filterLayout) return false
      if (filterStatus) {
        if (filterStatus === "none" && k.status) return false
        if (filterStatus !== "none" && k.status !== filterStatus) return false
      }
      return true
    })
  }, [sortedData, filterName, filterStudio, filterLayout, filterStatus])

  useEffect(() => { setPage(1) }, [filteredData.length])

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginPwd === ADMIN_PASSWORD) {
      setAuthenticated(true)
      sessionStorage.setItem("adminAuth", "true")
      setLoginError(false)
    } else {
      setLoginError(true)
    }
  }

  const save = (kb) => {
    let updated = editData ? data.map(k => k.id === kb.id ? kb : k) : [...data, kb]
    setData(updated); sessionStorage.setItem("keyboardData", JSON.stringify(updated))
    setShowForm(false); setEditData(null); setToastMsg(editData ? "\u5DF2\u66F4\u65B0\uFF08\u4E34\u65F6\uFF09\uFF0C\u8BF7\u5BFC\u51FA JSON \u4EE5\u6C38\u4E45\u4FDD\u5B58" : "\u5DF2\u6DFB\u52A0\uFF08\u4E34\u65F6\uFF09\uFF0C\u8BF7\u5BFC\u51FA JSON \u4EE5\u6C38\u4E45\u4FDD\u5B58")
  }

  const remove = (id) => {
    if (!confirm("\u786E\u5B9A\u5220\u9664?")) return
    const updated = data.filter(k => k.id !== id)
    setData(updated); sessionStorage.setItem("keyboardData", JSON.stringify(updated)); setToastMsg("\u5DF2\u5220\u9664\uFF08\u4E34\u65F6\uFF09")
  }

  const exportJSON = () => {
    setToastMsg("\u5DF2\u5BFC\u51FA\u4E3A keyboard_data.json")
    const blob = new Blob([JSON.stringify({keyboards:data},null,2)], {type:"application/json"})
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "keyboard_data.json"; a.click()
  }

  const importJSON = (e) => {
    const file = e.target.files[0]; if (!file) return
    const r = new FileReader()
    r.onload = (ev) => { try { const d = JSON.parse(ev.target.result); if (d.keyboards) { setData(d.keyboards); sessionStorage.setItem("keyboardData",JSON.stringify(d.keyboards)); setToastMsg("\u5BFC\u5165\u6210\u529F") } } catch(err) {} }
    r.readAsText(file); e.target.value = ""
  }

  const sl = (s) => s === "ic" ? "IC" : s === "gb" ? "GB" : s === "completed" ? "\u5B8C\u6210" : "-"

  // Gather unique layouts from data for the filter dropdown
  const layoutOptions = useMemo(() => {
    const s = new Set()
    data.forEach(k => { if (k.layout) s.add(k.layout) })
    return [...s].sort()
  }, [data])

  if (loading) return <Layout><div style={{textAlign:"center",padding:"60px",color:"var(--text-muted)",fontSize:13}}>{String.fromCharCode(0x52A0,0x8F7D,0x4E2D,0x2E,0x2E,0x2E)}</div></Layout>

  // Login form
  if (!authenticated) {
    return (
      <Layout>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"60vh",flexDirection:"column",gap:16}}>
          <h2 style={{fontSize:20,fontWeight:700,color:"var(--text-primary)",letterSpacing:1}}>{String.fromCharCode(0x7BA1,0x7406,0x5458,0x767B,0x5F55)}</h2>
          <form onSubmit={handleLogin} style={{display:"flex",gap:8,flexDirection:"column",alignItems:"center"}}>
            <input type="password" value={loginPwd} onChange={e=>{setLoginPwd(e.target.value);setLoginError(false)}} placeholder={String.fromCharCode(0x8BF7,0x8F93,0x5165,0x5BC6,0x7801)} autoFocus
              style={{padding:"10px 14px",fontSize:14,background:"var(--bg-primary)",border:"1px solid "+(loginError?"#dc2626":"var(--border-base)"),color:"var(--text-primary)",width:240,fontFamily:"inherit"}} />
            <button type="submit" style={{padding:"10px 32px",fontSize:13,cursor:"pointer",fontWeight:600,letterSpacing:0.5,background:"var(--accent)",color:"var(--text-primary)",border:"2px solid var(--text-primary)",fontFamily:"inherit",marginTop:4}}>{String.fromCharCode(0x786E,0x8BA4)}</button>
            {loginError && <p style={{fontSize:12,color:"#dc2626",marginTop:4}}>{String.fromCharCode(0x5BC6,0x7801,0x9519,0x8BEF)}</p>}
          </form>
        </div>
      </Layout>
    )
  }

  const start = (page - 1) * PAGE_SIZE
  const paged = filteredData.slice(start, start + PAGE_SIZE)

  const btn = {padding:"8px 20px",fontSize:12,cursor:"pointer",fontWeight:600,letterSpacing:0.5}
  const cell = {padding:"10px 12px",borderBottom:"1px solid var(--border-base)"}
  const th = {...cell,color:"var(--text-muted)",fontWeight:600,fontSize:10,textTransform:"uppercase",letterSpacing:1,background:"var(--bg-secondary)"}
  const inputStyle = {padding:"6px 10px",fontSize:12,background:"var(--bg-base)",border:"1px solid var(--border-base)",color:"var(--text-primary)",fontFamily:"inherit",borderRadius:0}
  const selectStyle = {...inputStyle,cursor:"pointer"}

  return (
    <Layout>
      {toastMsg && <div style={{position:"fixed",bottom:24,right:24,background:"#18181b",color:"#fff",padding:"10px 20px",fontSize:12,zIndex:400,boxShadow:"var(--shadow-hover)",animation:"slideIn .3s",border:"1px solid var(--accent)"}}>{toastMsg}</div>}
      <div style={{background:"var(--accent-dim)",border:"1px solid var(--border-base)",padding:"8px 16px",marginBottom:16,fontSize:11,color:"var(--text-secondary)"}}>{String.fromCharCode(0x2550,0x2550,0x20,0x7F16,0x8F91,0x540E,0x8BF7,0x5BFC,0x51FA,0x20,0x4A,0x53,0x4F,0x4E,0x20,0x66FF,0x6362,0x20,0x70,0x75,0x62,0x6C,0x69,0x63,0x2F,0x64,0x61,0x74,0x61,0x2E,0x6A,0x73,0x6F,0x6E,0x20,0x4EE5,0x6C38,0x4E45,0x4FDD,0x5B58,0x20,0x2550,0x2550)}</div>

      {/* Action buttons */}
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <button onClick={() => { setEditData(null); setShowForm(true) }} style={{...btn,background:"var(--accent)",color:"var(--text-primary)",border:"2px solid var(--text-primary)"}}>{String.fromCharCode(0x2B,0x20,0x6DFB,0x52A0,0x952E,0x76D8)}</button>
        <button onClick={exportJSON} style={{...btn,background:"var(--bg-primary)",color:"var(--text-primary)",border:"1px solid var(--border-base)"}}>{String.fromCharCode(0x5BFC,0x51FA,0x20,0x4A,0x53,0x4F,0x4E)}</button>
        <button onClick={() => document.getElementById("importFile").click()} style={{...btn,background:"var(--bg-primary)",color:"var(--text-primary)",border:"1px solid var(--border-base)"}}>{String.fromCharCode(0x5BFC,0x5165,0x20,0x4A,0x53,0x4F,0x4E)}</button>
        <input type="file" id="importFile" accept=".json" style={{display:"none"}} onChange={importJSON} />
      </div>

      {/* Filter row */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center",background:"var(--bg-secondary)",padding:"10px 14px",border:"1px solid var(--border-base)"}}>
        <input value={filterName} onChange={e=>setFilterName(e.target.value)} placeholder={String.fromCharCode(0x641C,0x7D22,0x540D,0x79F0)} style={{...inputStyle,flex:1,minWidth:100}} />
        <input value={filterStudio} onChange={e=>setFilterStudio(e.target.value)} placeholder={String.fromCharCode(0x641C,0x7D22,0x5DE5,0x4F5C,0x5BA4)} style={{...inputStyle,flex:1,minWidth:100}} />
        <select value={filterLayout} onChange={e=>setFilterLayout(e.target.value)} style={selectStyle}>
          <option value="">{String.fromCharCode(0x5168,0x90E8,0x914D,0x5217)}</option>
          {layoutOptions.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={selectStyle}>
          <option value="">{String.fromCharCode(0x5168,0x90E8,0x72B6,0x6001)}</option>
          <option value="ic">IC</option>
          <option value="gb">GB</option>
          <option value="completed">{String.fromCharCode(0x5DF2,0x5B8C,0x6210)}</option>
          <option value="none">{String.fromCharCode(0x672A,0x8BBE,0x7F6E)}</option>
        </select>
        {filteredData.length < sortedData.length && <span style={{fontSize:11,color:"var(--text-muted)",whiteSpace:"nowrap"}}>{filteredData.length + " / " + sortedData.length}</span>}
      </div>

      {/* Table */}
      <div style={{overflowX:"auto",background:"var(--bg-primary)",border:"1px solid var(--border-base)",boxShadow:"var(--shadow-base)"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr>{[String.fromCharCode(0x540D,0x79F0),String.fromCharCode(0x5DE5,0x4F5C,0x5BA4),String.fromCharCode(0x914D,0x5217),String.fromCharCode(0x72B6,0x6001),"IC " + String.fromCharCode(0x65F6,0x95F4),"GB " + String.fromCharCode(0x65F6,0x95F4),String.fromCharCode(0x64CD,0x4F5C)].map(h => <th key={h} style={th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {paged.map(k => (
              <tr key={k.id} style={{transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--bg-secondary)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                <td style={cell}>{k.name}</td>
                <td style={cell}>{k.studio}</td>
                <td style={cell}>{k.layout || "-"}</td>
                <td style={cell}>{sl(k.status)}</td>
                <td style={cell}>{k.icTime || "-"}</td>
                <td style={cell}>{k.gbTime || "-"}</td>
                <td style={cell}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={() => { setEditData(k); setShowForm(true) }} style={{padding:"4px 12px",border:"1px solid var(--border-base)",fontSize:11,cursor:"pointer",background:"var(--bg-primary)"}}>{String.fromCharCode(0x7F16,0x8F91)}</button>
                    <button onClick={() => remove(k.id)} style={{padding:"4px 12px",border:"1px solid var(--border-base)",fontSize:11,cursor:"pointer",background:"var(--bg-primary)"}}>{String.fromCharCode(0x5220,0x9664)}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination current={page} total={filteredData.length} pageSize={PAGE_SIZE} onChange={setPage} />
      <KeyboardForm show={showForm} onClose={() => { setShowForm(false); setEditData(null) }} onSave={save} editData={editData} />
    </Layout>
  )
}
