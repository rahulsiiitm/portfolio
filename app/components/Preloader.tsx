"use client";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [isUnmounted, setIsUnmounted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);     // Tracks actual browser load
  const [isAnimReady, setIsAnimReady] = useState(false); // Tracks our F1 light sequence
  
  // Refs for animation targets
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const uiContentRef = useRef<HTMLDivElement>(null); // wrapper for lights/counter/logo
  const counterRef = useRef<HTMLSpanElement>(null);

  // 1. REAL BROWSER LOAD LISTENER (No Timeout)
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsLoaded(true);
    } else {
      const handleLoad = () => setIsLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // 2. THE ENTRANCE ANIMATION (Lights turning on, Logo fade, Counter)
  useEffect(() => {
    // Lock scrolling immediately
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimReady(true); // Tell the app our sequence is done
      }
    });

    // Animate UI content fade in
    tl.fromTo(uiContentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Animate 0 to 99% 
    tl.to({ value: 0 }, {
      value: 99,
      duration: 2, 
      ease: "power2.inOut",
      onUpdate: function () {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(this.targets()[0].value).toString();
        }
      }
    }, 0.2); // slight delay after fade in

    // Turn on the 5 lights sequentially
    tl.to(".f1-light", { 
      backgroundColor: "#ff0000", 
      borderColor: "#ff0000",
      boxShadow: "0 0 30px rgba(255, 0, 0, 0.6)",
      duration: 0.1, 
      stagger: 0.4 
    }, 0.4); 

    return () => { document.body.style.overflow = ""; };
  }, []);

  // 3. THE EXIT ANIMATION (Triggered ONLY when BOTH are true)
  useEffect(() => {
    if (isLoaded && isAnimReady) {
      const tl = gsap.timeline({
        onComplete: () => {
          // 1. Reset overflow to let your CSS take over
          document.body.style.overflow = "";
          // 2. Kill the preloader entirely
          setIsUnmounted(true);
        }
      });

      if (counterRef.current) counterRef.current.textContent = "100";

      // "Lights Out"
      tl.to(".f1-light", { 
        backgroundColor: "transparent", 
        borderColor: "#222",
        boxShadow: "none", 
        duration: 0.05 
      }, "+=0.2");

      // Fade out UI Content
      tl.to(uiContentRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.in"
      });

      // Split panels - THE FIX IS HERE
      tl.to([leftPanelRef.current, rightPanelRef.current], {
        xPercent: (i) => i === 0 ? -100 : 100, // Left goes -100, Right goes 100
        duration: 1.1,
        ease: "power4.inOut",
        // Important: Hide them as soon as they are off-screen to prevent width expansion
        onComplete: () => {
          gsap.set([leftPanelRef.current, rightPanelRef.current], { display: "none" });
        }
      }, "+=0.1");
    }
  }, [isLoaded, isAnimReady]);

  if (isUnmounted) return null;

  return (
    <div
      ref={mainWrapperRef}
      /* THE FIX: pointer-events-none on the wrapper ensures it doesn't block clicks if a pixel remains */
      className="fixed inset-0 z-[9999] w-full h-full overflow-hidden pointer-events-none"
    >
      
      {/* --- SPLIT PANELS --- */}
      {/* Added pointer-events-auto here so the preloader itself is interactive if needed */}
      <div ref={leftPanelRef} className="absolute top-0 left-0 w-1/2 h-full bg-[#050505] z-0 will-change-transform pointer-events-auto"></div>
      <div ref={rightPanelRef} className="absolute top-0 right-0 w-1/2 h-full bg-[#050505] z-0 will-change-transform pointer-events-auto"></div>

      {/* --- UI CONTENT WRAPPER --- */}
      <div ref={uiContentRef} className="relative z-10 w-full h-full flex flex-col items-center justify-center opacity-0 pointer-events-none">
        
        {/* Background 21 - Constrained */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] overflow-hidden w-full h-full">
          <span className="text-[30rem] md:text-[40rem] font-black italic text-white leading-none whitespace-nowrap">
            21
          </span>
        </div>

        <div className="flex flex-col items-center gap-8 md:gap-10">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase mb-1 md:mb-2 select-none">
            <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
            <span>rs // Logic</span>
          </div>

          <div className="flex gap-4 md:gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="f1-light w-8 h-8 md:w-12 md:h-12 rounded-full border-2 border-[#222] bg-transparent"
              ></div>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="absolute bottom-10 right-10 md:bottom-16 md:right-16 flex items-baseline font-mono">
          <span ref={counterRef} className="text-5xl md:text-7xl font-black italic text-white tracking-tighter">
            0
          </span>
          <span className="text-lg md:text-2xl font-bold text-racing-red ml-1">
            %
          </span>
        </div>
      </div>
    </div>
  );
}