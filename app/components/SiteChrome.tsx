"use client";

import { usePathname } from "next/navigation";
import SmoothScrolling from "./SmoothScrolling";
import Navbar from "./Navbar";
import ChatWidget from "./Chatbot/ChatWidget";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isControlRoom = pathname.startsWith("/zero-control");

  if (isControlRoom) return <>{children}</>;

  return (
    <>
      <SmoothScrolling>
        <Navbar />
        {children}
      </SmoothScrolling>
      <ChatWidget />
    </>
  );
}
