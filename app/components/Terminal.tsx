"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import projectsData from "../../data/projects.json";
import experienceData from "../../data/experience.json";
import achievementsData from "../../data/achievements.json";

type LogEntry = {
    type: "input" | "output" | "error" | "system";
    text: string;
};

export default function Terminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<LogEntry[]>([
        { type: "system", text: "IRIS_LOGIC_TERMINAL v1.0.4" },
        { type: "system", text: "TYPE 'HELP' FOR AVAILABLE COMMANDS" },
    ]);
    
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of terminal
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Handle Keyboard Shortcut (Ctrl + ` or ESC)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
            if (e.ctrlKey && e.key === "`") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when terminal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const addLog = (text: string, type: LogEntry["type"] = "output") => {
        setLogs(prev => [...prev, { type, text }]);
    };

    const processCommand = (cmd: string) => {
        const fullCmd = cmd.trim().toLowerCase();
        const [base, ...args] = fullCmd.split(" ");
        
        addLog(`> ${cmd}`, "input");

        switch (base) {
            case "help":
                addLog("AVAILABLE_COMMANDS:");
                addLog("  FIND [query]  - SEARCH PROJECTS/SKILLS");
                addLog("  STATUS        - DUMP CAREER TELEMETRY");
                addLog("  RESUME        - EXTRACT RESUME FILTRATE");
                addLog("  NAV [id]      - JUMP TO SECTION (ABOUT, PROJECTS, EXP)");
                addLog("  CLEAR         - WIPE TERMINAL BUFFER");
                addLog("  EXIT          - CLOSE CONSOLE");
                break;

            case "clear":
                setLogs([]);
                break;

            case "exit":
                setIsOpen(false);
                break;

            case "resume":
                addLog("EXTRACTING_RESUME_DATA...", "system");
                window.open("https://drive.google.com/file/d/1iDo79Pjt8dvHsPlNpKoUCsbWNcSxSJ9r/view?usp=sharing", "_blank");
                break;

            case "status":
                addLog("--- SYSTEM_TELEMETRY ---", "system");
                addLog(`ROLE: FULL_STACK / AI_ENGINEER`);
                addLog(`GPA: ${achievementsData[2]?.pos || "7.65"}`);
                addLog(`ACTIVE_PROJECTS: ${projectsData.length}`);
                addLog(`LOCATION: IMPHAL_IN`);
                break;

            case "find":
                const query = args.join(" ");
                if (!query) {
                    addLog("ERROR: QUERY REQUIRED", "error");
                    break;
                }
                const matches = projectsData.filter(p => 
                    p.title.toLowerCase().includes(query) || 
                    p.stack.some(s => s.toLowerCase().includes(query)) ||
                    p.category.toLowerCase().includes(query)
                );
                
                if (matches.length > 0) {
                    addLog(`MATCHES_FOUND: ${matches.length}`, "system");
                    matches.forEach(m => addLog(`  - ${m.title} [${m.category}]`));
                    // Scroll to projects section if found
                    const projectsSection = document.getElementById("projects");
                    if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth" });
                } else {
                    addLog(`ZERO_RESULTS_FOR: ${query}`, "error");
                }
                break;

            case "nav":
                const target = args[0];
                const el = document.getElementById(target);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                    addLog(`NAVIGATING_TO: ${target.toUpperCase()}`, "system");
                } else {
                    addLog(`ERROR: TARGET '${target}' NOT_FOUND`, "error");
                }
                break;

            default:
                addLog(`COMMAND_NOT_RECOGNIZED: ${base}`, "error");
                addLog("TYPE 'HELP' FOR ASSISTANCE");
        }
        setInput("");
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[95vw] max-w-2xl pointer-events-none">
            
            {/* TERMINAL BAR (Trigger) */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto mx-auto flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full group hover:border-red-500/50 transition-all duration-300"
                >
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-mono font-bold text-white/60 tracking-[0.2em] group-hover:text-white">
                        IRIS_LOGIC_TERMINAL // [CTRL + `]
                    </span>
                </button>
            )}

            {/* EXPANDED CONSOLE */}
            {isOpen && (
                <div 
                    ref={terminalRef}
                    className="pointer-events-auto flex flex-col w-full h-[40vh] bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">CONSOLE_BUFFER</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                            <span className="text-xs font-mono">[ESC]</span>
                        </button>
                    </div>

                    {/* Output Buffer */}
                    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed custom-scrollbar">
                        {logs.map((log, i) => (
                            <div key={i} className={`mb-1 ${
                                log.type === "input" ? "text-white" : 
                                log.type === "system" ? "text-red-500 font-bold" : 
                                log.type === "error" ? "text-amber-500" : "text-gray-400"
                            }`}>
                                {log.text}
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 flex items-center gap-2">
                        <span className="text-red-500 font-bold font-mono text-xs">IRIS_ {'>'}</span>
                        <input 
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && processCommand(input)}
                            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs placeholder:text-white/10"
                            placeholder="AWAITING_COMMAND..."
                        />
                    </div>
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
