import 'dotenv/config';

const FORGE_API_URL = process.env.BUILT_IN_FORGE_API_URL;
const FORGE_API_KEY = process.env.BUILT_IN_FORGE_API_KEY;

console.log('API URL:', FORGE_API_URL ? 'set' : 'MISSING');
console.log('API KEY:', FORGE_API_KEY ? 'set' : 'MISSING');

const payload = {
  model: "gemini-2.5-flash",
  messages: [
    { role: "system", content: "You are a game industry analyst." },
    { role: "user", content: 'Analyze this game for China market. Return JSON: {"grade": "A", "score": 75, "summary": "brief analysis"}' }
  ],
  max_tokens: 2048,
  thinking: { budget_tokens: 128 },
  response_format: {
    type: "json_object"
  }
};

try {
  const url = `${FORGE_API_URL}/v1/chat/completions`;
  console.log('Calling:', url);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${FORGE_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  
  console.log('Status:', res.status, res.statusText);
  const data = await res.json();
  
  if (data.choices?.[0]?.message?.content) {
    console.log('Content type:', typeof data.choices[0].message.content);
    console.log('Content:', data.choices[0].message.content.substring(0, 500));
    try {
      const parsed = JSON.parse(data.choices[0].message.content);
      console.log('Parsed JSON:', JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Parse error:', e.message);
    }
  } else {
    console.log('Full response:', JSON.stringify(data, null, 2).substring(0, 1000));
  }
} catch (e) {
  console.error('Error:', e.message);
}
