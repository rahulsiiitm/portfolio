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

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Footer Parallax
        gsap.fromTo(footerRef.current,
            { y: -100 },
            { y: 0, scrollTrigger: { trigger: footerRef.current, start: "top bottom", end: "bottom bottom", scrub: true } }
        );

        // 2. Form Slide-Up
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

    }, []);

    // 3. Typer Logic
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

    // 4. Wheel Spin Acceleration
    const handleMouseEnter = () => {
        gsap.to(wheelRef.current, { rotation: "+=360", duration: 1.5, ease: "power2.out" });
    };

    // 5. WEB3FORMS SUBMISSION LOGIC
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setResult("Sending data packets...");

        const formData = new FormData(event.target as HTMLFormElement);
        // Optional: Append custom subject so you know where it came from
        formData.append("subject", "New Message from Rahul's Portfolio");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setResult("Transmission Successful. We'll be in touch.");
                (event.target as HTMLFormElement).reset();
            } else {
                console.error("Error", data);
                setResult(data.message || "Connection Failed. Retrying...");
            }
        } catch (error) {
            setResult("Network Error. Check connectivity.");
        } finally {
            setIsSubmitting(false);
            // Clear success message after 5 seconds
            setTimeout(() => setResult(""), 5000);
        }
    };

    return (
        <footer
            id="contact"
            ref={footerRef}
            onMouseEnter={handleMouseEnter}
            className="group relative w-full bg-red-600 text-white overflow-hidden flex flex-col pt-20 pb-0"
            style={{ clipPath: "polygon(0% 5%, 100% 0%, 100% 100%, 0% 100%)", marginTop: "-5vh" }}
        >

            {/* BACKGROUND TEXTURE */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* === THE GIANT F1 WHEEL === */}
            <div
                ref={wheelRef}
                className="absolute -left-[15%] top-[5%] w-[60vw] h-[60vw] md:w-[45vw] md:h-[45vw] opacity-20 pointer-events-none z-0 border-[4px] border-dashed border-white rounded-full flex items-center justify-center animate-spin-slow"
            >
                {/* Tire Sidewall Details */}
                <div className="w-[85%] h-[85%] border-[1px] border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-[80%] h-[80%] border-[20px] border-white/20 rounded-full"></div>
                </div>
                {/* Spokes */}
                <div className="absolute w-full h-[2px] bg-white/20 rotate-0"></div>
                <div className="absolute w-full h-[2px] bg-white/20 rotate-45"></div>
                <div className="absolute w-full h-[2px] bg-white/20 rotate-90"></div>
                <div className="absolute w-full h-[2px] bg-white/20 rotate-135"></div>
            </div>


            {/* MAIN CONTENT */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center max-w-7xl mx-auto w-full px-6 md:px-12 mb-20 flex-grow">

                {/* LEFT: Typer Headline */}
                <div className="flex flex-col justify-center relative">
                    <div className="flex items-center gap-4 mb-6 opacity-80">
                        <span className="h-[2px] w-10 bg-white"></span>
                        <span className="text-sm font-bold tracking-[0.3em] uppercase">Pit Lane / Contact</span>
                    </div>

                    <h1 className="text-[14vw] lg:text-[7rem] leading-[0.8] font-black uppercase mb-8 italic transform -skew-x-6 min-h-[3ch]">
                        Let's <br /> Build <br />
                        <span className="text-transparent stroke-text">
                            {displayText}
                            <span className="animate-pulse text-white">_</span>
                        </span>
                    </h1>

                    <p className="max-w-md text-lg font-medium opacity-90 leading-relaxed">
                        From <strong>IIIT Manipur</strong> to the world. Let's engineer solutions that break the speed limit.
                    </p>
                </div>

                {/* RIGHT: The "Pit Board" Form */}
                <div
                    ref={formRef}
                    className="w-full bg-white text-zinc-900 p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden transform -skew-x-2 rounded-sm"
                >
                    <div className="absolute top-0 right-0 w-3 h-full bg-red-600"></div>

                    <h3 className="text-2xl font-black uppercase mb-8 tracking-tighter flex items-center gap-4">
                        <span className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                        Initialize Comms
                    </h3>

                    <form onSubmit={onSubmit} className="flex flex-col gap-5">
                        {/* --- WEB3FORMS CONFIGURATION --- */}
                        <input
                            type="hidden"
                            name="access_key"
                            value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY}
                        />

                        {/* Honeypot Spam Protection (Keep hidden) */}
                        <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 form-element">
                            <input type="text" name="name" required className="w-full bg-gray-100 p-4 text-sm font-bold uppercase focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all placeholder-gray-400" placeholder="NAME" />
                            <input type="email" name="email" required className="w-full bg-gray-100 p-4 text-sm font-bold uppercase focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all placeholder-gray-400" placeholder="EMAIL" />
                        </div>
                        <div className="form-element">
                            <textarea name="message" required rows={3} className="w-full bg-gray-100 p-4 text-sm font-medium uppercase focus:bg-white focus:ring-2 focus:ring-red-600 outline-none transition-all resize-none placeholder-gray-400" placeholder="PROJECT BRIEF..."></textarea>
                        </div>

                        <button type="submit" disabled={isSubmitting} className="form-element mt-2 py-5 px-6 bg-black text-white text-base font-black uppercase tracking-widest hover:bg-red-600 hover:animate-shake transition-colors duration-300 flex justify-between items-center group/btn">
                            <span>{isSubmitting ? "Transmitting..." : "Start Engine"}</span>
                            <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                        </button>

                        {result && (
                            <div className={`text-center p-3 text-[10px] font-bold uppercase tracking-widest border-l-4 ${result.includes("Error") ? "bg-red-100 border-red-600 text-red-600" : "bg-green-100 border-green-500 text-green-700"}`}>
                                {result}
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* === STATIC COMMAND BAR === */}
            <div className="w-full bg-black py-8 px-6 md:px-12 border-t-4 border-white/20 z-20 flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="text-[10px] md:text-xs font-mono text-gray-500 tracking-widest uppercase">
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

                <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em] text-white">
                    <a href="https://linkedin.com/in/rahulsharma2k4" target="_blank" className="hover:text-red-600 transition-colors">
                        LinkedIn
                    </a>
                    <a href="https://github.com/rahulsiiitm" target="_blank" className="hover:text-red-600 transition-colors">
                        GitHub
                    </a>
                    <a href="mailto:rahulsharma.hps@gmail.com" className="hover:text-red-600 transition-colors">
                        Email
                    </a>
                </div>

            </div>

            <style jsx>{`
        .stroke-text { -webkit-text-stroke: 2px white; color: transparent; }
        
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
        }

        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .hover\:animate-shake:hover {
            animation: shake 0.5s; 
            animation-iteration-count: infinite; 
        }
      `}</style>
        </footer>
    );
}