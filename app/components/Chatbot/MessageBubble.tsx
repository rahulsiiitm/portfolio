import { UIMessage } from "ai";
import { motion } from "framer-motion";

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
        className={`px-4 py-3 max-w-[80%] text-[13px] rounded-2xl whitespace-pre-wrap transition-shadow ${
          isUser
            ? "bg-gradient-to-r from-red-800 to-red-950 text-white border border-red-500/30 rounded-br-sm shadow-[0_0_15px_rgba(220,38,38,0.25)] hover:shadow-[0_0_22px_rgba(220,38,38,0.45)]"
            : "bg-[#222222] text-gray-200 border border-white/5 rounded-bl-sm font-mono leading-relaxed shadow-[0_0_10px_rgba(255,0,0,0.08)] hover:shadow-[0_0_16px_rgba(255,0,0,0.2)]"
        }`}
      >
        {message.parts.map((part, index) => {
          if (part.type === "text") return <span key={index}>{part.text}</span>;
          return null;
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