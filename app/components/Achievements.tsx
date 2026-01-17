"use client";

const results = [
  {
    pos: "P1",
    event: "SMART INDIA HACKATHON",
    detail: "Internal Round Winner // AgriHive Project",
    team: "Team Leader",
    status: "QUALIFIED",
    color: "text-yellow-400", // Gold feel
  },
  {
    pos: "P5",
    event: "INTER-IIIT HACKATHON",
    detail: "Udbhav Portal Development // 500+ Users",
    team: "Solo Dev",
    status: "FINALIST",
    color: "text-gray-300", // Silver/White
  },
  {
    pos: "3.8",
    event: "B.TECH CSE (IIIT MANIPUR)",
    detail: "Specialization: AI & Computer Vision",
    team: "Batch 2027",
    status: "DISTINCTION",
    color: "text-racing-red", // Team Red
  },
];

export default function Achievements() {
  return (
    <section className="bg-black text-white py-32 px-4 md:px-12 border-t border-white/10">
      
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER: F1 TV Graphic Style */}
        <div className="flex items-center justify-between mb-8 border-b-4 border-racing-red pb-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
                Official <span className="text-transparent stroke-text">Classification</span>
            </h2>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-racing-red animate-pulse rounded-full"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">
                    Session Final
                </span>
            </div>
        </div>

        {/* COLUMN HEADERS */}
        <div className="grid grid-cols-12 gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-4 px-4">
            <div className="col-span-2 md:col-span-1">Pos</div>
            <div className="col-span-6 md:col-span-5">Event / Driver</div>
            <div className="hidden md:block md:col-span-4">Details</div>
            <div className="col-span-4 md:col-span-2 text-right">Status</div>
        </div>

        {/* THE RESULTS TABLE */}
        <div className="flex flex-col gap-2">
            {results.map((item, index) => (
                <div 
                    key={index} 
                    className="group relative grid grid-cols-12 gap-4 items-center bg-white/5 border border-white/5 p-4 md:py-6 hover:bg-white hover:border-white transition-all duration-300"
                >
                    
                    {/* Position (P1, P2...) */}
                    <div className={`col-span-2 md:col-span-1 text-2xl md:text-3xl font-black italic ${item.color} group-hover:text-black`}>
                        {item.pos}
                    </div>

                    {/* Event Name */}
                    <div className="col-span-6 md:col-span-5 flex flex-col">
                        <span className="text-lg md:text-xl font-bold uppercase tracking-tight group-hover:text-black transition-colors">
                            {item.event}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-gray-500 group-hover:text-black/60">
                            {item.team}
                        </span>
                    </div>

                    {/* Technical Details (Hidden on mobile) */}
                    <div className="hidden md:block md:col-span-4 text-xs font-mono font-medium text-gray-400 group-hover:text-black/70">
                        {item.detail}
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-4 md:col-span-2 text-right">
                        <span className="inline-block px-2 py-1 bg-black/50 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-white group-hover:bg-racing-red group-hover:text-white group-hover:border-transparent transition-all">
                            {item.status}
                        </span>
                    </div>

                    {/* Little Red Decor Bar on Left */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-racing-red opacity-0 group-hover:opacity-100 transition-opacity"></div>

                </div>
            ))}
        </div>
        
        {/* FOOTER NOTE */}
        <div className="mt-8 text-right">
             <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                /// Certified by FIA (Future Intelligence Agency)
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