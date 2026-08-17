"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";
import { Caveat } from "next/font/google";
import { sfx } from "./sound";
import Image from "next/image";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [serverState, setServerState] = useState<"checking" | "online" | "offline">("checking");
  const backendUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000/api/chat";
  const baseUrl = backendUrl.replace(/\/api\/chat\/?$/, "");

  useEffect(() => {
    let active = true;
    const ping = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const url = `${baseUrl}/ready`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (active) setServerState(res.ok ? "online" : "offline");
      } catch {
        if (active) setServerState("offline");
      }
    };
    ping();
    return () => { active = false; };
  }, [baseUrl]);

  const toggle = () => {
    if (!isOpen) sfx.open(); else sfx.close();
    setIsOpen(!isOpen);
  };

  const statusColor = serverState === "online" ? "bg-emerald-500" : serverState === "checking" ? "bg-zinc-400" : "bg-zinc-600";

  return (
    <>
      <AnimatePresence>{isOpen && <ChatWindow serverState={serverState} onClose={() => { sfx.close(); setIsOpen(false); }} />}</AnimatePresence>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-end pointer-events-none">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="hidden lg:flex items-center gap-2 mr-4 pointer-events-none"
          >
            <div className={`text-zinc-300 text-xl tracking-wide whitespace-nowrap flex flex-col items-center leading-tight ${caveat.className}`}>
              <span>Tap to chat</span>
              <span>with ZERO</span>
            </div>
            <svg width="62" height="32" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-400">
              <path d="M5,15 Q50,45 95,25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M85,15 L97,24 L85,35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </motion.div>
        )}

        <div className="relative pointer-events-auto">
          {/* Rotating scan ring (hidden when open to save GPU power) */}
          {!isOpen && (
            <div className="absolute inset-[-5px] rounded-full border border-racing-red/35 pointer-events-none" />
          )}

          <motion.button
            className="w-[60px] h-[60px] sm:w-16 sm:h-16 rounded-full bg-black border border-racing-red shadow-[0_10px_28px_rgba(0,0,0,0.35),0_0_14px_rgba(255,0,0,0.35)] flex items-center justify-center relative group z-10 overflow-hidden"
            whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(255,0,0,0.55)" }}
            whileTap={{ scale: 0.95 }}
            onClick={toggle}
            aria-label="Toggle Chat"
          >
            <div className="absolute inset-0 bg-racing-red opacity-0 group-hover:opacity-20 transition-opacity rounded-full overflow-hidden pointer-events-none" />
            <Image src="/mask-circle.png" alt="Chat" fill sizes="64px" className="object-cover rounded-full" />
          </motion.button>

          {!isOpen && (
            <span className="absolute bottom-0 right-0 flex h-4 w-4 transform translate-x-1/4 translate-y-1/4 z-20">
              {serverState === "online" && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusColor} opacity-75`}></span>
              )}
              <span className={`relative inline-flex rounded-full h-full w-full ${statusColor} border-2 border-black`}></span>
            </span>
          )}
        </div>
      </div>
    </>
  );
}
