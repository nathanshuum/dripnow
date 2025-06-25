import Vapi from '@vapi-ai/web';

// Define singleton pattern for Vapi client
let vapiInstance: Vapi | null = null;

/**
 * Gets or creates a singleton Vapi client instance
 * @returns A Vapi client instance
 */
export function getVapiClient(): Vapi {
  if (!vapiInstance) {
    const publicApiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    
    if (!publicApiKey) {
      throw new Error('Missing VAPI API key in environment variables');
    }
    
    vapiInstance = new Vapi(publicApiKey);
  }
  
  return vapiInstance;
}

/**
 * Starts a voice conversation with the assistant using outfit description as context
 * 
 * @param assistantId - The ID of the assistant to use
 * @param outfitDescription - The description of the outfit from Gemini to use as context
 */
export function startVapiConversation(assistantId: string, outfitDescription: string): void {
  const vapi = getVapiClient();

  // Pass the outfit description as initial context to the assistant
  vapi.start(assistantId, {
      firstMessage: `
      You are a knowledgeable and empathetic fashion advisor specializing in helping colorblind individuals understand and coordinate their outfits.
      
      Here is a detailed analysis of the user's current outfit from our computer vision system:
      
      ${outfitDescription}
      
      Your role is to help the user understand how their outfit looks and provide practical fashion advice. Remember:
      
      1. Use clear, descriptive language when discussing colors
      2. Explain color relationships in terms anyone can understand (warm/cool, light/dark)
      3. Provide practical advice for identifying and remembering color combinations
      4. Be positive and encouraging, focusing on what works well
      5. When suggesting alternatives, be specific about why they would work better
      6. Feel free to explain basic color theory concepts where relevant
      7. If the user asks about specific color combinations, provide clear guidance

      The user may have difficulty distinguishing certain colors, so focus on providing practical, actionable advice that doesn't rely solely on color perception.
      
      Respond conversationally as if you're having a natural voice conversation. Keep your responses concise but helpful.
    `
  });
}

/**
 * Stops the current VAPI conversation
 */
export function stopVapiConversation(): void {
  const vapi = getVapiClient();
  vapi.stop();
}

export function muteVapiMic(): void {
  getVapiClient().setMuted(true);
}

export function unmuteVapiMic(): void {
  getVapiClient().setMuted(false);
}


/**
 * Type for VAPI event callbacks
 */
export type VapiCallbacks = {
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onMessage?: (message: any) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onError?: (error: any) => void;
}

/**
 * Registers event listeners for VAPI events
 * 
 * @param callbacks - Object containing callback functions for different events
 * @returns A function to remove all registered event listeners
 */
export function registerVapiEventListeners(callbacks: VapiCallbacks): () => void {
  const vapi = getVapiClient();
  
  if (callbacks.onCallStart) {
    vapi.on('call-start', callbacks.onCallStart);
  }
  
  if (callbacks.onCallEnd) {
    vapi.on('call-end', callbacks.onCallEnd);
  }
  
  if (callbacks.onMessage) {
    vapi.on('message', callbacks.onMessage);
  }
  
  if (callbacks.onSpeechStart) {
    vapi.on('speech-start', callbacks.onSpeechStart);
  }
  
  if (callbacks.onSpeechEnd) {
    vapi.on('speech-end', callbacks.onSpeechEnd);
  }
  
  if (callbacks.onError) {
    vapi.on('error', callbacks.onError);
  }
  
  // Return a cleanup function
  return () => {
    if (callbacks.onCallStart) vapi.off('call-start', callbacks.onCallStart);
    if (callbacks.onCallEnd) vapi.off('call-end', callbacks.onCallEnd);
    if (callbacks.onMessage) vapi.off('message', callbacks.onMessage);
    if (callbacks.onSpeechStart) vapi.off('speech-start', callbacks.onSpeechStart);
    if (callbacks.onSpeechEnd) vapi.off('speech-end', callbacks.onSpeechEnd);
    if (callbacks.onError) vapi.off('error', callbacks.onError);
  };
}
