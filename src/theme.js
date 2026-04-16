export const C = {
  bg:       '#0a0f1a',
  surface:  '#111827',
  surface2: '#1a2235',
  surface3: '#1e293b',
  border:   '#1e2d47',
  accent:   '#38bdf8',
  accent2:  '#818cf8',
  green:    '#10b981',
  yellow:   '#f59e0b',
  red:      '#f43f5e',
  text:     '#e2e8f0',
  muted:    '#64748b',
  dim:      '#94a3b8',
}

export const LEVELS = [
  { id: 'A2',  label: 'Beginner',           color: '#64748b', min: 0,  max: 4  },
  { id: 'B1',  label: 'Elementary',         color: '#10b981', min: 5,  max: 8  },
  { id: 'B2',  label: 'Intermediate',       color: '#38bdf8', min: 9,  max: 11 },
  { id: 'B2+', label: 'Upper-Intermediate', color: '#818cf8', min: 12, max: 13 },
  { id: 'C1',  label: 'Advanced',           color: '#f59e0b', min: 14, max: 15 },
]

export function getLevelByScore(score) {
  return LEVELS.find(l => score >= l.min && score <= l.max) || LEVELS[0]
}

export function getLevelByXp(xp) {
  if (xp < 150)  return LEVELS[0]
  if (xp < 400)  return LEVELS[1]
  if (xp < 800)  return LEVELS[2]
  if (xp < 1400) return LEVELS[3]
  return LEVELS[4]
}

export const CSS_GLOBAL = `
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { background: #0a0f1a; color: #e2e8f0; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e2d47; border-radius: 4px; }
  input, textarea, button { font-family: inherit; }
  input::placeholder, textarea::placeholder { color: #475569; }
  textarea:focus, input:focus { border-color: #38bdf8 !important; outline: none; }
  .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .hover-lift:active { transform: scale(0.97); }
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  .dot-bounce span { animation: db 1.2s infinite; display:inline-block; font-size:8px; }
  .dot-bounce span:nth-child(2) { animation-delay:.2s; }
  .dot-bounce span:nth-child(3) { animation-delay:.4s; }
  @keyframes db { 0%,60%,100% { transform:translateY(0); opacity:0.3; } 30% { transform:translateY(-6px); opacity:1; } }
  .fade-in { animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .slide-up { animation: slideUp 0.35s ease; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
`
