import { useState, useEffect, useMemo } from 'react'
import BlurOverlay from '../components/BlurOverlay'
import TopProgressBar from '../components/TopProgressBar'
import Layout from '../components/Layout'
import SearchControls from '../components/SearchControls'
import KeyboardCard from '../components/KeyboardCard'
import KeyboardDetail from '../components/KeyboardDetail'
import StudioDetail from '../components/StudioDetail'
import Pagination from '../components/Pagination'
import useBreakpoint from '../lib/useBreakpoint'
import useData from '../lib/useData'
import { useRouter } from 'next/router'

const DEFAULT_PAGE_SIZE = 8

export default function Home() {
  const router = useRouter()
  const { isDesktop, isTablet, isMobile } = useBreakpoint()
  const { keyboards, loading } = useData()
  const [showBlur, setShowBlur] = useState(false)
  const [filtered, setFiltered] = useState([])
  const [page, setPage] = useState(1)
  const [resetKey, setResetKey] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  useEffect(function() {
    if (typeof window !== 'undefined') {
      var s = localStorage.getItem('keyboardPageSize')
      if (s) setPageSize(parseInt(s))
    }
  }, [])
  const [detailData, setDetailData] = useState(null)
  const [studioData, setStudioData] = useState(null)
  const cols = isDesktop ? 4 : isTablet ? 2 : 1

  const sortedKeyboards = useMemo(() =>
    [...keyboards].sort((a,b) => (b.sortTime || '').localeCompare(a.sortTime || '')),
  [keyboards])

  useEffect(() => { setFiltered(sortedKeyboards) }, [sortedKeyboards])
  useEffect(() => { setPage(1) }, [filtered.length])

  if (loading) return <Layout><div style={{textAlign:'center',padding:'60px',color:'var(--text-muted)',fontSize:13}}>{'\u52A0\u8F7D\u4E2D...'}</div></Layout>

  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  const handlePageSizeChange = function(newSize) {
    localStorage.setItem('keyboardPageSize', String(newSize))
    setPageSize(newSize)
  }

  const handleGoHome = function() {
    setPage(1)
    setFiltered(sortedKeyboards)
    setResetKey(function(k){return k+1})
    setShowBlur(true)
    setTimeout(function() {
      setPage(1)
      setFiltered(sortedKeyboards)
      setResetKey(function(k){return k+1})
    }, 200)
    setTimeout(function() {
      setShowBlur(false)
    }, 1000)
    setTimeout(function() {
      router.push('/')
    }, 1800)
  }

  const handleShowStudio = (studio) => {
    setDetailData(null)
    setStudioData(studio)
  }

  return (
    <>
      <Layout onGoHome={handleGoHome}>
      <SearchControls key={router.asPath + '_' + resetKey} data={sortedKeyboards} onFilter={setFiltered} />
      <div style={{display:'grid',gridTemplateColumns:'repeat('+cols+',1fr)',gap:isMobile?'0.75rem':'1.25rem'}}>
        {paged.map(k => <KeyboardCard key={k.id} kb={k} onClick={() => setDetailData(k)} />)}
      </div>
      {filtered.length === 0 && (
        <div style={{textAlign:'center',padding:'60px 20px',color:'var(--text-muted)'}}>
          <h3 style={{fontSize:16,marginBottom:8,color:'var(--text-primary)'}}>{'\u6682\u65E0\u6570\u636E'}</h3>
          <p>{'\u8BF7\u5728\u7BA1\u7406\u9875\u9762\u6DFB\u52A0\u952E\u76D8'}</p>
        </div>
      )}
      <Pagination current={page} total={filtered.length} pageSize={pageSize} onChange={function(p){setPage(p);requestAnimationFrame(function(){window.scrollTo({top:0,behavior:'smooth'})})}} onPageSizeChange={handlePageSizeChange} />
      {detailData && <KeyboardDetail keyboard={detailData} onClose={() => setDetailData(null)} onShowStudio={handleShowStudio} />}
      {studioData && <StudioDetail studio={studioData} keyboards={keyboards} onClose={() => setStudioData(null)} />}
    </Layout>
      <BlurOverlay active={showBlur} />
    </>
  )
}
