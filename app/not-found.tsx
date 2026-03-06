"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const rafRef = useRef<number>(0);

  const LOG_LINES = [
    "CAM_04 // FRONT_WING_CAM",
    "SIGNAL LOST",
    "attempting reconnect...",
    "route: NOT FOUND [404]",
    "DRIVER: R.SHARMA // CAR 21",
    "█████████ NO SIGNAL █████████",
  ];

  // Reveal log lines one by one
  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i < LOG_LINES.length) {
        setLines(prev => [...prev, LOG_LINES[i++]]);
        setTimeout(next, 260 + Math.random() * 200);
      }
    };
    const t = setTimeout(next, 400);
    return () => clearTimeout(t);
  }, []);

  // Show content after brief delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Static noise canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;

    const draw = () => {
      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      // Base static noise
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() > 0.85 ? Math.floor(Math.random() * 80) : 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);

      // Scanlines
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }

      // Random horizontal glitch bars
      if (Math.random() > 0.7) {
        const barY = Math.random() * height;
        const barH = 2 + Math.random() * 18;
        const shift = (Math.random() - 0.5) * 40;
        ctx.drawImage(canvas, 0, barY, width, barH, shift, barY, width, barH);

        if (Math.random() > 0.6) {
          ctx.fillStyle = `rgba(255,0,0,${Math.random() * 0.15})`;
          ctx.fillRect(0, barY, width, barH);
        }
      }

      // Vertical tear
      if (frame % 40 < 3) {
        const tearX = Math.random() * width;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`;
        ctx.fillRect(tearX, 0, 1 + Math.random() * 3, height);
      }

      frame++;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">

      {/* Static canvas — full background */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      />

      {/* Dark vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* HUD corners */}
      {(["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"] as const).map((pos, i) => (
        <div key={i} aria-hidden className={`absolute ${pos} w-8 h-8 pointer-events-none`}>
          <div className={`absolute w-full h-[2px] bg-white/30 ${i < 2 ? "top-0" : "bottom-0"}`} />
          <div className={`absolute h-full w-[2px] bg-white/30 ${i % 2 === 0 ? "left-0" : "right-0"}`} />
        </div>
      ))}

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-3 text-[10px] font-mono tracking-[0.25em] uppercase border-b border-white/10 text-white/40">
        <span>CAM 04 // FW</span>
        <span className="text-red-500 animate-pulse font-bold">● REC</span>
        <span>NO SIGNAL</span>
      </div>

      {/* Centre content */}
      <div
        className="relative z-10 flex flex-col items-center text-center px-6 transition-opacity duration-700"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {/* Giant 404 */}
        <div className="relative mb-4">
          <h1
            className="text-[28vw] md:text-[22rem] font-black italic leading-none tracking-tighter text-white/90"
            style={{
              textShadow: "3px 0 #ff0000, -3px 0 rgba(0,255,255,0.4)",
              filter: "blur(0.4px)",
            }}
          >
            404
          </h1>
          <h1
            aria-hidden
            className="absolute inset-0 text-[28vw] md:text-[22rem] font-black italic leading-none tracking-tighter text-red-600/20 pointer-events-none"
            style={{ transform: "translate(6px, -2px)" }}
          >
            404
          </h1>
        </div>

        {/* NO SIGNAL stamp */}
        <div className="mb-8 px-4 py-1.5 border-2 border-white/20 rotate-[-1.5deg]">
          <span className="font-mono text-xs md:text-sm tracking-[0.5em] uppercase text-white/50 font-bold">
            NO SIGNAL
          </span>
        </div>

        {/* Terminal log */}
        <div className="w-full max-w-xs mb-10 text-left font-mono text-[10px] tracking-wider space-y-1">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                line.includes("NOT FOUND") || line.includes("SIGNAL")
                  ? "text-red-500"
                  : line.includes("DRIVER")
                  ? "text-white/80"
                  : "text-white/35"
              }
            >
              {i === lines.length - 1 ? `> ${line}` : `  ${line}`}
            </div>
          ))}
          {lines.length < LOG_LINES.length && (
            <div className="text-white/30 animate-pulse">  _</div>
          )}
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white border border-white/20 hover:border-white/60 px-8 py-3 transition-all duration-300 hover:bg-white/5"
        >
          ← RETURN TO BASE
        </Link>
      </div>

      {/* Bottom HUD bar */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-8 py-3 text-[9px] font-mono tracking-[0.2em] uppercase border-t border-white/10 text-white/25">
        <span>© 2026 R.SHARMA</span>
        <span>CAR 21 // IIIT MANIPUR</span>
        <span>VER 2.0.4</span>
      </div>

    </main>
  );
}