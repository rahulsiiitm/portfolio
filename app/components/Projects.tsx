"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronRight, Layers } from "lucide-react";

const projects = [
  {
    id: "01",
    title: "AgriHive",
    category: "AI / AGRI-TECH",
    description: "Multilingual AI farming assistant achieving 92% disease detection accuracy. Engineered with TensorFlow, Gemini API, and an offline-first Firebase architecture for rural accessibility.",
    year: "2025",
    colorClass: "bg-zinc-900",
    bgImage: "/projects/AgriHive.webp",
    slug: "agrihive",
    links: { github: "#", demo: "#" }
  },
  {
    id: "02",
    title: "AEGIS (CRPF)",
    category: "SECURITY / ARCH",
    description: "Mission-critical secure log and personnel management system for the Central Reserve Police Force. Features multi-role authentication and high-integrity Firestore architecture.",
    year: "2025",
    colorClass: "bg-zinc-900",
    bgImage: "/projects/crpf.png",
    slug: "aegis",
    links: null,
    confidential: true
  },
  {
    id: "03",
    title: "Fatigue Detector",
    category: "HARDWARE / AI",
    description: "Wearable EMG/IMU glove detecting muscle fatigue in real-time. Integrating IoT signal processing with AI to predict physical strain for athletes and industrial workers.",
    year: "2026",
    colorClass: "bg-zinc-800",
    bgImage: "/projects/fatigue.png",
    slug: "fatigue",
    links: null,
    inProgress: true
  }
];

type ProjectLinks = { github?: string; demo?: string; website?: string; download?: string; } | null;

