"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
    const container = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animation: The red line grows as you scroll
        gsap.fromTo(".red-line",
            { height: "0%" },
            {
                height: "100%",
                duration: 1.5,
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: true, // Links animation to scroll bar
                }
            }
        );
    }, []);

    return (
        <section ref={container} className="relative w-full min-h-screen bg-off-white text-carbon-black flex flex-col md:flex-row">

            {/* LEFT COLUMN: The "Label" */}
            <div className="w-full md:w-1/4 p-10 border-r border-gray-300 relative">
                <span className="text-sm font-bold tracking-widest uppercase text-gray-500">01 — Introduction</span>
                {/* The Animated Red Line */}
                <div className="red-line absolute top-0 right-0 w-2 bg-racing-red"></div>
            </div>

            {/* RIGHT COLUMN: The Content */}
            <div className="w-full md:w-3/4 p-10 md:p-20 flex flex-col justify-center">

                {/* Big Headline */}
                <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-10 uppercase">
                    Building the bridge between <span className="text-racing-red">Complex Logic</span> and <span className="text-racing-red">Human Design</span>.
                </h2>

                {/* Descriptive Text */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg text-gray-700">
                    <p>
                        I am a B.Tech CSE student at IIIT Manipur with a unique dual-focus.
                        While most engineers stop at the code, I push through to the pixel.
                    </p>
                    <p>
                        From training ML models to designing intuitive interfaces in Figma,
                        I believe the best applications feel "invisible" — they just work.
                    </p>
                </div>

                {/* Call to Action Button */}
                <div className="mt-12">
                    <button className="px-8 py-4 border-2 border-carbon-black text-carbon-black font-bold uppercase tracking-widest hover:bg-carbon-black hover:text-white transition-colors duration-300">
                        Download Resume
                    </button>
                </div>

            </div>
        </section>
    );
}