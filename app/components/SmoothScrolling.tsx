"use client";
import { ReactLenis } from 'lenis/react'

function SmoothScrolling({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.35, smoothWheel: true }}>
      {children as any}
    </ReactLenis>
  );
}

export default SmoothScrolling;