"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

const menuLinks = [
  { label: "Home", href: "/", id: "01" },
  { label: "Projects", href: "#projects", id: "02" },
  { label: "Tech Stack", href: "#tech", id: "03" },
  { label: "Experience", href: "#experience", id: "04" },
  { label: "Achievements", href: "#achievements", id: "05" },
  { label: "Contact", href: "#contact", id: "06" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkText, setIsDarkText] = useState(false);

  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // --- SMOOTH SCROLL HANDLER ---
  const handleLinkClick = (e: any, href: string) => {
    setIsOpen(false);

    if (href.startsWith("#")) {
      e.preventDefault();
      lenis?.scrollTo(href);
    }
    else if (href === "/" && pathname === "/") {
      e.preventDefault();
      lenis?.scrollTo(0);
    }
  };

  // --- DYNAMIC BACKGROUND DETECTION ---
  useEffect(() => {
    const checkBackground = () => {
      const element = document.elementFromPoint(window.innerWidth / 2, 40);
      if (element) {
        let current: HTMLElement | null = element as HTMLElement;
        let bgColor = null;

        while (current && current !== document.body) {
          const computed = window.getComputedStyle(current);
          const bg = computed.backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            bgColor = bg;
            break;
          }
          current = current.parentElement;
        }

        if (bgColor) {
          const rgb = bgColor.match(/\d+/g);
          if (rgb) {
            const [r, g, b] = rgb.map(Number);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            setIsDarkText(brightness > 128);
          }
        } else {
          setIsDarkText(false);
        }
      }
    };

    window.addEventListener("scroll", checkBackground);
    checkBackground();
    return () => window.removeEventListener("scroll", checkBackground);
  }, []);

  // --- MENU ANIMATIONS ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isOpen) {
        gsap.to(overlayRef.current, { duration: 0.5, opacity: 1, pointerEvents: "all", ease: "power2.out" });
        gsap.to(menuRef.current, { duration: 0.5, x: "0%", ease: "power3.out" });
        gsap.fromTo(".menu-link-item",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.2 }
        );
      } else {
        gsap.to(menuRef.current, { duration: 0.5, x: "100%", ease: "power3.in" });
        gsap.to(overlayRef.current, { duration: 0.5, opacity: 0, pointerEvents: "none", delay: 0.2 });
      }
    });
    return () => ctx.revert();
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const textColorClass = isDarkText ? "text-carbon-black" : "text-white";
  const hamburgerColorClass = isDarkText ? "bg-carbon-black" : "bg-white";

  return (
    <>
      {/* NAVBAR - MOBILE OPTIMIZED */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 md:px-12 py-4 sm:py-5 md:py-6 flex justify-between items-center pointer-events-none transition-colors duration-300">

        {/* LOGO - MOBILE OPTIMIZED */}
        <Link href="/" onClick={(e) => handleLinkClick(e, "/")} className="group flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <img
            src="/Y21.png"
            alt="Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform duration-300 relative z-10"
          />
          <span className="font-black text-base sm:text-lg tracking-tighter uppercase flex items-center relative">
            <span className={`relative z-10 transition-colors duration-300 ${textColorClass}`}>
              RAHUL
            </span>
            <span className="text-racing-red relative z-10">.DEV</span>
          </span>
        </Link>

        {/* TOGGLE BUTTON - MOBILE OPTIMIZED */}
        <button
          onClick={toggleMenu}
          className={`group flex items-center gap-2 sm:gap-3 cursor-pointer outline-none pointer-events-auto transition-colors duration-300 ${textColorClass}`}
        >
          <span className="hidden md:block font-mono text-xs font-bold uppercase tracking-widest group-hover:text-racing-red transition-colors">
            {isOpen ? "Close" : "Chapters"}
          </span>
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex flex-col justify-center gap-1.5 items-end">
            <span className={`w-full h-[2px] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2 bg-racing-red' : hamburgerColorClass}`}></span>
            <span className={`w-2/3 h-[2px] transition-all duration-300 ${isOpen ? 'opacity-0' : `group-hover:w-full ${hamburgerColorClass}`}`}></span>
            <span className={`w-full h-[2px] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2 bg-racing-red' : hamburgerColorClass}`}></span>
          </div>
        </button>

      </nav>

      {/* OVERLAY */}
      <div
        ref={overlayRef}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] opacity-0 pointer-events-none transition-opacity"
      ></div>

      {/* MENU PANEL - MOBILE OPTIMIZED */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-screen w-full sm:w-[380px] md:w-[450px] bg-zinc-950 border-l border-white/10 z-[100] transform translate-x-full shadow-2xl flex flex-col"
      >
        {/* HEADER - MOBILE OPTIMIZED */}
        <div className="p-8 sm:p-10 md:p-12 border-b border-white/10 flex justify-between items-center text-white">
          <span className="font-mono text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">/// Index</span>
          <button onClick={() => setIsOpen(false)} className="hover:text-racing-red transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest">[ ESC ]</button>
        </div>

        {/* LINKS - MOBILE OPTIMIZED */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-10 md:px-12 gap-6 sm:gap-7 md:gap-8">
          {menuLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="menu-link-item group flex items-center gap-4 sm:gap-5 md:gap-6"
            >
              <span className="font-mono text-[10px] md:text-xs text-gray-600 group-hover:text-racing-red transition-colors duration-300">{link.id}</span>
              <span className="text-2xl sm:text-3xl font-bold text-gray-400 uppercase tracking-wide group-hover:text-white group-hover:translate-x-2 transition-all duration-300">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* FOOTER - MOBILE OPTIMIZED */}
        <div className="p-8 sm:p-10 md:p-12 border-t border-white/10 text-white">
          <div className="flex gap-4 sm:gap-5 md:gap-6 mb-3 md:mb-4">
            <a href="https://github.com/rahulsiiitm" target="_blank" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/rahulsharma2k4" target="_blank" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">LinkedIn</a>
          </div>
          <p className="font-mono text-[9px] md:text-[10px] text-gray-700">SYSTEM: ONLINE <br /> V.2.0.4</p>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" style={{ filter: 'invert(1)' }}></div>
      </div>
    </>
  );
}