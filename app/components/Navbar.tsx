"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { ArrowDownRight, ChevronDown, Code2, Github, Linkedin, Mail } from "lucide-react";

const menuLinks = [
  { label: "Home", href: "/", id: "01" },
  { label: "Projects", href: "#projects", id: "02" },
  { label: "Tech Stack", href: "#tech", id: "03" },
  { label: "Experience", href: "#experience", id: "04" },
  { label: "Achievements", href: "#achievements", id: "05" },
  { label: "Contact", href: "#contact", id: "06" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/rahulsiiitm", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/rahulsiiitm", icon: Linkedin },
  { label: "LeetCode", href: "https://leetcode.com/u/rahul2k4/", icon: Code2 },
  { label: "Email", href: "mailto:rahulsharma.hps@gmail.com", icon: Mail },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkText, setIsDarkText] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const checkBackground = () => {
      const element = document.elementFromPoint(window.innerWidth / 2, 40);
      let current = element as HTMLElement | null;
      while (current && current !== document.body) {
        const bg = window.getComputedStyle(current).backgroundColor;
        if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
          const rgb = bg.match(/\d+/g)?.map(Number);
          if (rgb) setIsDarkText((rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 > 128);
          return;
        }
        current = current.parentElement;
      }
      setIsDarkText(false);
    };
    window.addEventListener("scroll", checkBackground, { passive: true });
    checkBackground();
    return () => window.removeEventListener("scroll", checkBackground);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const toggleMenu = () => setIsOpen((open) => !open);

  const resolvedHref = (href: string) => href.startsWith("#") && pathname !== "/" ? `/${href}` : href;
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      event.preventDefault();
      lenis?.scrollTo(href);
    } else if (href === "/" && pathname === "/") {
      event.preventDefault();
      lenis?.scrollTo(0);
    }
  };

  const textColor = isDarkText && !isOpen ? "text-carbon-black" : "text-white";
  const lineColor = isDarkText && !isOpen ? "bg-carbon-black" : "bg-white";

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-[120] flex items-center justify-between px-4 py-4 pointer-events-none sm:px-7 md:px-12 md:py-6">
        <Link href="/" onClick={(event) => handleLinkClick(event, "/")} className="flex items-center gap-2 pointer-events-auto">
          <Image src="/Y21.png" alt="Rahul Sharma" width={34} height={34} className="h-8 w-8 object-contain" priority />
          <span className={`text-base font-black uppercase tracking-tighter transition-colors ${textColor}`}>Rahul<span className="text-racing-red">.dev</span></span>
        </Link>
        <button type="button" onClick={toggleMenu} aria-expanded={isOpen} aria-controls="site-menu" aria-label={isOpen ? "Close menu" : "Open menu"} className={`group flex items-center gap-3 pointer-events-auto sm:gap-5 ${textColor}`}>
          <span className="hidden items-center gap-3 text-sm font-semibold uppercase sm:flex sm:text-base">
            {isOpen ? "Close" : "Chapters"}
            <ChevronDown className={`h-5 w-5 stroke-[2.5] transition-all duration-500 ${isOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100 group-hover:translate-y-0.5"}`} />
          </span>
          <span className="relative block h-11 w-12 sm:h-12 sm:w-14" aria-hidden="true">
            <span className={`absolute left-0 top-1/2 h-[3px] w-full origin-center transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "translate-y-0 rotate-45 bg-white" : `-translate-y-[6px] -skew-x-[18deg] ${lineColor}`}`} />
            <span className={`absolute left-0 top-1/2 h-[3px] w-full origin-center transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "translate-y-0 -rotate-45 bg-white" : `translate-y-[6px] -skew-x-[18deg] ${lineColor}`}`} />
          </span>
        </button>
      </nav>

      <div id="site-menu" aria-hidden={!isOpen} className={`fixed inset-0 z-[110] h-[100dvh] overflow-hidden bg-[#030312] text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "translate-y-0 pointer-events-auto" : "-translate-y-full pointer-events-none"}`}>
        <div className="absolute inset-0 opacity-[0.055] bg-grid-pattern" />
        <div className="absolute -right-[12vw] top-[7vh] select-none text-[44vw] font-black italic leading-none text-white/[0.025]">21</div>
        <div className="relative grid h-full grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(5.25rem,env(safe-area-inset-top))] sm:gap-5 sm:px-8 md:grid-cols-[minmax(260px,0.7fr)_1.3fr] md:grid-rows-1 md:px-12 md:pb-10 md:pt-28 lg:gap-20">
          <aside className={`order-2 flex min-h-0 flex-col justify-end transition-all duration-700 md:order-1 ${isOpen ? "translate-y-0 opacity-100 delay-300" : "-translate-y-8 opacity-0"}`}>
            <div className="hidden max-w-sm rounded-[6px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md md:block">
              <div className="mb-10 flex items-start justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Currently building</span><span className="text-racing-red">●</span></div>
              <p className="text-2xl font-medium leading-tight">AI systems with speed,<br />clarity and character.</p>
              <Link href={resolvedHref("#projects")} onClick={(event) => handleLinkClick(event, resolvedHref("#projects"))} className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs uppercase tracking-[0.2em] transition-colors hover:text-racing-red">Explore selected work <ArrowDownRight size={18} /></Link>
            </div>
            <div className="mt-3 flex items-center gap-2 sm:mt-5 sm:gap-3 text-white/55">{socials.map((social) => { const Icon = social.icon; return <a key={social.label} href={social.href} target={social.href.startsWith("http") ? "_blank" : undefined} rel={social.href.startsWith("http") ? "noreferrer" : undefined} aria-label={social.label} title={social.label} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all hover:-translate-y-1 hover:border-racing-red hover:text-white"><Icon size={17} /></a>; })}</div>
          </aside>

          <main className="order-1 flex min-h-0 flex-col justify-center md:order-2">
            <p className={`mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-racing-red transition-all duration-500 ${isOpen ? "translate-y-0 opacity-100 delay-300" : "-translate-y-6 opacity-0"}`}>Portfolio index / 2026</p>
            <div className="flex flex-col">
              {menuLinks.map((link, index) => (
                <Link key={link.id} href={resolvedHref(link.href)} onClick={(event) => handleLinkClick(event, resolvedHref(link.href))} style={{ transitionDelay: isOpen ? `${360 + index * 55}ms` : "0ms" }} className={`group flex items-baseline gap-3 border-b border-white/10 py-[clamp(0.22rem,1vh,0.7rem)] transition-all duration-500 md:gap-6 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}>
                  <span className="font-mono text-[9px] text-white/35 transition-colors group-hover:text-racing-red">{link.id}</span>
                  <span className="text-[clamp(1.75rem,7.4vw,6.8rem)] font-black uppercase leading-[0.88] tracking-[-0.07em] transition-all group-hover:translate-x-3 group-hover:text-racing-red">{link.label}</span>
                </Link>
              ))}
            </div>
            <div className={`mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/35 transition-all duration-500 ${isOpen ? "translate-y-0 opacity-100 delay-700" : "-translate-y-5 opacity-0"}`}><span>Rahul Sharma</span><span className="hidden sm:inline">Imphal, India · 24.8170° N</span></div>
          </main>
        </div>
      </div>
    </>
  );
}