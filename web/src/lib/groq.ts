export async function generateScript(niche: string, prompt?: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const systemPrompt = `You are a viral YouTube Shorts scriptwriter. 
  Create a script for a ${niche} video. 
  Hook should be in the first 3 seconds. 
  Keep it fast-paced. 
  Format: One sentence per line for easy voiceover sync.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt || `Write a viral script about ${niche}` }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateMetadata(script: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Generate 3 catchy YouTube Shorts titles and a description based on this script. Return as JSON." },
        { role: "user", content: script }
      ],
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
