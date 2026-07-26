"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { Send, SendHorizontal, Minus, User, Bot, Cpu, RotateCcw, ChevronDown, Bug, Copy, Check, Sparkles } from "lucide-react";
import MessageBubble from "@/app/components/Chatbot/MessageBubble";
import { sfx } from "./sound";
import { Outfit, JetBrains_Mono } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jbMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono" });



const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "1",
    role: "assistant",
    parts: [{ type: "text", text: "Hey — I'm Zero, Rahul's AI. Fair warning: I'm still being trained, so I don't know everything about him yet. But ask anyway." }],
  },
];

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
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [serverState, setServerState] = useState<"checking" | "online" | "offline">("checking");
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [copiedInput, setCopiedInput] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000/api/chat";
  const baseUrl = backendUrl.replace(/\/api\/chat\/?$/, "");

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

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);
  
  useEffect(() => {
    // Generate or retrieve session ID
    let sid = localStorage.getItem("zero_chat_session_id");
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("zero_chat_session_id", sid);
    }
    setSessionId(sid);
    
    // Fetch history
    fetch(`${baseUrl}/api/chat/history/${sid}`)
      .then(r => r.json())
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          // Format messages for useChat
          const formatted = data.messages.map((m: any, i: number) => ({
            id: `history-${i}`,
            role: m.role === "model" ? "assistant" : m.role,
            content: m.content
          }));
          setMessages(formatted);
        }
      })
      .catch(e => console.error("Failed to fetch history:", e));
  }, [backendUrl]);

  const transport = new TextStreamChatTransport({ api: backendUrl });

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    messages: INITIAL_MESSAGES,
  });
  
  // Custom submit that adds session_id to body
  const customSendMessage = (text: string) => {
    sendMessage({
      text,
    }, {
      body: { session_id: sessionId }
    });
  };

  const isTyping = status === "submitted" || status === "streaming";

  // Auto-focus input on open
  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  // Lock body scroll when chat is open to prevent mobile keyboard from pushing UI out of viewport
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    // Also disable touch scrolling on the body for iOS Safari
    const preventTouchMove = (e: TouchEvent) => {
      // Don't prevent touchmove if the event is originating from inside our chat scroll area
      const target = e.target as HTMLElement;
      if (!target.closest('.chat-scroll-area')) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', preventTouchMove, { passive: false });
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('touchmove', preventTouchMove);
    };
  }, []);

  // SFX on response done + empty-response fallback
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current === "streaming" && status === "ready") {
      sfx.receive();
    }
    prevStatus.current = status;
  }, [status]);

  // Ping server to check if awake
  useEffect(() => {
    let active = true;
    const ping = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        const url = `${baseUrl}/keep-alive`;
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (active) setServerState(res.ok ? "online" : "offline");
      } catch (e) {
        if (active) setServerState("offline");
        try {
          const url = `${baseUrl}/keep-alive`;
          const res = await fetch(url);
          if (active && res.ok) setServerState("online");
        } catch (err) {}
      }
    };
    ping();
    return () => { active = false; };
  }, [backendUrl]);

  // Handle cold start waiting message
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (status === "submitted" && serverState !== "online") {
      timeoutId = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "wakeup-" + Date.now(),
            role: "assistant",
            parts: [{ type: "text", text: "*(Yawns...)* I was sleeping! Waking up the servers takes a minute. Hang tight..." }],
          }
        ]);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  }, [status, serverState, setMessages]);

  // Auto-resize textarea
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
    } else if (e.key !== "Shift" && e.key !== "Meta" && e.key !== "Control" && e.key !== "Alt") {
      // Subtle typing click sound
      sfx.key();
    }
  };

  const submitMessage = () => {
    if (!input.trim() || isTyping) return;
    sfx.send();
    customSendMessage(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    scrollToBottom(); // Instantly jump to bottom and re-enable auto-scroll
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage();
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleCopyChatOrInput = () => {
    const lastBotMsg = [...messages].reverse().find((m) => m.role === "assistant");
    const textToCopy = input.trim() || (lastBotMsg ? lastBotMsg.parts.filter(p => p.type === 'text').map((p: any) => p.text).join('\n') : "");
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 1800);
    });
  };

  // Scroll tracking
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  // Auto-scroll logic that triggers on every message chunk
  useEffect(() => {
    if (!userScrolledUp.current) {
      // Using 'auto' (instant) instead of 'smooth' here is crucial for streaming.
      // Smooth scrolling gets interrupted by rapid DOM updates during a stream,
      // causing it to fall behind or stutter. 'auto' perfectly sticks to the bottom.
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBtn(distanceToBottom > 120);
    
    // If the user scrolls up more than 80px from the bottom, they have "broken" the auto-scroll
    userScrolledUp.current = distanceToBottom > 80;
  };

  const scrollToBottom = () => {
    userScrolledUp.current = false;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Block scroll propagation to page
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
    { label: "His projects", icon: <Bot size={13} className="text-racing-red shrink-0" /> },
    { label: "IIT Roorkee Internship", icon: <Cpu size={13} className="text-racing-red shrink-0" /> },
    { label: "Tech stack & skills", icon: <User size={13} className="text-racing-red shrink-0" /> },
  ];

  const handleSuggestionClick = (text: string) => {
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
      className={`fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[440px] h-[100dvh] sm:h-[600px] max-h-[100dvh] sm:max-h-[calc(100dvh-120px)] bg-white sm:border-2 sm:border-red-600/50 sm:rounded-3xl flex flex-col overflow-hidden z-[100] origin-bottom sm:origin-center sm:shadow-[0_0_30px_rgba(220,38,38,0.25)] ${outfit.className} ${outfit.variable} ${jbMono.variable}`}
    >
      {/* ── Header ── */}
      <div className="bg-white px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:pt-3 flex items-center justify-between border-b border-zinc-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-zinc-900 overflow-hidden bg-[#1a1a1a] shrink-0">
            <img src="/mask-circle.png" alt="Zero" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="font-ammonite text-racing-red text-xl leading-none tracking-wide lowercase">zero</h3>
              <span className={`w-1.5 h-1.5 rounded-full ${isTyping ? "bg-racing-red" : serverState === "online" ? "bg-emerald-500" : serverState === "checking" ? "bg-zinc-400" : "bg-zinc-600"} animate-pulse`} />
              <span className="text-[9px] font-semibold text-zinc-400 tracking-widest uppercase">
                {isTyping ? "typing" : serverState}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Rahul's AI alter ego</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Clear chat */}
          {messages.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearChat}
              title="Clear conversation"
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-700"
            >
              <RotateCcw size={15} />
            </motion.button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-800"
          >
            <Minus size={18} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 relative overflow-hidden min-h-0 bg-[#0e0e0e] rounded-t-3xl border-t border-white/5">
        {/* Watermark — hidden on mobile to boost scrolling performance */}
        <div className="hidden sm:block absolute inset-0 opacity-50 bg-[url('/web-watermark.png')] bg-no-repeat bg-right-bottom pointer-events-none mix-blend-screen bg-[length:140%_auto] z-0" />

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="chat-scroll-area h-full overflow-y-auto overscroll-contain px-4 pt-4 pb-2 custom-scrollbar bg-transparent relative"
        >
          <div className="relative z-10 space-y-3">
            {messages.map((message, i) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <MessageBubble message={message} isLast={i === messages.length - 1 && isTyping} />
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

        {/* Scroll-to-bottom — fixed to the visible frame, not the scrollable content */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, x: "-50%", y: 10 }}
              animate={{ opacity: 1, x: "-50%", y: 0 }}
              exit={{ opacity: 0, x: "-50%", y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0a0b0d]/80 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-medium text-zinc-200 hover:bg-[#0a0b0d] hover:text-white transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-20 group"
            >
              <ChevronDown size={13} className="text-racing-red group-hover:translate-y-[2px] transition-transform" />
              <span className="tracking-wide">Scroll down</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Suggestions (show only before first user message) ── */}
      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-2 bg-[#0e0e0e] overflow-hidden"
          >
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
                  className="flex items-center gap-2 px-3 py-2 text-[11px] text-zinc-400 border border-white/8 rounded-lg hover:text-white hover:border-racing-red/40 transition-all bg-white/[0.03] text-left"
                >
                  {s.icon}
                  <span className="truncate">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      <div className="px-3 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:pb-3 bg-[#0a0b0d] border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (window.innerWidth < 640) {
                setTimeout(() => window.scrollTo(0, 0), 100);
              }
            }}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 bg-[#121316] text-white border border-white/10 rounded-2xl px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:border-racing-red/60 transition-all placeholder:text-zinc-600 resize-none leading-relaxed overflow-hidden shadow-inner"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />

          {/* Red Glow Send Button */}
          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/40"
          >
            <SendHorizontal size={17} />
          </motion.button>
        </form>

        {/* ── Spider Footer Divider Bar ── */}
        <div className="flex items-center justify-center gap-2 mt-3 pb-1 text-[10px] text-zinc-500 font-sans select-none">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-red-900/60 to-red-600/50" />
          <Bug size={14} className="text-racing-red shrink-0 stroke-[2.2]" />
          <span className="text-zinc-500 tracking-wide font-medium">I survived my trip to Manipur!</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-red-900/60 to-red-600/50" />
        </div>
      </div>
    </motion.div>
  );
}