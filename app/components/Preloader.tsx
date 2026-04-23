"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const uiContentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 1. Lock scrolling
    document.body.style.overflow = "hidden";

    // 2. Initial UI Fade In
    gsap.to(uiContentRef.current, { opacity: 1, duration: 0.3 });

    // 3. REAL ASSET TRACKING
    const images = document.querySelectorAll("img");
    const totalAssets = images.length;
    let loadedAssets = 0;

    const updateProgress = () => {
      loadedAssets++;
      const newProgress = Math.round((loadedAssets / totalAssets) * 100);
      setProgress(newProgress);
      
      // Update counter text directly for performance
      if (counterRef.current) {
        counterRef.current.textContent = newProgress.toString();
      }

      // Turn on lights based on progress milestones
      if (newProgress >= 20) gsap.to(".light-1", { backgroundColor: "#ff0000", borderColor: "#ff0000", boxShadow: "0 0 20px #ff0000" });
      if (newProgress >= 40) gsap.to(".light-2", { backgroundColor: "#ff0000", borderColor: "#ff0000", boxShadow: "0 0 20px #ff0000" });
      if (newProgress >= 60) gsap.to(".light-3", { backgroundColor: "#ff0000", borderColor: "#ff0000", boxShadow: "0 0 20px #ff0000" });
      if (newProgress >= 80) gsap.to(".light-4", { backgroundColor: "#ff0000", borderColor: "#ff0000", boxShadow: "0 0 20px #ff0000" });
      if (newProgress >= 95) gsap.to(".light-5", { backgroundColor: "#ff0000", borderColor: "#ff0000", boxShadow: "0 0 20px #ff0000" });
    };

    if (totalAssets === 0) {
      setProgress(100);
    } else {
      images.forEach((img) => {
        if (img.complete) {
          updateProgress();
        } else {
          img.addEventListener("load", updateProgress);
          img.addEventListener("error", updateProgress); // count errors too so we don't get stuck
        }
      });
    }

    // 4. EXIT SEQUENCE (Triggered when window is fully ready)
    const handleFullLoad = () => {
      const tl = gsap.timeline({
        delay: 0.2, // Small buffer for visual comfort
        onComplete: () => {
          document.body.style.overflow = "";
          setIsUnmounted(true);
        }
      });

      // Lights out! (F1 Start)
      tl.to(".f1-light", { 
        backgroundColor: "transparent", 
        borderColor: "#222", 
        boxShadow: "none", 
        duration: 0.05 
      })
      .to(uiContentRef.current, { opacity: 0, duration: 0.3 })
      .to([leftPanelRef.current, rightPanelRef.current], {
        xPercent: (i) => i === 0 ? -100 : 100,
        duration: 0.8,
        ease: "power4.inOut"
      });
    };

    if (document.readyState === "complete") {
      handleFullLoad();
    } else {
      window.addEventListener("load", handleFullLoad);
      return () => window.removeEventListener("load", handleFullLoad);
    }

  }, []);

  if (isUnmounted) return null;

  return (
    <div ref={mainWrapperRef} className="fixed inset-0 z-[9999] w-full h-full overflow-hidden pointer-events-none">
      <div ref={leftPanelRef} className="absolute top-0 left-0 w-1/2 h-full bg-[#050505] z-0 pointer-events-auto"></div>
      <div ref={rightPanelRef} className="absolute top-0 right-0 w-1/2 h-full bg-[#050505] z-0 pointer-events-auto"></div>

      <div ref={uiContentRef} className="relative z-10 w-full h-full flex flex-col items-center justify-center opacity-0 pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] overflow-hidden">
          <span className="text-[30rem] md:text-[40rem] font-black italic text-white">21</span>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] uppercase tracking-[0.4em]">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
            <span>IRIS_SYSTEM_CHECK</span>
          </div>

          <div className="flex gap-4 md:gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`f1-light light-${i} w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#222] bg-transparent`}></div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 flex items-baseline font-mono">
          <span ref={counterRef} className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">0</span>
          <span className="text-lg md:text-2xl font-bold text-red-600 ml-1">%</span>
        </div>
      </div>
    </div>
  );
}