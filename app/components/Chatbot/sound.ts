// Lightweight synthesized SFX for compact ZERO UI feedback.
let ctx: AudioContext | null = null;
const getCtx = () => {
  if (typeof window === "undefined") return null;
  const AudioContextConstructor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!ctx) ctx = new AudioContextConstructor();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

function tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.08, slideTo?: number) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + duration);
  amp.gain.setValueAtTime(0.0001, c.currentTime);
  amp.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(amp).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  open: () => { tone(120, 0.16, "triangle", 0.075, 260); setTimeout(() => tone(360, 0.09, "sine", 0.045), 95); },
  close: () => { tone(260, 0.12, "triangle", 0.055, 120); },
  send: () => tone(540, 0.1, "sine", 0.08, 760),
  receive: () => { tone(280, 0.08, "sine", 0.055, 420); setTimeout(() => tone(520, 0.07, "triangle", 0.035), 55); },
  key: () => tone(700 + Math.random() * 80, 0.018, "sine", 0.018),
};
