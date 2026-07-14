// Lightweight synthesized SFX — zero asset files, fits the ZERO hacker aesthetic
let ctx: AudioContext | null = null;
const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
};

function blip(freq: number, duration: number, type: OscillatorType = "square", gain = 0.04) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  amp.gain.setValueAtTime(gain, c.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(amp).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  open: () => { blip(220, 0.08); setTimeout(() => blip(440, 0.1), 60); },
  close: () => { blip(440, 0.06); setTimeout(() => blip(180, 0.08), 40); },
  send: () => blip(660, 0.05, "sine", 0.03),
  receive: () => { blip(320, 0.04, "sine", 0.03); setTimeout(() => blip(500, 0.06, "sine", 0.03), 50); },
  key: () => blip(900 + Math.random() * 200, 0.015, "square", 0.015),
};