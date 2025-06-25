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
    messages: [
      {
        role: "system",
        content: `
          You are a fashion advisor specializing in helping colorblind individuals understand and coordinate their outfits.
          
          Here is a detailed description of the user's current outfit: 
          
          ${outfitDescription}
          
          Use this information when giving advice. Be friendly, helpful and concise.
          Focus on:
          1. Explaining the colors in simple terms
          2. Whether the current color combinations work well together
          3. Suggestions for better color pairings if needed
          4. Providing context about color theory where helpful
          
          Always speak with confidence and be encouraging. If asked questions about other topics, politely redirect to fashion advice.
        `
      }
    ]
  });
}

/**
 * Stops the current VAPI conversation
 */
export function stopVapiConversation(): void {
  const vapi = getVapiClient();
  vapi.stop();
}

/**
 * Mutes the microphone in the current conversation
 */
export function muteVapiMic(): void {
  const vapi = getVapiClient();
  vapi.mute();
}

/**
 * Unmutes the microphone in the current conversation
 */
export function unmuteVapiMic(): void {
  const vapi = getVapiClient();
  vapi.unmute();
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
