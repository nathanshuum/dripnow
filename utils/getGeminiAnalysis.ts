import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export type ImageData = {
  mimeType: string;
  data: string; // base64 encoded image data
};

/**
 * Analyzes an outfit image using Google's Gemini API
 * 
 * @param imageData The base64 encoded image data with MIME type
 * @returns A detailed description of the outfit focusing on colors and style
 */
export async function analyzeOutfitImage(imageData: ImageData): Promise<string> {
  try {
    // For Gemini Pro Vision
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = `
      I am colorblind and need help understanding the colors and style of my outfit.
      Please provide a detailed description of this outfit, focusing on:
      1. Precise color names of each item (not just "blue" but "navy blue" or "cobalt blue")
      2. How well the colors match together
      3. The style of the outfit
      4. Any suggestions for improvements
      
      Format the response in clear sections for colors, style, and suggestions.
      Be detailed but concise.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: imageData.mimeType,
          data: imageData.data
        }
      }
    ]);

    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return "I'm sorry, I couldn't analyze your outfit. Please try again with a clearer image.";
  }
}
