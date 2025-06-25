import { NextResponse } from 'next/server';
import { analyzeOutfitImage, ImageData } from '@/utils/getGeminiAnalysis';

/**
 * API endpoint to analyze outfit images using Google's Gemini API
 * 
 * @param request The HTTP request containing the image data
 * @returns A response with the analysis of the outfit
 */
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { imageData } = body as { imageData: ImageData };
    
    // Check if we have valid image data
    if (!imageData || !imageData.data || !imageData.mimeType) {
      return NextResponse.json(
        { error: 'Missing or invalid image data' },
        { status: 400 }
      );
    }
    
    // Process the image with Gemini
    const description = await analyzeOutfitImage(imageData);
    
    // Return the analysis
    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error in analyze-outfit API:', error);
    
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
