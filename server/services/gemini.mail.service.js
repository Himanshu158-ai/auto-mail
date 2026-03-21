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
      Generate a concise and professional college email based on this voice transcript.
      Transcript: "${transcript}"
      Recipient Username: "${username}"
      
      Rules:
      - Tone should be formal and professional
      - DO NOT write long paragraphs
      - Extract key points from the transcript and present them as a numbered or bulleted list
      - Each point should be brief (1-2 lines max)
      - Add a short 1-line intro before the list and a short 1-line closing after
      - Include proper greeting and sign off
      
      Example format for body:
      <p>Dear [Name],</p>
      <p>I wanted to bring the following points to your attention:</p>
      <ol>
        <li><strong>Point 1:</strong> Brief explanation</li>
        <li><strong>Point 2:</strong> Brief explanation</li>
        <li><strong>Point 3:</strong> Brief explanation</li>
      </ol>
      <p>Please let me know if you have any questions.</p>
      <p>Regards,<br/>Admin</p>
      
      Return response in this exact JSON format:
      {
        "subject": "email subject here",
        "body": "<p>Dear...</p><ol><li>...</li></ol><p>Regards,<br/>Admin</p>"
      }
      Return ONLY the JSON, no extra text.
    `,
  });

  const text = response.text.trim();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}