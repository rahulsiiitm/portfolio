"use client";

import { createContext, useCallback, useContext, useMemo, useRef } from "react";

type SoundName = "hover" | "engine";
type SoundContextValue = { play: (name: SoundName) => void };
const SoundContext = createContext<SoundContextValue>({ play: () => undefined });
const ENGINE_SOURCE = "/engine-start.mp3?v=rahul-engine-3";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const activeEngineRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((name: SoundName) => {
    if (name !== "engine") return;
    if (activeEngineRef.current && !activeEngineRef.current.paused) return;

    const engine = activeEngineRef.current ?? new Audio(ENGINE_SOURCE);
    engine.preload = "metadata";
    engine.volume = 0.45;
    engine.currentTime = 0;
    activeEngineRef.current = engine;
    engine.addEventListener("ended", () => {
      if (activeEngineRef.current === engine) activeEngineRef.current = null;
    }, { once: true });
    void engine.play().catch((error) => {
      console.warn("Engine audio could not play:", error);
    });
  }, []);

  const value = useMemo(() => ({ play }), [play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export const useSound = () => useContext(SoundContext);
