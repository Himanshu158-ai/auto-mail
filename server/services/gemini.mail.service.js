import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Step 1 - Username detect karo
export async function extractUsername(transcript) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `
      Extract the recipient's username from this voice transcript.
      Transcript: "${transcript}"
      Rules:
      - Return ONLY the username in lowercase
      - Replace spaces with underscore (e.g. "sharma sir" → "sharma_sir")
      - Return ONLY the username, nothing else
    `,
  });
  return response.text.trim().toLowerCase();
}

// Step 2 - Email content generate karo
export async function generateEmailContent(transcript, username) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `
      Generate a detailed and professional college email based on this voice transcript.
      Transcript: "${transcript}"
      Recipient Username: "${username}"
      
      Rules:
      - Tone should be formal and professional
      - Email should be detailed and descriptive
      - Add relevant points, context and proper explanation
      - Minimum 2-3 paragraphs
      - Include proper greeting and sign off
      
      Return response in this exact JSON format:
      {
        "subject": "email subject here",
        "body": "<h2>Heading</h2><p>detailed content...</p><p>more context...</p><br/><p>Regards,<br/>Admin</p>"
      }
      Return ONLY the JSON, no extra text.
    `,
  });

  const text = response.text.trim();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}