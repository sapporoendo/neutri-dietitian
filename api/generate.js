export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.AZURE_OPENAI_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  if (!apiKey || !endpoint) return res.status(500).json({ error: '環境変数が設定されていません' });

  try {
    const body = req.body;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        max_tokens: body.max_tokens || 2000,
        messages: body.messages
      })
    });
    const data = await response.json();
    return res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
