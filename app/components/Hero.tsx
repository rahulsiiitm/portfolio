"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
    const overlayRef = useRef(null);
    const textRef = useRef(null);
    const subTextRef = useRef(null);

    useEffect(() => {
        // 1. Reveal the White Slanted Overlay
        gsap.fromTo(overlayRef.current,
            { x: "-100%" },
            { x: "0%", duration: 1.2, ease: "power4.out" }
        );

        // 2. Text Slide-in
        gsap.fromTo(textRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" }
        );

        // 3. Subtext Slide-in
        gsap.fromTo(subTextRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out" }
        );
    }, []);

    return (
        <section className="relative w-full h-screen overflow-hidden bg-black">

            {/* === 0. THE STATIC GLOBAL GRID === 
          - position: fixed -> It never scrolls.
          - z-index: 20 -> It sits ON TOP of the video and white sheet.
          - blend-mode -> It effectively "disappears" on the dark video but shows on white.
      */}
            <div className="fixed inset-0 z-20 pointer-events-none bg-grid-pattern opacity-40 mix-blend-multiply"></div>


            {/* 1. FIXED BACKGROUND VIDEO */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay muted loop playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                </video>
            </div>

            {/* 2. THE SLANTED "CUTOUT" PANEL */}
            <div
                ref={overlayRef}
                className="absolute top-0 left-[-10%] w-[120%] h-full bg-off-white z-10 transform -skew-x-12 origin-bottom border-r-8 border-racing-red"
            >
                {/* REMOVED THE GRID FROM HERE so it doesn't move with this div */}

                {/* 4. CONTENT CONTAINER */}
                <div className="absolute inset-0 flex flex-col justify-center px-20 md:px-40 transform skew-x-12">

                    {/* The "Tag" */}
                    <div ref={subTextRef} className="flex items-center gap-4 mb-2">
                        <span className="h-[2px] w-10 bg-racing-red"></span>
                        <span className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500">
                            Portfolio • 2026
                        </span>
                    </div>

                    {/* The Massive Name */}
                    <div ref={textRef}>
                        <h1 className="text-[5rem] md:text-[10rem] font-black leading-[0.85] tracking-tighter text-carbon-black uppercase">
                            Rahul <br />
                            <span className="text-racing-red">Sharma</span>
                        </h1>

                        <p className="mt-6 text-xl md:text-2xl font-medium text-gray-600 max-w-lg">
                            Engineering intelligence into design.
                            <br />
                            <span className="text-sm uppercase tracking-widest text-gray-400 font-bold">
                                B.Tech CSE • UI/UX Specialist
                            </span>
                        </p>
                    </div>

                    {/* Decorative Specs */}
                    <div className="absolute bottom-10 left-40 hidden md:flex gap-10 text-xs font-mono text-gray-400">
                        <div>
                            <p>LOC</p>
                            <p className="text-black">IMPHAL, IN</p>
                        </div>
                        <div>
                            <p>STATUS</p>
                            <p className="text-racing-red">ONLINE</p>
                        </div>
                        <div>
                            <p>SYS</p>
                            <p className="text-black">NEXT.JS / GSAP</p>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
}