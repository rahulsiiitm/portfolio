"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const menuLinks = [
  { label: "Home", href: "/", id: "01" },
  { label: "Projects", href: "#projects", id: "02" },
  { label: "Tech Stack", href: "#tech", id: "03" }, // Ensure you have a section with id="tech"
  { label: "Experience", href: "#experience", id: "04" },
  { label: "Achievements", href: "#achievements", id: "05" }, // Ensure you have a section with id="achievements"
  { label: "Contact", href: "#contact", id: "06" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isOpen) {
        // OPEN ANIMATION
        gsap.to(overlayRef.current, { duration: 0.5, opacity: 1, pointerEvents: "all", ease: "power2.out" });
        gsap.to(menuRef.current, { duration: 0.5, x: "0%", ease: "power3.out" });
        gsap.fromTo(".menu-link-item", 
          { x: 30, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.2 }
        );
      } else {
        // CLOSE ANIMATION
        gsap.to(menuRef.current, { duration: 0.5, x: "100%", ease: "power3.in" });
        gsap.to(overlayRef.current, { duration: 0.5, opacity: 0, pointerEvents: "none", delay: 0.2 });
      }
    });
    return () => ctx.revert();
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* === NAVBAR (Fixed Top) === 
          - z-[100]: Ensures it's above the Hero Grid (which is z-50)
          - mix-blend-difference: Inverts colors so it's visible on light/dark backgrounds
      */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 flex justify-between items-center mix-blend-difference text-white">
        
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-3 h-3 bg-white group-hover:bg-racing-red transition-colors"></div>
          <span className="font-black text-lg tracking-tighter uppercase">
            RAHUL<span className="text-racing-red">.DEV</span>
          </span>
        </Link>

        {/* TOGGLE BUTTON ("CHAPTERS") */}
        <button 
          onClick={toggleMenu} 
          className="group flex items-center gap-3 cursor-pointer outline-none"
        >
          <span className="hidden md:block font-mono text-xs font-bold uppercase tracking-widest group-hover:text-racing-red transition-colors">
            {isOpen ? "Close" : "Chapters"}
          </span>
          <div className="relative w-8 h-8 flex flex-col justify-center gap-1.5 items-end">
             {/* Animated Hamburger Lines */}
             <span className={`w-full h-[2px] bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2 bg-racing-red' : ''}`}></span>
             <span className={`w-2/3 h-[2px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'group-hover:w-full'}`}></span>
             <span className={`w-full h-[2px] bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2 bg-racing-red' : ''}`}></span>
          </div>
        </button>

      </nav>


      {/* === SIDEBAR OVERLAY (Backdrop) === */}
      <div 
        ref={overlayRef} 
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity"
      ></div>

      {/* === SIDEBAR PANEL === */}
      <div 
        ref={menuRef} 
        className="fixed top-0 right-0 h-screen w-full md:w-[450px] bg-zinc-950 border-l border-white/10 z-[100] transform translate-x-full shadow-2xl flex flex-col"
      >
        
        {/* Header */}
        <div className="p-12 border-b border-white/10 flex justify-between items-center">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                /// Index
            </span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-racing-red transition-colors text-xs font-bold uppercase tracking-widest">
                [ ESC ]
            </button>
        </div>

        {/* CLEAN LINKS LIST */}
        <div className="flex-1 flex flex-col justify-center px-12 gap-8">
            {menuLinks.map((link) => (
                <Link 
                    key={link.id} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="menu-link-item group flex items-center gap-6"
                >
                    {/* ID Number */}
                    <span className="font-mono text-xs text-gray-600 group-hover:text-racing-red transition-colors duration-300">
                        {link.id}
                    </span>
                    
                    {/* Label - Solid, Upright, Normal Font */}
                    <span className="text-3xl font-bold text-gray-400 uppercase tracking-wide group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                        {link.label}
                    </span>
                </Link>
            ))}
        </div>

        {/* Footer */}
        <div className="p-12 border-t border-white/10">
            <div className="flex gap-6 mb-4">
                <a href="https://github.com/rahulsiiitm" target="_blank" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">GitHub</a>
                <a href="https://linkedin.com/in/rahulsharma2k4" target="_blank" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">LinkedIn</a>
            </div>
            <p className="font-mono text-[10px] text-gray-700">
                SYSTEM: ONLINE <br/>
                V.2.0.4
            </p>
        </div>

        {/* Decorative Grid inside menu */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" style={{ filter: 'invert(1)' }}></div>

      </div>
    </>
  );
}