import { json } from "@sveltejs/kit";
import { OPENROUTER_API_KEY } from "$env/static/private";

export async function POST({ request }) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return json({ error: "No task provided." }, { status: 400 });
    }

    const prompt = `
User described a task: "${text}"

Return ONLY valid JSON:
{
  "title": "clean task title",
  "description": "2–3 sentence task description"
}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-2-9b-it",   // ✔ FREE & reliable
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const result = await response.json();
    let content = result.choices?.[0]?.message?.content || "";

    // Clean and parse JSON
    content = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(content);

    return json(parsed);

  } catch (error) {
    console.error("AI Error:", error);
    return json({ error: "AI generation failed." }, { status: 500 });
  }
}
