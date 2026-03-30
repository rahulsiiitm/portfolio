import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Code2, Cpu, Globe, Lock, Terminal } from "lucide-react";
import projectsData from "../../data/projects.json";

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 pt-32 pb-20 px-4 md:px-8 lg:px-16 font-sans relative overflow-hidden">
      
      {/* --- TILTED 3D GRID BACKGROUND (Matches Case Study) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center perspective-[2000px]">
        <div className="absolute -top-[20%] w-[300vw] h-[150vh]"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
               backgroundSize: '50px 50px',
               transform: 'rotateX(75deg) translateY(-200px) translateZ(-200px)',
               transformOrigin: 'top center',
               maskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)',
               WebkitMaskImage: 'radial-gradient(ellipse at top, black 20%, transparent 70%)'
             }}>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* --- PAGE HEADER --- */}
        <header className="mb-16">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-400 hover:text-red-600 mb-8 transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Base
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-10">
            <div>
              <h1 className="text-7xl md:text-9xl font-ammonite lowercase leading-none tracking-tight text-zinc-900">
                archive<span className="text-red-600">.</span>
              </h1>
              <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-400 font-black">
                System Directory // Complete Project Log 2023—2026
              </p>
            </div>
            <div className="text-left md:text-right">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1">Status</span>
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest flex items-center gap-2 md:justify-end">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
                    All Systems Operational
                </span>
            </div>
          </div>
        </header>

        {/* --- TECHNICAL LIST (MANIFEST) --- */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
                <th className="py-4 font-bold">Year</th>
                <th className="py-4 font-bold">Project</th>
                <th className="py-4 font-bold hidden md:table-cell">Category</th>
                <th className="py-4 font-bold hidden lg:table-cell">Tech Stack</th>
                <th className="py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {projectsData.map((project) => (
                <tr key={project.slug} className="group hover:bg-white transition-colors">
                  <td className="py-6 font-mono text-xs text-zinc-400 font-bold">
                    {project.year || "2024"}
                  </td>
                  <td className="py-6">
                    <Link href={`/projects/${project.slug}`} className="block">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter group-hover:text-red-600 transition-colors">
                                {project.title}
                            </h3>
                            {project.links === null && (
                                <Lock size={12} className="text-zinc-300" />
                            )}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1 md:hidden">
                            {project.category || "Uncategorized"}
                        </p>
                    </Link>
                  </td>
                  <td className="py-6 hidden md:table-cell">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                        {project.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-6 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map(tech => (
                        <span key={tech} className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <Link 
                        href={`/projects/${project.slug}`} 
                        className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest bg-zinc-900 text-white px-4 py-2 rounded-sm hover:bg-red-600 transition-all shadow-sm"
                    >
                        View <ArrowUpRight size={12} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- FOOTER SPECS --- */}
        <footer className="mt-20 pt-10 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Total Modules</span>
                    <span className="text-lg font-black italic">{projectsData.length.toString().padStart(2, '0')}</span>
                </div>
                <div className="w-px h-8 bg-zinc-200"></div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Core Career</span>
                    <span className="text-lg font-black italic uppercase">AI / ML</span>
                </div>
            </div>
            
            <div className="flex gap-4">
                <div className="p-2 border border-zinc-200 rounded-sm text-zinc-400">
                    <Globe size={16} />
                </div>
                <div className="p-2 border border-zinc-200 rounded-sm text-zinc-400">
                    <Terminal size={16} />
                </div>
                <div className="p-2 border border-zinc-200 rounded-sm text-zinc-400">
                    <Cpu size={16} />
                </div>
            </div>
        </footer>
      </div>
    </main>
  );
}