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
        <section id="home" className="relative w-full h-screen overflow-hidden bg-black">

            {/* === 0. THE STATIC GLOBAL GRID === */}
            <div className="fixed inset-0 z-20 pointer-events-none bg-grid-pattern opacity-40 mix-blend-multiply"></div>

            {/* 1. BACKGROUND IMAGE */}
            <div className="absolute right-0 top-0 w-full h-full flex items-center justify-end lg:block">
                <img
                    src="/livery.jpeg"
                    alt="Background Livery"
                    className="w-full h-full object-cover opacity-60 md:opacity-100"
                />
            </div>

            {/* 2. THE SLANTED "CUTOUT" PANEL */}
            <div
                ref={overlayRef}
                className="absolute top-0 left-[-15%] md:left-[-10%] w-[130%] md:w-[120%] h-full bg-off-white z-10 transform -skew-x-12 origin-bottom border-r-8 border-racing-red"
            >

                {/* 4. CONTENT CONTAINER */}
                {/* Reverted strictly to flex-col justify-center. px-6 for mobile safety, px-40 for desktop */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-40 transform skew-x-12">

                    {/* The "Tag" - Removed extra margins */}
                    <div ref={subTextRef} className="flex items-center gap-4 mb-2">
                        <span className="h-[2px] w-8 md:w-10 bg-racing-red"></span>
                        <span className="text-xs md:text-sm font-bold tracking-[0.2em] uppercase text-gray-500">
                            Portfolio • 2026
                        </span>
                    </div>

                    {/* The Massive Name - Removed extra margins */}
                    <div ref={textRef}>
                        <h1 className="text-6xl md:text-[10rem] font-black leading-[0.9] tracking-tighter text-carbon-black uppercase">
                            Rahul <br />
                            <span className="text-racing-red">Sharma</span>
                        </h1>

                        <p className="mt-6 text-lg md:text-2xl font-medium text-gray-600 max-w-lg leading-relaxed">
                            Engineering intelligence into design.
                            <br />
                            <span className="text-xs md:text-sm uppercase tracking-widest text-gray-400 font-bold block mt-2">
                                B.Tech CSE • Full Stack & AI Engineer
                            </span>
                        </p>
                    </div>

                    {/* Decorative Specs - Positioned absolutely so they don't affect flow */}
                    <div className="absolute bottom-10 left-6 md:left-40 flex gap-6 md:gap-10 text-[10px] md:text-xs font-mono text-gray-400">
                        <div>
                            <p>LOC</p>
                            <p className="text-black ">IMPHAL, IN</p>
                        </div>
                        <div>
                            <p>STATUS</p>
                            <p className="text-racing-red ">ONLINE</p>
                        </div>
                        <div className="hidden sm:block">
                            <p>SYS</p>
                            <p className="text-black ">NEXT.JS / PYTHON</p>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
}