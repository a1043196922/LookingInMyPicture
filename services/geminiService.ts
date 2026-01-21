import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// Initialize the client. 
// Note: In a real production app, you might proxy this through a backend.
// For this demo, we use the process.env.API_KEY as strictly instructed.
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates an image based on a reference image and a text prompt using NanoBanana (gemini-2.5-flash-image).
 */
export const generatePortraitImage = async (
  base64Image: string,
  prompt: string,
  aspectRatio: AspectRatio = '1:1'
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Using gemini-2.5-flash-image (NanoBanana) as requested
    const model = 'gemini-2.5-flash-image';

    // Clean base64 string if it contains data URI prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity or converting before sending
              data: cleanBase64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // count: 1 // Default is 1
        },
      },
    });

    // Parse response for image data
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};