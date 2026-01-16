"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stack = [
  {
    category: "Core / Languages",
    items: ["Python", "C++", "Dart", "JavaScript (ES6+)", "SQL"],
  },
  {
    category: "Frameworks & Libraries",
    items: ["React / Next.js", "Flutter", "PyTorch", "TensorFlow", "YOLOv8"],
  },
  {
    category: "Design & Creative",
    items: ["Figma", "Adobe XD", "Three.js", "Blender", "UI Prototyping"],
  },
  {
    category: "DevOps & Tools",
    items: ["Git / GitHub", "Docker", "Firebase", "AirSim", "Linux"],
  },
];

export default function TechStack() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate the grid items staggering in
    gsap.fromTo(
      ".stack-item",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section ref={containerRef} className="bg-black text-white py-32 px-6 md:px-12 border-t border-white/10">
      
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER */}
        <div className="flex items-end justify-between mb-24 border-b border-white/20 pb-8">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 bg-racing-red rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-racing-red">
                        System Diagnostics
                    </span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                    Engine <span className="text-transparent stroke-text">Specs</span>
                </h2>
            </div>
            
            <div className="hidden md:block text-right opacity-60 font-mono text-sm">
                <p>OPT: MAX_PERFORMANCE</p>
                <p>STATUS: OPTIMIZED</p>
            </div>
        </div>


        {/* THE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {stack.map((group, i) => (
            <div key={i} className="stack-item flex flex-col">
              
              {/* Category Header */}
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-8 border-l-2 border-racing-red pl-4">
                {group.category}
              </h3>

              {/* List */}
              <ul className="flex flex-col gap-4">
                {group.items.map((tech, j) => (
                  <li key={j} className="group flex items-center justify-between border-b border-white/10 pb-2 hover:border-white transition-colors cursor-default">
                    <span className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">
                        {tech}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-racing-red text-xl transition-opacity">
                        +
                    </span>
                  </li>
                ))}
              </ul>

            </div>
          ))}

        </div>

      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
      `}</style>
    </section>
  );
}