"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Marquee() {
    const firstText = useRef(null);
    const secondText = useRef(null);
    const slider = useRef(null);

    // Variables to track speed
    let xPercent = 0;
    let direction = -1; // -1 = left, 1 = right

    useEffect(() => {
        requestAnimationFrame(animation);
    }, []);

    const animation = () => {
        if (xPercent <= -100) {
            xPercent = 0;
        }
        if (xPercent > 0) {
            xPercent = -100;
        }

        // Move the text
        gsap.set(firstText.current, { xPercent: xPercent });
        gsap.set(secondText.current, { xPercent: xPercent });

        // Constant speed
        xPercent += 0.1 * direction;
        requestAnimationFrame(animation);
    };

    return (
        <div className="relative flex overflow-hidden bg-racing-red py-8">
            {/* The Container for the sliding text */}
            <div ref={slider} className="absolute top-0 flex whitespace-nowrap">
                <TextContent ref={firstText} />
                <TextContent ref={secondText} />
            </div>
            {/* Invisible spacer to give the div height */}
            <div className="opacity-0 pointer-events-none">
                <TextContent />
            </div>
        </div>
    );
}

// Small helper component so we don't repeat code
const TextContent = ({ ref }: { ref?: any }) => (
    <div ref={ref} className="flex gap-10 px-4">
        <h2 className="text-6xl md:text-8xl font-black uppercase text-white tracking-tighter">
            • UI/UX Design • Artificial Intelligence • Full Stack • Creative Dev
        </h2>
    </div>
);