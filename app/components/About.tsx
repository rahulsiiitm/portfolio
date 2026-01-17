"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const container = useRef(null);
  const headlineRef = useRef(null);
  const bodyRef = useRef(null);
  const buttonRef = useRef(null);
  const numberRef = useRef(null);
  const sidebarRef = useRef(null);
  
  useEffect(() => {
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

        // 2. LAYER 1: HEADLINE (Fastest Up)
        gsap.to(headlineRef.current, {
            y: -200, 
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0, // Instant response (No settling)
            }
        });

        // 3. LAYER 2: BODY TEXT (Medium Up)
        gsap.to(bodyRef.current, {
            y: -150,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

        // 4. LAYER 3: BUTTON (Slow Up)
        // Moves slower than body, creating a gap as you scroll
        gsap.to(buttonRef.current, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

        // 5. LAYER 4: BIG "21" (Reverse Down)
        // Moves against the scroll for deep depth
        gsap.to(numberRef.current, {
            y: 600, 
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

         // 6. SIDEBAR PARALLAX (Subtle shift)
         gsap.to(sidebarRef.current, {
            y: 50,
            ease: "none",
            scrollTrigger: {
                trigger: container.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0,
            }
        });

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} id="about" className="relative w-full bg-off-white text-carbon-black border-b border-black/10 overflow-hidden">
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative z-10">

        {/* LEFT COLUMN: Sticky Sidebar */}
        <div className="w-full md:w-1/4 md:h-screen md:sticky md:top-0 flex flex-col justify-between p-10 border-r border-black/10 relative overflow-hidden bg-off-white/50 backdrop-blur-[2px]">
            
            <div ref={sidebarRef}>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-racing-red">
                    NO. 21 // PILOT
                </span>
            </div>
            
            {/* Giant Background "21" for Sidebar */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                <span className="text-[20rem] font-black italic tracking-tighter text-black stroke-text">
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

        {/* RIGHT COLUMN: The Manifesto */}
        <div className="w-full md:w-3/4 p-10 md:p-24 flex flex-col justify-center relative">

            {/* Giant Parallax "21" Background Number (Deep Layer) */}
            <div ref={numberRef} className="absolute top-[-10%] right-0 opacity-[0.04] pointer-events-none z-0">
                <span className="text-[35rem] leading-none font-black italic text-black">
                    21
                </span>
            </div>

            {/* Headline (Fast Layer) */}
            <div ref={headlineRef} className="relative z-10">
                <h2 className="text-5xl md:text-7xl font-black leading-[0.9] mb-12 uppercase tracking-tighter">
                    Bridging the Gap Between <br/>
                    <span className="text-racing-red">Silicon Logic</span> & <br/>
                    <span className="text-transparent stroke-text">Human Emotion</span>.
                </h2>
            </div>

            {/* Content Body (Medium Layer) */}
            <div ref={bodyRef} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 text-lg font-medium text-gray-600 leading-relaxed">
                <div>
                    <p className="mb-6">
                        I am a <strong className="text-black">B.Tech CSE</strong> student at <strong className="text-black">IIIT Manipur</strong> (Batch 2027) with a distinct edge: I don't just write code; I craft experiences.
                    </p>
                    <p>
                        While many engineers stop at function, I push through to form. My work exists at the intersection where <strong className="text-black">AI/ML algorithms</strong> meet pixel-perfect <strong className="text-black">UI/UX design</strong>.
                    </p>
                </div>
                
                <div className="flex flex-col justify-between">
                    <p>
                        I believe the most powerful applications feel "invisible." They anticipate needs (AI) and respond effortlessly (UX). That is the standard I build for.
                    </p>
                    
                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/10 pt-6">
                        <div>
                            <span className="block text-2xl font-black text-black">2+</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Years Exp.</span>
                        </div>
                        <div>
                            <span className="block text-2xl font-black text-black">10+</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Projects</span>
                        </div>
                    </div>
                </div>
            </div>

             {/* Download Button (Slow Layer) */}
             <div ref={buttonRef} className="mt-24 relative z-10">
                <a 
                    href="https://drive.google.com/file/d/1GaUFx-KT4HekLrgq1jmTVeSRy-z6HGdu/view?usp=sharing" 
                    download="Rahul Sharma.pdf"
                    className="inline-flex items-center gap-4 px-8 py-4 bg-black text-white font-bold uppercase tracking-[0.2em] text-sm hover:bg-racing-red transition-colors duration-300 group shadow-xl"
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