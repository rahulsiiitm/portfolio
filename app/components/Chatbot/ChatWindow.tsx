"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { SendHorizontal, Minus, User, Bot, Cpu, RotateCcw, ChevronDown, Bug, Sparkles } from "lucide-react";
import MessageBubble from "@/app/components/Chatbot/MessageBubble";
import { sfx } from "./sound";
import { Outfit, JetBrains_Mono } from "next/font/google";
import Image from "next/image";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jbMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono" });
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const SESSION_STORAGE_KEY = "zero_chat_session";

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "1",
    role: "assistant",
    parts: [{ type: "text", text: "Hey - I'm Zero, Rahul's AI co-driver. Ask about his projects, stack, internships, or the weird little details behind the build." }],
  },
];

function createSession() {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
    createdAt: Date.now(),
  };
}

function getOrCreateSession() {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { id?: string; createdAt?: number };
      if (parsed.id && parsed.createdAt && Date.now() - parsed.createdAt < SESSION_TTL_MS) {
        return { id: parsed.id, createdAt: parsed.createdAt };
      }
    } catch {
      // Ignore malformed/legacy state and rotate the session below.
    }
  }

  // Migrate away from the legacy indefinite session key.
  localStorage.removeItem("zero_chat_session_id");
  const session = createSession();
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

