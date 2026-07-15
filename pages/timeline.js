import Layout from '../components/Layout'
import TimelineView from '../components/TimelineView'
import useData from '../lib/useData'

export default function Timeline() {
  const { keyboards, loading } = useData()
  if (loading) return <Layout><div style={{textAlign:'center',padding:'60px',color:'var(--text-muted)',fontSize:13}}>加载中...</div></Layout>
  return <Layout><TimelineView keyboards={keyboards} /></Layout>
}
