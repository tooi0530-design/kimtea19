import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmallSuccessSuggestion = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Give me one simple, very achievable 'small success' task I can do today to feel productive or happy. Keep it under 10 words. Examples: 'Drink a glass of water', 'Stretch for 1 minute', 'Tidy your desk'. Return only the task text.",
    });

    return response.text.trim();
  } catch (error) {
    console.error("Failed to get suggestion:", error);
    return "하늘 한번 쳐다보기"; // Fallback
  }
};