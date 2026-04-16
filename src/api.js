// Anthropic API wrapper
// Set your key in .env.local as VITE_ANTHROPIC_KEY=sk-ant-...

const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY || ''

export async function callClaude(messages, systemPrompt, maxTokens = 1000) {
  if (!API_KEY) {
    return '⚠️ API key not set. Add VITE_ANTHROPIC_KEY to your .env.local file.'
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    })
    const data = await response.json()
    if (data.error) return `Error: ${data.error.message}`
    return data.content?.[0]?.text || 'No response.'
  } catch (err) {
    return `Network error: ${err.message}`
  }
}
