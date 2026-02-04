"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const projects = [
  {
    id: "01",
    title: "AgriHive",
    category: "AI / FLUTTER",
    description: "AI-powered farming advisory platform achieving 92% disease detection accuracy using TensorFlow, Gemini API, and an offline-first Firebase backend.",
    year: "2025",
    colorClass: "bg-zinc-900", 
    bgImage: "/projects/AgriHive.webp", 
    links: {
      github: "https://github.com/rahulsiiitm/AgriHive-Frontend",
      githubBackend: "https://github.com/rahulsiiitm/Backend",
      demo: "https://agrihive-c8f6b.web.app/",
      download: "https://drive.google.com/uc?export=download&id=1mOW06ng4V848ZiInPcajH08s4yVApNqz"
    }
  },
  {
    id: "02",
    title: "AEGIS (CRPF)",
    category: "SECURITY / APP",
    description: "Mission-critical secure log management app developed for the CRPF featuring real-time data visualization and secure Firestore architecture.",
    year: "2025",
    colorClass: "bg-zinc-900",
    bgImage: null, 
    links: null,
    confidential: true
  },
  {
    id: "03",
    title: "Auto Drone Module",
    category: "ROBOTICS / CV",
    description: "Autonomous UAV navigation system built in Gazebo using ROS and SLAM algorithms, integrating OpenCV CNNs for in-flight obstacle avoidance.",
    year: "2025",
    colorClass: "bg-zinc-800",
    bgImage: null,
    links: {
      github: "https://github.com/rahulsiiitm/semantic_drone_project"
    },
    inProgress: true
  },
  {
    id: "04",
    title: "Walmart Bot",
    category: "GEN AI / WEB",
    description: "AI chatbot engineered with LangChain and Gemini API to facilitate semantic product search and intelligent customer guidance.",
    year: "2025",
    colorClass: "bg-zinc-800",
    bgImage: "/projects/guidance.webp", 
    links: {
      github: "https://github.com/rahulsiiitm/Chatbot"
    }
  },
];

