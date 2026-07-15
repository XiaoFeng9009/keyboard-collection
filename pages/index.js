import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import SearchControls from '../components/SearchControls'
import KeyboardCard from '../components/KeyboardCard'
import Pagination from '../components/Pagination'
import useData from '../lib/useData'

const PAGE_SIZE = 20

export default function Home() {
  const { keyboards, loading } = useData()
  const [filtered, setFiltered] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => { if (keyboards.length > 0) setFiltered(keyboards) }, [keyboards])
  useEffect(() => { setPage(1) }, [filtered.length])

  if (loading) return <Layout><div style={{textAlign:'center',padding:'60px',color:'var(--text-muted)',fontSize:13}}>{'\u52A0\u8F7D\u4E2D...'}</div></Layout>

  const start = (page - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  return (
    <Layout>
      <SearchControls data={keyboards} onFilter={setFiltered} />
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:20}}>
        {paged.map(k => <KeyboardCard key={k.id} kb={k} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
          <h3 style={{fontSize:16,marginBottom:8,color:'var(--text-primary)'}}>{'\u6682\u65E0\u6570\u636E'}</h3>
          <p>{'\u8BF7\u5728\u7BA1\u7406\u9875\u9762\u6DFB\u52A0\u952E\u76D8'}</p>
        </div>
      )}
      <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </Layout>
  )
}
