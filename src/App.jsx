import { useState, useCallback } from 'react'
import { C, CSS_GLOBAL, getLevelByXp } from './theme.js'
import { useStorage } from './hooks/useStorage.js'
import Assessment from './components/Assessment.jsx'
import Home from './components/Home.jsx'
import Progress from './components/Progress.jsx'
import { Vocab, Convo, Phrases, Write } from './components/Modules.jsx'

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  // Core state
  const [assessment, setAssessment]     = useStorage('ep_assessment', null)
  const [progressData, setProgressData] = useStorage('ep_progress', { sessions: [] })
  const [learned, setLearned]           = useStorage('ep_learned', [])
  const [xp, setXp]                     = useStorage('ep_xp', 0)
  const [streak, setStreak]             = useStorage('ep_streak', 0)

  const [page, setPage]                   = useState('home')
  const [retakingAssessment, setRetaking] = useState(false)

  // ── Actions ────────────────────────────────────────────────────────────────

  const addXp = useCallback((n) => {
    setXp(prev => prev + n)
  }, [setXp])

  const markLearned = useCallback((id) => {
    setLearned(prev => {
      if (prev.includes(id)) return prev
      addXp(10)
      logSession({ type: 'vocab', label: 'כרטיסיית מילה', xp: 10 })
      return [...prev, id]
    })
  }, [setLearned, addXp])

  const logSession = useCallback(({ type, label, xp: sessionXp }) => {
    setProgressData(prev => ({
      sessions: [
        ...prev.sessions,
        { type, label, xp: sessionXp, date: new Date().toISOString() },
      ],
    }))
    // Update streak
    const today = new Date().toDateString()
    const lastSession = progressData.sessions.slice(-1)[0]
    const lastDay = lastSession ? new Date(lastSession.date).toDateString() : null
    if (lastDay !== today) {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = lastDay === yesterday.toDateString()
      setStreak(prev => wasYesterday ? prev + 1 : 1)
    }
  }, [setProgressData, progressData, setStreak])

  const handleAssessmentComplete = useCallback((result) => {
    setAssessment(result)
    setRetaking(false)
    setPage('home')
  }, [setAssessment])

  // ── Render assessment ──────────────────────────────────────────────────────

  if (!assessment || retakingAssessment) {
    return (
      <div style={s.app}>
        <style>{CSS_GLOBAL}</style>
        <div style={s.shell}>
          <header style={s.header}>
            <div style={s.logo}>
              <span style={s.logoMark}>EN</span>
              <span style={s.logoText}>ProEnglish</span>
            </div>
          </header>
          <main style={s.main}>
            <Assessment
              onComplete={handleAssessmentComplete}
              existingResult={retakingAssessment ? null : undefined}
            />
          </main>
        </div>
      </div>
    )
  }

  // ── Nav ────────────────────────────────────────────────────────────────────

  const navItems = [
    { id: 'home',     label: 'בית',      icon: HomeIcon },
    { id: 'vocab',    label: 'מילים',    icon: BookIcon },
    { id: 'convo',    label: 'שיחה',     icon: ChatIcon },
    { id: 'phrases',  label: 'ביטויים',  icon: ListIcon },
    { id: 'write',    label: 'כתיבה',    icon: WriteIcon },
    { id: 'progress', label: 'התקדמות', icon: ChartIcon },
  ]

  const level = getLevelByXp(xp)

  return (
    <div style={s.app}>
      <style>{CSS_GLOBAL}</style>
      <div style={s.shell}>
        {/* Header */}
        <header style={s.header}>
          <div style={s.logo}>
            <span style={s.logoMark}>EN</span>
            <span style={s.logoText}>ProEnglish</span>
          </div>
          <div style={s.headerRight}>
            <span style={{...s.levelPill, background:level.color+'22', color:level.color}}>{level.id}</span>
            <span style={s.badge}>🔥 {streak}</span>
            <span style={s.badge}>⚡ {xp}</span>
          </div>
        </header>

        {/* Main */}
        <main style={s.main}>
          {page === 'home'     && <Home learned={learned} xp={xp} streak={streak} setPage={setPage}/>}
          {page === 'vocab'    && <Vocab learned={learned} markLearned={markLearned}/>}
          {page === 'convo'    && <Convo addXp={addXp} logSession={logSession}/>}
          {page === 'phrases'  && <Phrases addXp={addXp}/>}
          {page === 'write'    && <Write addXp={addXp} logSession={logSession}/>}
          {page === 'progress' && (
            <Progress
              progressData={progressData}
              learned={learned}
              xp={xp}
              assessment={assessment}
              onRetakeAssessment={()=>{ setRetaking(true) }}
            />
          )}
        </main>

        {/* Nav */}
        <nav style={s.nav}>
          {navItems.map(n => {
            const Ic = n.icon
            return (
              <button key={n.id} style={{...s.navBtn,...(page===n.id?s.navActive:{})}} onClick={()=>setPage(n.id)}>
                <Ic active={page===n.id}/>
                <span style={s.navLabel}>{n.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ic = (d, vb='0 0 24 24') => ({ active }) => (
  <svg width="20" height="20" viewBox={vb} fill="none" stroke="currentColor" strokeWidth={active?2.5:2}>
    {d}
  </svg>
)

const HomeIcon  = ic(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>)
const BookIcon  = ic(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>)
const ChatIcon  = ic(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>)
const ListIcon  = ic(<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>)
const WriteIcon = ic(<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>)
const ChartIcon = ic(<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>)

// ─── Layout styles ─────────────────────────────────────────────────────────────

const s = {
  app:   { background: C.bg, minHeight:'100vh', display:'flex', justifyContent:'center', fontFamily:"'DM Sans','Segoe UI',sans-serif", color:C.text },
  shell: { width:'100%', maxWidth:480, display:'flex', flexDirection:'column', minHeight:'100vh' },
  header:{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.9rem 1.2rem', borderBottom:`1px solid ${C.border}`, background:C.surface, position:'sticky', top:0, zIndex:10 },
  logo:  { display:'flex', alignItems:'center', gap:'0.5rem' },
  logoMark: { background:`linear-gradient(135deg,${C.accent},${C.accent2})`, color:'#fff', fontWeight:800, padding:'0.2rem 0.5rem', borderRadius:6, fontSize:13, letterSpacing:1 },
  logoText: { fontWeight:700, fontSize:15 },
  headerRight: { display:'flex', alignItems:'center', gap:'0.4rem' },
  levelPill: { fontSize:11, fontWeight:700, padding:'0.2rem 0.5rem', borderRadius:20, letterSpacing:0.5 },
  badge: { background:C.surface2, border:`1px solid ${C.border}`, padding:'0.2rem 0.5rem', borderRadius:20, fontSize:11, fontWeight:600, color:C.dim },
  main:  { flex:1, overflowY:'auto', paddingBottom:72 },
  nav:   { position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:480, display:'flex', background:C.surface, borderTop:`1px solid ${C.border}`, padding:'0.3rem 0 0.5rem', zIndex:10 },
  navBtn:{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'0.4rem 0', background:'none', border:'none', cursor:'pointer', color:C.muted, fontSize:9, transition:'color 0.2s' },
  navActive: { color:C.accent },
  navLabel:  { fontSize:9 },
}
