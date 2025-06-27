"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Toggle } from "./ui/toggle";
import { cn } from "@/utils";
import { 
  muteVapiMic, 
  unmuteVapiMic, 
  stopVapiConversation 
} from "@/utils/vapiService";

export interface ControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  onMuteToggle: () => void;
  onEndCall: () => void;
}

export default function Controls({ isConnected, isMuted, isSpeaking, onMuteToggle, onEndCall }: ControlsProps) {
  return (
    <div
      className={
        cn(
          "fixed bottom-0 left-0 w-full p-4 pb-6 flex items-center justify-center",
          "bg-gradient-to-t from-card via-card/90 to-card/0",
        )
      }
    >
      <AnimatePresence>
        {isConnected ? (
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className={
              "p-4 bg-card border border-border/50 rounded-full flex items-center gap-4"
            }
          >
            <Toggle
              className={"rounded-full"}
              pressed={!isMuted}
              onPressedChange={onMuteToggle}
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
              onClick={onEndCall}
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
