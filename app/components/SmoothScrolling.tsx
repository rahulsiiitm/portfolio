"use client";
import { ReactLenis } from "lenis/react";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.085, duration: 1.45, smoothWheel: true, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}