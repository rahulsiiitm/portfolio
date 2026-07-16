"use client";

import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Fragment, useState } from "react";
import { Copy, Check } from "lucide-react";

// Minimal markdown renderer: **bold**, `code`, *italic*, bullet lines, line breaks
function renderFormatted(text: string) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const trimmed = line.trim();
    const isBullet = /^[-*]\s+/.test(trimmed);
    const content = isBullet ? trimmed.replace(/^[-*]\s+/, "") : line;

    const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
    const rendered = parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={pi} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`"))
        return (
          <code key={pi} className="bg-black/40 border border-white/10 rounded px-1 py-0.5 text-[11px] text-racing-red font-mono">
            {part.slice(1, -1)}
          </code>
        );
      if (part.startsWith("*") && part.endsWith("*") && part.length > 1)
        return <em key={pi} className="italic text-zinc-300">{part.slice(1, -1)}</em>;
      return <Fragment key={pi}>{part}</Fragment>;
    });

    if (isBullet) {
      return (
        <div key={li} className="flex gap-2 pl-1">
          <span className="text-racing-red mt-0.5 shrink-0">▸</span>
          <span>{rendered}</span>
        </div>
      );
    }
    return (
      <div key={li}>
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

  return (
    <div className={`flex w-full group ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center border border-zinc-700 mt-1 mr-2 overflow-hidden bg-[#1a1a1a]">
          <img src="/mask-circle.png" alt="Zero" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative max-w-[80%]">
        {/* Message bubble */}
        <div
          className={`px-4 py-3 text-[13px] rounded-2xl ${
            isUser
              ? "bg-gradient-to-br from-red-700 to-red-950 text-white border border-red-500/20 rounded-br-sm shadow-[0_0_12px_rgba(220,38,38,0.2)] whitespace-pre-wrap"
              : "bg-[#1e1e1e] text-zinc-200 border border-white/5 rounded-bl-sm font-mono leading-relaxed space-y-0.5"
          }`}
        >
          {message.parts.map((part, index) => {
            if (part.type !== "text") return null;
            return isUser ? (
              <span key={index}>{(part as { type: "text"; text: string }).text}</span>
            ) : (
              <div key={index}>{renderFormatted((part as { type: "text"; text: string }).text)}</div>
            );
          })}

          {/* Blinking cursor on last bot message */}
          {!isUser && isLast && (
            <motion.span
              className="inline-block w-[6px] h-[12px] bg-racing-red ml-1 align-middle rounded-[1px]"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            />
          )}
        </div>

        {/* Copy button — appears on hover for bot messages */}
        {!isUser && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            onClick={handleCopy}
            title="Copy message"
            className="absolute -bottom-5 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-zinc-500 hover:text-zinc-300"
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
          </motion.button>
        )}
      </div>
    </div>
  );
}