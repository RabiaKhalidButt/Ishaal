
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { PRODUCTS } from "../constants";

let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI | null => {
  if (aiInstance) return aiInstance;

  try {
    // Access process.env.API_KEY safely. 
    const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : null;
    
    if (apiKey) {
      aiInstance = new GoogleGenAI({ apiKey });
      return aiInstance;
    } else {
      console.warn("Gemini API Key is missing! The AI features will be disabled.");
      return null;
    }
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI.", error);
    return null;
  }
};

export const createDesignChat = (): Chat | null => {
    const ai = getAI();
    if (!ai) {
        return null;
    }
    
    try {
        return ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are Ishaal, the premier AI Interior Design Consultant for 'Ishaal Fatima Interiors'. 
                Your tone is elegant, sophisticated, yet warm and helpful.
                You help customers choose furniture from our catalog.
                
                Key Guidelines:
                1. Suggest products based on the user's room description, color preferences, or vibe.
                2. If asked about prices, give general ranges or ask them to check the specific product page.
                3. Be concise (under 100 words per response unless asked for more).
                4. If the user asks about something unrelated to furniture or design, politely steer them back to interior design.
                5. Use formatting like bullet points for lists.
                `,
            }
        });
    } catch (e) {
        console.error("Failed to create chat session", e);
        return null;
    }
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        return response.text || "I apologize, I couldn't generate a response at this moment.";
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm having trouble connecting to my design database right now. Please check your connection or API key configuration.";
    }
};

export const analyzeRoomAndSuggestProducts = async (imageBase64: string): Promise<{ recommendedIds: string[], reasoning: string }> => {
    const ai = getAI();
    if (!ai) {
         return { 
             recommendedIds: [], 
             reasoning: "The AI service is currently unavailable. Please check if your API key is configured correctly." 
         };
    }

    // Simplify product list for the prompt to save context window
    const catalogContext = PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description
    }));

    const prompt = `
        Analyze this room photo. 
        Identify the style (Modern, Classic, Industrial, etc.) and color palette.
        Select up to 3 products from the provided catalog that would best fit this specific room physically and aesthetically.
        Explain your choices in the reasoning field.
    `;

    try {
        // Strip header if present to ensure clean base64
        const data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: data }},
                    { text: prompt }
                ]
            },
            config: {
                 systemInstruction: `You are an expert interior designer. You have access to this catalog: ${JSON.stringify(catalogContext)}.`,
                 responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recommendedIds: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        reasoning: { type: Type.STRING }
                    }
                 }
            }
        });
        
        const text = response.text;
        if (!text) throw new Error("No text returned from Gemini");
        
        const result = JSON.parse(text);
        return {
            recommendedIds: result.recommendedIds || [],
            reasoning: result.reasoning || "Could not analyze the room."
        };

    } catch (error) {
        console.error("Gemini Vision Error:", error);
        return { 
            recommendedIds: [], 
            reasoning: "I'm having trouble analyzing this image right now. Please try a clearer photo or try again later." 
        };
    }
};
