// ─── Vocab ────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { C } from '../theme.js'
import { VOCAB_CARDS } from '../data/vocab.js'
import { PHRASES } from '../data/phrases.js'
import { SCENARIOS } from '../data/phrases.js'
import { callClaude } from '../api.js'
import { useRef, useEffect } from 'react'

export function Vocab({ learned, markLearned }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [filter, setFilter] = useState('all')

  const cards = filter === 'all' ? VOCAB_CARDS : VOCAB_CARDS.filter(c => c.category === filter)
  const card = cards[idx] || VOCAB_CARDS[0]
  const isLearned = learned.includes(card.id)

  const next = () => { setFlipped(false); setTimeout(()=>setIdx((idx+1)%cards.length),150) }
  const prev = () => { setFlipped(false); setTimeout(()=>setIdx((idx-1+cards.length)%cards.length),150) }

  return (
    <div style={ss.page}>
      <h2 style={ss.pageTitle}>🃏 כרטיסיות מילים</h2>
      <div style={ss.filters}>
        {[['all','הכל'],['tech','🔧 Tech'],['business','💼 Business'],['meetings','🗓️ Meetings']].map(([f,l])=>(
          <button key={f} style={{...ss.filterBtn,...(filter===f?ss.filterActive:{})}} onClick={()=>{setFilter(f);setIdx(0);setFlipped(false)}}>{l}</button>
        ))}
      </div>
      <div style={ss.counter}>{idx+1} / {cards.length} • {learned.length} נלמדו</div>
      <div style={{...ss.flashcard,...(flipped?ss.flipped:{})}} onClick={()=>setFlipped(!flipped)} className="hover-lift">
        {!flipped ? (
          <div style={ss.front}>
            <div style={ss.cat}>{card.category}</div>
            <div style={ss.word}>{card.word}</div>
            <div style={ss.hint}>לחץ לתרגום ←</div>
            {isLearned && <div style={ss.learnedBadge}>✓ ידוע</div>}
          </div>
        ) : (
          <div style={ss.back}>
            <div style={ss.he}>{card.he}</div>
            <div style={ss.def}>{card.def}</div>
            <div style={ss.ex}>"{card.example}"</div>
          </div>
        )}
      </div>
      <div style={ss.controls}>
        <button style={ss.ctrl} onClick={prev}>← הקודם</button>
        <button style={{...ss.ctrl,...ss.ctrlPrimary}} onClick={()=>{markLearned(card.id);next()}}>
          {isLearned ? 'הבא →' : '✓ ידוע +10XP'}
        </button>
        <button style={ss.ctrl} onClick={next}>הבא →</button>
      </div>
      <h3 style={ss.listTitle}>כל המילים</h3>
      <div style={ss.wordList}>
        {cards.map((c,i)=>(
          <div key={c.id} style={{...ss.wordRow,...(learned.includes(c.id)?ss.wordDone:{})}} onClick={()=>{setIdx(i);setFlipped(false);window.scrollTo(0,0)}}>
            <span style={ss.wordEn}>{c.word}</span>
            <span style={ss.wordHe}>{c.he}</span>
            {learned.includes(c.id)&&<span style={{color:C.green,fontSize:12}}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Convo ────────────────────────────────────────────────────────────────────

export function Convo({ addXp, logSession }) {
  const [scenario, setScenario] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const bottomRef = useRef()

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) },[msgs])

  const startScenario = async (sc) => {
    setScenario(sc); setMsgs([]); setLoading(true); setMsgCount(0)
    const opening = await callClaude([{role:'user',content:'Start the conversation now with a short opening line.'}],
      sc.prompt + ' Keep all responses to 2-4 sentences max. Use natural professional English.')
    setMsgs([{role:'assistant',content:opening}])
    setLoading(false)
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = {role:'user',content:input}
    const newMsgs = [...msgs, userMsg]
    setMsgs(newMsgs); setInput(''); setLoading(true)
    addXp(5)
    const newCount = msgCount + 1
    setMsgCount(newCount)
    const tipInstruction = newCount % 3 === 0 ? ' After your reply, add a short language tip in Hebrew in parentheses starting with "טיפ:".' : ''
    const reply = await callClaude(newMsgs, sc.prompt + ' Keep responses to 2-4 sentences.' + tipInstruction)
    setMsgs([...newMsgs, {role:'assistant',content:reply}])
    setLoading(false)
    if (newCount === 1) logSession({ type:'convo', label:scenario.label, xp:5 })
  }

  const sc = scenario

  if (!scenario) return (
    <div style={ss.page}>
      <h2 style={ss.pageTitle}>🗣️ תרגול שיחה עם AI</h2>
      <p style={ss.sub}>בחר תרחיש ושוחח באנגלית עם Claude. כל הודעה = +5 XP</p>
      <div style={ss.scenarioGrid}>
        {SCENARIOS.map(sc=>(
          <button key={sc.id} style={ss.scenarioCard} onClick={()=>startScenario(sc)} className="hover-lift">
            <span style={ss.scenarioIcon}>{sc.icon}</span>
            <span style={ss.scenarioLabel}>{sc.label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={ss.page}>
      <div style={ss.chatHeader}>
        <button style={ss.backBtn} onClick={()=>setScenario(null)}>← חזרה</button>
        <span style={ss.chatTitle}>{sc.icon} {sc.label}</span>
        <span style={{fontSize:11,color:C.green,fontWeight:600}}>+5 XP/msg</span>
      </div>
      <div style={ss.chatBody}>
        {msgs.map((m,i)=>(
          <div key={i} style={{...ss.bubble,...(m.role==='user'?ss.bubbleUser:ss.bubbleBot)}}>{m.content}</div>
        ))}
        {loading&&<div style={{...ss.bubble,...ss.bubbleBot,...ss.dotWrap}} className="dot-bounce"><span>●</span><span>●</span><span>●</span></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={ss.chatInputRow}>
        <input style={ss.chatInput} value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Type in English..." disabled={loading}/>
        <button style={ss.sendBtn} onClick={send} disabled={loading||!input.trim()}>→</button>
      </div>
    </div>
  )
}

// ─── Phrases ──────────────────────────────────────────────────────────────────

export function Phrases({ addXp }) {
  const [saved, setSaved] = useState(()=>{try{return JSON.parse(localStorage.getItem('ep_saved'))||[]}catch{return[]}})
  const [expanded, setExpanded] = useState(null)
  const [tab, setTab] = useState(0)

  const toggleSave = (phrase) => {
    const next = saved.includes(phrase)?saved.filter(p=>p!==phrase):[...saved,phrase]
    setSaved(next); localStorage.setItem('ep_saved',JSON.stringify(next))
    if(!saved.includes(phrase)) addXp(3)
  }

  const allTabs = [...PHRASES.map(p=>p.cat),'שמורים ⭐']

  return (
    <div style={ss.page}>
      <h2 style={ss.pageTitle}>💬 ביטויים מקצועיים</h2>
      <div style={ss.tabs}>
        {allTabs.map((t,i)=>(
          <button key={t} style={{...ss.tab,...(tab===i?ss.tabActive:{})}} onClick={()=>setTab(i)}>{t}</button>
        ))}
      </div>
      <div style={ss.phraseList}>
        {tab < PHRASES.length ? PHRASES[tab].items.map((item,i)=>(
          <div key={i} style={ss.phraseCard}>
            <div style={ss.phraseTop} onClick={()=>setExpanded(expanded===`${tab}-${i}`?null:`${tab}-${i}`)}>
              <span style={ss.phraseText}>"{item.phrase}"</span>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <button style={{...ss.starBtn,...(saved.includes(item.phrase)?{color:C.yellow}:{})}} onClick={e=>{e.stopPropagation();toggleSave(item.phrase)}}>
                  {saved.includes(item.phrase)?'★':'☆'}
                </button>
                <span style={{color:C.muted,fontSize:11}}>{expanded===`${tab}-${i}`?'▲':'▼'}</span>
              </div>
            </div>
            {expanded===`${tab}-${i}`&&(
              <div style={ss.phraseDetails}>
                <p style={ss.phraseMeaning}><strong>משמעות:</strong> {item.meaning}</p>
                <p style={ss.phraseContext}><strong>מתי:</strong> {item.context}</p>
              </div>
            )}
          </div>
        )) : (
          saved.length===0
            ? <div style={ss.emptyState}>לחץ ☆ על ביטוי כדי לשמור אותו כאן. +3 XP לכל שמירה.</div>
            : saved.map((phrase,i)=><div key={i} style={ss.phraseCard}><div style={ss.phraseTop}><span style={ss.phraseText}>"{phrase}"</span><button style={{...ss.starBtn,color:C.yellow}} onClick={()=>toggleSave(phrase)}>★</button></div></div>)
        )}
      </div>
    </div>
  )
}

// ─── Write ────────────────────────────────────────────────────────────────────

export function Write({ addXp, logSession }) {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('free')

  const PROMPTS = [
    { label:'עדכון סטנד-אפ',      starter:'Write a daily standup: what you did yesterday, what you\'re doing today, and blockers.' },
    { label:'בקשת הארכת דדליין',   starter:'Write an email to your manager asking for a deadline extension on a feature.' },
    { label:'תיאור באג',           starter:'Describe a bug you found: what it is, how it was triggered, and what the impact is.' },
    { label:'הודעת Slack לעמית',   starter:'Write a Slack message asking a colleague to review your code before the sprint ends.' },
    { label:'סיכום פגישה',         starter:'Write a brief meeting summary with key decisions and action items.' },
    { label:'הצגת פיצ\'ר חדש',     starter:'Write a short pitch for a new feature you want to add to the product.' },
  ]

  const analyze = async () => {
    if (!text.trim()||loading) return
    setLoading(true); addXp(15)
    const fb = await callClaude([{role:'user',content:text}],
      `You are a professional English writing coach for Israeli tech workers. Analyze the text and provide:
1. **Overall Assessment** (1-2 sentences)  
2. **Grammar & Spelling** — list errors with corrections (or "No errors found ✅")
3. **Tone & Professionalism** — is it appropriate for tech/business?
4. **Improved Version** — a rewritten, polished version
5. **טיפים בעברית** — 2-3 actionable tips in Hebrew

Be specific, encouraging, and practical.`)
    setFeedback(fb)
    setLoading(false)
    logSession({ type:'write', label:'תיקון כתיבה', xp:15 })
  }

  return (
    <div style={ss.page}>
      <h2 style={ss.pageTitle}>✍️ תיקון כתיבה</h2>
      <p style={ss.sub}>כתוב אנגלית וקבל משוב מ-AI • +15 XP לכל ניתוח</p>
      <div style={ss.tabs}>
        <button style={{...ss.tab,...(mode==='free'?ss.tabActive:{})}} onClick={()=>{setMode('free');setFeedback(null)}}>כתיבה חופשית</button>
        <button style={{...ss.tab,...(mode==='prompt'?ss.tabActive:{})}} onClick={()=>{setMode('prompt');setFeedback(null)}}>נושאים מוכנים</button>
      </div>
      {mode==='prompt'&&(
        <div style={ss.promptGrid}>
          {PROMPTS.map((p,i)=>(
            <button key={i} style={ss.promptBtn} onClick={()=>{setText(p.starter);setFeedback(null)}}>{p.label}</button>
          ))}
        </div>
      )}
      <textarea style={ss.textarea} value={text} onChange={e=>setText(e.target.value)}
        placeholder="Write anything in English — email, Slack message, standup update, technical explanation..."/>
      <button style={{...ss.analyzeBtn,...(!text.trim()||loading?{opacity:0.4,cursor:'not-allowed'}:{})}} onClick={analyze} disabled={!text.trim()||loading}>
        {loading?'מנתח...':'🔍 נתח ותקן +15 XP'}
      </button>
      {feedback&&(
        <div style={ss.feedbackBox}>
          <div style={ss.feedbackTitle}>📝 משוב</div>
          <div style={ss.feedbackText}>
            {feedback.split('\n').map((line,i)=>(
              <p key={i} style={/^\d\.|^\*\*/.test(line)?{fontWeight:700,marginTop:'0.8rem',color:C.text}:{color:C.dim,margin:'0.2rem 0'}}>
                {line.replace(/\*\*/g,'')}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const ss = {
  page: { padding:'1.2rem' },
  pageTitle: { fontSize:20, fontWeight:700, marginBottom:'0.6rem' },
  sub: { color:C.muted, fontSize:13, marginBottom:'1rem' },
  listTitle: { fontSize:12, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:1, margin:'1.2rem 0 0.5rem' },

  // vocab
  filters: { display:'flex', gap:'0.4rem', marginBottom:'1rem', flexWrap:'wrap' },
  filterBtn: { padding:'0.4rem 0.8rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, color:C.muted, fontSize:12, cursor:'pointer' },
  filterActive: { background:`${C.accent}22`, border:`1px solid ${C.accent}`, color:C.accent, fontWeight:700 },
  counter: { textAlign:'center', fontSize:12, color:C.muted, marginBottom:'0.8rem' },
  flashcard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:'2rem 1.5rem', minHeight:200, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem', textAlign:'center' },
  flipped: { background:`linear-gradient(135deg,#0f1f3d,#1a1040)`, border:`1px solid ${C.accent}44` },
  front: {}, back: {},
  cat: { fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:2, marginBottom:'0.8rem' },
  word: { fontSize:34, fontWeight:800, letterSpacing:-1, marginBottom:'0.5rem' },
  hint: { fontSize:12, color:C.muted },
  he: { fontSize:22, fontWeight:700, color:C.accent, marginBottom:'0.6rem' },
  def: { fontSize:14, color:C.dim, marginBottom:'0.8rem', lineHeight:1.5 },
  ex: { fontSize:13, color:C.muted, fontStyle:'italic' },
  learnedBadge: { position:'absolute', top:12, right:12, background:`${C.green}22`, color:C.green, border:`1px solid ${C.green}44`, padding:'0.2rem 0.5rem', borderRadius:20, fontSize:11, fontWeight:600 },
  controls: { display:'flex', gap:'0.5rem', marginBottom:'1.2rem' },
  ctrl: { flex:1, padding:'0.7rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, color:C.dim, fontSize:13, cursor:'pointer' },
  ctrlPrimary: { background:`linear-gradient(135deg,${C.accent},${C.accent2})`, color:'#fff', fontWeight:700, border:'none' },
  wordList: { display:'flex', flexDirection:'column', gap:2 },
  wordRow: { display:'flex', alignItems:'center', padding:'0.7rem 0.8rem', background:C.surface, borderRadius:8, cursor:'pointer', gap:'0.5rem', fontSize:13, border:'1px solid transparent' },
  wordDone: { borderColor:`${C.green}33`, background:`${C.green}08` },
  wordEn: { flex:1, fontWeight:600 },
  wordHe: { color:C.muted, fontSize:12 },

  // convo
  scenarioGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.7rem' },
  scenarioCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1.2rem', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' },
  scenarioIcon: { fontSize:28 },
  scenarioLabel: { fontSize:13, fontWeight:600, textAlign:'center' },
  chatHeader: { display:'flex', alignItems:'center', gap:'0.5rem', paddingBottom:'0.8rem', marginBottom:'0.5rem', borderBottom:`1px solid ${C.border}` },
  backBtn: { background:'none', border:'none', color:C.accent, cursor:'pointer', fontSize:13 },
  chatTitle: { flex:1, fontWeight:700, fontSize:15 },
  chatBody: { display:'flex', flexDirection:'column', gap:'0.7rem', minHeight:280, maxHeight:400, overflowY:'auto', paddingBottom:'0.5rem' },
  bubble: { maxWidth:'85%', padding:'0.8rem 1rem', borderRadius:14, fontSize:14, lineHeight:1.5, whiteSpace:'pre-wrap' },
  bubbleBot: { background:C.surface2, border:`1px solid ${C.border}`, alignSelf:'flex-start', borderBottomLeftRadius:4 },
  bubbleUser: { background:`linear-gradient(135deg,${C.accent}cc,${C.accent2}cc)`, color:'#fff', alignSelf:'flex-end', borderBottomRightRadius:4 },
  dotWrap: { display:'flex', gap:6, alignItems:'center', padding:'1rem', color:C.muted },
  chatInputRow: { display:'flex', gap:'0.5rem', paddingTop:'0.8rem', borderTop:`1px solid ${C.border}` },
  chatInput: { flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem 1rem', color:C.text, fontSize:14 },
  sendBtn: { background:`linear-gradient(135deg,${C.accent},${C.accent2})`, border:'none', borderRadius:10, padding:'0 1.2rem', color:'#fff', cursor:'pointer', fontSize:18, fontWeight:700 },

  // phrases
  tabs: { display:'flex', gap:'0.3rem', marginBottom:'1rem', overflowX:'auto', paddingBottom:'0.2rem' },
  tab: { flexShrink:0, padding:'0.4rem 0.9rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, color:C.muted, fontSize:12, cursor:'pointer', whiteSpace:'nowrap' },
  tabActive: { background:`${C.accent}22`, border:`1px solid ${C.accent}`, color:C.accent, fontWeight:700 },
  phraseList: { display:'flex', flexDirection:'column', gap:'0.5rem' },
  phraseCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' },
  phraseTop: { display:'flex', alignItems:'center', padding:'0.9rem 1rem', cursor:'pointer', gap:'0.5rem' },
  phraseText: { flex:1, fontWeight:600, fontSize:14, color:C.accent },
  starBtn: { background:'none', border:'none', cursor:'pointer', fontSize:18, color:C.muted, padding:0 },
  phraseDetails: { padding:'0 1rem 1rem', borderTop:`1px solid ${C.border}` },
  phraseMeaning: { fontSize:13, color:C.dim, marginTop:'0.7rem', lineHeight:1.5 },
  phraseContext: { fontSize:12, color:C.muted, marginTop:'0.4rem', lineHeight:1.5 },
  emptyState: { textAlign:'center', color:C.muted, padding:'3rem 0', fontSize:14 },

  // write
  promptGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1rem' },
  promptBtn: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem', color:C.dim, fontSize:12, cursor:'pointer', textAlign:'left', lineHeight:1.4 },
  textarea: { width:'100%', minHeight:140, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, padding:'1rem', color:C.text, fontSize:14, resize:'vertical', lineHeight:1.6, boxSizing:'border-box', marginBottom:'0.8rem' },
  analyzeBtn: { width:'100%', padding:'0.9rem', background:`linear-gradient(135deg,${C.accent},${C.accent2})`, color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:15, cursor:'pointer', marginBottom:'1rem' },
  feedbackBox: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1.2rem' },
  feedbackTitle: { fontWeight:700, marginBottom:'0.8rem', fontSize:15 },
  feedbackText: { lineHeight:1.6 },
}
