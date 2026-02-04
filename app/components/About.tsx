"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const container = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);
  const buttonRef = useRef(null);
  const numberRef = useRef(null);
  const sidebarRef = useRef(null);
  
  // Audio State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    setIsMobile(window.innerWidth < 768);

    // 1. SETUP AUDIO
    const audio = new Audio("/engine-start.mp3");
    audio.volume = 0.5;
    audioRef.current = audio;

    // 2. UNLOCK AUDIO (Browser Policy Fix)
    const unlockAudio = () => {
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioRef.current?.pause();
                    audioRef.current!.currentTime = 0;
                    setAudioUnlocked(true);
                }).catch(() => {});
            }
        }
        document.removeEventListener("click", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
        // 1. RED LINE (Progress Bar)
        gsap.fromTo(".red-line",
          { height: "0%" },
          {
            height: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: container.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            }
          }
        );

        // Reduce parallax intensity on mobile
        const parallaxMultiplier = isMobile ? 0.3 : 1;

        // 2. LAYER 1: HEADLINE
        gsap.to(headlineRef.current, {
            y: -200 * parallaxMultiplier, 
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

        // 3. LAYER 2: BODY TEXT
        gsap.to(bodyRef.current, {
            y: -150 * parallaxMultiplier,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

        // 4. LAYER 3: BUTTON
        gsap.to(buttonRef.current, {
            y: -50 * parallaxMultiplier,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

        // 5. LAYER 4: BIG "21"
        gsap.to(numberRef.current, {
            y: 600 * parallaxMultiplier, 
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

         // 6. SIDEBAR PARALLAX
         gsap.to(sidebarRef.current, {
            y: 50 * parallaxMultiplier,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

    }, container);

    return () => {
        ctx.revert();
        document.removeEventListener("click", unlockAudio);
    };
  }, [isMobile]);

  const playHoverSound = () => {
    if (!audioUnlocked) return;
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
    }
  };

  return (
    <section ref={container} id="about" className="relative w-full bg-off-white text-carbon-black border-b border-black/10 overflow-hidden">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative z-10">

        {/* LEFT COLUMN: Sticky Sidebar - MOBILE OPTIMIZED */}
        <div className="w-full md:w-1/4 md:h-screen md:sticky md:top-0 flex flex-col justify-between p-6 md:p-10 border-b md:border-b-0 md:border-r border-black/10 relative overflow-hidden bg-off-white/50 backdrop-blur-[2px]">
            
            <div ref={sidebarRef}>
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-racing-red">
                    NO. 21 // PILOT
                </span>
            </div>
            
            {/* Giant Background "21" for Sidebar - MOBILE OPTIMIZED */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                <span className="text-[12rem] md:text-[20rem] font-black italic tracking-tighter text-black stroke-text">
                    21
                </span>
            </div>
            
            {/* Vertical Text */}
            <div className="hidden md:block mt-auto relative z-10">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    IIIT MANIPUR // CSE
                </p>
            </div>

            {/* Red Line */}
            <div className="red-line absolute top-0 right-[-1.5px] w-[3px] bg-racing-red z-20 shadow-[0_0_10px_rgba(255,0,0,0.4)]"></div>
        </div>

        {/* RIGHT COLUMN: The Manifesto - MOBILE OPTIMIZED */}
        <div className="w-full md:w-3/4 p-6 sm:p-10 md:p-24 flex flex-col justify-center relative">

            {/* Giant Parallax "21" Background Number - MOBILE OPTIMIZED */}
            <div ref={numberRef} className="absolute top-[-10%] right-0 opacity-[0.04] pointer-events-none z-0">
                <span className="text-[20rem] sm:text-[28rem] md:text-[35rem] leading-none font-black italic text-black">
                    21
                </span>
            </div>

            {/* Headline - MOBILE OPTIMIZED */}
            <div ref={headlineRef} className="relative z-10">
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[0.9] mb-8 md:mb-12 uppercase tracking-tighter">
                    Bridging the Gap Between <br/>
                    <span className="text-racing-red">Silicon Logic</span> & <br/>
                    <span className="text-transparent stroke-text">Human Emotion</span>
                </h2>
            </div>

            {/* Content Body - MOBILE OPTIMIZED */}
            <div ref={bodyRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-base md:text-lg font-medium text-gray-600 leading-relaxed">
                <div>
                    <p className="mb-4 md:mb-6">
                        <strong className="text-black">B.Tech CSE @ IIIT Manipur</strong> (Batch 2027). I build products that work intelligently and look effortlessly good.
                    </p>
                    <p>
                        Most engineers optimize for performance. I optimize for <strong className="text-black">experience</strong> - where <strong className="text-black">ML models</strong> meet <strong className="text-black">clean interfaces</strong>.
                    </p>
                </div>
                
                <div className="flex flex-col justify-between">
                    <p>
                        The best tech feels invisible. Users shouldn't think about how it works - they should just use it and love it.
                    </p>
                    
                    {/* Stats - MOBILE OPTIMIZED */}
                    <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4 border-t border-black/10 pt-4 md:pt-6">
                        <div>
                            <span className="block text-xl md:text-2xl font-black text-black">2+</span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">Years Exp.</span>
                        </div>
                        <div>
                            <span className="block text-xl md:text-2xl font-black text-black">10+</span>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">Projects</span>
                        </div>
                    </div>
                </div>
            </div>

             {/* Download Button - MOBILE OPTIMIZED */}
             <div ref={buttonRef} className="mt-6 md:mt-7 relative z-10">
                <a 
                    href="https://drive.google.com/file/d/1GaUFx-KT4HekLrgq1jmTVeSRy-z6HGdu/view?usp=sharing" 
                    download="Rahul_Sharma_Resume.pdf"
                    target="_blank"
                    onMouseEnter={playHoverSound}
                    className="inline-flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 bg-black text-white font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm hover:bg-racing-red transition-colors duration-300 group shadow-xl cursor-pointer"
                >
                    <span>Download Telemetry</span>
                    <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                </a>
            </div>

        </div>

      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px #000;
          color: transparent;
        }
      `}</style>
    </section>
  );
}