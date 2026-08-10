"use client";

import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { Copy, Check, CheckCheck, ChevronDown } from "lucide-react";
import Image from "next/image";

// Markdown renderer supporting collapsible sections & formatting
function renderFormatted(text: string) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const trimmed = line.trim();

    // Check for Collapsible / Section Headers starting with "► " or "▶ "
    if (/^[►▶]\s+/.test(trimmed)) {
      const sectionText = trimmed.replace(/^[►▶]\s+/, "");
      return (
        <details key={li} className="group my-1.5 border border-white/10 rounded-xl bg-white/[0.03] overflow-hidden text-xs">
          <summary className="flex items-center justify-between px-3 py-2 cursor-pointer font-semibold text-zinc-200 hover:bg-white/5 transition-colors select-none">
            <span className="flex items-center gap-2">
              <span className="text-racing-red text-[10px]">▶</span>
              {sectionText}
            </span>
            <ChevronDown size={13} className="text-zinc-400 group-open:rotate-180 transition-transform" />
          </summary>
        </details>
      );
    }

    // Horizontal Rule
    if (/^---+$/.test(trimmed)) {
      return <div key={li} className="h-px w-full bg-white/10 my-2" />;
    }

    // Headings (e.g. ### Title)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
    let isHeading = false;
    let headingLevel = 0;
    let content = trimmed;

    if (headingMatch) {
      isHeading = true;
      headingLevel = headingMatch[1].length;
      content = headingMatch[2];
    } else {
      const isBullet = /^[-*▸▶]\s+/.test(trimmed);
      content = isBullet ? trimmed.replace(/^[-*▸▶]\s+/, "") : line;
    }

    // Inline formatting: Links, Bold, Code, Italic
    const parts = content.split(/(\[(?:[^\]]+)\]\((?:[^)]+)\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
    const rendered = parts.map((part, pi) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch)
        return (
          <a
            key={pi}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-racing-red underline underline-offset-2 decoration-racing-red/50 hover:decoration-racing-red transition-colors break-all font-semibold"
          >
            {linkMatch[1]}
          </a>
        );
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={pi} className="font-bold text-white tracking-wide">{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`"))
        return (
          <code key={pi} className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[11px] text-racing-red font-mono">
            {part.slice(1, -1)}
          </code>
        );
      if (part.startsWith("*") && part.endsWith("*") && part.length > 1)
        return <em key={pi} className="italic text-zinc-300">{part.slice(1, -1)}</em>;
      return <Fragment key={pi}>{part}</Fragment>;
    });

    if (isHeading) {
      return (
        <div key={li} className={`font-bold text-white mt-3 mb-1 tracking-wide ${headingLevel === 1 ? 'text-sm sm:text-[15px] uppercase text-racing-red' : headingLevel === 2 ? 'text-[13px] sm:text-[14px] text-zinc-100' : 'text-xs sm:text-[13px] text-zinc-300'}`}>
          {rendered}
        </div>
      );
    }

    if (/^[-*▸▶]\s+/.test(trimmed)) {
      return (
        <div key={li} className="flex gap-2.5 pl-1 py-0.5 leading-relaxed">
          <span className="text-racing-red shrink-0 font-bold select-none text-[11px] mt-[1px]">▸</span>
          <span className="text-zinc-200">{rendered}</span>
        </div>
      );
    }
    
    return (
      <div key={li} className="leading-relaxed">
        {rendered}
        {trimmed === "" && li !== lines.length - 1 && <br />}
      </div>
    );
  });
}

export default function MessageBubble({
  message,
  isLast,
}: {
  message: UIMessage;
  isLast?: boolean;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const fullText = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // Avoid hydration mismatch by rendering time only on client
  const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex w-full items-start gap-2.5 group ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Bot Spider Avatar */}
      {!isUser && (
        <div className="relative w-8 h-8 rounded-full shrink-0 flex items-center justify-center border-2 border-racing-red/80 bg-[#16171a] shadow-[0_0_10px_rgba(220,38,38,0.4)] overflow-hidden mt-0.5">
          <Image src="/mask-circle.png" alt="Zero" fill sizes="32px" className="object-cover" />
        </div>
      )}

      <div className="relative max-w-[82%]">
        {/* Message bubble */}
        <div
          className={`relative px-4 py-3 text-[13px] sm:text-[13px] rounded-[15px] leading-relaxed ${
            isUser
              ? "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-tr-[2px] shadow-[0_4px_15px_rgba(185,28,28,0.4)] border border-red-500/30 after:content-[''] after:absolute after:-right-[5px] after:top-3.5 after:w-2.5 after:h-2.5 after:bg-[#801a1a] after:border-t after:border-r after:border-red-500/40 after:rotate-45"
              : "bg-[#141518] text-zinc-200 border border-white/10 rounded-tl-[2px] shadow-md space-y-1 before:content-[''] before:absolute before:-left-[5px] before:top-3.5 before:w-2.5 before:h-2.5 before:bg-[#141518] before:border-l before:border-b before:border-white/10 before:rotate-45"
          }`}
        >
          {message.parts.map((part, index) => {
            if (part.type !== "text") return null;
            return isUser ? (
              <span key={index} className="font-medium text-white">{ (part as { type: "text"; text: string }).text }</span>
            ) : (
              <div key={index}>{renderFormatted((part as { type: "text"; text: string }).text)}</div>
            );
          })}

          {/* User timestamp and double checkmarks */}
          {isUser && (
            <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-red-200/80 font-sans">
              <span suppressHydrationWarning>{timeString}</span>
              <CheckCheck size={13} className="text-red-300" />
            </div>
          )}

          {/* Blinking cursor on last bot message while streaming */}
          {!isUser && isLast && (
            <motion.span
              className="inline-block w-[6px] h-[13px] bg-racing-red ml-1 align-middle rounded-[1px]"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            />
          )}

          {/* Bot Action Bar (Copy Button) */}
          {!isUser && (
            <div className="flex items-center justify-end mt-2 pt-1.5 border-t border-white/5">
              <button
                onClick={handleCopy}
                title="Copy message"
                className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
