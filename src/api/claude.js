/**
 * Simple wrapper for the Anthropic Claude API.
 * In a real application, you would route this through a backend proxy
 * to protect your API key. For this demo, we'll call it directly.
 */

// We read the API key from Vite's environment variables
// Add VITE_CLAUDE_API_KEY=your_key_here to a .env file in the root
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export async function askClaude(messages, systemPrompt) {
  if (!API_KEY) {
    return "Error: VITE_CLAUDE_API_KEY is not set. Please add it to your .env file.";
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to fetch from Claude API');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API Error:', error);
    return `Error: ${error.message}`;
  }
}
