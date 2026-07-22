import { useState, useEffect, useMemo } from 'react'
import Layout from '../components/Layout'
import SearchControls from '../components/SearchControls'
import KeyboardCard from '../components/KeyboardCard'
import KeyboardDetail from '../components/KeyboardDetail'
import StudioDetail from '../components/StudioDetail'
import Pagination from '../components/Pagination'
import useBreakpoint from '../lib/useBreakpoint'
import useData from '../lib/useData'

const PAGE_SIZE = 20

export default function Home() {
  const { isDesktop, isTablet, isMobile } = useBreakpoint()
  const { keyboards, loading } = useData()
  const [filtered, setFiltered] = useState([])
  const [page, setPage] = useState(1)
  const [detailData, setDetailData] = useState(null)
  const [studioData, setStudioData] = useState(null)
  const cols = isDesktop ? 4 : isTablet ? 2 : 1

  const sortedKeyboards = useMemo(() =>
    [...keyboards].sort((a,b) => (b.sortTime || '').localeCompare(a.sortTime || '')),
  [keyboards])

  useEffect(() => { setFiltered(sortedKeyboards) }, [sortedKeyboards])
  useEffect(() => { setPage(1) }, [filtered.length])

  if (loading) return <Layout><div style={{textAlign:'center',padding:'60px',color:'var(--text-muted)',fontSize:13}}>{'\u52A0\u8F7D\u4E2D...'}</div></Layout>

  const start = (page - 1) * PAGE_SIZE
  const paged = filtered.slice(start, start + PAGE_SIZE)

  const handleShowStudio = (studio) => {
    setDetailData(null)
    setStudioData(studio)
  }

  return (
    <Layout>
      <SearchControls data={sortedKeyboards} onFilter={setFiltered} />
      <div style={{display:'grid',gridTemplateColumns:'repeat('+cols+',1fr)',gap:isMobile?12:20}}>
        {paged.map(k => <KeyboardCard key={k.id} kb={k} onClick={() => setDetailData(k)} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
          <h3 style={{fontSize:16,marginBottom:8,color:'var(--text-primary)'}}>{'\u6682\u65E0\u6570\u636E'}</h3>
          <p>{'\u8BF7\u5728\u7BA1\u7406\u9875\u9762\u6DFB\u52A0\u952E\u76D8'}</p>
        </div>
      )}
      <Pagination current={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={function(p){setPage(p);window.scrollTo({top:0,behavior:'smooth'})}} />
      {detailData && <KeyboardDetail keyboard={detailData} onClose={() => setDetailData(null)} onShowStudio={handleShowStudio} />}
      {studioData && <StudioDetail studio={studioData} keyboards={keyboards} onClose={() => setStudioData(null)} />}
    </Layout>
  )
}
