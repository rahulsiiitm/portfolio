"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    id: "01",
    title: "AgriHive",
    category: "AI / FLUTTER",
    description: "AI-powered farming advisory platform integrating Firebase & weather forecasting.",
    year: "2025",
    image: "bg-zinc-900", 
  },
  {
    id: "02",
    title: "Auto Drone",
    category: "COMPUTER VISION",
    description: "Autonomous drone navigation system using YOLOv8 and AirSim simulation.",
    year: "2025",
    image: "bg-zinc-800",
  },
  {
    id: "03",
    title: "Udbhav",
    category: "WEB3 / 3D",
    description: "Official hackathon platform featuring retro-themed Three.js elements.",
    year: "2024",
    image: "bg-zinc-900",
  },
  {
    id: "04",
    title: "CRPF Logs",
    category: "APP DEV",
    description: "Secure independent log management application deployed for CRPF.",
    year: "2024",
    image: "bg-zinc-800",
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const speedDisplayRef = useRef<HTMLSpanElement>(null);
  const redlineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!trackRef.current || !containerRef.current || !progressBarRef.current) return;

    const totalWidth = trackRef.current.offsetWidth;
    const viewportWidth = window.innerWidth;
    
    // 1. THE TRACK SCROLL
    const scrollTween = gsap.to(trackRef.current, {
      x: -(totalWidth - viewportWidth), 
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1, // Inertia for weight
        start: "top top",
        end: "+=3500",
        
        onUpdate: (self) => {
          // --- A. SPEEDOMETER LOGIC ---
          const velocity = Math.abs(self.getVelocity());
          const normalizedSpeed = Math.min(Math.round(velocity / 10), 350); 

          if (speedDisplayRef.current) {
            speedDisplayRef.current.innerText = normalizedSpeed.toString().padStart(3, '0');
          }

          // --- B. REDLINE EFFECT ---
          const redlineOpacity = gsap.utils.clamp(0, 0.8, (normalizedSpeed - 100) / 200);
          gsap.to(redlineRef.current, { opacity: redlineOpacity, duration: 0.1, overwrite: true });


          // --- C. DYNAMIC SKEW (Motion Only) ---
          // The cards lean ONLY when moving, otherwise they stand straight
          const skewAmount = self.getVelocity() / 300; 
          const clampedSkew = gsap.utils.clamp(-10, 10, skewAmount);

          gsap.to(".project-card", {
            skewX: -clampedSkew, 
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto"
          });

          // --- D. PROGRESS BAR ---
          gsap.to(progressBarRef.current, { width: `${self.progress * 100}%`, ease: "none" });
        }
      },
    });

    // 2. PARALLAX
    const cards = gsap.utils.toArray(".project-card");
    cards.forEach((card: any) => {
        const image = card.querySelector(".project-image-inner");
        gsap.to(image, {
            x: 100,
            ease: "none",
            scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween, 
                start: "left right", 
                end: "right left",   
                scrub: true,
            }
        });
    });

    return () => {
      scrollTween.kill();
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen bg-black text-white overflow-hidden perspective-1000"
    >
      
      {/* REDLINE GLOW */}
      <div ref={redlineRef} className="absolute inset-0 bg-racing-red mix-blend-overlay opacity-0 pointer-events-none z-30 transition-opacity"></div>


      {/* === HUD LAYERS === */}
      
      {/* Top Left: Title (Upright Font) */}
      <div className="absolute top-0 left-0 px-6 md:px-12 py-8 z-20 pointer-events-none">
          <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 bg-racing-red rounded-full animate-pulse"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-racing-red">Race Logic / v1.0</span>
          </div>
          {/* Removed italic/skew */}
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Selected <span className="text-transparent stroke-text">Works</span>
          </h2>
      </div>

      {/* Top Right: Speedometer */}
      <div className="absolute top-0 right-0 px-6 md:px-12 py-8 z-20 pointer-events-none text-right">
          <div className="flex flex-col items-end">
             <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-1">Scroll Velocity</p>
             <div className="flex items-baseline gap-2">
                <span ref={speedDisplayRef} className="text-6xl font-black font-mono text-racing-red leading-none">000</span>
                <span className="text-sm font-bold text-gray-500">KM/H</span>
             </div>
          </div>
      </div>

      {/* Checkered Strip (Subtle) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#222_20px,#222_40px)] opacity-50 z-10"></div>


      {/* Bottom: Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gray-900 z-20 border-t border-white/10">
          <div ref={progressBarRef} className="h-full bg-racing-red w-0"></div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-10 pointer-events-none" style={{ filter: 'invert(1)' }}></div>


      {/* === HORIZONTAL TRACK === */}
      <div 
        ref={trackRef}
        className="flex h-full items-center pl-6 md:pl-12"
        style={{ width: "fit-content" }} 
      >
        
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="project-card relative w-[90vw] md:w-[60vw] h-[75vh] md:h-[80vh] flex flex-col md:flex-row flex-shrink-0 mr-6 md:mr-16 border border-white/10 bg-zinc-900/80 backdrop-blur-sm group origin-bottom-left overflow-hidden"
          >
            {/* Top Stripe */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-racing-red to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            
            {/* LEFT: IMAGE (60%) */}
            <div className={`w-full md:w-[60%] h-[50%] md:h-full ${project.image} relative overflow-hidden border-r border-white/10`}>
                
                {/* Parallax Inner Image */}
                <div className="project-image-inner absolute inset-[-20%] bg-cover bg-center bg-no-repeat opacity-50"></div>

                {/* Placeholder Number - Upright Font */}
                <div className="project-image-inner absolute inset-0 flex items-center justify-center">
                    <span className="text-[10rem] md:text-[15rem] font-black text-white/5 select-none">
                        {project.id}
                    </span>
                </div>

                <div className="absolute inset-0 bg-racing-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                
                {/* View Button - Standard Circle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center font-black text-2xl hover:bg-racing-red hover:text-white transition-colors">
                        →
                    </div>
                </div>
            </div>

            {/* RIGHT: CONTENT (40%) */}
            <div className="w-full md:w-[40%] h-[50%] md:h-full p-8 flex flex-col justify-between bg-black/40">
                
                <div className="flex justify-between items-start border-b border-white/10 pb-6">
                    {/* Clean Tag */}
                    <span className="px-3 py-1 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-racing-red">
                        {project.category}
                    </span>
                    <span className="font-mono text-xs text-gray-500">{project.year}</span>
                </div>

                <div>
                    {/* Clean Title */}
                    <h3 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] mb-4 group-hover:text-racing-red transition-colors duration-300">
                        {project.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <div className="border-t border-white/10 pt-6 flex justify-between items-center text-xs font-mono text-gray-500 uppercase">
                    <span>Pro. ID // {project.id}</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300 text-white font-bold">Details -{">"}</span>
                </div>

            </div>

          </div>
        ))}
        
        <div className="w-[10vw]"></div>

      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
      `}</style>
    </section>
  );
}