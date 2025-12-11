// Import Google Generative AI SDK and SvelteKit utilities
import { GoogleGenerativeAI } from "@google/generative-ai";
import { json } from "@sveltejs/kit";
import { GEMINI_API_KEY } from "$env/static/private";

// Debug log to verify API key is loaded
console.log("=== GEMINI KEY LOADED ===", GEMINI_API_KEY);

// API endpoint to generate task details using AI
export async function POST({ request }) {
  try {
    // Extract task text from request body
    const { text } = await request.json();

    // Validate input text
    if (!text || text.trim().length === 0) {
      return json({ error: "No task provided." }, { status: 400 });
    }

    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Get the Gemini model for content generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Create prompt to generate structured task data
    const prompt = `
The user wrote a task: "${text}". 
Generate a JSON object only:
{
  "title": "...",
  "description": "..."
}
`;

    // Generate content using AI model
    const result = await model.generateContent(prompt);

    // Extract text response from AI
    let aiText = result.response.text();

    // Clean up response by removing markdown code blocks
    let cleaned = aiText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Return parsed JSON response
    return json(parsed);

  } catch (error) {
    // Log error and return failure response
    console.error("AI Error:", error);
    return json({ error: "AI generation failed." }, { status: 500 });
  }
}
