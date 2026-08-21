"use client";

import { UIMessage } from "ai";
import { motion } from "framer-motion";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, Check, CheckCheck } from "lucide-react";
import Image from "next/image";

function renderInline(text: string, keyPrefix: string) {
  const parts = text
    .split(/(\[(?:[^\]]+)\]\((?:[^)]+)\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g)
    .filter(Boolean);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const href = linkMatch[2].trim();
      if (!/^https?:\/\//i.test(href) && !href.startsWith("/")) {
        return <Fragment key={key}>{linkMatch[1]}</Fragment>;
      }
      return (
        <a key={key} href={href} target={href.startsWith("/") ? undefined : "_blank"} rel={href.startsWith("/") ? undefined : "noopener noreferrer"} className="font-medium text-red-400 underline decoration-red-500/45 underline-offset-2 transition-colors hover:text-red-300 break-words">
          {linkMatch[1]}
        </a>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key} className="rounded-[4px] border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[11px] text-red-300 break-all">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      return <em key={key} className="italic text-zinc-300">{part.slice(1, -1)}</em>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

function normalizeListMarkers(text: string) {
  let insideFence = false;
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) {
        insideFence = !insideFence;
        return line;
      }
      if (insideFence) return line;
      return line.replace(/([^\n])\s+▸\s+/g, "$1\n▸ ");
    })
    .join("\n");
}

function renderFormatted(text: string) {
  const lines = normalizeListMarkers(text).split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  const startsBlock = (line: string) => {
    const value = line.trim();
    return !value || /^```/.test(value) || /^#{1,6}\s+/.test(value) || /^---+$/.test(value) || /^>\s?/.test(value) || /^(?:[-*]|▸)\s+/.test(value) || /^\d+[.)]\s+/.test(value);
  };

  while (index < lines.length) {
    const trimmed = lines[index].trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const fence = trimmed.match(/^```([\w+#.-]*)\s*$/);
    if (fence) {
      const language = fence[1] || "code";
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(
        <div key={`code-${index}`} className="overflow-hidden rounded-[8px] border border-white/10 bg-[#090a0d] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-3 py-1.5">
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{language}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-racing-red shadow-[0_0_7px_rgba(239,43,37,0.8)]" />
          </div>
          <pre className="max-w-full overflow-x-auto px-3.5 py-3 text-[11px] leading-5 text-zinc-200 custom-scrollbar">
            <code className="font-mono whitespace-pre">{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(
        <div key={`heading-${index}`} className={`${level <= 2 ? "text-[14px]" : "text-[13px]"} font-semibold leading-snug text-white`}>
          {renderInline(heading[2], `heading-${index}`)}
        </div>
      );
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push(<div key={`rule-${index}`} className="h-px bg-white/10" />);
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${index}`} className="rounded-r-[7px] border-l-2 border-racing-red bg-red-500/[0.055] px-3 py-2 text-[12px] leading-5 text-zinc-300">
          {renderInline(quoteLines.join(" "), `quote-${index}`)}
        </blockquote>
      );
      continue;
    }

    if (/^(?:[-*]|▸)\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^(?:[-*]|▸)\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^(?:[-*]|▸)\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ul key={`list-${index}`} className="space-y-2">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-2.5 rounded-r-[6px] border-l border-red-500/55 bg-white/[0.025] px-2.5 py-2 text-[13px] leading-[1.55] text-zinc-200">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-racing-red shadow-[0_0_6px_rgba(239,43,37,0.65)]" />
              <span className="min-w-0 break-words">{renderInline(item, `list-${index}-${itemIndex}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+[.)]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+[.)]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+[.)]\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol key={`ordered-${index}`} className="space-y-1.5">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="grid grid-cols-[18px_1fr] gap-2 text-[13px] leading-5 text-zinc-200">
              <span className="font-mono text-[10px] text-red-400">{String(itemIndex + 1).padStart(2, "0")}</span>
              <span className="min-w-0 break-words">{renderInline(item, `ordered-${index}-${itemIndex}`)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    const paragraph: string[] = [trimmed];
    index += 1;
    while (index < lines.length && !startsBlock(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`} className="break-words text-[13px] leading-[1.65] text-zinc-200">
        {renderInline(paragraph.join(" "), `paragraph-${index}`)}
      </p>
    );
  }

  return <div className="min-w-0 space-y-3">{blocks}</div>;
}
function useSmoothText(target: string) {
  const [visibleText, setVisibleText] = useState(target);
  const visibleRef = useRef(target);
  const targetRef = useRef(target);

  useEffect(() => {
    targetRef.current = target;


    let frameId = 0;
    const reveal = () => {
      const current = visibleRef.current;
      const desired = targetRef.current;
      if (current === desired) return;

      if (!desired.startsWith(current)) {
        visibleRef.current = desired;
        setVisibleText(desired);
        return;
      }

      const remaining = desired.length - current.length;
      const step = remaining > 90 ? 4 : remaining > 45 ? 3 : remaining > 18 ? 2 : 1;
      const next = desired.slice(0, current.length + step);
      visibleRef.current = next;
      setVisibleText(next);
      frameId = requestAnimationFrame(reveal);
    };

    if (visibleRef.current !== targetRef.current) frameId = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(frameId);
  }, [target]);

  return visibleText;
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
  const [timeString] = useState(() => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

  const fullText = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("\n");

  const displayedText = useSmoothText(fullText);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className={`flex w-full items-start gap-2.5 group ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Bot Spider Avatar */}
      {!isUser && (
        <div className="relative w-8 h-8 rounded-full shrink-0 flex items-center justify-center border border-racing-red/80 bg-[#0b0c10] shadow-[0_0_14px_rgba(220,38,38,0.32)] overflow-hidden mt-0.5">
          <Image src="/mask-circle.png" alt="Zero" fill sizes="32px" className="object-cover" />
        </div>
      )}

      <div className="relative min-w-0 max-w-[86%] sm:max-w-[84%]">
        {/* Message bubble */}
        <div
          className={`relative px-3.5 py-3 text-[13px] sm:text-[13px] rounded-[12px] leading-relaxed ${
            isUser
              ? "bg-gradient-to-br from-[#d82b31] via-[#b91f28] to-[#74101a] text-white rounded-tr-[4px] shadow-[0_8px_24px_rgba(185,28,28,0.2)] border border-red-400/35"
              : "bg-[#14161b]/95 text-zinc-200 border border-white/10 rounded-tl-[4px] shadow-[0_10px_28px_rgba(0,0,0,0.24)] space-y-1 before:content-[''] before:absolute before:left-3 before:top-0 before:h-px before:w-12 before:bg-gradient-to-r before:from-racing-red before:to-transparent"
          }`}
        >
          {isUser ? (
            <span className="font-medium text-white">{fullText}</span>
          ) : (
            <div>{renderFormatted(displayedText)}</div>
          )}

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
