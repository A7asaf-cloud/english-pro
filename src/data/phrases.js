export const PHRASES = [
  {
    cat: 'Meetings',
    items: [
      { phrase: "Let's circle back on that",        meaning: "Let's return to this topic later",              context: "When a topic needs more discussion but time is limited" },
      { phrase: "Can you elaborate on that?",        meaning: "Please explain in more detail",                 context: "When you need more information" },
      { phrase: "To piggyback on what you said...", meaning: "Building on your point...",                     context: "Adding to someone's idea" },
      { phrase: "Let's take this offline",           meaning: "Let's discuss this privately/later",            context: "When a topic is too detailed for the group" },
      { phrase: "I'd like to push back on that",    meaning: "I respectfully disagree",                      context: "Expressing professional disagreement" },
      { phrase: "What's the ETA on this?",          meaning: "When will this be done?",                      context: "Asking for a deadline estimate" },
      { phrase: "Let's align on this",              meaning: "Let's make sure we all agree/understand",       context: "Before making a decision together" },
      { phrase: "Can we park that for now?",        meaning: "Let's set this aside temporarily",              context: "Keeping the meeting on track" },
    ],
  },
  {
    cat: 'Emails',
    items: [
      { phrase: "I hope this finds you well",        meaning: "A polite email opener",                         context: "Starting a formal or semi-formal email" },
      { phrase: "Per my last email...",              meaning: "As I mentioned before (firm)",                  context: "Following up on something ignored" },
      { phrase: "Please advise",                    meaning: "Tell me what to do / your opinion",             context: "Asking for guidance politely" },
      { phrase: "I'll loop you in",                 meaning: "I'll add you to the email thread",              context: "Including someone in a conversation" },
      { phrase: "As a heads up...",                 meaning: "Just so you know in advance",                   context: "Giving advance notice of something" },
      { phrase: "Happy to jump on a call",          meaning: "I'm available for a phone/video call",          context: "Offering to have a conversation" },
      { phrase: "Circling back on this",            meaning: "Following up on a previous message",            context: "When you haven't gotten a reply" },
      { phrase: "For your reference / FYI",         meaning: "Sharing information without needing action",    context: "Attaching context or background information" },
    ],
  },
  {
    cat: 'Disagreement',
    items: [
      { phrase: "That's a fair point, however...",  meaning: "I acknowledge your view but...",               context: "Polite disagreement" },
      { phrase: "I see where you're coming from",   meaning: "I understand your perspective",                 context: "Showing empathy before disagreeing" },
      { phrase: "With all due respect...",          meaning: "Respectfully, I disagree",                      context: "Formal professional disagreement" },
      { phrase: "Food for thought",                 meaning: "Something worth considering",                   context: "Suggesting an idea without pressure" },
      { phrase: "Let's get on the same page",       meaning: "Let's make sure we understand each other",     context: "Aligning before proceeding" },
      { phrase: "I'd push back on that assumption", meaning: "I disagree with the underlying assumption",    context: "Technical or strategic disagreements" },
    ],
  },
  {
    cat: 'Presenting',
    items: [
      { phrase: "To give you some context...",      meaning: "Here's the background information",             context: "Before explaining something complex" },
      { phrase: "The key takeaway here is...",      meaning: "The most important point is...",                context: "Summarizing during a presentation" },
      { phrase: "Let me walk you through this",     meaning: "I'll explain this step by step",               context: "Showing a demo or process" },
      { phrase: "Does that make sense so far?",     meaning: "Do you understand / any questions?",            context: "Checking understanding during a talk" },
      { phrase: "I'll hand it over to...",          meaning: "I'm passing the floor to someone else",        context: "During a group presentation" },
      { phrase: "To recap...",                      meaning: "To summarize what we've discussed",             context: "At the end of a meeting or section" },
    ],
  },
]

export const SCENARIOS = [
  { id: 'standup',  label: 'Daily Standup',    icon: '☀️', prompt: 'You are a scrum master running a daily standup. Ask the user what they worked on yesterday, what they plan to do today, and if there are any blockers. Keep it brief and professional. After their response, ask one follow-up question. Keep exchanges short.' },
  { id: 'review',   label: 'Code Review',      icon: '🔍', prompt: 'You are a senior developer doing a code review. The user is presenting their PR. Ask about design decisions, edge cases, test coverage, and suggest improvements. Be constructive and use real technical language. Keep responses 2-3 sentences.' },
  { id: 'interview',label: 'Job Interview',    icon: '💼', prompt: 'You are a tech interviewer at a top startup. Ask behavioral and technical questions: "Tell me about a challenging bug", "How do you handle disagreements?", "Walk me through a system you\'re proud of." Give brief reactions to their answers. Be realistic.' },
  { id: 'casual',   label: 'Office Small Talk', icon: '☕', prompt: 'You are a friendly coworker at the coffee machine. Make casual conversation about work, weekend plans, or tech news. Keep it very light and natural. Use contractions and informal language. Short messages only.' },
  { id: 'present',  label: 'Product Demo',     icon: '📊', prompt: 'You are a skeptical client being shown a product demo. Ask tough questions about features, pricing, timelines, and reliability. Push back occasionally. Use business language. Keep exchanges realistic and concise.' },
  { id: 'email',    label: 'Email Coach',      icon: '📧', prompt: 'You help the user write professional emails. The user will describe a situation or paste a draft. You will: 1) write an improved version, 2) explain what makes it effective, 3) offer one alternative phrasing. Be concise and practical.' },
]
