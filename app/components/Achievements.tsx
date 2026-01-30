"use client";

const results = [
  {
    pos: "MOU", // Displaying MOU as the "Position" for impact
    label: "SIGNED PARTNERSHIP",
    event: "MANIPUR IT HUB",
    desc: "Collaborated to enhance agri-tech based application",
    gap: "OFFICIAL", 
    tyre: "S", 
    tyreColor: "border-red-500 text-red-500",
    accent: "bg-racing-red",
  },
  {
    pos: "P5", // "P5" implies Top 5 Finalist
    label: "FINALIST",
    event: "INTER-IIIT HACKATHON (UDBHAV) - 2026",
    desc: "Represented IIIT Manipur // Udbhav",
    gap: "QUALIFIED", 
    tyre: "M", 
    tyreColor: "border-yellow-400 text-yellow-400",
    accent: "bg-white",
  },
  {
    pos: "7.65",
    label: "ACADEMIC",
    event: "IIIT MANIPUR (CSE)",
    desc: "Current CGPA // Batch 2027",
    gap: "CONSISTENT",
    tyre: "H", 
    tyreColor: "border-white text-white",
    accent: "bg-gray-500",
  },
];

export default function Achievements() {
  return (
    <section id="achievements" className="bg-black text-white py-24 px-4 md:px-12 border-t border-white/10">
      
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER: CL16 Style */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
                <div className="flex items-center gap-3 mb-2">
                     <span className="px-2 py-0.5 bg-racing-red text-black text-[10px] font-black uppercase italic tracking-widest">
                        Scuderia Data
                     </span>
                     <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        Session: Telemetry
                     </span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]">
                    Grand <br/> <span className="text-transparent stroke-text">Prix</span>
                </h2>
            </div>
            
            <div className="mt-8 md:mt-0 opacity-20">
                <span className="text-9xl font-black italic text-transparent stroke-text">21</span>
            </div>
        </div>


        {/* THE DATA GRID */}
        <div className="flex flex-col gap-1">
            
            <div className="grid grid-cols-12 px-6 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-600 border-b border-white/10">
                <div className="col-span-3 md:col-span-2">Stat / Pos</div>
                <div className="col-span-5 md:col-span-6">Context</div>
                <div className="col-span-2 md:col-span-2 text-center">Class</div>
                <div className="col-span-2 md:col-span-2 text-right">Status</div>
            </div>

            {results.map((item, index) => (
                <div 
                    key={index} 
                    className="group relative grid grid-cols-12 items-center p-6 border-b border-white/10 overflow-hidden hover:border-transparent transition-colors duration-300"
                >
                    {/* HOVER BACKGROUND */}
                    <div className="absolute inset-0 bg-racing-red translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>

                    {/* 1. POSITION / STAT */}
                    <div className="relative z-10 col-span-3 md:col-span-2">
                        <span className="text-3xl md:text-5xl font-black italic text-white group-hover:text-black transition-colors duration-300">
                            {item.pos}
                        </span>
                    </div>

                    {/* 2. EVENT DETAILS */}
                    <div className="relative z-10 col-span-5 md:col-span-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1 h-4 ${item.accent} group-hover:bg-black transition-colors`}></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-black/60 transition-colors">
                                {item.label}
                            </span>
                        </div>
                        <h3 className="text-sm md:text-2xl font-black uppercase italic tracking-tight group-hover:text-black transition-colors">
                            {item.event}
                        </h3>
                        <p className="hidden md:block text-xs font-mono text-gray-500 mt-1 group-hover:text-black/70">
                            {item.desc}
                        </p>
                    </div>

                    {/* 3. CLASS / TYRE */}
                    <div className="relative z-10 col-span-2 md:col-span-2 flex justify-center">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold font-mono text-xs md:text-sm bg-black group-hover:bg-black group-hover:border-black group-hover:text-white transition-all duration-300 ${item.tyreColor}`}>
                            {item.tyre}
                        </div>
                    </div>

                    {/* 4. STATUS / GAP */}
                    <div className="relative z-10 col-span-2 md:col-span-2 text-right">
                        <span className={`font-mono text-xs md:text-sm font-bold uppercase tracking-wider group-hover:text-black ${item.gap === 'OFFICIAL' ? 'text-green-500' : 'text-white'}`}>
                            {item.gap}
                        </span>
                    </div>

                </div>
            ))}

        </div>

        {/* BOTTOM DECORATION */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/10 opacity-50">
             <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-8 h-2 ${i < 3 ? 'bg-green-500' : 'bg-gray-800'} skew-x-[-20deg]`}></div>
                ))}
             </div>
             <p className="font-mono text-[10px] uppercase tracking-widest">
                DRS: ENABLED
             </p>
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