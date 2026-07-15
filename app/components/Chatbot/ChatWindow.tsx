"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, UIMessage } from "ai";
import { Send, Minus, User, Bot, Bug } from "lucide-react";
import MessageBubble from "@/app/components/Chatbot/MessageBubble";
import { sfx } from "./sound";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    const fontSize = 13;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(1);
    const chars = "01ZERO01アイウエオ01";

    let raf: number;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 70) return;
      last = t;
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,0,0,0.35)";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" />;
}

function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 opacity-[0.08]"
      style={{
        backgroundImage: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 3px)",
      }}
    />
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-[#222222] border border-white/5 rounded-2xl rounded-bl-sm w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-racing-red"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const transport = new TextStreamChatTransport({ api: "/api/chat" });

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [{ type: "text", text: "Hey there! I'm ZERO 🕷️\nThink of me as Rahul's AI sidekick.\nAsk me anything about his projects, skills, experience or journey!" }],
      },
      { id: "2", role: "assistant", parts: [{ type: "text", text: "Where should we swing in? 🕸️" }] },
    ] as UIMessage[],
  });

  const isTyping = status === "submitted" || status === "streaming";
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === "streaming" && status === "ready") sfx.receive();
    prevStatus.current = status;
  }, [status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sfx.send();
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const suggestions = [
    { label: "Tell me about Rahul", icon: <User size={14} className="text-racing-red" /> },
    { label: "Show me his projects", icon: <Bot size={14} className="text-racing-red" /> },
    { label: "IIT Roorkee Internship", icon: <Bug size={14} className="text-racing-red" /> },
    { label: "Tech stack & skills", icon: <User size={14} className="text-racing-red" /> },
  ];

  const handleSuggestionClick = (text: string) => {
    sfx.send();
    sendMessage({ role: "user", parts: [{ type: "text", text }] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bottom-24 right-6 w-[450px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-120px)] bg-[#111111] border border-racing-red rounded-2xl flex flex-col overflow-hidden z-50 ring-1 ring-white/10"
      style={{ boxShadow: "0 0 20px rgba(255,0,0,0.15)" }}
    >
      {/* Animated glow border sweep */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-20"
        animate={{ boxShadow: ["0 0 10px rgba(255,0,0,0.2)", "0 0 32px rgba(255,0,0,0.55)", "0 0 10px rgba(255,0,0,0.2)"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Rotating conic edge light */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none z-0 opacity-70"
        style={{
          background: "conic-gradient(from 0deg, transparent 0%, rgba(255,0,0,0.9) 8%, transparent 20%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-black/10 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-black overflow-hidden relative shadow-inner bg-[#1a1a1a]"
            animate={{ boxShadow: ["0 0 0px rgba(255,0,0,0)", "0 0 10px rgba(255,0,0,0.7)", "0 0 0px rgba(255,0,0,0)"] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <img src="/mask-circle.png" alt="Bot DP" className="w-full h-full object-cover" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <motion.h3
                className="font-bold text-racing-red text-lg leading-none"
                animate={{ textShadow: ["0 0 0px rgba(255,0,0,0)", "0 0 8px rgba(255,0,0,0.8)", "0 0 0px rgba(255,0,0,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ZERO
              </motion.h3>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isTyping ? "bg-racing-red animate-pulse" : "bg-green-500 animate-pulse"}`}></span>
                <span className="text-[9px] font-bold text-gray-500 tracking-wider">{isTyping ? "TYPING" : "ONLINE"}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Rahul's AI sidekick</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black">
          <Minus size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overscroll-contain p-4 custom-scrollbar bg-black/95 relative -mt-1 rounded-t-2xl z-20">
        <MatrixRain />
        <ScanlineOverlay />
        <div className="absolute inset-0 opacity-60 bg-[url('/web-watermark.png')] bg-no-repeat bg-right-bottom pointer-events-none mix-blend-screen bg-[length:150%_auto]"></div>
        <div className="relative z-10 space-y-4">
          {messages.map((message, i) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, x: message.role === "user" ? 8 : -8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <MessageBubble message={message} isLast={i === messages.length - 1} />
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <TypingDots />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Try Asking Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 bg-black/95 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-[1px] w-8 bg-racing-red"></div>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Try Asking</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03, borderColor: "rgba(255,0,0,0.8)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSuggestionClick(s.label)}
                className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 border border-white/10 rounded-lg hover:text-white transition-colors bg-white/5 text-left"
              >
                {s.icon}
                <span className="truncate">{s.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-black/95 border-t border-white/5 relative z-10">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="w-full bg-[#1A1A1A] text-white border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-racing-red focus:shadow-[0_0_14px_rgba(255,0,0,0.5)] transition-all placeholder:text-gray-500"
          />
          <motion.button
            type="submit"
            disabled={!input.trim()}
            whileHover={{ scale: 1.15, rotate: -8, filter: "drop-shadow(0 0 6px rgba(255,0,0,0.8))" }}
            whileTap={{ scale: 0.9, rotate: 0 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-racing-red hover:text-white disabled:opacity-50 disabled:hover:text-racing-red transition-colors"
          >
            <Send size={18} />
          </motion.button>
        </form>
        <div className="mt-3 flex items-center justify-center gap-2 text-gray-500 text-[10px]">
          <Bug size={10} className="text-racing-red" />
          <span>"With great code comes great debugging."</span>
        </div>
      </div>
    </motion.div>
  );
}