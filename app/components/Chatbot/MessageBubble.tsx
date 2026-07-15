import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Fragment } from "react";

// Minimal markdown-ish renderer: **bold**, `code`, bullet lines, line breaks
function renderFormatted(text: string) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const trimmed = line.trim();
    const isBullet = /^[-*]\s+/.test(trimmed);
    const content = isBullet ? trimmed.replace(/^[-*]\s+/, "") : line;

    const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
    const rendered = parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={pi} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={pi} className="bg-black/40 border border-white/10 rounded px-1 py-0.5 text-[12px] text-racing-red">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
        return <em key={pi} className="italic text-gray-100">{part.slice(1, -1)}</em>;
      }
      return <Fragment key={pi}>{part}</Fragment>;
    });

    if (isBullet) {
      return (
        <div key={li} className="flex gap-2 pl-1">
          <span className="text-racing-red">▸</span>
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

export default function MessageBubble({ message, isLast }: { message: UIMessage; isLast?: boolean }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border border-black mt-1 mr-2 relative shadow-inner overflow-hidden bg-[#1a1a1a]">
          <img src="/mask-circle.png" alt="Bot DP" className="w-full h-full object-cover" />
        </div>
      )}
      <div
        className={`px-4 py-3 max-w-[80%] text-[13px] rounded-2xl transition-shadow ${
          isUser
            ? "bg-gradient-to-r from-red-800 to-red-950 text-white border border-red-500/30 rounded-br-sm shadow-[0_0_15px_rgba(220,38,38,0.25)] hover:shadow-[0_0_22px_rgba(220,38,38,0.45)] whitespace-pre-wrap"
            : "bg-[#222222] text-gray-200 border border-white/5 rounded-bl-sm font-mono leading-relaxed shadow-[0_0_10px_rgba(255,0,0,0.08)] hover:shadow-[0_0_16px_rgba(255,0,0,0.2)] space-y-0.5"
        }`}
      >
        {message.parts.map((part, index) => {
          if (part.type !== "text") return null;
          return isUser ? (
            <span key={index}>{part.text}</span>
          ) : (
            <div key={index}>{renderFormatted(part.text)}</div>
          );
        })}
        {!isUser && isLast && (
          <motion.span
            className="inline-block w-[7px] h-[13px] bg-racing-red ml-1 align-middle"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        )}
      </div>
    </div>
  );
}