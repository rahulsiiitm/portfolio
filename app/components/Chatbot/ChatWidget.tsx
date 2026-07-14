"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";
import { Caveat } from "next/font/google";
import { sfx } from "./sound";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "500", "700"] });

const GLITCH_CHARS = "01<>/\\|{}#$%";

function useGlitchText(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let frame = 0;
    const totalFrames = 10;
    const interval = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        setDisplay(text);
        clearInterval(interval);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            ch === " " ? " " : i < (frame / totalFrames) * text.length
              ? text[i]
              : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          )
          .join("")
      );
    }, 35);
    return () => clearInterval(interval);
  }, [active, text]);
  return display;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const toggle = () => {
    if (!isOpen) { sfx.open(); setHasOpened(true); } else sfx.close();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AnimatePresence>{isOpen && <ChatWindow onClose={() => { sfx.close(); setIsOpen(false); }} />}</AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="hidden sm:flex items-center gap-2 mr-4 pointer-events-none"
          >
            <div className={`text-gray-300 text-2xl tracking-wide whitespace-nowrap flex flex-col items-center leading-tight ${caveat.className}`}>
              <span>Tap to chat</span>
              <span>with ZERO</span>
            </div>
            <svg width="80" height="40" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
              <path d="M5,15 Q50,45 95,25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M85,15 L97,24 L85,35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </motion.div>
        )}

        <div className="relative">
          {/* Rotating scan ring */}
          <motion.div
            className="absolute inset-[-8px] rounded-full border border-racing-red/40 pointer-events-none"
            style={{ borderStyle: "dashed" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-[-6px] rounded-full border border-white/60 pointer-events-none" />

          <motion.button
            className="w-16 h-16 rounded-full bg-black border-2 border-racing-red shadow-[0_0_15px_rgba(255,0,0,0.5)] flex items-center justify-center relative group z-10 overflow-hidden"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,0,0,0.8)" }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            aria-label="Toggle Chat"
          >
            <div className="absolute inset-0 bg-racing-red opacity-0 group-hover:opacity-20 transition-opacity rounded-full overflow-hidden pointer-events-none" />
            <img src="/mask-circle.png" alt="Chat" className="w-full h-full object-cover rounded-full overflow-hidden" />
          </motion.button>

          {!isOpen && (
            <span className="absolute bottom-0 right-0 flex h-4 w-4 transform translate-x-1/4 translate-y-1/4 z-20">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-racing-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-racing-red border-2 border-black"></span>
            </span>
          )}
        </div>
      </div>
    </>
  );
}