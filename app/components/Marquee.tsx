"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TelemetryMarquee() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gForceDotRef = useRef<HTMLDivElement>(null);
    const firstTextRef = useRef<HTMLDivElement>(null);
    const secondTextRef = useRef<HTMLDivElement>(null);
    
    // Performance refs to avoid React rerender lags
    const rpmTextRef = useRef<HTMLSpanElement>(null);
    const speedTextRef = useRef<HTMLSpanElement>(null);
    const gearTextRef = useRef<HTMLDivElement>(null);
    const ledsRef = useRef<(HTMLDivElement | null)[]>([]);

    let xPercent = 0;
    const direction = -1;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Scrolling Text Ticker
        let animationFrameId: number;
        const animateText = () => {
            if (xPercent <= -100) xPercent = 0;
            if (xPercent > 0) xPercent = -100;

            if (firstTextRef.current && secondTextRef.current) {
                gsap.set(firstTextRef.current, { xPercent: xPercent });
                gsap.set(secondTextRef.current, { xPercent: xPercent });
            }
            xPercent += 0.04 * direction;
            animationFrameId = requestAnimationFrame(animateText);
        };
        animationFrameId = requestAnimationFrame(animateText);

        // 2. G-Force Mouse Tracker
        let lastX = 0;
        let lastY = 0;
        let lastTime = Date.now();
        const gForceDot = gForceDotRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const dt = now - lastTime || 1;
            const vx = (e.clientX - lastX) / dt;
            const vy = (e.clientY - lastY) / dt;

            const targetX = gsap.utils.clamp(-20, 20, -vx * 10);
            const targetY = gsap.utils.clamp(-20, 20, -vy * 10);

            if (gForceDot) {
                gsap.to(gForceDot, {
                    x: targetX,
                    y: targetY,
                    duration: 0.2,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(gForceDot, {
                            x: 0,
                            y: 0,
                            duration: 0.5,
                            ease: "elastic.out(1, 0.4)"
                        });
                    }
                });
            }

            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;
        };

        window.addEventListener("mousemove", handleMouseMove);

        // 3. Scroll-Activated Gear/RPM Telemetry
        const trigger = ScrollTrigger.create({
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const progress = self.progress;
                const velocity = Math.abs(self.getVelocity());
                
                // Speed matches scroll velocity
                const currentSpeed = Math.min(Math.round(velocity / 12), 340);
                if (speedTextRef.current) {
                    speedTextRef.current.textContent = `${currentSpeed} km/h`;
                }

                // Gearbox selection (1 to 6)
                const gearCount = 6;
                const rawGear = Math.floor(progress * gearCount) + 1;
                const currentGear = Math.min(gearCount, rawGear);
                if (gearTextRef.current) {
                    gearTextRef.current.textContent = currentGear.toString();
                }

                // RPM curves (sawtooth per gear shift)
                const gearProgress = (progress * gearCount) % 1;
                const minRpm = 3000;
                const maxRpm = 8200;
                const currentRpm = Math.round(minRpm + (maxRpm - minRpm) * gearProgress);
                
                if (rpmTextRef.current) {
                    rpmTextRef.current.textContent = `RPM: ${currentRpm}`;
                }

                // Shift lights update
                const percent = (currentRpm - minRpm) / (maxRpm - minRpm);
                const activeCount = Math.round(percent * 10);

                ledsRef.current.forEach((led, idx) => {
                    if (!led) return;
                    
                    // Reset class bases
                    led.className = "w-3.5 h-1.5 rounded-sm transition-all duration-75 ";
                    
                    if (idx >= activeCount) {
                        led.className += "bg-zinc-800";
                    } else if (percent > 0.92) {
                        led.className += "bg-red-600 animate-ping shadow-[0_0_8px_#ef4444]";
                    } else if (idx < 5) {
                        led.className += "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]";
                    } else if (idx < 8) {
                        led.className += "bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]";
                    } else {
                        led.className += "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]";
                    }
                });
            }
        });

        // Initialize LEDs to off
        ledsRef.current.forEach((led) => {
            if (led) led.className = "w-3.5 h-1.5 rounded-sm bg-zinc-800";
        });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("mousemove", handleMouseMove);
            trigger.kill();
        };
    }, []);

    const techItems = [
        "sys_status: active",
        "loc_gateway: iiit_manipur",
        "rag_pipeline: sutra_synced",
        "gpu_core: rtx_a6000",
        "latency: 14ms",
        "model: graph_rag_v2",
        "chassis: rs-portfolio-x"
    ];

    return (
        <div 
            ref={containerRef}
            className="relative w-full bg-[#070707] border-y border-zinc-800/80 py-6 px-6 md:px-12 select-none z-10 my-10 overflow-hidden"
        >
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-8">
                
                {/* 1. INTERACTIVE G-FORCE METER (LEFT) */}
                <div className="flex items-center gap-4 border border-zinc-800/60 bg-black/40 p-3 rounded-sm min-w-[200px] shrink-0 w-full md:w-auto justify-center md:justify-start">
                    <div className="relative w-14 h-14 rounded-full border border-zinc-800/80 flex items-center justify-center bg-zinc-950/50">
                        {/* Circle Rings */}
                        <div className="absolute w-8 h-8 rounded-full border border-dashed border-zinc-900" />
                        <div className="absolute w-full h-[1px] bg-zinc-900" />
                        <div className="absolute w-[1px] h-full bg-zinc-900" />
                        
                        {/* Physics Dot */}
                        <div 
                            ref={gForceDotRef}
                            className="absolute w-2 h-2 bg-red-600 rounded-full shadow-[0_0_8px_#ef4444]"
                        />
                    </div>
                    <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                        <span className="block text-white font-bold text-xs tracking-wider mb-0.5">G-FORCE METER</span>
                        <span>accel_vector_stream</span>
                    </div>
                </div>

                {/* 2. DYNAMIC SYSTEM DATA STREAM (CENTER) */}
                <div className="flex-1 overflow-hidden relative w-full border-y md:border-y-0 md:border-x border-zinc-800/40 py-4 md:py-0 px-4">
                    <div className="flex whitespace-nowrap w-max relative">
                        <div ref={firstTextRef} className="flex gap-14 px-6 shrink-0 items-center">
                            {techItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-14">
                                    <span className="font-mono text-[10px] md:text-[11px] text-zinc-500 tracking-[0.25em] uppercase">
                                        {item}
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-red-600/30 rounded-full" />
                                </div>
                            ))}
                        </div>
                        <div ref={secondTextRef} className="flex gap-14 px-6 shrink-0 items-center">
                            {techItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-14">
                                    <span className="font-mono text-[10px] md:text-[11px] text-zinc-500 tracking-[0.25em] uppercase">
                                        {item}
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-red-600/30 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. SHIFT LIGHTS & SHIFTING GEARBOX (RIGHT) */}
                <div className="flex items-center gap-6 border border-zinc-800/60 bg-black/40 p-3 rounded-sm shrink-0 w-full md:w-auto justify-between md:justify-start">
                    
                    {/* Led Engine rpm indicator */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex gap-1">
                            {[...Array(10)].map((_, i) => (
                                <div 
                                    key={i} 
                                    ref={(el) => { ledsRef.current[i] = el; }}
                                    className="w-3.5 h-1.5 rounded-sm bg-zinc-800"
                                />
                            ))}
                        </div>
                        <div className="flex justify-between font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
                            <span ref={rpmTextRef}>RPM: 0000</span>
                            <span>ENGINE_RPM</span>
                        </div>
                    </div>

                    {/* Gearbox container */}
                    <div className="flex items-center gap-3 pl-5 border-l border-zinc-800/80">
                        <div 
                            ref={gearTextRef}
                            className="w-11 h-11 bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-black text-2xl text-red-500 rounded-sm shadow-inner"
                        >
                            1
                        </div>
                        <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                            <span ref={speedTextRef} className="block text-white font-bold text-xs tracking-wider mb-0.5">0 km/h</span>
                            <span>GEARBOX</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}