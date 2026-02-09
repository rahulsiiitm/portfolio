"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

// REPLACE WITH YOUR IMAGES
const sketches = [
    { src: "/sketch/sketch1.png", id: "01" },
    { src: "/sketch/sketch2.webp", id: "02" },
    { src: "/sketch/sketch3.jpeg", id: "03" },
    { src: "/sketch/sketch4.webp", id: "04" },
    { src: "/sketch/sketch5.webp", id: "05" },
    { src: "/sketch/sketch6.webp", id: "06" },
];

export default function SecretSketchbook() {
    const [isOpen, setIsOpen] = useState(false);
    const lenis = useLenis();
    
    // PERF: Cache DOM elements to avoid querying them every frame
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    
    // PHYSICS STATE
    const state = useRef({
        rotation: 0,
        target: 0,
        velocity: 0,
        isDragging: false,
        isHovering: false,
        startX: 0,
        lastX: 0
    }).current;

    // 1. SECRET CODE LISTENER ("sketch")
    useEffect(() => {
        let buffer = "";
        const code = "sketch";
        const handleKeyDown = (e: KeyboardEvent) => {
            buffer += e.key;
            if (buffer.length > code.length) buffer = buffer.slice(-code.length);
            if (buffer.toLowerCase() === code) setIsOpen(true);
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // 2. LOCK SCROLL
    useEffect(() => {
        if (isOpen) {
            lenis?.stop();
            document.body.style.overflow = "hidden";
        } else {
            lenis?.start();
            document.body.style.overflow = "auto";
        }
    }, [isOpen, lenis]);

    // 3. OPTIMIZED ANIMATION LOOP
    useEffect(() => {
        if (!isOpen) return;

        const radius = window.innerWidth < 768 ? 250 : 450; 
        const autoSpeed = 0.2; 
        const total = sketches.length;
        const angleStep = 360 / total;

        const update = () => {
            // PHYSICS ENGINE
            if (!state.isDragging) {
                state.velocity *= 0.95; // Friction
                
                if (!state.isHovering) {
                    state.target += (autoSpeed + state.velocity);
                } else {
                    state.velocity = 0;
                }
            }

            // LERP: Move current rotation towards target
            state.rotation += (state.target - state.rotation) * 0.1;

            // RENDER LOOP (Using Cached Refs)
            cardsRef.current.forEach((card, i) => {
                if (!card) return;

                const itemAngle = (i * angleStep) + state.rotation;
                const radian = (itemAngle * Math.PI) / 180;

                // 3D ORBIT CALCULATION
                const x = Math.sin(radian) * radius;
                const z = Math.cos(radian) * radius;
                
                // VISUALS
                const scale = (z + radius * 2) / (radius * 3) + 0.5;
                const opacity = Math.max(0, (z + radius) / (radius * 2) + 0.2);
                const zIndex = Math.floor(z + radius);

                // GSAP SET (Hardware Accelerated)
                gsap.set(card, {
                    x: x,
                    scale: scale,
                    zIndex: zIndex,
                    opacity: opacity,
                    rotationY: itemAngle,
                    force3D: true // Forces GPU rendering
                });
            });
        };

        // Add to GSAP Ticker (60fps)
        gsap.ticker.add(update);
        return () => gsap.ticker.remove(update);
    }, [isOpen]);

    // 4. EVENT HANDLERS (Memoized not needed for window listeners generally, but good practice)
    useEffect(() => {
        if (!isOpen) return;

        const handleDown = (clientX: number) => {
            state.isDragging = true;
            state.startX = clientX;
            state.lastX = clientX;
            state.velocity = 0;
        };

        const handleMove = (clientX: number) => {
            if (!state.isDragging) return;
            const diff = clientX - state.lastX;
            state.target += diff * 0.5; 
            state.velocity = diff * 0.5; 
            state.lastX = clientX;
        };

        const handleUp = () => {
            state.isDragging = false;
        };

        // EVENT LISTENERS
        const addEvents = (target: Window, events: string[], handler: any) => 
            events.forEach(evt => target.addEventListener(evt, handler));
        const removeEvents = (target: Window, events: string[], handler: any) => 
            events.forEach(evt => target.removeEventListener(evt, handler));

        // MOUSE
        addEvents(window, ["mousedown"], (e: MouseEvent) => handleDown(e.clientX));
        addEvents(window, ["mousemove"], (e: MouseEvent) => handleMove(e.clientX));
        addEvents(window, ["mouseup"], handleUp);
        
        // TOUCH
        addEvents(window, ["touchstart"], (e: TouchEvent) => handleDown(e.touches[0].clientX));
        addEvents(window, ["touchmove"], (e: TouchEvent) => handleMove(e.touches[0].clientX));
        addEvents(window, ["touchend"], handleUp);

        return () => {
            // CLEANUP
            removeEvents(window, ["mousedown"], (e: MouseEvent) => handleDown(e.clientX));
            removeEvents(window, ["mousemove"], (e: MouseEvent) => handleMove(e.clientX));
            removeEvents(window, ["mouseup"], handleUp);
            removeEvents(window, ["touchstart"], (e: TouchEvent) => handleDown(e.touches[0].clientX));
            removeEvents(window, ["touchmove"], (e: TouchEvent) => handleMove(e.touches[0].clientX));
            removeEvents(window, ["touchend"], handleUp);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden">
            
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-zinc-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#222_0%,_#000_100%)]"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
            </div>

            {/* HEADER */}
            <div className="absolute top-10 left-0 w-full text-center z-50 pointer-events-none">
                <p className="text-racing-red font-mono text-xs uppercase tracking-[0.3em] mb-2">
                    /// CLASSIFIED ARCHIVE
                </p>
                <h2 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
                    Raw <span className="stroke-text">Concepts</span>
                </h2>
                <div className="mt-6 flex flex-col items-center gap-2">
                    <p className="text-gray-500 text-[10px] font-mono">
                        HOVER TO INSPECT • DRAG TO SPIN
                    </p>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2 border border-white/20 text-xs font-mono text-white hover:bg-white hover:text-black transition-colors pointer-events-auto"
                    >
                        CLOSE [ESC]
                    </button>
                </div>
            </div>

            {/* STAGE */}
            <div className="relative w-full h-[600px] flex items-center justify-center mt-20">
                {sketches.map((img, i) => (
                    <div
                        key={i}
                        ref={(el) => { cardsRef.current[i] = el; }} // Cache Ref
                        className="absolute top-1/2 left-1/2 w-[240px] h-[340px] md:w-[320px] md:h-[440px] origin-center will-change-transform group cursor-pointer"
                        style={{ 
                            transform: `translate3d(-50%, -50%, 0)`, // Initial GPU Position
                        }}
                        onMouseEnter={() => state.isHovering = true}
                        onMouseLeave={() => state.isHovering = false}
                    >
                        {/* FRAME */}
                        <div className="relative w-full h-full bg-zinc-900 border border-white/10 p-1 shadow-2xl transition-transform duration-300 group-hover:scale-105 group-hover:border-racing-red/50">
                            
                            {/* Brackets */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/30 group-hover:border-racing-red transition-colors"></div>
                            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/30 group-hover:border-racing-red transition-colors"></div>
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/30 group-hover:border-racing-red transition-colors"></div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/30 group-hover:border-racing-red transition-colors"></div>

                            {/* Image */}
                            <div className="relative w-full h-[85%] bg-black overflow-hidden">
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none z-10"></div>
                                <img 
                                    src={img.src} 
                                    alt={`Sketch ${i}`} 
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" 
                                    draggable="false"
                                    decoding="async" // Async Decoding
                                />
                            </div>

                            {/* Footer */}
                            <div className="h-[15%] w-full flex items-center justify-between px-3 bg-zinc-950 border-t border-white/10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 font-mono tracking-wider">FIG.{img.id}</span>
                                    <span className="text-[8px] text-gray-700 font-mono">CONCEPT_DATA</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] text-gray-500 font-mono group-hover:text-white transition-colors">VIEW</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-800 group-hover:bg-green-500 group-hover:shadow-[0_0_5px_#22c55e] transition-all"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .stroke-text {
                    -webkit-text-stroke: 1px white;
                    color: transparent;
                }
            `}</style>
        </div>
    );
}