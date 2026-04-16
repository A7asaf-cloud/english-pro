# ProEnglish 🇬🇧

אפליקציה אישית ללימוד אנגלית מקצועית לאנשי הייטק.

## מה יש באפליקציה

| מודול | תיאור |
|-------|--------|
| 📊 הערכת רמה | מבחן אבחוני ראשוני + מעקב רמה לאורך זמן |
| 🃏 כרטיסיות | מילים טכניות ועסקיות עם Spaced Repetition |
| 🗣️ שיחה עם AI | תרחישים: standup, code review, interview, small talk |
| 💬 ביטויים | meetings, emails, disagreement – עם מועדפים |
| ✍️ תיקון כתיבה | AI feedback מלא + גרסה משופרת |
| 📈 התקדמות | גרף XP, session history, streak, רמה נוכחית |

## הפעלה

```bash
npm install
npm run dev
```

## דרישות

- Node.js 18+
- מפתח API של Anthropic (נדרש לתכונות AI)

### הגדרת API Key

צור קובץ `.env.local`:
```
VITE_ANTHROPIC_KEY=sk-ant-...
```

> ⚠️ אל תעלה את `.env.local` ל-Git! הוא כבר נמצא ב-`.gitignore`.

## מבנה הפרויקט

```
src/
├── components/
│   ├── Assessment.jsx   # מבחן רמה
│   ├── Home.jsx         # דשבורד ראשי
│   ├── Vocab.jsx        # כרטיסיות מילים
│   ├── Convo.jsx        # שיחה עם AI
│   ├── Phrases.jsx      # ביטויים מקצועיים
│   ├── Write.jsx        # תיקון כתיבה
│   └── Progress.jsx     # מעקב התקדמות
├── data/
│   ├── vocab.js
│   ├── phrases.js
│   ├── scenarios.js
│   └── assessment.js
├── hooks/
│   └── useStorage.js
├── api.js               # Anthropic API wrapper
├── theme.js             # עיצוב וצבעים
├── App.jsx
└── main.jsx
```

## מעקב התקדמות

כל הנתונים נשמרים ב-`localStorage` תחת מפתחות:
- `ep_profile` – פרופיל משתמש + הגדרות
- `ep_progress` – session history + XP
- `ep_learned` – מילים שנלמדו
- `ep_saved` – ביטויים שמורים
- `ep_assessment` – תוצאות מבחן

## Build

```bash
npm run build
# dist/ folder ready for deployment
```