export default function Projects() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const speedDisplayRef = useRef<HTMLSpanElement>(null);
  const redlineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!trackRef.current || !containerRef.current || !progressBarRef.current) return;

    const totalWidth = trackRef.current.offsetWidth;
    const viewportWidth = window.innerWidth;
    const isMobile = window.innerWidth < 768;

    const scrollTween = gsap.to(trackRef.current, {
      x: -(totalWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: isMobile ? "+=2500" : "+=3500",

        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity());
          const normalizedSpeed = Math.min(Math.round(velocity / 10), 350);

          if (speedDisplayRef.current) {
            speedDisplayRef.current.innerText = normalizedSpeed.toString().padStart(3, '0');
          }

          const redlineOpacity = gsap.utils.clamp(0, 0.8, (normalizedSpeed - 100) / 200);
          gsap.to(redlineRef.current, { opacity: redlineOpacity, duration: 0.1, overwrite: true });

          const skewAmount = self.getVelocity() / 300;
          const clampedSkew = gsap.utils.clamp(-10, 10, skewAmount);

          if (!isMobile) {
            gsap.to(".project-card", {
              skewX: -clampedSkew,
              duration: 0.5,
              ease: "power3.out",
              overwrite: "auto"
            });
          }

          gsap.to(progressBarRef.current, { width: `${self.progress * 100}%`, ease: "none" });
        },

        onLeave: () => {
          if (!isMobile) {
            gsap.to(".project-card", { skewX: 0, duration: 0.3, ease: "power2.out" });
          }
          if (speedDisplayRef.current) {
            speedDisplayRef.current.innerText = "000";
          }
          gsap.to(redlineRef.current, { opacity: 0, duration: 0.2 });
        },

        onEnterBack: () => {
          if (!isMobile) {
            gsap.to(".project-card", { skewX: 0, duration: 0.3, ease: "power2.out" });
          }
        }
      },
    });

    if (!isMobile) {
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      cards.forEach((card) => {
        const image = card.querySelector(".project-image-inner") as HTMLElement | null;
        gsap.to(image, {
          x: 50, 
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
    }

    return () => {
      scrollTween.kill();
    };
  }, []);

  const handleProjectClick = (project: typeof projects[0]) => {
    if (project.confidential || project.inProgress) return;

    if (project.links?.demo) {
      window.open(project.links.demo, '_blank');
    } else if (project.links?.github) {
      window.open(project.links.github, '_blank');
    }
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative h-screen bg-black text-white overflow-hidden perspective-1000"
    >

      <div ref={redlineRef} className="absolute inset-0 bg-racing-red mix-blend-overlay opacity-0 pointer-events-none z-30 transition-opacity"></div>

      {/* --- HUD HEADER (Left) - MOBILE OPTIMIZED --- */}
      <div className="absolute top-20 md:top-24 left-0 px-4 md:px-12 z-20 pointer-events-none">
        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-racing-red rounded-full animate-pulse"></span>
          <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] md:tracking-[0.2em] uppercase text-racing-red">Race Logic / v1.0</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
          Selected <span className="text-transparent stroke-text">Works</span>
        </h2>
      </div>

      {/* --- HUD SPEEDOMETER (Right) - MOBILE OPTIMIZED --- */}
      <div className="absolute top-20 md:top-24 right-0 px-4 md:px-12 z-20 pointer-events-none text-right">
        <div className="flex flex-col items-end">
          <p className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase text-gray-500 mb-0.5 md:mb-1">Scroll Velocity</p>
          <div className="flex items-baseline gap-1 md:gap-2">
            <span ref={speedDisplayRef} className="text-3xl sm:text-5xl md:text-6xl font-black font-mono text-racing-red leading-none">000</span>
            <span className="text-[10px] md:text-sm font-bold text-gray-500">KM/H</span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#222_20px,#222_40px)] opacity-50 z-10"></div>

      <div className="absolute bottom-0 left-0 w-full h-3 md:h-4 bg-gray-900 z-20 border-t border-white/10">
        <div ref={progressBarRef} className="h-full bg-racing-red w-0"></div>
      </div>

      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-10 pointer-events-none" style={{ filter: 'invert(1)' }}></div>

      <div
        ref={trackRef}
        className="flex h-full items-end pl-4 md:pl-12 pb-6 md:pb-8"
        style={{ width: "fit-content" }}
      >

        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card relative w-[85vw] sm:w-[75vw] md:w-[60vw] h-[65vh] sm:h-[68vh] md:h-[70vh] flex flex-col md:flex-row flex-shrink-0 mr-4 md:mr-16 border border-white/10 bg-zinc-900/80 backdrop-blur-sm group origin-bottom-left overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-racing-red to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            {/* CONFIDENTIAL BADGE - MOBILE OPTIMIZED */}
            {project.confidential && (
              <div className="absolute top-3 right-3 md:top-4 md:right-4 z-30 flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-red-500/20 backdrop-blur-md border border-red-500/40 rounded-full">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] md:text-xs font-medium text-red-300">NDA</span>
              </div>
            )}

            {/* IN PROGRESS BADGE - MOBILE OPTIMIZED */}
            {project.inProgress && (
              <div className="absolute top-3 right-3 md:top-4 md:right-4 z-30 flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-amber-500/20 backdrop-blur-md border border-amber-500/40 rounded-full">
                <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-[10px] md:text-xs font-medium text-amber-300">Ongoing</span>
              </div>
            )}

            {/* IMAGE SECTION - MOBILE OPTIMIZED */}
            <div className={`w-full md:w-[60%] h-[45%] md:h-full ${project.colorClass} relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10`}>
              
              {project.bgImage ? (
                  <img 
                    src={project.bgImage}
                    alt={project.title}
                    className="project-image-inner absolute w-[110%] h-[110%] -left-[5%] -top-[5%] object-cover opacity-60 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105"
                  />
              ) : (
                  <div className="project-image-inner absolute inset-[-10%] bg-cover bg-center bg-no-repeat opacity-50"></div>
              )}

              {/* Huge Number Overlay - MOBILE OPTIMIZED */}
              <div className="project-image-inner absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[8rem] sm:text-[10rem] md:text-[15rem] font-black text-white/5 select-none">
                  {project.id}
                </span>
              </div>

              {/* Hover Red Overlay */}
              <div className="absolute inset-0 bg-racing-red/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>

              {/* Hover Action Button - MOBILE OPTIMIZED */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                <button
                  onClick={() => handleProjectClick(project)}
                  disabled={project.confidential}
                  className={`w-16 h-16 md:w-20 md:h-20 ${project.confidential ? 'bg-gray-600 cursor-not-allowed' : 'bg-white hover:bg-racing-red hover:text-white'} text-black rounded-full flex items-center justify-center font-black text-xl md:text-2xl transition-colors shadow-xl`}
                >
                  {project.confidential ? '🔒' : '→'}
                </button>
              </div>
            </div>

            {/* CONTENT SECTION - MOBILE OPTIMIZED */}
            <div className="w-full md:w-[40%] h-[55%] md:h-full p-4 sm:p-6 md:p-8 flex flex-col justify-between bg-black/40">

              <div className="flex justify-between items-start border-b border-white/10 pb-3 md:pb-4">
                <span className="px-2 md:px-3 py-0.5 md:py-1 border border-white/20 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-racing-red">
                  {project.category}
                </span>
                <span className="font-mono text-[10px] md:text-xs text-gray-500">{project.year}</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase leading-[0.9] mb-3 md:mb-4 group-hover:text-racing-red transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed line-clamp-3 md:line-clamp-4">
                  {project.description}
                </p>
              </div>

              {/* ACTION BUTTONS - MOBILE OPTIMIZED */}
              <div className="border-t border-white/10 pt-3 md:pt-4 flex justify-between items-center text-[10px] md:text-xs font-mono text-gray-500 uppercase">
                {project.confidential ? (
                  <>
                    <div className="flex items-center gap-1.5 md:gap-2 text-red-400">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="hidden sm:inline">Restricted</span>
                    </div>
                    <span className="text-[9px] md:text-xs">Pro. ID // {project.id}</span>
                  </>
                ) : project.inProgress ? (
                  <>
                    <a
                      href={project.links?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded transition-colors text-white text-[10px] md:text-xs"
                    >
                      <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      CODE
                    </a>
                    <span className="hidden sm:inline text-[9px] md:text-xs">Pro. ID // {project.id}</span>
                  </>
                ) : (
                  <>
                    <div className="flex gap-1.5 md:gap-2">
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded transition-colors text-white text-[10px] md:text-xs"
                        >
                          <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          <span className="hidden sm:inline">CODE</span>
                        </a>
                      )}
                      {project.links?.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-racing-red hover:bg-red-600 text-white rounded transition-colors text-[10px] md:text-xs"
                        >
                          <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="hidden sm:inline">DEMO</span>
                        </a>
                      )}
                      {project.links?.download && (
                        <a
                          href={project.links.download}
                          className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded transition-colors text-white text-[10px] md:text-xs"
                        >
                          <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span className="hidden sm:inline">APK</span>
                        </a>
                      )}
                    </div>
                    <span className="hidden sm:inline group-hover:translate-x-2 transition-transform duration-300 text-white font-bold text-[9px] md:text-xs">Pro. ID // {project.id}</span>
                  </>
                )}
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
        .bg-racing-red {
          background-color: #ff0000;
        }
      `}</style>
    </section>
  );
}