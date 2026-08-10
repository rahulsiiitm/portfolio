"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TYPER_WORDS = ["FAST", "SCALABLE", "INTELLIGENT", "BOLD"];

export default function Footer() {
    const footerRef = useRef(null);
    const formRef = useRef(null);
    const wheelRef = useRef(null);

    const [result, setResult] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Typer State
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // --- AUDIO STATE ---
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 1. SETUP AUDIO
        const audio = new Audio("/engine-start.mp3?v=rahul-engine-3");
        audio.volume = 1;
        audioRef.current = audio;

        // GSAP ANIMATIONS
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(footerRef.current,
            { y: -100 },
            { y: 0, scrollTrigger: { trigger: footerRef.current, start: "top bottom", end: "bottom bottom", scrub: true } }
        );

        const tl = gsap.timeline({
            scrollTrigger: { trigger: footerRef.current, start: "top 60%" }
        });

        tl.fromTo(formRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        )
            .fromTo(".form-element",
                { x: -20, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
                "-=0.4"
            );

        // 4. CLEANUP
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };

    }, []);

    // 5. Typer Logic
    useEffect(() => {
        const handleTyping = () => {
            const fullWord = TYPER_WORDS[currentWordIndex];
            if (isDeleting) {
                setDisplayText(prev => prev.substring(0, prev.length - 1));
            } else {
                setDisplayText(prev => fullWord.substring(0, prev.length + 1));
            }

            if (!isDeleting && displayText === fullWord) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && displayText === "") {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % TYPER_WORDS.length);
            }
        };
        const timer = setTimeout(handleTyping, isDeleting ? 50 : 150);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, currentWordIndex]);

    // 6. Wheel Spin
    const handleMouseEnter = () => {
        gsap.fromTo(wheelRef.current, { rotation: -8, scale: 1 }, { rotation: 0, scale: 1.035, duration: 1.15, ease: "power3.out", overwrite: true });
    };

    // --- PLAY SOUND FUNCTION ---
    const playEngineSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((e) => console.log("Play blocked", e));
        }
    };

    // 7. SECURE SUBMISSION LOGIC
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResult("Sending data packets...");

        const formData = new FormData(event.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        try {
            const htmlBody = `
              <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; border-radius: 8px; overflow: hidden;">
                <div style="background: #dc2626; padding: 24px 32px; text-align: center;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #fff;">
                    📬 New Portfolio Message
                  </h1>
                </div>
                <div style="padding: 32px;">
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 80px;">From</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #222; font-weight: 700;">${data.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #222;">
                        <a href="mailto:${data.email}" style="color: #dc2626; text-decoration: none;">${data.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px 0 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Message</td>
                      <td style="padding: 16px 0 0; line-height: 1.7; white-space: pre-wrap;">${data.message}</td>
                    </tr>
                  </table>
                  <div style="text-align: center; border-top: 1px solid #222; padding-top: 28px;">
                    <p style="color: #6b7280; font-size: 13px; margin-bottom: 20px;">
                      They reached out via <strong style="color: #f5f5f5;">rahul.aishtrex.com</strong>. Check out the project showcase below:
                    </p>
                    <a href="https://rahul.aishtrex.com/projects"
                       style="display: inline-block; background: #dc2626; color: #fff; text-decoration: none; padding: 14px 32px; font-weight: 900; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase; border-radius: 2px;">
                      🚀 View My Projects →
                    </a>
                  </div>
                </div>
                <div style="background: #111; padding: 16px 32px; text-align: center; border-top: 1px solid #1f1f1f;">
                  <p style="margin: 0; color: #4b5563; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">
                    © 2026 Rahul Sharma // Imphal, IN — Portfolio v2.0.4
                  </p>
                </div>
              </div>
            `;

            const payload = {
                access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '',
                subject: `New Message from ${data.name} — Rahul's Portfolio`,
                name: data.name,
                email: data.email,
                message: data.message,
                html: htmlBody,
                replyto: data.email
            };

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            let result;
            const text = await response.text();
            try {
                result = JSON.parse(text);
            } catch {
                console.error("Non-JSON response from server:", text);
                setResult(`Server Error (${response.status}). Please try again.`);
                return;
            }

            if (result.success) {
                setResult(result.message);
                (event.target as HTMLFormElement).reset();
            } else {
                setResult(result.message || "Connection Failed. Retrying...");
            }
        } catch (error: unknown) {
            console.error('Submission error:', error);
            const message = error instanceof Error ? error.message : 'Unknown error';
            if (message === 'Failed to fetch') {
                setResult("Adblocker prevented submission. Please email rahulsharma.hps@gmail.com directly.");
            } else {
                setResult(`Client Error: ${message || "Network Check failed"}`);
            }
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setResult(""), 5000);
        }
    };

    return (
        <footer
            id="contact"
            ref={footerRef}
            onMouseEnter={handleMouseEnter}
            className="group relative w-full bg-red-600 text-white overflow-hidden flex flex-col pt-16 sm:pt-20 pb-0"
            style={{ clipPath: "polygon(0% 5%, 100% 0%, 100% 100%, 0% 100%)", marginTop: "-5vh" }}
        >

            {/* BACKGROUND TEXTURE */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* === GIANT F1 TYRE === */}
            <div
                ref={wheelRef}
                className="absolute -left-[32%] top-[7%] z-0 aspect-square w-[92vw] pointer-events-none opacity-40 sm:-left-[18%] sm:w-[66vw] md:-left-[14%] md:w-[48vw]"
                aria-hidden="true"
            >
                <div className="f1-tyre-rotor relative h-full w-full rounded-full">
                    <div className="f1-tyre absolute inset-0 rounded-full">
                        <div className="f1-sidewall-copy absolute inset-[5.5%] rounded-full">
                            <span className="absolute left-1/2 top-[2%] -translate-x-1/2 text-[clamp(9px,1.15vw,17px)] font-black tracking-[0.3em] text-white/65">P ZERO</span>
                            <span className="absolute bottom-[2%] left-1/2 -translate-x-1/2 rotate-180 text-[clamp(7px,.8vw,12px)] font-bold tracking-[0.24em] text-white/35">RACING SLICK</span>
                        </div>
                        <div className="f1-rim absolute inset-[21%] rounded-full">
                            <div className="f1-brake-disc absolute inset-[12%] rounded-full" />
                            <div className="absolute inset-[5%] rounded-full">
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <span key={index} className="f1-spoke absolute left-1/2 top-1/2 h-[7%] w-[47%] origin-left" style={{ transform: `rotate(${index * 36}deg) translateY(-50%)` }} />
                                ))}
                            </div>
                            <div className="f1-hub absolute left-1/2 top-1/2 flex h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
                                <span className="h-[36%] w-[36%] rounded-full bg-racing-red shadow-[0_0_18px_rgba(220,38,38,.65)]" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="f1-tyre-shadow absolute bottom-[-4%] left-[8%] h-[12%] w-[84%] rounded-full" />
            </div>


            {/* MAIN CONTENT - MOBILE OPTIMIZED */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24 items-center max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 mb-16 md:mb-20 flex-grow">

                {/* LEFT: Typer Headline - MOBILE OPTIMIZED */}
                <div className="flex flex-col justify-center relative">
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 opacity-80">
                        <span className="h-[2px] w-8 md:w-10 bg-white"></span>
                        <span className="text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">Pit Lane / Contact</span>
                    </div>

                    <h1 className="text-[10vw] sm:text-[8vw] lg:text-[7rem] leading-[0.8] font-black uppercase mb-6 md:mb-8 italic transform -skew-x-6 min-h-[3ch]">
                        Let&#39;s <br /> Build <br />
                        <span className="text-transparent stroke-text">
                            {displayText}
                            <span className="animate-pulse text-white">_</span>
                        </span>
                    </h1>

                    <p className="max-w-md text-base md:text-lg font-medium opacity-90 leading-relaxed">
                        From <strong>IIIT Manipur</strong> to the world. Let&#39;s engineer solutions that break the speed limit.
                    </p>
                </div>

                {/* RIGHT: The "Pit Board" Form - MOBILE OPTIMIZED */}
                <div
                    ref={formRef}
                    className="w-full bg-white text-zinc-900 p-6 sm:p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden transform -skew-x-2 rounded-sm"
                >
                    <div className="absolute top-0 right-0 w-2 md:w-3 h-full bg-red-600"></div>

                    <h3 className="text-xl md:text-2xl font-black uppercase mb-6 md:mb-8 tracking-tighter flex items-center gap-3 md:gap-4">
                        <span className="w-4 h-4 md:w-5 md:h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                        Initialize Comms
                    </h3>

                    <form onSubmit={onSubmit} className="flex flex-col gap-4 md:gap-5">
                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 form-element">
                            <input
                                type="text"
                                name="name"
                                required
                                aria-label="Name"
                                className="w-full bg-gray-100 p-3 md:p-4 text-xs md:text-sm font-bold uppercase focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all placeholder-gray-400"
                                placeholder="NAME"
                            />
                            <input
                                type="email"
                                name="email"
                                required
                                aria-label="Email"
                                className="w-full bg-gray-100 p-3 md:p-4 text-xs md:text-sm font-bold uppercase focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all placeholder-gray-400"
                                placeholder="EMAIL"
                            />
                        </div>
                        <div className="form-element">
                            <textarea
                                name="message"
                                required
                                rows={3}
                                aria-label="Message"
                                className="w-full bg-gray-100 p-3 md:p-4 text-xs md:text-sm font-medium uppercase focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none placeholder-gray-400"
                                placeholder="PROJECT BRIEF..."
                            ></textarea>
                        </div>

                        {/* --- BUTTON WITH ENGINE SHAKE - MOBILE OPTIMIZED --- */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            onMouseEnter={playEngineSound}
                            onPointerDown={playEngineSound}
                            aria-label="Submit form"
                            className="slant-action form-element mt-1 md:mt-2 py-4 md:py-5 px-5 md:px-6 bg-black text-white text-sm md:text-base font-black uppercase tracking-widest hover:bg-red-600 hover:animate-engine-start transition-colors duration-300 flex justify-between items-center group/btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isSubmitting ? "Transmitting..." : "Start Engine"}</span>
                            <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                        </button>

                        {result && (
                            <div
                                role="alert"
                                className={`text-center p-2.5 md:p-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest border-l-4 ${result.includes("Error") || result.includes("Failed") ? "bg-red-100 border-red-600 text-red-600" : "bg-green-100 border-green-500 text-green-700"}`}
                            >
                                {result}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* === STATIC COMMAND BAR - MOBILE OPTIMIZED === */}
            <div className="w-full bg-black py-6 md:py-8 px-4 sm:px-6 md:px-12 border-t-4 border-white/20 z-20 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">

                <div className="text-[9px] md:text-xs font-mono text-gray-500 tracking-widest uppercase text-center md:text-left">
                    © 2026 Rahul Sharma // Imphal, IN
                </div>

                <div className="hidden md:flex gap-8 text-[10px] font-mono text-red-600 tracking-widest">
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                        SYS: ONLINE
                    </span>
                    <span>VER: 2.0.4</span>
                    <span>TEMP: 34°C</span>
                </div>

                <nav className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-white" aria-label="Social links">
                    <a href="https://linkedin.com/in/rahulsiiitm" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                        LinkedIn
                    </a>
                    <a href="https://github.com/rahulsiiitm" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                        GitHub
                    </a>
                    <a href="https://leetcode.com/u/rahul2k4/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition-colors">
                        LeetCode
                    </a>
                    <a href="mailto:rahulsharma.hps@gmail.com" className="hover:text-red-600 transition-colors">
                        Email
                    </a>
                </nav>

            </div>

            <style jsx>{`
                .stroke-text { -webkit-text-stroke: 2px white; color: transparent; }

                @keyframes tyre-roll {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .f1-tyre-rotor {
                    animation: tyre-roll 24s linear infinite;
                    filter: drop-shadow(0 28px 30px rgba(55, 0, 0, 0.38));
                    will-change: transform;
                }
                .f1-tyre {
                    background:
                        repeating-conic-gradient(from 2deg, rgba(255,255,255,.18) 0deg 1.4deg, transparent 1.4deg 8deg),
                        radial-gradient(circle at 35% 28%, #4a4a4a 0%, #1b1b1c 43%, #070708 72%, #202022 100%);
                    border: clamp(3px, .55vw, 8px) solid rgba(255,255,255,.2);
                    box-shadow: inset 0 0 0 clamp(8px, 1.25vw, 20px) rgba(0,0,0,.5), inset 18px 22px 34px rgba(255,255,255,.08), inset -22px -20px 36px rgba(0,0,0,.72);
                }
                .f1-sidewall-copy { border: 1px solid rgba(255,255,255,.13); }
                .f1-rim {
                    background: radial-gradient(circle at 36% 30%, #f5f5f5 0%, #a5a8ad 20%, #303238 58%, #0c0d0f 78%);
                    border: clamp(3px, .45vw, 7px) solid rgba(255,255,255,.42);
                    box-shadow: inset 0 0 24px rgba(0,0,0,.8), 0 0 0 clamp(5px,.8vw,12px) rgba(0,0,0,.75);
                }
                .f1-brake-disc {
                    background: repeating-conic-gradient(#52545a 0deg 3deg, #202226 3deg 7deg);
                    border: 2px solid rgba(255,255,255,.16);
                    box-shadow: inset 0 0 20px rgba(0,0,0,.8);
                }
                .f1-spoke {
                    clip-path: polygon(0 22%, 100% 0, 92% 100%, 0 72%);
                    background: linear-gradient(180deg, #f0f0f0, #777b82 48%, #202226);
                    box-shadow: 0 2px 4px rgba(0,0,0,.6);
                }
                .f1-hub {
                    background: radial-gradient(circle, #999da3 0%, #303238 46%, #0b0c0e 72%);
                    border: 2px solid rgba(255,255,255,.35);
                    box-shadow: 0 0 0 clamp(3px,.45vw,7px) rgba(0,0,0,.55);
                }
                .f1-tyre-shadow {
                    background: rgba(55,0,0,.42);
                    filter: blur(18px);
                    transform: skewX(-12deg);
                }
                @media (prefers-reduced-motion: reduce) {
                    .f1-tyre-rotor { animation: none; }
                }

                /* --- ENGINE START SHAKE ANIMATION --- */
                @keyframes engine-shake {
                    0% { transform: translate(2px, 2px) rotate(1deg); }
                    5% { transform: translate(-2px, -3px) rotate(-1deg); }
                    10% { transform: translate(-4px, 1px) rotate(2deg); }
                    15% { transform: translate(4px, 3px) rotate(0deg); }
                    20% { transform: translate(2px, -2px) rotate(2deg); }
                    25% { transform: translate(-2px, 3px) rotate(-2deg); }
                    30% { transform: translate(-4px, -1px) rotate(1deg); }
                    35% { transform: translate(4px, 2px) rotate(-1deg); }
                    40% { transform: translate(2px, -3px) rotate(2deg); }
                    45% { transform: translate(-2px, 1px) rotate(-2deg); }
                    50% { transform: translate(-4px, -2px) rotate(1deg); }
                    55% { transform: translate(4px, 3px) rotate(-1deg); }
                    60% { transform: translate(2px, -2px) rotate(2deg); }
                    70% { transform: translate(-1px, 2px) rotate(-1deg); }
                    80% { transform: translate(1px, -1px) rotate(0.5deg); }
                    90% { transform: translate(0.5px, 0.5px) rotate(-0.5deg); }
                    100% { transform: translate(0, 0) rotate(0); }
                }

                .hover\:animate-engine-start:hover {
                    animation: engine-shake 3s ease-out forwards;
                }
            `}</style>
        </footer>
    );
}
