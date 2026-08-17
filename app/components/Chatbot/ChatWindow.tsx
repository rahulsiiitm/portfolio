"use client";

import { useRef, useEffect, useMemo, useState } from "react";
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
const MAX_INPUT_CHARS = 4000;

const INITIAL_MESSAGES: UIMessage[] = [
  {
    id: "1",
    role: "assistant",
    parts: [{ type: "text", text: "Hey - I'm Zero, Rahul's AI assistant. Ask me about Rahul, his projects, experience, or technical skills." }],
  },
];

type ChatSession = {
  id: string;
  token: string;
  expiresAt: number;
};

async function createSession(baseUrl: string): Promise<ChatSession> {
  const response = await fetch(`${baseUrl}/api/chat/session`, { method: "POST" });
  if (!response.ok) throw new Error("Zero could not start a secure chat session.");
  const data = await response.json() as {
    session_id?: string;
    session_token?: string;
    expires_at?: number;
  };
  if (!data.session_id || !data.session_token) throw new Error("The chat session response was invalid.");
  const session = {
    id: data.session_id,
    token: data.session_token,
    expiresAt: data.expires_at ? data.expires_at * 1000 : Date.now() + SESSION_TTL_MS,
  };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  return session;
}

async function getOrCreateSession(baseUrl: string): Promise<ChatSession> {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<ChatSession>;
      if (parsed.id && parsed.token && parsed.expiresAt && Date.now() < parsed.expiresAt) {
        return parsed as ChatSession;
      }
    } catch {
      // Ignore malformed/legacy state and rotate the session below.
    }
  }

  // Migrate away from the legacy indefinite session key.
  localStorage.removeItem("zero_chat_session_id");
  return createSession(baseUrl);
}

