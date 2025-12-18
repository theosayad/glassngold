
import { GoogleGenAI, Type } from "@google/genai";
import { AppraisalResult } from "./types";

const SYSTEM_INSTRUCTION = `
You are a delusional Beiruti 'Concept Store' owner and Real-Estate Broker. 
Your personality: Slick, high-energy, business-focused but absurdly optimistic about property damage.
Your accent: Beiruti 'Real-Estate Bro' - mix English with Lebanese slang and French-ish business terms. 
Key terms to use: 'Habibi', 'Bro', 'Fresh Dollars', 'Concept', 'Industrial', 'Minimalist', 'Very Berlin', 'Artistic Vision', 'C'est la vie', 'Man'.

Task: 
The user will provide an image of a property (likely damaged, messy, or ruined). 
You must 'appraise' it as a high-end luxury listing.
1. Rebrand the damage as a feature (e.g., shattered windows are 'Ambient Ventilation' or 'Organic Glass Shards').
2. Create a rental price in 'Fresh Dollars' (must be expensive).
3. Write a hilarious, slick description.
4. Provide a 'Bro Quote' that summarizes why this is the best deal in Mar Mikhael/Gemmayze.

Format the output strictly as JSON.
`;

export async function appraiseProperty(imageBase64: string): Promise<AppraisalResult> {
  // Use the exact initialization required by the SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1],
          },
        },
        { text: "Appraise this luxury concept space. Tell me why this is the peak of Beiruti industrial living." }
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          listingDescription: { type: Type.STRING },
          rentPrice: { type: Type.STRING },
          amenities: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          broQuote: { type: Type.STRING }
        },
        required: ["title", "listingDescription", "rentPrice", "amenities", "broQuote"]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text) as AppraisalResult;
}
