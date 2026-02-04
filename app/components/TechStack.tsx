"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cpu,
  Layers,
  PenTool,
  Terminal,
} from "lucide-react";

const stack = [
  {
    id: "01",
    label: "CORE STACK",
    sub: "LANGUAGES_LOGIC",
    icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
    stats: { label: "PROFICIENCY", val: "NATIVE" },
    items: ["Python", "C++", "Dart", "JavaScript", "SQL"],
    desc: "Foundational languages driving system logic and algorithms.",
  },
  {
    id: "02",
    label: "FRAMEWORKS",
    sub: "TURBO_CHARGED",
    icon: <Layers className="w-5 h-5 md:w-6 md:h-6" />,
    stats: { label: "VERSATILITY", val: "HIGH" },
    items: ["React / Next.js", "Flutter", "PyTorch", "TensorFlow", "YOLOv8"],
    desc: "Robust libraries for building scalable AI and web applications.",
  },
  {
    id: "03",
    label: "UI / UX DESIGN",
    sub: "AERODYNAMICS",
    icon: <PenTool className="w-5 h-5 md:w-6 md:h-6" />,
    stats: { label: "AESTHETICS", val: "PIXEL_PERFECT" },
    items: ["Figma", "Adobe XD", "Three.js", "Blender", "Prototyping"],
    desc: "Crafting intuitive, high-fidelity user experiences.",
  },
  {
    id: "04",
    label: "DEVOPS & TOOLS",
    sub: "SYSTEM_OPS",
    icon: <Terminal className="w-5 h-5 md:w-6 md:h-6" />,
    stats: { label: "UPTIME", val: "99.9%" },
    items: ["Git / GitHub", "Docker", "Firebase", "AirSim", "Linux"],
    desc: "Deployment pipelines and environment management.",
  },
];

export default function RacingStack() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Rev up animation
    gsap.fromTo(
      ".module-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section id="tech" ref={containerRef} className="relative bg-zinc-950 text-white min-h-screen py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-12 flex flex-col justify-center overflow-hidden">

      {/* CARBON FIBER TEXTURE */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(#3f3f46 1px, transparent 1px)`, backgroundSize: '4px 4px' }}>
      </div>

      {/* HEADER DASHBOARD - MOBILE OPTIMIZED */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mb-6 sm:mb-7 md:mb-8 flex items-end justify-between border-b-2 border-zinc-800 pb-3 md:pb-4">
        <div>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
            <span className="w-2 h-2 md:w-3 md:h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></span>
            <span className="text-red-600 font-mono text-[10px] md:text-xs font-bold tracking-widest">SYSTEM_ARMED</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black italic tracking-tighter text-white">
            TECH <span className="text-transparent" style={{ WebkitTextStroke: "1px white" }}>SPECS</span>
          </h2>
        </div>
        <div className="hidden md:block text-right font-mono text-xs text-zinc-500">
          <p>CHASSIS: RS-2025-X</p>
          <p>STATUS: OPTIMIZED</p>
        </div>
      </div>

      {/* THE RACING ACCORDION - MOBILE OPTIMIZED */}
      <div className="relative z-10 flex flex-col md:flex-row h-auto md:h-[500px] gap-2 max-w-7xl mx-auto w-full">
        {stack.map((group, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={group.id}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`
                module-card relative overflow-hidden border border-zinc-800 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${isActive 
                  ? "md:flex-[3] bg-zinc-900 border-red-600/50 min-h-[400px] md:min-h-0" 
                  : "md:flex-1 bg-black hover:bg-zinc-900 min-h-[80px] md:min-h-0"
                }
              `}
            >
              {/* Caution Stripes (Only on active) */}
              {isActive && (
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-10 pointer-events-none"
                  style={{ backgroundImage: "repeating-linear-gradient(45deg, #ef4444 0, #ef4444 10px, transparent 10px, transparent 20px)" }}
                />
              )}

              {/* ACTIVE CONTENT - MOBILE OPTIMIZED */}
              <div className={`absolute inset-0 p-5 sm:p-7 md:p-10 flex flex-col justify-between transition-opacity duration-300 delay-75 ${isActive ? "opacity-100" : "opacity-0"}`}>

                {/* Top Row: Icon & Main Title - MOBILE OPTIMIZED */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-2 md:p-3 bg-red-600 text-black rounded font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black italic uppercase tracking-tighter">{group.label}</h3>
                      <p className="text-red-500 font-mono text-[10px] md:text-xs tracking-widest">{group.sub}</p>
                    </div>
                  </div>
                  <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-800 select-none">{group.id}</span>
                </div>

                {/* Middle: Description & Tech - MOBILE OPTIMIZED */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <p className="text-zinc-400 font-medium max-w-sm text-sm md:text-base">{group.desc}</p>

                  {/* Tech Tags - MOBILE OPTIMIZED */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {group.items.map((tech) => (
                      <span key={tech} className="px-2 md:px-3 py-1 bg-zinc-800 border border-zinc-700 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wide text-white hover:bg-red-600 hover:border-red-600 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom: Telemetry Bar - MOBILE OPTIMIZED */}
                <div className="mt-auto pt-4 sm:pt-5 md:pt-6 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-zinc-500 text-[9px] md:text-[10px] font-mono uppercase">{group.stats.label}</span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-white">{group.stats.val}</span>
                  </div>

                  {/* Animated RPM Bar - MOBILE OPTIMIZED */}
                  <div className="flex gap-0.5 md:gap-1 items-end h-6 md:h-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 md:w-2 bg-red-600 rounded-sm animate-pulse`}
                        style={{
                          height: `${(i + 1) * 20}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>


              {/* INACTIVE SPINE (Vertical Text) - MOBILE OPTIMIZED */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isActive ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                <div className="md:-rotate-90 flex items-center gap-3 md:gap-4 min-w-max">
                  <span className="text-red-600 font-mono text-[10px] md:text-xs font-bold">{group.id} //</span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black italic uppercase tracking-wider text-zinc-600 group-hover:text-white transition-colors">
                    {group.label}
                  </h3>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}