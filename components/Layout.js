import { useRouter } from 'next/router'

import BackToTop from './BackToTop'

export default function Layout({ children }) {
  const router = useRouter()
  const tabs = [
    { path: '/', label: '\u952E\u76D8' },
    { path: '/studios', label: '\u5DE5\u4F5C\u5BA4' },
    { path: '/timeline', label: '\u65F6\u95F4\u7EBF' },
    { path: '/admin', label: '\u7BA1\u7406' },
  ]
  return (
    <>
      <nav style={{
        background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-base)',
        padding: '0 24px', display: 'flex', alignItems: 'center', height: 56,
        gap: 24, position: 'sticky', top: 0, zIndex: 100,
        boxShadow: 'var(--shadow-base)'
      }}>
        <h1 style={{fontSize:18,fontWeight:700,letterSpacing:1,display:'flex',alignItems:'center',gap:8}}>
          KEYBOARD <span style={{background:'var(--accent)',padding:'0 6px',borderRadius:3,fontSize:14}}>COLLECTION</span>
        </h1>
        <div style={{display:'flex',gap:2}}>
          {tabs.map(t => (
            <button key={t.path} onClick={() => router.push(t.path)} style={{
              padding:'6px 14px',fontSize:13,borderRadius:4,letterSpacing:0.5,fontFamily:'inherit',
              border:'none',cursor:'pointer',
              background: router.pathname === t.path ? 'var(--accent)' : 'none',
              color: 'var(--text-primary)',
              fontWeight: router.pathname === t.path ? 600 : 400,
              transition: 'all .2s'
            }}>{t.label}</button>
          ))}
        </div>
      </nav>
      <main style={{maxWidth:1200,margin:'0 auto',padding:'32px 24px'}}>
        {children}
      </main>
      <BackToTop />
      <BackToTop />
        </>
  )
}

