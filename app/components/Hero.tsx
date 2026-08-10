"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const subTextRef = useRef<HTMLDivElement>(null);
    const coverRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        const context = gsap.context(() => {
            gsap.fromTo(overlayRef.current, { xPercent: -100 }, { xPercent: 0, duration: 1.2, ease: "power4.out" });
            gsap.fromTo(textRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" });
            gsap.fromTo(subTextRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "power3.out" });

            const leftPanels = gsap.utils.toArray<HTMLElement>(".hero-cover-left", coverRef.current);
            const rightPanels = gsap.utils.toArray<HTMLElement>(".hero-cover-right", coverRef.current);
            gsap.set(leftPanels, { xPercent: -125 });
            gsap.set(rightPanels, { xPercent: 125 });

            gsap.timeline({
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "+=100%",
                    scrub: 0.65,
                    pin: true,
                    pinSpacing: false,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            })
                .to(imageRef.current, { scale: 1.08, ease: "none", duration: 1 }, 0)
                .to([textRef.current, subTextRef.current], { yPercent: -20, opacity: 0.12, ease: "power1.in", duration: 0.45 }, 0.08)
                .to(leftPanels, { xPercent: 0, stagger: 0.055, ease: "power3.inOut", duration: 0.52 }, 0.28)
                .to(rightPanels, { xPercent: 0, stagger: 0.06, ease: "power3.inOut", duration: 0.52 }, 0.34);
        }, hero);

        return () => context.revert();
    }, []);

    return (
        <section ref={heroRef} id="home" className="relative z-0 h-screen w-full overflow-hidden bg-black">
            <div className="pointer-events-none fixed inset-0 z-20 bg-grid-pattern opacity-40 mix-blend-multiply" />
            <div ref={imageRef} className="absolute inset-0 flex origin-center items-center justify-end lg:block">
                <Image src="/livery.webp" alt="Racing-inspired portfolio background" fill priority quality={85} sizes="100vw" className="object-cover" />
            </div>

            <div ref={overlayRef} className="absolute left-[-5%] top-0 z-10 h-full w-[110%] origin-bottom -skew-x-6 border-r-4 border-racing-red bg-off-white md:left-[-10%] md:w-[120%] md:-skew-x-12 md:border-r-8">
                <div className="absolute inset-0 flex skew-x-6 flex-col justify-center px-4 sm:px-6 md:skew-x-12 md:px-40">
                    <div ref={subTextRef} className="mb-3 flex items-center gap-2 md:mb-2 md:gap-4">
                        <span className="h-[2px] w-6 bg-racing-red md:w-10" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 md:text-sm md:tracking-[0.2em]">Portfolio &bull; 2026</span>
                    </div>
                    <div ref={textRef}>
                        <h1 className="text-[3rem] font-black uppercase leading-[0.9] tracking-tighter text-carbon-black sm:text-6xl md:text-[10rem]">
                            Rahul <br /><span className="text-racing-red">Sharma</span>
                        </h1>
                        <p className="mt-4 max-w-lg text-base font-medium leading-relaxed text-gray-600 sm:text-lg md:mt-6 md:text-2xl">
                            Engineering intelligence into design.<br />
                            <span className="mt-2 block text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs md:text-sm">B.Tech CSE &bull; Full Stack &amp; AI Engineer</span>
                        </p>
                    </div>
                    <div className="absolute bottom-6 left-4 flex gap-4 font-mono text-[9px] text-gray-400 sm:left-6 md:bottom-10 md:left-40 md:gap-10 md:text-xs">
                        <div><p className="text-[8px] md:text-xs">LOC</p><p className="text-[10px] text-black md:text-xs">IMPHAL, IN</p></div>
                        <div><p className="text-[8px] md:text-xs">STATUS</p><p className="text-[10px] text-racing-red md:text-xs">ONLINE</p></div>
                        <div className="hidden sm:block"><p className="text-[8px] md:text-xs">SYS</p><p className="text-[10px] text-black md:text-xs">NEXT.JS / PYTHON</p></div>
                    </div>
                </div>
            </div>

            <div ref={coverRef} className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
                <div className="hero-cover-left absolute -left-[12%] top-[8%] h-[17%] w-[72%] bg-[#121826]" style={{ clipPath: "polygon(3% 0, 100% 0, 96% 100%, 0 100%)" }} />
                <div className="hero-cover-right absolute -right-[12%] top-[18%] h-[23%] w-[72%] bg-racing-red" style={{ clipPath: "polygon(5% 0, 100% 0, 97% 100%, 0 100%)" }} />
                <div className="hero-cover-left absolute -left-[8%] top-[39%] h-[25%] w-[93%] bg-[#111725]" style={{ clipPath: "polygon(2% 0, 100% 0, 96% 100%, 0 100%)" }} />
                <div className="hero-cover-right absolute -right-[6%] top-[51%] h-[20%] w-[57%] bg-racing-red" style={{ clipPath: "polygon(7% 0, 100% 0, 96% 100%, 0 100%)" }} />
                <div className="hero-cover-left absolute -left-[10%] bottom-[8%] h-[19%] w-[60%] bg-racing-red" style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" }} />
                <div className="hero-cover-right absolute -right-[8%] bottom-0 h-[30%] w-[31%] bg-off-white" style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }} />
            </div>
        </section>
    );
}
