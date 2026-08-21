"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SmoothScrolling from "./SmoothScrolling";
import Navbar from "./Navbar";
import { SoundProvider } from "./SoundProvider";

const ChatWidget = dynamic(() => import("./Chatbot/ChatWidget"), { ssr: false });

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isControlRoom = pathname.startsWith("/zero-control");
  const isHome = pathname === "/";
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const reveal = () => setShowChat(true);
    const idleId = window.requestIdleCallback?.(reveal, { timeout: 2000 });
    const timeoutId = idleId === undefined ? window.setTimeout(reveal, 1500) : undefined;

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (isControlRoom) return <>{children}</>;

  const content = (
    <>
      <Navbar />
      {children}
    </>
  );

  return (
    <SoundProvider>
      {isHome ? <SmoothScrolling>{content}</SmoothScrolling> : content}
      {showChat && <ChatWidget />}
    </SoundProvider>
  );
}
