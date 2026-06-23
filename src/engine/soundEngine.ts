// Web Audio API sound engine — no audio files needed, works on iOS Safari.
// AudioContext is created lazily on first user interaction to satisfy browser autoplay policy.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function gain(ac: AudioContext, value: number, time: number): GainNode {
  const g = ac.createGain();
  g.gain.setValueAtTime(value, time);
  g.connect(ac.destination);
  return g;
}

function osc(
  ac: AudioContext,
  type: OscillatorType,
  freq: number,
  startTime: number,
  duration: number,
  gainStart: number,
  gainEnd: number
): void {
  const g = gain(ac, gainStart, startTime);
  g.gain.exponentialRampToValueAtTime(Math.max(gainEnd, 0.0001), startTime + duration);

  const o = ac.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, startTime);
  o.connect(g);
  o.start(startTime);
  o.stop(startTime + duration);
}

// Soft wooden "tuk" — piece placed on board
export function playMove(): void {
  const ac = getCtx();
  const t = ac.currentTime;

  // Low thud
  osc(ac, 'sine', 180, t, 0.08, 0.35, 0.001);
  // Click transient
  osc(ac, 'square', 900, t, 0.025, 0.08, 0.001);
}

// Sharp "klak" — piece captured
export function playCapture(): void {
  const ac = getCtx();
  const t = ac.currentTime;

  osc(ac, 'sawtooth', 320, t, 0.06, 0.4, 0.001);
  osc(ac, 'square', 640, t, 0.04, 0.2, 0.001);
  osc(ac, 'sine', 160, t, 0.12, 0.25, 0.001);
}

// Two ascending tones — promotion to king
export function playPromotion(): void {
  const ac = getCtx();
  const t = ac.currentTime;

  osc(ac, 'sine', 523, t, 0.18, 0.3, 0.001);        // C5
  osc(ac, 'sine', 784, t + 0.15, 0.25, 0.35, 0.001); // G5
  osc(ac, 'triangle', 1046, t + 0.28, 0.3, 0.3, 0.001); // C6
}

// Victory fanfare — game won
export function playWin(): void {
  const ac = getCtx();
  const t = ac.currentTime;

  const notes = [523, 659, 784, 1046]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    osc(ac, 'sine', freq, t + i * 0.12, 0.3, 0.4, 0.001);
    osc(ac, 'triangle', freq * 2, t + i * 0.12, 0.2, 0.1, 0.001);
  });
}

// Soft neutral double tone — draw
export function playDraw(): void {
  const ac = getCtx();
  const t = ac.currentTime;

  osc(ac, 'sine', 440, t, 0.25, 0.3, 0.001);        // A4
  osc(ac, 'sine', 370, t + 0.2, 0.3, 0.25, 0.001);  // F#4
}
