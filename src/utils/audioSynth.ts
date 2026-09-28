/**
 * Clean Web Audio API Dembow Beat Loop Synthesizer
 * Emulates the pure dembow rhythm of Mora's "Pensabas"
 * 
 * Tempo: ~96 BPM
 * Pattern: Pure Dembow Rhythm (No vocals, only the pure signature beat loop)
 */

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let nextNoteTime = 0.0;
let currentStep = 0;
let timerId: number | any = null;

const BPM = 96;
const stepDuration = 60.0 / BPM / 4.0; // Duration of each 16th note step
const scheduleAheadTime = 0.1; // How far ahead to schedule audio (seconds)
const lookahead = 25.0; // How frequently to call scheduling function (milliseconds)

// Helper to create a synthesised Kick Drum element
function playKick(time: number, ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  // Frequency Sweep (Punchy bass kick)
  osc.frequency.setValueAtTime(160, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.15);
  
  // Volume envelope
  gain.gain.setValueAtTime(1.0, time);
  gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);
  
  osc.start(time);
  osc.stop(time + 0.25);
}

// Helper to create the classic Dembow Snare/Chak clapping sound
// Recreated with filtered noise which sounds like a crisp urban percussion element
function playSnare(time: number, ctx: AudioContext) {
  // 1. Noise channel for crisp high-end
  const bufferSize = ctx.sampleRate * 0.15; // 150ms of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1000, time);
  filter.Q.setValueAtTime(3.0, time);
  
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.5, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);
  
  noiseNode.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  
  // 2. Add an organic wooden click transient element
  const bodyOsc = ctx.createOscillator();
  const bodyGain = ctx.createGain();
  
  bodyOsc.type = "triangle";
  bodyOsc.frequency.setValueAtTime(320, time);
  bodyOsc.frequency.exponentialRampToValueAtTime(120, time + 0.06);
  
  bodyGain.gain.setValueAtTime(0.7, time);
  bodyGain.gain.exponentialRampToValueAtTime(0.01, time + 0.07);
  
  bodyOsc.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  
  // Play
  noiseNode.start(time);
  bodyOsc.start(time);
  
  noiseNode.stop(time + 0.15);
  bodyOsc.stop(time + 0.08);
}

// Helper to add a subtle high-hat to lock the rhythm in
function playHihat(time: number, ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  
  osc.type = "square";
  filter.type = "highpass";
  filter.frequency.setValueAtTime(8000, time);
  
  gain.gain.setValueAtTime(0.08, time);
  gain.gain.exponentialRampToValueAtTime(0.005, time + 0.035);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(time);
  osc.stop(time + 0.04);
}

// The core dembow step sequencer
// Decides which instrument to trigger at each step
function scheduleStep(step: number, time: number, ctx: AudioContext) {
  // THE COMPASS: DEMBOW GRID PATTERN
  // K = Kick, S = Snare, H = Hihat
  // Steps: 0, 1, 2,  3, 4, 5,  6, 7,  8, 9, 10, 11, 12, 13, 14, 15
  // Beats: K, -, -,  S, -, -,  S, H,  K, -,  -,  S,  -,  -,  S,  H
  
  const isKick = (step === 0 || step === 8);
  const isSnare = (step === 3 || step === 6 || step === 11 || step === 14);
  const isHihat = (step === 2 || step === 7 || step === 10 || step === 15);
  
  if (isKick) {
    playKick(time, ctx);
  }
  
  if (isSnare) {
    playSnare(time, ctx);
  }
  
  if (isHihat) {
    playHihat(time, ctx);
  }
}

// Sequencer loop controller
function scheduler() {
  if (!audioCtx) return;
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
    scheduleStep(currentStep, nextNoteTime, audioCtx);
    
    // Advance time and cycle through the 16 steps
    nextNoteTime += stepDuration;
    currentStep = (currentStep + 1) % 16;
  }
  timerId = setTimeout(scheduler, lookahead);
}

// Public API
export function startAmbientMusic() {
  if (typeof window === "undefined") return;
  if (isPlaying) return;
  
  try {
    // Initialise audio context
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    
    isPlaying = true;
    nextNoteTime = audioCtx.currentTime + 0.05;
    currentStep = 0;
    
    scheduler();
  } catch (error) {
    console.error("Synthesizer failed to spin up gracefully:", error);
  }
}

export function stopAmbientMusic() {
  isPlaying = false;
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  if (audioCtx) {
    audioCtx.close().catch(() => {});
    audioCtx = null;
  }
}