function SpideyThinker() {
  return (
    <div className="relative flex w-fit max-w-[88%] items-center gap-3 rounded-[10px] rounded-bl-[3px] border border-red-500/20 bg-[#17181c]/95 px-3.5 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.28)] overflow-hidden">
      <div className="chat-web-pattern absolute -right-8 -top-10 h-24 w-24 opacity-50 pointer-events-none" />
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border border-racing-red/45"
          animate={{ scale: [0.9, 1.22, 0.9], opacity: [0.65, 0.15, 0.65] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-[5px] rounded-full border border-white/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-racing-red/70 bg-black">
          <Image src="/mask-circle.png" alt="Zero thinking" fill sizes="32px" className="object-cover" />
        </div>
      </div>

      <div className="relative min-w-0">
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-racing-red">Spider-sense</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-racing-red"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                transition={{ duration: 0.85, repeat: Infinity, delay: i * 0.14 }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-300">
          <motion.span
            className="h-px w-7 bg-racing-red/70"
            animate={{ scaleX: [0.35, 1, 0.35], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
          <span>Zero is tracing the web</span>
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [serverState, setServerState] = useState<"checking" | "online" | "offline">("checking");
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const backendUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000/api/chat";
  const baseUrl = backendUrl.replace(/\/api\/chat\/?$/, "");

  const transport = new TextStreamChatTransport({ api: backendUrl });
  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    messages: INITIAL_MESSAGES,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    let lastH = 0;
    const handleResize = () => {
      if (window.innerWidth < 640) {
        const currentH = window.visualViewport!.height;
        if (Math.abs(lastH - currentH) > 15) {
          lastH = currentH;
          setViewportHeight(currentH);
        }
      } else {
        setViewportHeight(null);
      }
    };

    handleResize();
    window.visualViewport.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const session = getOrCreateSession();
    setSessionId(session.id);

    fetch(`${baseUrl}/api/chat/history/${session.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`History request failed: ${r.status}`))))
      .then((data) => {
        if (data.messages?.length > 0) {
          const formatted: UIMessage[] = data.messages.map(
            (m: { role: string; content?: string }, i: number) => ({
              id: `history-${i}`,
              role: m.role === "model" ? "assistant" : "user",
              parts: [{ type: "text", text: m.content || "" }],
            })
          );
          setMessages(formatted);
        }
      })
      .catch((e) => console.error("Failed to fetch history:", e));
  }, [baseUrl, setMessages]);

  const customSendMessage = (text: string) => {
    if (!sessionId) return;
    sendMessage({ text }, { body: { session_id: sessionId } });
  };

  const isTyping = status === "submitted" || status === "streaming";

  useEffect(() => {
    const focusTimer = setTimeout(() => textareaRef.current?.focus(), 100);
    return () => clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const preventTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".chat-scroll-area")) e.preventDefault();
    };
    document.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, []);

  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === "streaming" && status === "ready") sfx.receive();
    prevStatus.current = status;
  }, [status]);

  useEffect(() => {
    let active = true;
    const ping = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      try {
        const res = await fetch(`${baseUrl}/keep-alive`, { signal: controller.signal });
        if (active) setServerState(res.ok ? "online" : "offline");
      } catch {
        if (active) setServerState("offline");
      } finally {
        clearTimeout(timeoutId);
      }
    };
    ping();
    return () => {
      active = false;
    };
  }, [baseUrl]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (status === "submitted" && serverState !== "online") {
      timeoutId = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "wakeup-" + Date.now(),
            role: "assistant",
            parts: [{ type: "text", text: "Cold start in progress. The server is waking up - give me a few seconds." }],
          },
        ]);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [status, serverState, setMessages]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    } else if (!["Shift", "Meta", "Control", "Alt"].includes(e.key)) {
      sfx.key();
    }
  };

  const submitMessage = () => {
    if (!input.trim() || isTyping || !sessionId) return;
    sfx.send();
    customSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    scrollToBottom();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const clearChat = async () => {
    const oldSessionId = sessionId;
    setMessages(INITIAL_MESSAGES);

    const nextSession = createSession();
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    setSessionId(nextSession.id);

    if (!oldSessionId) return;
    try {
      const response = await fetch(`${baseUrl}/api/chat/history/${oldSessionId}`, { method: "DELETE" });
      if (!response.ok) console.error(`Failed to clear server history: ${response.status}`);
    } catch (error) {
      console.error("Failed to clear server history:", error);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  useEffect(() => {
    if (!userScrolledUp.current) messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBtn(distanceToBottom > 120);
    userScrolledUp.current = distanceToBottom > 80;
  };

  const scrollToBottom = () => {
    userScrolledUp.current = false;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    { label: "Who is Rahul?", icon: <User size={13} className="text-racing-red shrink-0" /> },
    { label: "Project telemetry", icon: <Bot size={13} className="text-racing-red shrink-0" /> },
    { label: "IIT Roorkee run", icon: <Cpu size={13} className="text-racing-red shrink-0" /> },
    { label: "Stack check", icon: <Sparkles size={13} className="text-racing-red shrink-0" /> },
  ];

  const handleSuggestionClick = (text: string) => {
    if (!sessionId || isTyping) return;
    sfx.send();
    customSendMessage(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ height: viewportHeight ? `${viewportHeight}px` : undefined }}
      className={`fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[430px] h-[100dvh] sm:h-[580px] max-h-[100dvh] sm:max-h-[calc(100dvh-120px)] bg-[#08090b] sm:border sm:border-red-500/45 sm:rounded-[15px] flex flex-col overflow-hidden z-[100] origin-bottom sm:origin-center sm:shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_26px_rgba(220,38,38,0.22)] ${outfit.className} ${outfit.variable} ${jbMono.variable}`}
    >
      <div className="relative bg-[#f4f4f4] px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:pt-3 flex items-center justify-between border-b border-red-500/25 shrink-0 overflow-hidden">
        <div className="absolute right-[-28px] top-0 h-full w-24 -skew-x-[18deg] bg-racing-red/95" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center border border-zinc-900 overflow-hidden bg-[#1a1a1a] shrink-0">
            <Image src="/mask-circle.png" alt="Zero" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="font-ammonite text-racing-red text-xl leading-none tracking-wide lowercase">zero</h3>
              <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? "bg-racing-red" : serverState === "online" ? "bg-emerald-500" : serverState === "checking" ? "bg-zinc-400" : "bg-zinc-600"} animate-pulse`} />
              <span className="text-[9px] font-semibold text-zinc-400 tracking-widest uppercase">
                {isTyping ? "spider-sense" : serverState}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Rahul&#39;s AI alter ego</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              title="Clear conversation"
              className="relative z-10 p-2 border border-zinc-300/70 rounded-[7px] transition-colors text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 bg-white/45"
            >
              <RotateCcw size={15} />
            </motion.button>
          )}
          <button onClick={onClose} className="relative z-10 p-2 border border-zinc-300/70 rounded-[7px] transition-colors text-zinc-500 hover:text-zinc-900 hover:border-zinc-900 bg-white/45">
            <Minus size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0d0e11] border-t border-white/5">
        <div className="chat-web-pattern absolute right-0 top-0 h-[260px] w-[260px] pointer-events-none z-0" />
        <div className="chat-web-pattern absolute bottom-0 left-0 h-[190px] w-[190px] rotate-180 opacity-60 pointer-events-none z-0" />
        <div ref={scrollContainerRef} onScroll={handleScroll} className="chat-scroll-area h-full overflow-y-auto overscroll-contain px-3.5 sm:px-4 pt-3.5 pb-2 custom-scrollbar bg-transparent relative">
          <div className="relative z-10 space-y-2.5">
            {messages.map((message, i) => (
              <motion.div key={message.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                <MessageBubble message={message} isLast={i === messages.length - 1 && isTyping} />
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <SpideyThinker />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, x: "-50%", y: 10 }}
              animate={{ opacity: 1, x: "-50%", y: 0 }}
              exit={{ opacity: 0, x: "-50%", y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0a0b0d]/80 backdrop-blur-md border border-white/10 rounded-[8px] text-[11px] font-medium text-zinc-200 hover:bg-[#0a0b0d] hover:text-white transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-20 group"
            >
              <ChevronDown size={13} className="text-racing-red group-hover:translate-y-[2px] transition-transform" />
              <span className="tracking-wide">Scroll down</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div initial={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="px-3.5 sm:px-4 pb-2 bg-[#0d0e11] overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-6 bg-racing-red" />
              <span className="text-[9px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Try asking</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSuggestionClick(s.label)}
                  disabled={!sessionId || isTyping}
                  className="slant-action flex min-w-0 items-center gap-2 px-3 py-2 text-[11px] text-zinc-400 border border-white/10 rounded-[6px] hover:text-white hover:border-racing-red/50 transition-all bg-white/[0.035] text-left disabled:opacity-50"
                >
                  {s.icon}
                  <span className="truncate">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:pb-3 bg-[#090a0d] border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (window.innerWidth < 640) setTimeout(() => window.scrollTo(0, 0), 100);
            }}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 bg-[#121316] text-white border border-white/10 rounded-[10px] px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:border-racing-red/60 transition-all placeholder:text-zinc-600 resize-none leading-relaxed overflow-hidden shadow-inner"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />

          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping || !sessionId}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-[10px] bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/40"
          >
            <SendHorizontal size={17} />
          </motion.button>
        </form>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 pb-1 text-[9px] sm:text-[10px] text-zinc-500 font-sans select-none">
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent via-red-900/60 to-red-600/50" />
          <Bug size={14} className="text-racing-red shrink-0 stroke-[2.2]" />
          <span className="text-zinc-500 tracking-wide font-medium">I survived my trip to Manipur!</span>
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent via-red-900/60 to-red-600/50" />
        </div>
      </div>
    </motion.div>
  );
}
