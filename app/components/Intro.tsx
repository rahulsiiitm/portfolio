"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from 'next/image';

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
            "-=1.0"
        );

    }, []);

    return (
        <section
            ref={container}
            className="relative w-full py-20 sm:py-24 md:py-32 px-6 sm:px-10 md:px-24 bg-off-white text-carbon-black overflow-hidden"
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 sm:gap-12 md:gap-16 items-start">

                {/* === LEFT COLUMN: TEXT CONTENT - MOBILE OPTIMIZED === */}
                <div className="w-full md:w-3/5">
                    {/* Header - MOBILE OPTIMIZED */}
                    <div className="flex items-center gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12 intro-line">
                        <span className="h-[2px] w-8 md:w-10 bg-racing-red"></span>
                        <span className="text-xs md:text-sm font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-gray-500">
                            The Mission
                        </span>
                    </div>

                    {/* Manifesto - MOBILE OPTIMIZED */}
                    <div ref={textRef} className="text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.1] uppercase tracking-tight">
                        <div className="overflow-hidden"><p className="intro-line">I do not just write code</p></div>
                        <div className="overflow-hidden"><p className="intro-line">I engineer <span className="text-racing-red">Velocity</span></p></div>

                        <div className="mt-6 sm:mt-7 md:mt-8 overflow-hidden">
                            <p className="intro-line text-base sm:text-lg md:text-2xl normal-case font-medium text-gray-600 max-w-xl leading-relaxed">
                                Merging the precision of <strong className="text-carbon-black">Deep Learning</strong> with the raw power of <strong className="text-carbon-black">Robotic Perception</strong>. My work lives where algorithms meet the real world.
                            </p>
                        </div>
                    </div>

                    {/* Stats Grid - MOBILE OPTIMIZED */}
                    <div className="grid grid-cols-2 gap-6 sm:gap-7 md:gap-8 mt-12 sm:mt-14 md:mt-16 border-t border-gray-300 pt-6 sm:pt-7 md:pt-8">
                        <StatItem number="01" label="Neural Nets" value="TensorFlow / PyTorch" />
                        <StatItem number="02" label="Robotics" value="ROS / SLAM / OpenCV" />
                    </div>
                </div>


                {/* === RIGHT COLUMN: PHOTO - MOBILE OPTIMIZED === */}
                <div className="w-full md:w-2/5 relative mt-6 sm:mt-8 md:mt-0">

                    {/* THE IMAGE CONTAINER - MOBILE OPTIMIZED */}
                    <div ref={imageRef} className="relative aspect-[3/4] w-full bg-gray-200 overflow-hidden shadow-2xl">

                        <Image
                            src="/profile.jpg"
                            alt="Rahul Sharma"
                            fill
                            className="object-cover hover:grayscale-0 transition-all duration-700"
                        />

                        {/* Border Overlay - MOBILE OPTIMIZED */}
                        <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-white/30 m-3 md:m-4 pointer-events-none"></div>

                        {/* Decorative Corner Accent - MOBILE OPTIMIZED */}
                        <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-racing-red z-10"></div>
                    </div>

                </div>

            </div>
        </section>
    );
}

const StatItem = ({ number, label, value }: any) => (
    <div className="intro-line flex flex-col gap-1.5 md:gap-2">
        <span className="text-[10px] md:text-xs font-bold text-racing-red">{number}</span>
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-gray-500">{label}</span>
        <span className="text-base sm:text-lg font-bold text-carbon-black">{value}</span>
    </div>
);