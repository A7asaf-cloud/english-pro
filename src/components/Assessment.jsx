import { useState } from 'react'
import { C, getLevelByScore } from '../theme.js'
import { ASSESSMENT_QUESTIONS, LEVEL_DESCRIPTIONS } from '../data/assessment.js'

export default function Assessment({ onComplete, existingResult }) {
  const [step, setStep] = useState(existingResult ? 'result' : 'intro') // intro | quiz | result
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)
  const [showExplain, setShowExplain] = useState(false)

  const q = ASSESSMENT_QUESTIONS[qIdx]
  const totalQ = ASSESSMENT_QUESTIONS.length

  const score = existingResult?.score ?? Object.entries(answers).filter(([id, ans]) => {
    const q = ASSESSMENT_QUESTIONS.find(q => q.id === id)
    return q && ans === q.answer
  }).length

  const result = existingResult || getLevelByScore(score)
  const desc = LEVEL_DESCRIPTIONS[result.id] || LEVEL_DESCRIPTIONS['B1']

  const typeColors = { grammar: C.accent, vocab: C.green, tech: C.accent2, comprehension: C.yellow }

  function handleSelect(idx) {
    if (showExplain) return
    setSelected(idx)
    setShowExplain(true)
    setAnswers(prev => ({ ...prev, [q.id]: idx }))
  }

  function nextQ() {
    setShowExplain(false)
    setSelected(null)
    if (qIdx + 1 >= totalQ) {
      const finalScore = Object.entries({ ...answers, [q.id]: selected }).filter(([id, ans]) => {
        const qq = ASSESSMENT_QUESTIONS.find(q => q.id === id)
        return qq && ans === qq.answer
      }).length
      const level = getLevelByScore(finalScore)
      onComplete({ score: finalScore, level: level.id, date: new Date().toISOString() })
      setStep('result')
    } else {
      setQIdx(qIdx + 1)
    }
  }

  if (step === 'intro') return (
    <div style={ss.page} className="fade-in">
      <div style={ss.introCard}>
        <div style={ss.introEmoji}>🎯</div>
        <h1 style={ss.introTitle}>בואו נגלה את הרמה שלך</h1>
        <p style={ss.introSub}>מבחן אבחוני קצר של {totalQ} שאלות — בדיקת דקדוק, אוצר מילים, אנגלית טכנית והבנת הנקרא.</p>
        <div style={ss.introBadges}>
          {[{icon:'⏱️',text:'~8 דקות'},{icon:'📊',text:'15 שאלות'},{icon:'🎯',text:'5 רמות'}].map((b,i)=>(
            <div key={i} style={ss.introBadge}><span>{b.icon}</span><span>{b.text}</span></div>
          ))}
        </div>
        <div style={ss.introTypes}>
          {[['grammar','Grammar','דקדוק'],['vocab','Vocabulary','אוצר מילים'],['tech','Tech English','אנגלית טכנית'],['comprehension','Reading','הבנת הנקרא']].map(([type,en,he])=>(
            <div key={type} style={{...ss.typeTag, background: typeColors[type]+'22', color: typeColors[type], border:`1px solid ${typeColors[type]}44`}}>
              <span style={{fontWeight:700}}>{en}</span><span style={{fontSize:10,opacity:0.8}}>{he}</span>
            </div>
          ))}
        </div>
        <button style={ss.startBtn} onClick={()=>setStep('quiz')}>התחל מבחן →</button>
      </div>
    </div>
  )

  if (step === 'result') {
    const levelData = getLevelByScore(score)
    const dsc = LEVEL_DESCRIPTIONS[levelData.id]
    const pct = Math.round((score / totalQ) * 100)
    return (
      <div style={ss.page} className="fade-in">
        <div style={ss.resultCard}>
          <div style={{...ss.levelBadgeBig, background: levelData.color+'22', border:`2px solid ${levelData.color}`, color: levelData.color}}>
            <span style={ss.levelId}>{levelData.id}</span>
            <span style={ss.levelLabel}>{levelData.label}</span>
          </div>
          {!existingResult && <div style={ss.scoreRow}><span style={ss.scoreNum}>{score}</span><span style={ss.scoreDen}>/{totalQ}</span><span style={ss.scorePct}> ({pct}%)</span></div>}
          {existingResult && <p style={ss.existingNote}>תוצאת המבחן האחרון שלך</p>}
          <p style={ss.resultDesc}>{dsc?.desc}</p>

          {dsc?.tips && (
            <div style={ss.tipsBox}>
              <div style={ss.tipsTitle}>מה כדאי לתרגל:</div>
              {dsc.tips.map((tip,i)=>(
                <div key={i} style={ss.tipItem}>→ {tip}</div>
              ))}
            </div>
          )}

          {/* Score breakdown */}
          {!existingResult && (
            <div style={ss.breakdown}>
              {['grammar','vocab','tech','comprehension'].map(type => {
                const typeQs = ASSESSMENT_QUESTIONS.filter(q=>q.type===type)
                const correct = typeQs.filter(q=>answers[q.id]===q.answer).length
                const pct = Math.round((correct/typeQs.length)*100)
                return (
                  <div key={type} style={ss.breakRow}>
                    <span style={{...ss.breakType, color: typeColors[type]}}>{ASSESSMENT_QUESTIONS.find(q=>q.type===type)?.label}</span>
                    <div style={ss.breakBar}><div style={{...ss.breakFill, width:`${pct}%`, background: typeColors[type]}}/></div>
                    <span style={ss.breakScore}>{correct}/{typeQs.length}</span>
                  </div>
                )
              })}
            </div>
          )}

          <button style={ss.doneBtn} onClick={()=>onComplete(existingResult || { score, level: levelData.id, date: new Date().toISOString() })}>
            {existingResult ? 'חזור לאפליקציה' : 'התחל ללמוד! 🚀'}
          </button>
          {!existingResult && <button style={ss.retakeBtn} onClick={()=>{setStep('quiz');setQIdx(0);setAnswers({});setSelected(null);setShowExplain(false);}}>חזור על המבחן</button>}
        </div>
      </div>
    )
  }

  // Quiz
  const progress = ((qIdx) / totalQ) * 100
  const typeColor = typeColors[q.type] || C.accent

  return (
    <div style={ss.page} className="slide-up">
      {/* Progress */}
      <div style={ss.quizHeader}>
        <div style={ss.qProgress}><div style={{...ss.qProgressFill, width:`${progress}%`, background: typeColor}}/></div>
        <div style={ss.qMeta}>
          <span style={{...ss.qType, color: typeColor}}>{q.label}</span>
          <span style={ss.qCount}>{qIdx+1}/{totalQ}</span>
        </div>
      </div>

      {/* Question */}
      <div style={ss.questionCard}>
        <p style={ss.questionText}>{q.question}</p>
      </div>

      {/* Options */}
      <div style={ss.options}>
        {q.options.map((opt, i) => {
          let bg = C.surface, border = C.border, color = C.text
          if (showExplain) {
            if (i === q.answer) { bg = `${C.green}18`; border = C.green; color = C.green }
            else if (i === selected && i !== q.answer) { bg = '#f43f5e18'; border = '#f43f5e'; color = '#f43f5e' }
          } else if (selected === i) {
            bg = `${typeColor}18`; border = typeColor; color = typeColor
          }
          return (
            <button key={i} style={{...ss.option, background:bg, borderColor:border, color}} onClick={()=>handleSelect(i)}>
              <span style={ss.optLetter}>{String.fromCharCode(65+i)}</span>
              <span style={ss.optText}>{opt}</span>
              {showExplain && i === q.answer && <span style={ss.optCheck}>✓</span>}
              {showExplain && i === selected && i !== q.answer && <span style={ss.optX}>✗</span>}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showExplain && (
        <div style={{...ss.explain, borderColor: selected===q.answer?C.green:'#f43f5e'}}>
          <div style={ss.explainTitle}>{selected===q.answer?'✅ נכון!':'❌ לא נכון'}</div>
          <p style={ss.explainText}>{q.explanation}</p>
        </div>
      )}

      {showExplain && (
        <button style={ss.nextBtn} onClick={nextQ}>
          {qIdx+1 < totalQ ? 'שאלה הבאה →' : 'ראה תוצאות →'}
        </button>
      )}
    </div>
  )
}

const ss = {
  page: { padding:'1.2rem', maxWidth:480 },
  introCard: { background: C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'2rem 1.5rem', textAlign:'center' },
  introEmoji: { fontSize:52, marginBottom:'1rem' },
  introTitle: { fontSize:22, fontWeight:800, marginBottom:'0.5rem' },
  introSub: { color:C.dim, fontSize:14, lineHeight:1.6, marginBottom:'1.5rem' },
  introBadges: { display:'flex', justifyContent:'center', gap:'0.5rem', marginBottom:'1.2rem' },
  introBadge: { display:'flex', gap:4, alignItems:'center', background:C.surface2, border:`1px solid ${C.border}`, padding:'0.3rem 0.7rem', borderRadius:20, fontSize:12, color:C.dim },
  introTypes: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1.5rem' },
  typeTag: { display:'flex', flexDirection:'column', alignItems:'center', padding:'0.6rem', borderRadius:10, gap:2, fontSize:13 },
  startBtn: { width:'100%', padding:'0.9rem', background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`, border:'none', borderRadius:12, color:'#fff', fontSize:16, fontWeight:700, cursor:'pointer' },

  quizHeader: { marginBottom:'1rem' },
  qProgress: { height:4, background:C.border, borderRadius:99, overflow:'hidden', marginBottom:'0.6rem' },
  qProgressFill: { height:'100%', borderRadius:99, transition:'width 0.4s' },
  qMeta: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  qType: { fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1 },
  qCount: { fontSize:12, color:C.muted },

  questionCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1.2rem', marginBottom:'1rem' },
  questionText: { fontSize:15, lineHeight:1.6, whiteSpace:'pre-line' },

  options: { display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1rem' },
  option: { display:'flex', alignItems:'flex-start', gap:'0.8rem', padding:'0.8rem 1rem', border:'1px solid', borderRadius:12, cursor:'pointer', textAlign:'left', transition:'all 0.15s' },
  optLetter: { fontWeight:700, fontSize:13, minWidth:18 },
  optText: { flex:1, fontSize:14, lineHeight:1.5 },
  optCheck: { color:C.green, fontWeight:700 },
  optX: { color:'#f43f5e', fontWeight:700 },

  explain: { background:`${C.surface}`, border:'1px solid', borderRadius:12, padding:'1rem', marginBottom:'1rem' },
  explainTitle: { fontWeight:700, marginBottom:'0.4rem', fontSize:14 },
  explainText: { color:C.dim, fontSize:13, lineHeight:1.6 },

  nextBtn: { width:'100%', padding:'0.9rem', background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`, border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' },

  resultCard: { background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'1.5rem' },
  levelBadgeBig: { borderRadius:16, padding:'1rem', textAlign:'center', marginBottom:'1rem', display:'flex', flexDirection:'column', alignItems:'center', gap:4 },
  levelId: { fontSize:28, fontWeight:900, letterSpacing:-1 },
  levelLabel: { fontSize:14, fontWeight:600 },
  scoreRow: { textAlign:'center', marginBottom:'0.8rem' },
  scoreNum: { fontSize:36, fontWeight:800, color:C.accent },
  scoreDen: { fontSize:20, color:C.muted },
  scorePct: { fontSize:16, color:C.muted },
  existingNote: { textAlign:'center', color:C.muted, fontSize:12, marginBottom:'0.8rem' },
  resultDesc: { color:C.dim, fontSize:14, lineHeight:1.6, marginBottom:'1rem', textAlign:'center' },

  tipsBox: { background:C.surface2, borderRadius:12, padding:'1rem', marginBottom:'1rem' },
  tipsTitle: { fontWeight:700, fontSize:13, marginBottom:'0.6rem', color:C.dim },
  tipItem: { fontSize:13, color:C.dim, lineHeight:1.7 },

  breakdown: { marginBottom:'1.2rem' },
  breakRow: { display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.5rem' },
  breakType: { fontSize:12, fontWeight:600, minWidth:90 },
  breakBar: { flex:1, height:6, background:C.border, borderRadius:99, overflow:'hidden' },
  breakFill: { height:'100%', borderRadius:99, transition:'width 0.6s' },
  breakScore: { fontSize:12, color:C.muted, minWidth:24, textAlign:'right' },

  doneBtn: { width:'100%', padding:'0.9rem', background:`linear-gradient(135deg, ${C.accent}, ${C.accent2})`, border:'none', borderRadius:12, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', marginBottom:'0.5rem' },
  retakeBtn: { width:'100%', padding:'0.7rem', background:'none', border:`1px solid ${C.border}`, borderRadius:12, color:C.muted, fontSize:13, cursor:'pointer' },
}
