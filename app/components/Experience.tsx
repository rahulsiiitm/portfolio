"use client";
import { useRef } from "react";

const experiences = [
    {
        id: "01",
        period: "JUN - AUG 2025",
        role: "UI/UX Intern",
        company: "AliveHire",
        location: "Remote",
        desc: "Designed high-fidelity wireframes and interactive prototypes. Collaborated with developers to implement pixel-perfect user interfaces for the core recruitment platform.",
        tags: ["Figma", "Prototyping", "UX Research"],
    },
    {
        id: "02",
        period: "2023 - PRESENT",
        role: "AI & App Developer",
        company: "Freelance / Academic",
        location: "Manipur, IN",
        desc: "Developing AI-integrated web and mobile apps. Built solutions for agriculture (AgriHive), retail guidance, and event management.",
        tech: ["Flutter", "TensorFlow", "Firebase"],
        tags: ["Flutter", "TensorFlow", "Firebase"],
    },
];

export default function Experience() {
    return (
        <section id="experience" className="bg-black text-white py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 border-t border-white/10">

            <div className="max-w-7xl mx-auto">

                {/* HEADER - MOBILE OPTIMIZED */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-20 md:mb-24">
                    <h2 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
                        Track <br /> <span className="text-transparent stroke-text">Record</span>
                    </h2>
                    <div className="text-left md:text-right mt-6 md:mt-0">
                        <p className="text-[10px] md:text-xs font-mono text-gray-500 mb-1.5 md:mb-2">/// CAREER TRAJECTORY</p>
                        <div className="flex items-center justify-start md:justify-end gap-2">
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-racing-red rounded-full animate-pulse"></span>
                            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-racing-red">Live Status</span>
                        </div>
                    </div>
                </div>

                {/* THE VELOCITY LIST - MOBILE OPTIMIZED */}
                <div className="flex flex-col">
                    {experiences.map((exp, index) => (
                        <div
                            key={index}
                            className="group relative border-t border-white/20 hover:border-transparent transition-colors duration-300"
                        >

                            {/* HOVER BACKGROUND (Expands from center) */}
                            <div className="absolute inset-0 bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center ease-out z-0"></div>

                            <div className="relative z-10 w-full py-8 sm:py-10 md:py-16 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-start md:items-baseline justify-between gap-4 sm:gap-6 md:gap-0 cursor-default">

                                {/* LEFT: Year & ID - MOBILE OPTIMIZED */}
                                <div className="w-full md:w-1/4 flex items-baseline gap-3 md:gap-4">
                                    <span className="text-[10px] md:text-xs font-bold text-racing-red group-hover:text-black tracking-widest">
                                        /{exp.id}
                                    </span>
                                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-white/40 group-hover:text-black transition-colors">
                                        {exp.period}
                                    </span>
                                </div>

                                {/* CENTER: Role & Company - MOBILE OPTIMIZED */}
                                <div className="w-full md:w-2/4">
                                    <h3 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase leading-[0.9] mb-1.5 md:mb-2 text-white group-hover:text-black transition-colors duration-300">
                                        {exp.role}
                                    </h3>
                                    <p className="text-xs md:text-sm font-mono text-gray-400 group-hover:text-black/60 uppercase tracking-wider transition-colors">
                                        @ {exp.company}
                                    </p>
                                </div>

                                {/* RIGHT: Arrow Icon - MOBILE OPTIMIZED */}
                                <div className="w-full md:w-1/4 flex justify-start md:justify-end items-center">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-black group-hover:rotate-[-45deg] transition-all duration-500">
                                        <span className="text-lg md:text-xl text-white group-hover:text-black">→</span>
                                    </div>
                                </div>

                            </div>

                            {/* HIDDEN CONTENT (Reveals on Hover) - MOBILE OPTIMIZED */}
                            <div className="relative z-10 grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                                <div className="overflow-hidden">
                                    <div className="pb-10 sm:pb-12 md:pb-16 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row md:ml-[25%] gap-6 sm:gap-7 md:gap-8">

                                        {/* Description - MOBILE OPTIMIZED */}
                                        <p className="text-black/70 text-base sm:text-lg font-medium leading-relaxed max-w-lg">
                                            {exp.desc}
                                        </p>

                                        {/* Tags - MOBILE OPTIMIZED */}
                                        <div className="flex flex-wrap gap-1.5 md:gap-2 content-start">
                                            {exp.tags.map((tag, i) => (
                                                <span key={i} className="px-2.5 md:px-3 py-1 border border-black/20 rounded-full text-[11px] md:text-xs font-bold uppercase text-black tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* Final Border */}
                    <div className="border-t border-white/20"></div>

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