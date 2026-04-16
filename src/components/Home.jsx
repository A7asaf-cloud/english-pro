import { C, getLevelByXp } from '../theme.js'
import { VOCAB_CARDS } from '../data/vocab.js'

export default function Home({ learned, xp, streak, setPage }) {
  const total = VOCAB_CARDS.length
  const pct   = Math.round((learned.length / total) * 100)
  const level = getLevelByXp(xp)

  const cards = [
    { icon:'📚', title:'מילים טכניות',      sub:`${learned.length}/${total} נלמדו`, page:'vocab',    color: C.accent },
    { icon:'🗣️', title:'תרגול שיחה',        sub:'סמולייטור AI',                    page:'convo',    color: C.accent2 },
    { icon:'💬', title:'ביטויים מקצועיים',   sub:'meetings · emails · presenting',  page:'phrases',  color: C.green },
    { icon:'✍️', title:'תיקון כתיבה',        sub:'AI Feedback',                     page:'write',    color: C.yellow },
    { icon:'📈', title:'ההתקדמות שלי',       sub:'XP · streak · היסטוריה',          page:'progress', color:'#f472b6' },
  ]

  const tips = [
    { en: '"I\'d like to flag something"', he: 'במקום "I have a problem" — נשמע הרבה יותר מקצועי ב-meetings' },
    { en: '"Let me loop you in"', he: 'לוסף מישהו לשרשרת מייל, ולא רק "I will add you"' },
    { en: '"Does that resonate with you?"', he: 'שאלה אלגנטית לבדיקת הסכמה בסוף הסבר ארוך' },
    { en: '"I\'ll take that as an action item"', he: 'בסוף פגישה, כדי לאשר שאתה לוקח אחריות על משימה' },
  ]
  const tip = tips[new Date().getDay() % tips.length]

  return (
    <div style={ss.page}>
      {/* Hero */}
      <div style={{...ss.hero, borderColor: level.color+'44'}}>
        <div style={{...ss.levelPill, background:level.color+'22', color:level.color}}>
          {level.id} · {level.label}
        </div>
        <h1 style={ss.heroTitle}>בוקר טוב! 👋</h1>
        <p style={ss.heroSub}>מוכן לאנגלית מקצועית של היום?</p>
        <div style={ss.progressWrap}>
          <div style={ss.progressLabels}><span>אוצר מילים</span><span>{pct}%</span></div>
          <div style={ss.progressBar}><div style={{...ss.progressFill, width:`${pct}%`, background:level.color}}/></div>
        </div>
      </div>

      {/* Stats */}
      <div style={ss.stats}>
        {[{n:streak,l:'🔥 ימים'},{n:xp,l:'⚡ XP'},{n:learned.length,l:'📖 words'}].map((s,i)=>(
          <div key={i} style={ss.stat}>
            <span style={ss.statNum}>{s.n}</span>
            <span style={ss.statLab}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Cards */}
      <h2 style={ss.sectionTitle}>מה ללמוד היום?</h2>
      <div style={ss.grid}>
        {cards.map((c,i)=>(
          <button key={i} style={ss.card} onClick={()=>setPage(c.page)} className="hover-lift">
            <div style={{...ss.cardIcon, background:c.color+'22', color:c.color}}>{c.icon}</div>
            <div style={ss.cardTitle}>{c.title}</div>
            <div style={ss.cardSub}>{c.sub}</div>
            <div style={{...ss.cardArrow, color:c.color}}>→</div>
          </button>
        ))}
      </div>

      {/* Daily tip */}
      <div style={ss.tip}>
        <div style={ss.tipLabel}>💡 ביטוי היום</div>
        <p style={ss.tipEn}>{tip.en}</p>
        <p style={ss.tipHe}>{tip.he}</p>
      </div>
    </div>
  )
}

const ss = {
  page: { padding:'1.2rem' },
  sectionTitle: { fontSize:13, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:1, margin:'1.2rem 0 0.6rem' },
  hero: { background:`linear-gradient(135deg, #0f1f3d, #1a1040)`, border:'1px solid', borderRadius:16, padding:'1.4rem', marginBottom:'1rem' },
  levelPill: { display:'inline-block', fontSize:11, fontWeight:700, padding:'0.2rem 0.7rem', borderRadius:20, marginBottom:'0.6rem', letterSpacing:1 },
  heroTitle: { fontSize:24, fontWeight:800, marginBottom:'0.2rem' },
  heroSub: { color:C.dim, fontSize:14, marginBottom:'1rem' },
  progressWrap: {},
  progressLabels: { display:'flex', justifyContent:'space-between', fontSize:12, color:C.muted, marginBottom:'0.3rem' },
  progressBar: { height:6, background:C.border, borderRadius:99, overflow:'hidden' },
  progressFill: { height:'100%', borderRadius:99, transition:'width 0.5s' },
  stats: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.6rem', marginBottom:'0.5rem' },
  stat: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.8rem', textAlign:'center' },
  statNum: { display:'block', fontSize:22, fontWeight:800, color:C.accent },
  statLab: { fontSize:11, color:C.muted },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.7rem', marginBottom:'1rem' },
  card: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1rem', textAlign:'left', cursor:'pointer', position:'relative', overflow:'hidden' },
  cardIcon: { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, marginBottom:'0.6rem' },
  cardTitle: { fontWeight:700, fontSize:13, marginBottom:'0.2rem' },
  cardSub: { fontSize:11, color:C.muted },
  cardArrow: { position:'absolute', top:'0.8rem', right:'0.8rem', fontSize:16, fontWeight:700 },
  tip: { background:`${C.yellow}11`, border:`1px solid ${C.yellow}33`, borderRadius:12, padding:'1rem' },
  tipLabel: { fontSize:11, fontWeight:700, color:C.yellow, marginBottom:'0.4rem', textTransform:'uppercase', letterSpacing:1 },
  tipEn: { fontSize:15, fontWeight:700, color:C.text, marginBottom:'0.3rem' },
  tipHe: { fontSize:13, color:C.dim, lineHeight:1.5 },
}
