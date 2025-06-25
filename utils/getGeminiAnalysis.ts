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
      I am analyzing fashion for a colorblind person who needs help understanding colors and outfit coordination.
      
      Please provide a detailed analysis of this outfit image with the following structure:
      
      ## COLOR IDENTIFICATION
      - Describe each clothing item with VERY specific color names (e.g., "royal blue", "burgundy red", "forest green")
      - For each item, mention color families it belongs to (e.g., "This is in the blue family, which pairs well with...")
      - Describe patterns, textures, and color variations in detail
      
      ## COLOR COORDINATION ASSESSMENT
      - Explain if the current color combinations work well together and why
      - Rate the color harmony on a scale of 1-10
      - Explain color theory principles relevant to this outfit (complementary, analogous, etc.)
      
      ## STYLE ANALYSIS
      - Describe the overall style category (casual, formal, sporty, etc.)
      - Identify key fashion elements and how they work together
      
      ## COLORBLIND-SPECIFIC ADVICE
      - Suggest simple ways to remember these color combinations
      - Provide tips for selecting similar matching outfits independently
      - Mention any potential challenging color distinctions in this outfit
      
      Be detailed but concise. Use objective descriptions that would be helpful for someone who cannot distinguish certain colors.
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
