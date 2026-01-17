"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image"; // Import Next.js Image component

export default function Intro() {
    const container = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 70%",
                end: "bottom center",
                toggleActions: "play none none reverse",
            },
        });

        // 1. Image Reveal (Scale Up + Fade)
        tl.fromTo(imageRef.current,
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }
        );

        // 2. Text Reveal (Staggered)
        tl.fromTo(".intro-line",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power4.out" },
            "-=1.0" // Start while image is still revealing
        );

    }, []);

    return (
        <section
            ref={container}
            className="relative w-full py-32 px-10 md:px-24 bg-off-white text-carbon-black overflow-hidden"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">

                {/* === LEFT COLUMN: TEXT CONTENT === */}
                <div className="w-full md:w-3/5">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-12 intro-line">
                        <span className="h-[2px] w-10 bg-racing-red"></span>
                        <span className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500">
                            The Mission
                        </span>
                    </div>

                    {/* Manifesto */}
                    <div ref={textRef} className="text-4xl md:text-6xl font-bold leading-[1.1] uppercase tracking-tight">
                        <div className="overflow-hidden"><p className="intro-line">I do not just write code.</p></div>
                        <div className="overflow-hidden"><p className="intro-line">I engineer <span className="text-racing-red">Velocity</span>.</p></div>

                        <div className="mt-8 overflow-hidden">
                            <p className="intro-line text-xl md:text-2xl normal-case font-medium text-gray-600 max-w-xl leading-relaxed">
                                Merging the precision of Machine Learning with the raw emotion of brutalist design. My work lives at the intersection where algorithms meet aesthetics.
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-8 mt-16 border-t border-gray-300 pt-8">
                        <StatItem number="01" label="Frontend" value="Next.js / GSAP" />
                        <StatItem number="02" label="AI / ML" value="Python / PyTorch" />
                    </div>
                </div>


                {/* === RIGHT COLUMN: PHOTO PLACEHOLDER === */}
                <div className="w-full md:w-2/5 relative mt-10 md:mt-0">

                    {/* THE IMAGE CONTAINER (Animated) */}
                    <div ref={imageRef} className="relative aspect-[3/4] w-full bg-gray-200 overflow-hidden">

                        <Image src="/profile.jpg" fill alt="Rahul" className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-400 m-4">
                            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest text-center">
                            </p>
                        </div>

                        {/* Decorative Corner Accent */}
                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-racing-red z-10"></div>
                    </div>

                </div>

            </div>
        </section>
    );
}

const StatItem = ({ number, label, value }: any) => (
    <div className="intro-line flex flex-col gap-2">
        <span className="text-xs font-bold text-racing-red">{number}</span>
        <span className="text-xs uppercase tracking-widest text-gray-500">{label}</span>
        <span className="text-lg font-bold text-carbon-black">{value}</span>
    </div>
);