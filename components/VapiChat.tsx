"use client";

import { useEffect, useState, useRef } from 'react';
import {
  registerVapiEventListeners,
  startVapiConversation,
  stopVapiConversation,
  muteVapiMic,
  unmuteVapiMic,
} from '@/utils/vapiService';
import ImageUploader from './ImageUploader';
import { Button } from './ui/button';
import { Mic, MicOff, Phone } from 'lucide-react';
import { Toggle } from './ui/toggle';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
};

export default function VapiChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [outfitDescription, setOutfitDescription] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDetails, setAnalysisDetails] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Setup VAPI event handlers
  useEffect(() => {
    // Only setup VAPI if we have an outfit description
    if (!outfitDescription) return;

    const cleanupListeners = registerVapiEventListeners({
      onCallStart: () => {
        setIsConnected(true);
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: "Hello! I'm your fashion assistant. I've analyzed your outfit and I'm ready to help. What would you like to know about your outfit?",
            timestamp: Date.now(),
          },
        ]);
      },
      onCallEnd: () => {
        setIsConnected(false);
        setIsSpeaking(false);
      },
      onMessage: (message) => {
        if (message.type === 'transcript') {
          setMessages((prev) => [
            ...prev,
            {
              id: `${message.role}-${Date.now()}`,
              role: message.role,
              text: message.transcript,
              timestamp: Date.now(),
            },
          ]);
        }
      },
      onSpeechStart: () => {
        setIsSpeaking(true);
      },
      onSpeechEnd: () => {
        setIsSpeaking(false);
      },
      onError: (error) => {
        console.error('VAPI error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            text: "I'm sorry, there was a problem with our connection. Please try again.",
            timestamp: Date.now(),
          },
        ]);
        
        // Only attempt to reconnect a maximum of 2 times
        if (!isConnected && reconnectAttempts < 2) {
          setReconnectAttempts(prev => prev + 1);
          setTimeout(() => {
            const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
            if (assistantId && outfitDescription) {
              console.log(`Attempting to reconnect (attempt ${reconnectAttempts + 1}/2)`);
              startVapiConversation(assistantId, outfitDescription);
            }
          }, 3000);
        } else if (reconnectAttempts >= 2) {
          console.log('Maximum reconnection attempts reached. Please try uploading a new image.');
        }
      },
    });

    return cleanupListeners;
  }, [outfitDescription, isConnected, reconnectAttempts]);

  // Start the conversation when we get an outfit description
  useEffect(() => {
    if (outfitDescription && !isConnected) {
      // Use the VAPI assistant ID from environment variables
      const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
      
      if (!assistantId) {
        console.error('Missing VAPI assistant ID');
        return;
      }
      
      startVapiConversation(assistantId, outfitDescription);
    }
  }, [outfitDescription, isConnected]);

  const handleImageAnalyzed = (description: string) => {
    setOutfitDescription(description);
    setIsAnalyzing(false);
    setReconnectAttempts(0);
    
    // Extract a summary from the analysis for display
    const summaryMatch = description.match(/## COLOR IDENTIFICATION([\s\S]*?)##/);
    const summary = summaryMatch 
      ? summaryMatch[1].trim() 
      : "Analysis complete! Ready to discuss your outfit.";
    
    setAnalysisDetails(description);
    
    // Add initial analysis message
    setMessages([
      {
        id: `analysis-${Date.now()}`,
        role: 'assistant',
        text: "I've analyzed your outfit! Starting your fashion assistant...",
        timestamp: Date.now(),
      },
    ]);
  };

  const handleEndCall = () => {
    stopVapiConversation();
    setIsConnected(false);
    setIsSpeaking(false);
    setOutfitDescription(null);
    setAnalysisDetails(null);
    setMessages([]);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      unmuteVapiMic();
      setIsMuted(false);
    } else {
      muteVapiMic();
      setIsMuted(true);
    }
  };

  const handleNewUpload = () => {
    // End current call if active
    if (isConnected) {
      stopVapiConversation();
    }
    
    // Reset states for new analysis
    setIsConnected(false);
    setIsSpeaking(false);
    setOutfitDescription(null);
    setAnalysisDetails(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4">
        {!outfitDescription && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-6">Fashion Color Assistant</h1>
            <p className="text-center text-muted-foreground mb-8 max-w-md">
              Upload a photo of your outfit and get real-time fashion advice, 
              specially designed for colorblind individuals.
            </p>
            <ImageUploader 
              onImageAnalyzed={handleImageAnalyzed}
              onAnalysisStarted={() => setIsAnalyzing(true)}
            />
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-center font-medium">Analyzing your outfit...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-4 pt-4">
            {analysisDetails && outfitDescription && (
              <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">Outfit Analysis</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The fashion assistant has analyzed your outfit and is ready to chat.
                  Ask questions about colors, style, and coordination.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                  onClick={handleNewUpload}
                >
                  Upload New Image
                </Button>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className={cn(
              "p-4 pb-6 flex items-center justify-center",
              "bg-gradient-to-t from-card via-card/90 to-card/0",
            )}
          >
            <div className="p-4 bg-card border border-border/50 rounded-full flex items-center gap-4">
              <Toggle
                className={"rounded-full"}
                pressed={!isMuted}
                onPressedChange={handleMuteToggle}
              >
                {isMuted ? (
                  <MicOff className={"size-4"} />
                ) : (
                  <Mic className={"size-4"} />
                )}
              </Toggle>

              <div className="relative h-8 w-48 shrink grow-0 flex items-center">
                {/* Audio visualization */}
                <div 
                  className={cn(
                    "h-2 bg-primary rounded-full transition-all duration-75 ease-in-out",
                    isSpeaking ? "animate-pulse w-full" : "w-8"
                  )}
                ></div>
              </div>

              <Button
                className={"flex items-center gap-1 rounded-full"}
                onClick={handleEndCall}
                variant={"destructive"}
              >
                <span>
                  <Phone
                    className={"size-4 opacity-50 fill-current"}
                    strokeWidth={0}
                  />
                </span>
                <span>End Call</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
