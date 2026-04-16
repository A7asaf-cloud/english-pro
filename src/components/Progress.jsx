import { C, getLevelByXp, getLevelByScore, LEVELS } from '../theme.js'
import { ASSESSMENT_QUESTIONS } from '../data/assessment.js'
import { VOCAB_CARDS } from '../data/vocab.js'

export default function Progress({ progressData, learned, xp, assessment, onRetakeAssessment }) {
  const sessions = progressData?.sessions || []
  const level = getLevelByXp(xp)
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1]
  const xpToNext = nextLevel ? nextLevel.min * (xp < 150 ? 1 : xp < 400 ? 2.67 : xp < 800 ? 2 : xp < 1400 ? 1.75 : 1) : null

  // Last 7 days XP
  const today = new Date()
  const last7 = Array.from({length:7},(_,i)=>{
    const d = new Date(today); d.setDate(d.getDate()-(6-i))
    return d.toDateString()
  })
  const xpByDay = last7.map(day => sessions.filter(s=>new Date(s.date).toDateString()===day).reduce((a,s)=>a+s.xp,0))
  const maxXp = Math.max(...xpByDay, 1)

  // All-time stats
  const totalSessions = sessions.length
  const totalConvos   = sessions.filter(s=>s.type==='convo').length
  const totalWriting  = sessions.filter(s=>s.type==='write').length
  const streak = calcStreak(sessions)

  // Assessment
  const assessLevel = assessment ? getLevelByScore(assessment.score) : null

  return (
    <div style={ss.page}>
      <h2 style={ss.pageTitle}>📈 ההתקדמות שלי</h2>

      {/* Level card */}
      <div style={{...ss.levelCard, borderColor: level.color+'66'}}>
        <div style={ss.levelLeft}>
          <div style={{...ss.levelBadge, background:level.color+'22', color:level.color, border:`1px solid ${level.color}44`}}>
            <span style={ss.levelId}>{level.id}</span>
            <span style={ss.levelName}>{level.label}</span>
          </div>
          <span style={ss.xpTotal}>{xp} XP</span>
        </div>
        {nextLevel && (
          <div style={ss.levelRight}>
            <div style={ss.nextLabel}>הבא: {nextLevel.label}</div>
            <div style={ss.xpBar}><div style={{...ss.xpFill, width:`${Math.min(100,Math.round(xp/xpToNext*100))}%`, background:level.color}}/></div>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div style={ss.statsGrid}>
        {[
          {num: streak,         lab:'🔥 Streak',     sub:'ימים רצופים'},
          {num: learned.length, lab:'📖 Words',       sub:'מילים נלמדו'},
          {num: totalConvos,    lab:'🗣️ Convos',      sub:'שיחות AI'},
          {num: totalWriting,   lab:'✍️ Reviews',     sub:'תיקוני כתיבה'},
        ].map((s,i)=>(
          <div key={i} style={ss.statCard}>
            <span style={ss.statNum}>{s.num}</span>
            <span style={ss.statLab}>{s.lab}</span>
            <span style={ss.statSub}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* 7-day XP chart */}
      <h3 style={ss.sectionTitle}>XP – 7 ימים אחרונים</h3>
      <div style={ss.chart}>
        {xpByDay.map((val,i)=>(
          <div key={i} style={ss.chartCol}>
            <div style={ss.chartBarWrap}>
              <div style={{...ss.chartBar, height:`${Math.max(4,Math.round((val/maxXp)*100))}%`, background: val>0?`linear-gradient(to top, ${C.accent}, ${C.accent2})`:`${C.border}`}}/>
            </div>
            <span style={ss.chartDay}>{['ד','ה','ו','ש','א','ב','ג'][new Date(last7[i]).getDay()]}</span>
            {val > 0 && <span style={ss.chartVal}>{val}</span>}
          </div>
        ))}
      </div>

      {/* Vocab progress */}
      <h3 style={ss.sectionTitle}>אוצר מילים לפי קטגוריה</h3>
      <div style={ss.vocabBreakdown}>
        {['tech','business','meetings'].map(cat => {
          const total = VOCAB_CARDS.filter(v=>v.category===cat).length
          const done  = VOCAB_CARDS.filter(v=>v.category===cat&&learned.includes(v.id)).length
          const pct   = total > 0 ? Math.round((done/total)*100) : 0
          const catColor = cat==='tech'?C.accent:cat==='business'?C.accent2:C.green
          return (
            <div key={cat} style={ss.vocabRow}>
              <span style={{...ss.vocabCat, color:catColor}}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</span>
              <div style={ss.vocabBar}><div style={{...ss.vocabFill, width:`${pct}%`, background:catColor}}/></div>
              <span style={ss.vocabScore}>{done}/{total}</span>
            </div>
          )
        })}
      </div>

      {/* Assessment result */}
      <h3 style={ss.sectionTitle}>מבחן רמה</h3>
      {assessment ? (
        <div style={ss.assessCard}>
          <div style={ss.assessLeft}>
            <div style={{...ss.assessBadge, background:assessLevel?.color+'22', color:assessLevel?.color, border:`1px solid ${assessLevel?.color}44`}}>
              {assessLevel?.id} – {assessLevel?.label}
            </div>
            <div style={ss.assessScore}>ציון: {assessment.score}/{ASSESSMENT_QUESTIONS.length}</div>
            <div style={ss.assessDate}>{new Date(assessment.date).toLocaleDateString('he-IL')}</div>
          </div>
          <button style={ss.retakeBtn} onClick={onRetakeAssessment}>חזור על המבחן</button>
        </div>
      ) : (
        <div style={ss.assessEmpty}>
          <p>עדיין לא עשית מבחן רמה</p>
          <button style={ss.retakeBtn} onClick={onRetakeAssessment}>עשה מבחן עכשיו</button>
        </div>
      )}

      {/* Session history */}
      {sessions.length > 0 && (
        <>
          <h3 style={ss.sectionTitle}>פעילות אחרונה</h3>
          <div style={ss.sessionList}>
            {[...sessions].reverse().slice(0,10).map((s,i)=>(
              <div key={i} style={ss.sessionRow}>
                <span style={ss.sessionIcon}>{s.type==='convo'?'🗣️':s.type==='write'?'✍️':s.type==='vocab'?'📖':'💬'}</span>
                <div style={ss.sessionInfo}>
                  <span style={ss.sessionType}>{s.label || s.type}</span>
                  <span style={ss.sessionDate}>{new Date(s.date).toLocaleDateString('he-IL')}</span>
                </div>
                <span style={ss.sessionXp}>+{s.xp} XP</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function calcStreak(sessions) {
  if (!sessions.length) return 0
  const days = [...new Set(sessions.map(s => new Date(s.date).toDateString()))].sort((a,b)=>new Date(b)-new Date(a))
  let streak = 0, prev = new Date()
  for (const day of days) {
    const d = new Date(day)
    const diff = Math.round((prev - d) / 86400000)
    if (diff <= 1) { streak++; prev = d } else break
  }
  return streak
}

const ss = {
  page: { padding:'1.2rem' },
  pageTitle: { fontSize:20, fontWeight:700, marginBottom:'1rem' },
  sectionTitle: { fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:1.5, margin:'1.2rem 0 0.6rem' },

  levelCard: { background:C.surface, border:'1px solid', borderRadius:16, padding:'1rem 1.2rem', display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1rem' },
  levelLeft: { display:'flex', flexDirection:'column', alignItems:'center', gap:4 },
  levelBadge: { borderRadius:10, padding:'0.4rem 0.8rem', display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
  levelId: { fontSize:18, fontWeight:900 },
  levelName: { fontSize:10, fontWeight:600 },
  xpTotal: { fontSize:11, color:C.muted, fontWeight:600 },
  levelRight: { flex:1 },
  nextLabel: { fontSize:12, color:C.muted, marginBottom:'0.3rem' },
  xpBar: { height:6, background:C.border, borderRadius:99, overflow:'hidden' },
  xpFill: { height:'100%', borderRadius:99, transition:'width 0.5s' },

  statsGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem', marginBottom:'0.5rem' },
  statCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.8rem', display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
  statNum: { fontSize:24, fontWeight:800, color:C.accent },
  statLab: { fontSize:12, fontWeight:600 },
  statSub: { fontSize:10, color:C.muted },

  chart: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1rem', display:'flex', gap:'0.3rem', alignItems:'flex-end', height:120, marginBottom:'0.5rem' },
  chartCol: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', height:'100%', gap:4 },
  chartBarWrap: { flex:1, width:'100%', display:'flex', alignItems:'flex-end' },
  chartBar: { width:'100%', borderRadius:'4px 4px 0 0', minHeight:4, transition:'height 0.5s' },
  chartDay: { fontSize:10, color:C.muted, fontWeight:600 },
  chartVal: { fontSize:9, color:C.accent },

  vocabBreakdown: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1rem', display:'flex', flexDirection:'column', gap:'0.7rem' },
  vocabRow: { display:'flex', alignItems:'center', gap:'0.7rem' },
  vocabCat: { fontSize:12, fontWeight:600, minWidth:70 },
  vocabBar: { flex:1, height:6, background:C.border, borderRadius:99, overflow:'hidden' },
  vocabFill: { height:'100%', borderRadius:99, transition:'width 0.5s' },
  vocabScore: { fontSize:11, color:C.muted, minWidth:30, textAlign:'right' },

  assessCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1rem', display:'flex', alignItems:'center', justifyContent:'space-between' },
  assessLeft: { display:'flex', flexDirection:'column', gap:4 },
  assessBadge: { fontSize:13, fontWeight:700, padding:'0.3rem 0.7rem', borderRadius:20, display:'inline-block' },
  assessScore: { fontSize:12, color:C.dim },
  assessDate: { fontSize:11, color:C.muted },
  assessEmpty: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1rem', display:'flex', alignItems:'center', justifyContent:'space-between', color:C.muted, fontSize:13 },
  retakeBtn: { background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.5rem 0.9rem', color:C.dim, fontSize:12, cursor:'pointer' },

  sessionList: { display:'flex', flexDirection:'column', gap:2 },
  sessionRow: { display:'flex', alignItems:'center', gap:'0.7rem', padding:'0.6rem 0.8rem', background:C.surface, borderRadius:8 },
  sessionIcon: { fontSize:16 },
  sessionInfo: { flex:1, display:'flex', flexDirection:'column', gap:2 },
  sessionType: { fontSize:13, fontWeight:600 },
  sessionDate: { fontSize:11, color:C.muted },
  sessionXp: { fontSize:12, color:C.green, fontWeight:700 },
}
