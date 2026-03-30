import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Code2, Play, Terminal } from "lucide-react";
import projectsData from "../../../data/projects.json";

export async function generateStaticParams() {
  return projectsData.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.slug === resolvedParams.slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 pt-24 pb-20 px-4 md:px-8 lg:px-12 font-sans selection:bg-red-500 selection:text-white relative overflow-hidden">
      
      {/* --- TILTED 3D GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center perspective-[2000px]">
        <div className="absolute -top-[20%] w-[300vw] h-[150vh]"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
               backgroundSize: '60px 60px',
               transform: 'rotateX(75deg) translateY(-200px) translateZ(-200px)',
               transformOrigin: 'top center',
               maskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)',
               WebkitMaskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)'
             }}>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* --- TOP NAV --- */}
        <nav className="mb-8 flex justify-between items-center border-b border-zinc-200 pb-4">
          {/* CHANGED: href="/#projects" to href="/" */}
          <Link href="/" className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-red-600 transition-colors flex items-center gap-2 font-semibold">
            <ArrowLeft size={14} />
            Back to Projects
          </Link>
          <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400">
            Deployed // 2026
          </span>
        </nav>

        {/* --- HEADER ROW --- */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="lg:w-2/3">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-600">
                Case Study // {project.slug}
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-ammonite lowercase tracking-wide mb-4 leading-[0.9] text-zinc-900">
              {project.title}
            </h1>
            <p className="text-sm md:text-base text-zinc-600 font-medium max-w-2xl leading-relaxed">
              {project.tagline}
            </p>
          </div>

          <div className="lg:w-1/3 flex flex-wrap lg:justify-end gap-x-8 gap-y-4">
            {project.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-400 mb-1">{stat.label}</span>
                <span className="text-xl md:text-2xl font-black italic text-zinc-800 leading-none">{stat.value}</span>
              </div>
            ))}
          </div>
        </header>

        {/* --- MAIN CONTENT LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            <div className="relative w-full aspect-video bg-zinc-900 rounded-md overflow-hidden ring-1 ring-zinc-200 shadow-xl shadow-zinc-200/50 group">
              <div className="absolute top-3 left-3 flex items-center gap-2 z-10 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-mono font-bold text-white tracking-widest uppercase">DEMO_RECORDING</span>
              </div>
              
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-xs tracking-widest bg-zinc-900">
                      [ VIDEO ASSET REQUIRED ]
                  </div>
              </video>
            </div>

            <div className="pt-4 border-t border-zinc-200 bg-white/50 backdrop-blur-sm p-6 rounded-md ring-1 ring-zinc-100">
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-zinc-400 mb-3">02 // Architecture Execution</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {project.solution}
              </p>
            </div>

          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-md ring-1 ring-zinc-100">
              <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-red-600 mb-3">01 // The Problem Context</h3>
              <p className="text-sm text-zinc-700 leading-relaxed">
                {project.context}
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-200">
              <h3 className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 mb-3">System Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech: string) => (
                  <span key={tech} className="px-2.5 py-1 bg-white ring-1 ring-zinc-200 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-700 rounded-sm shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.codeSnippet && (
              <div className="flex-grow flex flex-col bg-[#0d1117] rounded-md overflow-hidden ring-1 ring-zinc-800 shadow-xl mt-2 min-h-[200px]">
                <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={12} />
                    core_module.ts
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                  </div>
                </div>
                <div className="p-5 overflow-auto text-[11px] font-mono leading-relaxed text-zinc-300 flex-grow scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                  <pre><code>{project.codeSnippet}</code></pre>
                </div>
              </div>
            )}

            {project.links && (
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" 
                     className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition-colors shadow-sm">
                    <Play size={14} />
                    Launch Demo
                  </a>
                )}
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" 
                     className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-zinc-900 ring-1 ring-zinc-200 rounded-md text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-50 transition-colors shadow-sm">
                    <Code2 size={14} />
                    Source Code
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}