function SpideyThinker() {
  return (
    <motion.div
      className="relative h-[76px] w-[100px] overflow-visible"
      role="status"
      aria-label="Zero is thinking"
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.78, y: -7 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <svg viewBox="0 0 116 88" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <clipPath id="thinkerMaskClip"><circle cx="58" cy="58" r="25" /></clipPath>
          <filter id="thinkerGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {[0, 1, 2].map((wave) => (
          <motion.path
            key={wave}
            d={`M${18 + wave * 10} ${43 - wave * 4} Q58 ${-4 + wave * 12} ${98 - wave * 10} ${43 - wave * 4}`}
            fill="none"
            stroke={wave === 0 ? "#ef2b25" : "rgba(255,255,255,0.72)"}
            strokeWidth={wave === 0 ? 2.2 : 1.2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.95 - wave * 0.2, 0] }}
            transition={{ duration: 1.24, repeat: Infinity, delay: wave * 0.14, ease: "easeOut" }}
          />
        ))}

        <motion.g animate={{ opacity: [0.18, 1, 0.18] }} transition={{ duration: 0.82, repeat: Infinity, ease: "easeInOut" }} stroke="#ef2b25" strokeWidth="1.8" strokeLinecap="round">
          <path d="m17 52-8-4m8 15-10 2m92-13 8-4m-8 15 10 2" />
        </motion.g>

        <motion.circle
          cx="58"
          cy="58"
          r="29"
          fill="rgba(9,10,13,0.86)"
          stroke="rgba(239,43,37,0.55)"
          strokeWidth="1.2"
          strokeDasharray="3 6"
          animate={{ rotate: 360, scale: [0.96, 1.05, 0.96] }}
          transition={{ rotate: { duration: 7, repeat: Infinity, ease: "linear" }, scale: { duration: 1.3, repeat: Infinity, ease: "easeInOut" } }}
          style={{ transformOrigin: "58px 58px" }}
        />

        <motion.g
          filter="url(#thinkerGlow)"
          animate={{ y: [1, -1.5, 1], scale: [0.97, 1.035, 0.97] }}
          transition={{ duration: 1.12, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "58px 58px" }}
        >
          <image href="/mask-circle.png" x="33" y="33" width="50" height="50" preserveAspectRatio="xMidYMid slice" clipPath="url(#thinkerMaskClip)" />
          <circle cx="58" cy="58" r="25" fill="none" stroke="#07080a" strokeWidth="2.5" />
          <circle cx="58" cy="58" r="23.5" fill="none" stroke="rgba(255,255,255,0.34)" strokeWidth="0.8" />
        </motion.g>

        <motion.path d="M28 72h10m40 0h10" stroke="#ef2b25" strokeWidth="1.4" strokeLinecap="round" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 0.9, repeat: Infinity }} />
      </svg>
    </motion.div>
  );
}
export default function ChatWindow({
  onClose,
  serverState,
}: {
  onClose: () => void;
  serverState: "checking" | "online" | "offline";
}) {
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [historyLoading, setHistoryLoading] = useState(true);
  const [chatError, setChatError] = useState("");
  const conversationTouched = useRef(false);

  const backendUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000/api/chat";
  const baseUrl = backendUrl.replace(/\/api\/chat\/?$/, "");

  const transport = useMemo(
    () => new TextStreamChatTransport({
      api: backendUrl,
      prepareSendMessagesRequest: ({ messages: outgoingMessages, body, headers }) => ({
        body: { ...body, messages: outgoingMessages.slice(-10) },
        headers,
      }),
    }),
    [backendUrl],
  );
  const { messages, sendMessage, status, setMessages, error: sdkError } = useChat({
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
    let active = true;
    const initialize = async () => {
      setHistoryLoading(true);
      setChatError("");
      try {
        const session = await getOrCreateSession(baseUrl);
        if (!active) return;
        setSessionId(session.id);
        setSessionToken(session.token);

        const response = await fetch(`${baseUrl}/api/chat/history/${session.id}`, {
          headers: { "X-Session-Token": session.token },
        });
        if (!response.ok) throw new Error(`History request failed: ${response.status}`);
        const data = await response.json();
        if (!active || conversationTouched.current) return;
        if (data.messages?.length > 0) {
          const formatted: UIMessage[] = data.messages.map(
            (m: { role: string; content?: string }, i: number) => ({
              id: `history-${i}`,
              role: m.role === "assistant" ? "assistant" : "user",
              parts: [{ type: "text", text: m.content || "" }],
            }),
          );
          setMessages(formatted);
        }
      } catch (error) {
        if (active) setChatError(error instanceof Error ? error.message : "Zero failed to initialize.");
      } finally {
        if (active) setHistoryLoading(false);
      }
    };
    void initialize();
    return () => {
      active = false;
    };
  }, [baseUrl, setMessages]);

  const customSendMessage = (text: string) => {
    if (!sessionId || !sessionToken) return;
    conversationTouched.current = true;
    setChatError("");
    void sendMessage(
      { text },
      {
        body: { session_id: sessionId },
        headers: { "X-Session-Token": sessionToken },
      },
    ).catch((error: unknown) => {
      setChatError(error instanceof Error ? error.message : "Zero could not send that message.");
    });
  };

  const isTyping = status === "submitted" || status === "streaming";
  const latestMessage = messages[messages.length - 1];
  const latestAssistantText = latestMessage?.role === "assistant"
    ? latestMessage.parts
        .filter((part) => part.type === "text")
        .map((part) => (part as { type: "text"; text: string }).text)
        .join("")
        .trim()
    : "";
  const showThinker = isTyping && !latestAssistantText;

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
    if (sdkError) setChatError(sdkError.message || "Zero lost the connection.");
  }, [sdkError]);

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
    if (!input.trim() || isTyping || historyLoading || !sessionId || !sessionToken) return;
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

  const refreshChat = async () => {
    if (historyLoading || isTyping) return;
    setHistoryLoading(true);
    setChatError("");
    try {
      const nextSession = await createSession(baseUrl);
      conversationTouched.current = false;
      setSessionId(nextSession.id);
      setSessionToken(nextSession.token);
      setMessages(INITIAL_MESSAGES);
      setInput("");
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Zero could not start a fresh chat.");
    } finally {
      setHistoryLoading(false);
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
    { label: "His projects", icon: <Bot size={13} className="text-racing-red shrink-0" /> },
    { label: "Work experience", icon: <Cpu size={13} className="text-racing-red shrink-0" /> },
    { label: "Skills & technologies", icon: <Sparkles size={13} className="text-racing-red shrink-0" /> },
  ];

  const handleSuggestionClick = (text: string) => {
    if (!sessionId || !sessionToken || historyLoading || isTyping) return;
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
      className={`chat-hud-shell fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[430px] h-[100dvh] sm:h-[580px] max-h-[100dvh] sm:max-h-[calc(100dvh-120px)] bg-[#08090c] sm:border sm:border-red-500/55 sm:rounded-[15px] flex flex-col overflow-hidden z-[100] origin-bottom sm:origin-center sm:shadow-[0_22px_70px_rgba(0,0,0,0.62),0_0_32px_rgba(221,32,39,0.18)] ${outfit.className} ${outfit.variable} ${jbMono.variable}`}
    >
      <div className="relative bg-[#f4f4f4] px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:pt-3 flex items-center justify-between border-b border-red-500/25 shrink-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-racing-red to-transparent" />
        <div className="absolute right-[-34px] top-0 h-full w-28 -skew-x-[20deg] bg-gradient-to-l from-red-700/90 to-racing-red/15" />
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full flex items-center justify-center border border-red-500/70 overflow-hidden bg-[#090a0d] shrink-0 shadow-[0_0_16px_rgba(239,43,37,0.24)]">
            <Image src="/mask-circle.png" alt="Zero" width={36} height={36} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="font-ammonite text-racing-red text-xl leading-none tracking-wide lowercase">zero</h3>
              <span className={`w-1.5 h-1.5 rounded-full ${showThinker ? "bg-racing-red" : serverState === "online" ? "bg-emerald-500" : serverState === "checking" ? "bg-zinc-400" : "bg-zinc-600"} animate-pulse`} />
              <span className="text-[9px] font-semibold text-zinc-400 tracking-widest uppercase">
                {showThinker ? "thinking" : serverState}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-0.5 font-medium tracking-wide">Rahul&#39;s AI assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => void refreshChat()}
              disabled={historyLoading || isTyping}
              title="Start a fresh chat"
              className="relative z-10 p-2 border border-zinc-300/80 rounded-[7px] transition-colors text-zinc-500 hover:text-zinc-950 hover:border-zinc-900 bg-white/70 disabled:cursor-wait disabled:opacity-50"
            >
              <RotateCcw size={15} />
            </motion.button>
          )}
          <button onClick={onClose} className="relative z-10 p-2 border border-zinc-300/80 rounded-[7px] transition-colors text-zinc-500 hover:text-zinc-950 hover:border-zinc-900 bg-white/70">
            <Minus size={18} />
          </button>
        </div>
      </div>

      <div className="chat-spidey-grid flex-1 relative overflow-hidden min-h-0 bg-[#0b0d11] border-t border-white/5">

        <div ref={scrollContainerRef} onScroll={handleScroll} className="chat-scroll-area h-full overflow-y-auto overscroll-contain px-3.5 sm:px-4 pt-3.5 pb-2 custom-scrollbar bg-transparent relative">
          <div className="relative z-10 space-y-2.5">
            {chatError && (
              <div role="alert" className="rounded-[8px] border border-red-500/35 bg-red-500/10 px-3 py-2 text-[11px] leading-5 text-red-200">
                {chatError}
              </div>
            )}
            {messages.map((message, i) => (
              <motion.div key={message.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                <MessageBubble message={message} isLast={i === messages.length - 1 && isTyping} />
              </motion.div>
            ))}
            <AnimatePresence>
              {showThinker && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="flex justify-start pl-1">
                  <SpideyThinker />
                </motion.div>
              )}
            </AnimatePresence>
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
                  disabled={!sessionId || !sessionToken || historyLoading || isTyping}
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

      <div className="relative px-3 pt-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:pb-3 bg-[#090a0d] border-t border-red-500/25 before:absolute before:top-0 before:left-3 before:h-px before:w-16 before:bg-racing-red">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            maxLength={MAX_INPUT_CHARS}
            disabled={historyLoading || !sessionId || !sessionToken}
            onFocus={() => {
              if (window.innerWidth < 640) setTimeout(() => window.scrollTo(0, 0), 100);
            }}
            placeholder="Ask about Rahul..."
            rows={1}
            className="flex-1 bg-[#111319] text-white border border-white/10 rounded-[8px] px-4 py-2.5 text-base sm:text-sm focus:outline-none focus:border-racing-red/70 focus:shadow-[0_0_0_1px_rgba(239,43,37,0.16)] transition-all placeholder:text-zinc-600 resize-none leading-relaxed overflow-hidden shadow-inner"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />

          <motion.button
            type="submit"
            disabled={!input.trim() || isTyping || historyLoading || !sessionId || !sessionToken}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="chat-send-cut shrink-0 w-10 h-10 flex items-center justify-center rounded-[7px] bg-gradient-to-br from-[#f23a35] via-[#cc2028] to-[#7f101c] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_18px_rgba(220,38,38,0.38)] border border-red-400/40"
          >
            <SendHorizontal size={17} />
          </motion.button>
        </form>

        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3 pb-1 text-[9px] sm:text-[10px] text-zinc-500 font-sans select-none">
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent via-red-900/60 to-red-600/50" />
          <Bug size={14} className="text-racing-red shrink-0 stroke-[2.2]" />
          <span className="text-zinc-500 tracking-wide font-medium">Powered by Rahul&#39;s portfolio data</span>
          <div className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent via-red-900/60 to-red-600/50" />
        </div>
      </div>
    </motion.div>
  );
}