type Project = {
  id: string; title: string; category: string; description: string; year: string;
  colorClass: string; bgImage: string; links: ProjectLinks; slug?: string;
  confidential?: boolean; inProgress?: boolean; isArchive?: boolean;
};

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const speedDisplayRef = useRef<HTMLSpanElement>(null);
  const f1ImageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!trackRef.current || !containerRef.current || !progressBarRef.current) return;

      const totalWidth = trackRef.current.offsetWidth;
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 768;

      const scrollTween = gsap.to(trackRef.current, {
        x: -(totalWidth - viewportWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: isMobile ? 1 : 0.5,
          start: "top top",
          end: isMobile ? "+=1200" : "+=2500",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const velocity = Math.abs(self.getVelocity());
            const normalizedSpeed = Math.min(Math.round(velocity / 10), 450);

            if (speedDisplayRef.current) {
              speedDisplayRef.current.textContent = normalizedSpeed.toString().padStart(3, '0');
            }
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }

            // Skip heavy effects on mobile
            if (!isMobile) {
              const redlineOpacity = gsap.utils.clamp(0, 0.8, (normalizedSpeed - 100) / 350);
              gsap.set(".project-speed-glow", { opacity: redlineOpacity });

              if (velocity > 50) {
                const skewAmount = self.getVelocity() / 300;
                const clampedSkew = gsap.utils.clamp(-10, 10, skewAmount);
                gsap.to(".project-card", { skewX: -clampedSkew, duration: 0.3, ease: "power2.out", overwrite: "auto" });
              }
            }
          },
          onLeave: () => {
            if (!isMobile) gsap.to(".project-card", { skewX: 0, duration: 0.3, ease: "power2.out" });
            if (speedDisplayRef.current) speedDisplayRef.current.textContent = "000";
            if (!isMobile) gsap.to(".project-speed-glow", { opacity: 0, duration: 0.2 });
          }
        },
      });

      if (f1ImageRef.current && !isMobile) {
        gsap.to(f1ImageRef.current, {
          x: -200, ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=3500",
            scrub: 0.5
          }
        });
      }

      // Parallax on cards — desktop only
      if (!isMobile) {
        const cards = gsap.utils.toArray<HTMLElement>(".project-card");
        cards.forEach((card) => {
          const image = card.querySelector(".project-image-inner") as HTMLElement | null;
          if (image) {
            gsap.to(image, {
              x: 50, ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: 0.5
              }
            });
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleProjectClick = (project: Project) => {
    if (project.slug) router.push(`/projects/${project.slug}`);
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative h-screen bg-black text-white overflow-hidden"
    >
      {/* Background — static on mobile for perf */}
      <div
        ref={f1ImageRef}
        className="absolute top-0 -left-[10%] w-[120%] h-full z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/bg2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform"
        }}
      />
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-10 pointer-events-none" style={{ filter: 'invert(1)' }} />

      {/* HUD Header */}
      <div className="absolute top-16 sm:top-20 md:top-24 left-0 px-4 sm:px-8 md:px-12 z-20 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase text-red-500">
            Race Logic / v1.0
          </span>
        </div>
        <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-wide leading-none">
          Selected <span className="stroke-text">Works</span>
        </h2>
      </div>

      {/* HUD Speedometer */}
      <div className="absolute top-16 sm:top-20 md:top-24 right-0 px-4 sm:px-8 md:px-12 z-20 pointer-events-none text-right">
        <p className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-0.5">
          Scroll Velocity
        </p>
        <div className="flex items-baseline gap-1 justify-end">
          <span
            ref={speedDisplayRef}
            className="text-2xl sm:text-4xl md:text-5xl font-black font-mono text-red-500 leading-none tabular-nums"
          >
            000
          </span>
          <span className="text-[9px] sm:text-xs font-bold text-gray-500">KM/H</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 max-w-md h-1.5 md:h-2 bg-zinc-800/60 z-20 border border-white/10 rounded-full overflow-hidden">
        <div
          ref={progressBarRef}
          className="h-full bg-red-600 w-0 rounded-full shadow-[0_0_8px_rgba(255,0,0,0.5)]"
          style={{ willChange: "width" }}
        />
      </div>

      {/* Horizontal Track */}
      <div
        ref={trackRef}
        className="flex h-full items-end pl-4 sm:pl-8 md:pl-12 pb-10 sm:pb-12 md:pb-16"
        style={{ width: "fit-content", willChange: "transform" }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card relative flex-shrink-0 mr-4 sm:mr-8 md:mr-16 border border-white/10 bg-zinc-900/80 group origin-bottom-left overflow-hidden shadow-2xl
              w-[80vw] sm:w-[70vw] md:w-[58vw]
              h-[62vh] sm:h-[66vh] md:h-[70vh]
              flex flex-col md:flex-row"
          >
            {/* Top red line on hover */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Speed glow — desktop only via CSS */}
            <div className="project-speed-glow hidden md:block absolute inset-0 bg-red-600 mix-blend-overlay opacity-0 pointer-events-none z-20 will-change-opacity" />

            {/* Badges */}
            {project.confidential && (
              <div className="absolute top-2.5 right-2.5 z-30 px-2 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
                <span className="text-[9px] font-semibold text-red-300">NDA</span>
              </div>
            )}
            {project.inProgress && (
              <div className="absolute top-2.5 right-2.5 z-30 px-2 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full">
                <span className="text-[9px] font-semibold text-amber-300">Ongoing</span>
              </div>
            )}

            {/* Image */}
            <div
              className={`w-full md:w-[58%] h-[42%] md:h-full ${project.colorClass} relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 cursor-pointer`}
              onClick={() => handleProjectClick(project)}
            >
              {project.bgImage && (
                <img
                  src={project.bgImage}
                  alt={project.title}
                  className="project-image-inner absolute w-[110%] h-[110%] -left-[5%] -top-[5%] object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <span className="absolute inset-0 flex items-center justify-center text-[6rem] sm:text-[8rem] md:text-[12rem] font-black text-white/5 select-none pointer-events-none">
                {project.id}
              </span>
              <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white text-black rounded-full flex items-center justify-center shadow-xl">
                  <ArrowRight size={22} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-[42%] h-[58%] md:h-full p-4 sm:p-5 md:p-8 flex flex-col justify-between bg-black/40">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="px-2 py-0.5 border border-white/20 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-red-500">
                  {project.category}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] text-gray-500">{project.year}</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl md:text-4xl font-black uppercase leading-[0.9] mb-2 md:mb-4 group-hover:text-red-500 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 leading-relaxed line-clamp-3 md:line-clamp-4">
                  {project.description}
                </p>
              </div>

              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                {project.slug && (
                  <button
                    onClick={() => handleProjectClick(project)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white text-black hover:bg-red-600 hover:text-white transition-colors text-[9px] sm:text-[10px] font-black uppercase tracking-widest"
                  >
                    View Case Study <ChevronRight size={12} />
                  </button>
                )}
                <span className="hidden sm:inline text-gray-500 font-mono text-[9px] group-hover:translate-x-1 transition-transform duration-300">
                  ID // {project.id}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Archive Bridge Card */}
        <div className="project-card relative flex-shrink-0 mr-4 sm:mr-8 md:mr-16 border-2 border-dashed border-white/10 bg-zinc-950/40 group hover:border-red-600/50 transition-all duration-500
          w-[80vw] sm:w-[42vw] md:w-[32vw]
          h-[62vh] sm:h-[66vh] md:h-[70vh]
          flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center text-center p-6 sm:p-8">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-500">
              <Layers size={26} className="text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter mb-2">Full Archive</h3>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.15em] mb-8 max-w-[200px] leading-relaxed">
              Complete system directory // 12+ Modules
            </p>
            <button
              onClick={() => router.push('/archive')}
              className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.25em] hover:bg-red-600 hover:text-white transition-all group-hover:scale-105 active:scale-95 shadow-xl"
            >
              Explore All
            </button>
          </div>
        </div>

        <div className="w-[8vw] md:w-[10vw] flex-shrink-0" />
      </div>

      <style>{`
  .stroke-text { -webkit-text-stroke: 1px white; color: transparent; }
`}</style>
    </section>
  );
}