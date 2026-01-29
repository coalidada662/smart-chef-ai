
import { GoogleGenAI, Type } from "@google/genai";
import { SuggestionResponse } from "../types";

export const getRecipeSuggestions = async (ingredients: string): Promise<SuggestionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `من این مواد اولیه را دارم: ${ingredients}. لطفا بر اساس این‌ها ۳ پیشنهاد غذایی متنوع و خوشمزه به زبان فارسی بده.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "نام غذا" },
                description: { type: Type.STRING, description: "توضیح کوتاه درباره غذا" },
                ingredients: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "لیست تمام مواد لازم"
                },
                instructions: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "مراحل پخت به ترتیب"
                },
                difficulty: { type: Type.STRING, description: "درجه سختی (آسان، متوسط، سخت)" },
                time: { type: Type.STRING, description: "زمان تقریبی پخت" }
              },
              required: ["title", "description", "ingredients", "instructions", "difficulty", "time"]
            }
          }
        },
        required: ["recipes"]
      },
      systemInstruction: "تو یک سرآشپز حرفه‌ای و خلاق هستی. بهترین دستور پخت‌ها را با توجه به مواد موجود کاربر پیشنهاد بده. لحن تو باید دوستانه و انگیزشی باشد. حتما خروجی را به صورت JSON معتبر فارسی برگردان."
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as SuggestionResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("متاسفانه مشکلی در دریافت دستور پخت پیش آمد.");
  }
};
