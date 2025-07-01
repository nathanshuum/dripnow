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
  // Pass the gemini outfit description as initial context to the assistant
  console.log("Starting VAPI conversation with gemini description:", outfitDescription);
  vapi.start(assistantId, {
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `The user has uploaded an image of their outfit. Here is the analysis from our vision model. Use this as context for your conversation. Do not mention this analysis unless the user asks about it. \n\nANALYSIS:\n${outfitDescription}`,
        },
      ],
    },
    firstMessageMode: 'assistant-waits-for-user',
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
