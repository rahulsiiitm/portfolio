// Lightweight synthesized SFX — zero asset files, fits the ZERO hacker aesthetic
let ctx: AudioContext | null = null;
const getCtx = () => {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function blip(freq: number, duration: number, type: OscillatorType = "square", gain = 0.15) {
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
  open: () => { blip(220, 0.08, "square", 0.1); setTimeout(() => blip(440, 0.1, "square", 0.1), 60); },
  close: () => { blip(440, 0.06, "square", 0.1); setTimeout(() => blip(180, 0.08, "square", 0.1), 40); },
  send: () => blip(660, 0.08, "sine", 0.25),
  receive: () => { blip(320, 0.05, "sine", 0.2); setTimeout(() => blip(500, 0.08, "sine", 0.2), 60); },
  key: () => blip(900 + Math.random() * 200, 0.02, "square", 0.05),
};