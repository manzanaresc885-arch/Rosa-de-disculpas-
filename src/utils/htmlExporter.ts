import { ApologyConfig } from '../types';

export function exportApologyToHtml(config: ApologyConfig, letterText: string, roseMood: 'romantic' | 'celestial' | 'aurora' | 'sunset'): string {
  const friendName = config.friendName.trim() || 'Amiga';
  const displayTitle = `Una rosa para ti, ${friendName}`;
  const escFriendName = friendName.replace(/"/g, '\\"');

  // Map mood values to colors and descriptions for the p5 standalone application
  const moodMap = {
    romantic: {
      name: 'Rosa Silvestre Clásica 🌸',
      description: 'Pétalos rosados carmín con rubor natural',
      bgGlow: 'rgba(65, 15, 35, 0.45)',
      gradientText: 'from-pink-400 to-rose-400'
    },
    celestial: {
      name: 'Rosa Rosada Celestial ✨',
      description: 'Tonos rosa pastel con destellos de estrellas',
      bgGlow: 'rgba(40, 20, 50, 0.45)',
      gradientText: 'from-purple-400 to-amber-300'
    },
    aurora: {
      name: 'Rosa Aurora de Reencuentro 💜',
      description: 'Matices violetas-rosas con rocío de luz mística',
      bgGlow: 'rgba(15, 45, 55, 0.45)',
      gradientText: 'from-teal-400 to-fuchsia-400'
    },
    sunset: {
      name: 'Rosa Atardecer Coral 🌅',
      description: 'Rosa cálido intenso con reflejos ámbar y sol',
      bgGlow: 'rgba(55, 20, 20, 0.45)',
      gradientText: 'from-amber-400 to-red-400'
    }
  };

  const selectedMood = moodMap[roseMood] || moodMap.romantic;

  // Render the promises list in HTML
  const promisesListItems = config.promisesForFuture.length > 0 
    ? config.promisesForFuture.map(p => `
      <div class="flex items-start bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 text-sm gap-3">
        <span class="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 shadow-md flex-shrink-0 mt-1.5 animate-pulse"></span>
        <span class="text-slate-300 leading-relaxed">${p}</span>
      </div>`).join('')
    : `<p class="text-xs text-slate-500 italic text-center">Un camino de crecimiento que caminaremos con el tiempo.</p>`;

  // Sanitizing the letterText output to insert safely in HTML template code
  const formattedLetterText = letterText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayTitle}</title>
  
  <!-- Premium Serenade Typography -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS Playback CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- p5.js Canvas Drawings Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ["Inter", "sans-serif"],
            serif: ["Playfair Display", "serif"],
            mono: ["JetBrains Mono", "monospace"],
          }
        }
      }
    };
  </script>

  <style>
    /* Styling adjustments */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.4);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(244, 63, 94, 0.35);
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(244, 63, 94, 0.6);
    }
    body {
      background-color: #030712;
      color: #f3f4f6;
      font-family: "Inter", sans-serif;
    }
    .custom-gradient-bg {
      background: radial-gradient(circle at center, ${selectedMood.bgGlow} 0%, rgba(3, 7, 18, 1) 75%);
    }
    .text-glow {
      text-shadow: 0 0 10px rgba(244, 63, 94, 0.3);
    }
  </style>
</head>
<body class="min-h-screen custom-gradient-bg flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">

  <!-- TOP DECORATIVE HEADER -->
  <header class="w-full px-6 py-4 border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-.1-8.716-.247m0 0A10.954 10.954 0 0112 3.75c2.78 0 5.38.45 7.843 1.258"></path></svg>
        </div>
        <div>
          <h1 class="text-md font-serif font-semibold tracking-tight bg-gradient-to-r from-rose-100 to-amber-100 bg-clip-text text-transparent">
            Una Rosa Para Mari 💗
          </h1>
          <p class="text-[9px] text-rose-300/60 font-mono tracking-widest uppercase">
            Arte Interactivo Programado para ${friendName}
          </p>
        </div>
      </div>

      <!-- ROMANTIC MUSIC CONTROLLER -->
      <button 
        id="music-btn"
        onclick="toggleMusic()"
        class="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-[11px] text-slate-300 rounded-full border border-slate-800 transition shadow-lg hover:shadow-rose-500/10 active:scale-95 cursor-pointer"
      >
        <svg class="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Escuchar Melodía Romántica 💕</span>
      </button>
    </div>
  </header>

  <!-- CORE DUAL PILL GRID -->
  <main class="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
    
    <!-- LEFT PILLAR: P5 ART DISPLAY CONTAINER -->
    <section class="col-span-1 lg:col-span-5 flex flex-col gap-6 sticky lg:top-8">
      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] font-mono text-pink-400 bg-pink-950/40 border border-pink-900/40 px-2.5 py-1 rounded-md self-start uppercase tracking-wider">
          Especialmente para ti
        </span>
        <h2 class="text-2xl font-serif font-bold text-white tracking-tight text-glow">
          El Florecer de la Rosa
        </h2>
        <p class="text-xs text-slate-400 leading-relaxed">
          He preparado esta rosa interactiva hecha con código y cariño. Mírala abrirse pétalo a pétalo. Puedes pasar el mouse encima o hacer clic para guiar destellos de luz dorada a su alrededor.
        </p>
      </div>

      <!-- Canvas Box Stage Wrapper -->
      <div class="flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl relative aspect-square w-full max-w-md mx-auto lg:max-w-none">
        
        <!-- Canvas target div -->
        <div id="canvas-container" class="flex-1 w-full min-h-[320px] relative"></div>

        <!-- Float Counter -->
        <div class="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 text-xs text-rose-300 font-mono tracking-tight pointer-events-none">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
          <span id="petal-counter-text">Generando composición...</span>
        </div>

        <!-- Mini controller row on bottom of canvas -->
        <div class="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between backdrop-blur-md">
          <div class="flex flex-col">
            <h4 class="text-white text-xs font-semibold flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400"></span>
              ${selectedMood.name}
            </h4>
            <p class="text-[10px] text-slate-400">${selectedMood.description}</p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Launch Sparkles -->
            <button 
              onclick="triggerLocalBurst()"
              class="bg-slate-850 hover:bg-slate-800 active:scale-95 text-pink-300 p-2 rounded-lg border border-slate-700/80 transition flex items-center justify-center cursor-pointer"
              title="Lanzar destellos de luz"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3.096 15.125 8.192 14.33 9 9.188l.813 5.143 5.096.795-5.096.778zM19.5 10.5l-.31-.969-1.02-.341 1.02-.34.31-.969.31.969 1.02.34-1.02.341-.31.969zm0 9l-.31-.969-1.02-.341 1.02-.34.31-.969.31.969 1.02.34-1.02.341-.31.969z"></path></svg>
            </button>

            <!-- Complete Rose -->
            <button 
              onclick="completeLocalSketch()"
              class="bg-gradient-to-r from-pink-650 to-rose-600 hover:from-pink-600 hover:to-rose-500 active:scale-95 text-white px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0.15)]"
              title="Abrir flor por completo"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Abrir Flor 🌹</span>
            </button>

            <!-- Reset Bloom -->
            <button 
              onclick="resetLocalSketch()"
              class="bg-slate-850 hover:bg-slate-800 active:scale-95 text-slate-300 p-2 rounded-lg border border-slate-700/80 transition flex items-center justify-center cursor-pointer"
              title="Ver florecer paso a paso"
            >
              <svg id="restart-icon" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"></path></svg>
            </button>
          </div>
        </div>

        <!-- Canvas progress bar -->
        <div class="w-full bg-slate-900 h-1">
          <div id="bloom-progress-bar" class="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 h-full transition-all duration-300 ease-out" style="width: 0%"></div>
        </div>
      </div>
    </section>

    <!-- RIGHT PILLAR: PARCHMENT PRESENTATION SYSTEM FOR THE APOLOGY -->
    <section class="col-span-1 lg:col-span-7 flex flex-col gap-6">
      
      <!-- LETTER CONTAINER -->
      <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 p-5 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div class="flex items-center justify-between border-b border-slate-850 pb-3.5 mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path></svg>
            <h3 class="font-serif font-bold text-white text-md">Carta de Corazón a Corazón</h3>
          </div>
          <span class="text-[10px] text-slate-500 font-mono">Formato Intransferible</span>
        </div>

        <!-- The beautiful scrollable letter box inside the page -->
        <div class="w-full bg-[#171420]/30 border border-slate-800 p-6 md:p-8 rounded-xl max-h-[500px] overflow-y-auto font-serif text-slate-200/90 leading-relaxed text-sm md:text-base whitespace-pre-wrap relative shadow-inner">
          ${formattedLetterText}
        </div>
      </div>

      <!-- FUTURE COMMITMENTS DISPLAY -->
      <div class="bg-slate-900/50 border border-slate-905 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
          <svg class="w-4.5 h-4.5 text-rose-450 animate-pulse" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499c-.105-.347-.492-.347-.597 0L8.711 9.61a.29.29 0 01-.176.17l-6.123.85c-.347.048-.485.474-.216.716l4.428 4.225a.29.29 0 01.075.23l-1.054 6.07c-.06.347.306.612.597.412l5.48-3.95a.29.29 0 01.29 0l5.48 3.95c.29.2 1.657-.065.597-.412l-1.054-6.07a.29.29 0 01.075-.23l4.428-4.225c.269-.242.13-.668-.216-.716l-6.123-.85a.29.29 0 01-.176-.17l-2.172-6.111z"></path></svg>
          <h3 class="font-serif font-bold text-white text-sm">Mis Mimos y Detalles Especiales 💕</h3>
        </div>
        <p class="text-xs text-slate-400">
          El cariño verdadero se demuestra con mimos sinceros. Abajo están las sorpresas y promesas que asumo con ilusión para consentirte siempre:
        </p>

        <!-- Commitments list rendered dynamically -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          ${promisesListItems}
        </div>
      </div>

    </section>
  </main>

  <!-- LUXURIOUS FOOTER -->
  <footer class="w-full px-6 py-6 border-t border-slate-800/40 bg-slate-950 text-center mt-12">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <p>© 2026 Rosa de Disculpas. Un obsequio artístico virtual.</p>
      <div class="flex items-center gap-4">
        <span class="font-serif text-slate-400 flex items-center gap-1.5 justify-center"><span class="text-rose-500 font-sans">♥</span> Por una amistad duradera</span>
      </div>
    </div>
  </footer>

  <!-- STANDALONE JS CORE ENGINE -->
  <script>
    // Global references for HTML interactions
    let p5Instance = null;

    // --- SOUND PADS EXPERT AUDIO SYNTHESIZER ---
    let audioCtx = null;

    function toggleMusic() {
      const btn = document.getElementById('music-btn');
      if (!audioCtx) {
        // Initialize & Start Web Audio Context
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
        playBackgroundSynthAmbient();
        btn.innerHTML = \`
          <svg class="w-3.5 h-3.5 text-green-400 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          <span class="text-emerald-400">Sonando Paz Celestial</span>
        \`;
      } else if (audioCtx.state === 'running') {
        audioCtx.suspend();
        btn.innerHTML = \`
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Continuar Música</span>
        \`;
      } else {
        audioCtx.resume();
        btn.innerHTML = \`
          <svg class="w-3.5 h-3.5 text-pink-400 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
          <span class="text-pink-400">Sonando Melodía Romántica ✨</span>
        \`;
      }
    }

    function playBackgroundSynthAmbient() {
      // Harmonic pentatonic peaceful frequencies (F Maj Pentatonic / Bb Maj)
      const pitches = [
        146.83, // D3
        174.61, // F3
        220.00, // A3
        261.63, // C4
        349.23, // F4
        440.00,  // A4
        523.25  // C5
      ];

      function scheduleNextChord() {
        if (!audioCtx || audioCtx.state !== 'running') {
          setTimeout(scheduleNextChord, 3000);
          return;
        }

        const now = audioCtx.currentTime;
        // Construct a slow evolving 3-note triad chord
        const count = 3 + Math.floor(Math.random() * 2);
        const selected = [];
        
        // Base low pitch
        selected.push(pitches[0] + (Math.random() > 0.6 ? 2.0 : -2.0));
        
        while (selected.length < count) {
          const randF = pitches[Math.floor(Math.random() * pitches.length)];
          if (!selected.includes(randF)) {
            selected.push(randF);
          }
        }

        selected.forEach((freq) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          
          // Slight detune for spatial chorus warmth
          osc.detune.setValueAtTime((Math.random() * 12) - 6, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, now);

          // Attack curve
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(0.035, now + 3.0);
          
          // Sustain and slow release curve
          gainNode.gain.setValueAtTime(0.035, now + 5.5);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 9.5);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioCtx.destination);

          osc.start(now);
          osc.stop(now + 10.0);
        });

        // Trigger next chord overlapping in 7.5 seconds
        setTimeout(scheduleNextChord, 7500);
      }

      scheduleNextChord();
    }


    // --- P5.JS PORTED DRAWING SYSTEM ---
    const s = (p) => {
      let petals = [];
      let particles = [];
      let activePetalIndex = 0;
      let petalProgress = 0.0;
      let progressOffset = 0.03;
      let bloomSpeed = 1.0;
      let isCompleted = false;

      class Sparkle {
        constructor(x, y, isBurst = false) {
          this.pos = p.createVector(x, y);
          if (isBurst) {
            const angle = p.random(p.TWO_PI);
            const r = p.random(2.5, 6.5);
            this.vel = p.createVector(p.cos(angle) * r, p.sin(angle) * r);
          } else {
            this.vel = p.createVector(p.random(-1.0, 1.0), p.random(-2.8, -0.6));
          }
          this.size = p.random(4, 8);
          this.maxLife = p.random(90, 160);
          this.life = this.maxLife;
          this.shimmerOffset = p.random(100);
          this.isHeart = p.random(1) > 0.30; // 70% chance of being a gorgeous floating heart
          this.color = getMoodParticleColor();
        }

        update() {
          this.pos.add(this.vel);
          if (this.isHeart) {
            // Zigzag upward motion
            const zigzagSpeed = 0.08;
            const zigzagAmp = 1.6;
            this.pos.x += p.sin(p.frameCount * zigzagSpeed + this.shimmerOffset) * zigzagAmp;
            this.vel.y = p.constrain(this.vel.y, -3.0, -0.8);
          } else {
            this.vel.x += p.sin(p.frameCount * 0.05 + this.shimmerOffset) * 0.04;
          }
          this.life -= p.random(0.7, 1.4);
        }

        draw() {
          p.push();
          const alpha = p.map(this.life, 0, this.maxLife, 0, 255);
          const sizeMod = p.map(this.life, 0, this.maxLife, 0, this.size);
          const glow = p.sin(p.frameCount * 0.1 + this.shimmerOffset) * 100 + 155;
          p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
          p.noStroke();
          
          if (this.isHeart) {
            // Palpitating/beating rhythm
            const pulseSpeed = 0.16;
            const wave = p.sin(p.frameCount * pulseSpeed + this.shimmerOffset);
            let heartbeatScale = 1.0;
            if (wave > 0) {
              heartbeatScale = 1.0 + Math.pow(wave, 3.5) * 0.42;
            } else {
              heartbeatScale = 1.0 + Math.abs(p.sin(p.frameCount * (pulseSpeed * 0.5) + this.shimmerOffset)) * 0.15;
            }

            const r = sizeMod * 1.6 * heartbeatScale + (glow > 210 ? 1.4 : 0);
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(p.sin(p.frameCount * 0.04 + this.shimmerOffset) * 0.4);
            p.beginShape();
            for (let angle = 0; angle < p.TWO_PI; angle += 0.15) {
              const xX = r * 16 * Math.pow(Math.sin(angle), 3) / 16;
              const yY = -r * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 16;
              p.vertex(xX, yY);
            }
            p.endShape(p.CLOSE);
            p.pop();
          } else {
            p.circle(this.pos.x, this.pos.y, sizeMod + (glow > 200 ? 1.8 : 0));
          }
          p.pop();
        }

        isDead() {
          return this.life <= 0;
        }
      }

      function getMoodParticleColor() {
        const mood = "${roseMood}";
        switch (mood) {
          case 'celestial':
            return p.random(1) > 0.5 ? p.color(255, 230, 160) : p.color(255, 180, 220);
          case 'aurora':
            return p.random(1) > 0.5 ? p.color(180, 240, 255) : p.color(230, 160, 255);
          case 'sunset':
            return p.random(1) > 0.5 ? p.color(255, 120, 80) : p.color(255, 190, 100);
          case 'romantic':
          default:
            return p.random(1) > 0.5 ? p.color(255, 150, 180, 200) : p.color(255, 80, 140, 180);
        }
      }

      function generateRosePetals() {
        petals = [];
        // Layer 0: Sepals (5)
        const greenSepalsCount = 5;
        for (let i = 0; i < greenSepalsCount; i++) {
          petals.push({
            layer: 0,
            angle: (p.TWO_PI / greenSepalsCount) * i + p.random(-0.1, 0.1),
            size: p.random(170, 200),
            tilt: p.random(-0.05, 0.05),
            aspectRatio: p.random(0.4, 0.6),
            flatness: p.random(0.3, 0.4)
          });
        }

        // Layer 1: Outermost Large Petals
        const outerCount = 6;
        for (let i = 0; i < outerCount; i++) {
          petals.push({
            layer: 1,
            angle: (p.TWO_PI / outerCount) * i + p.random(-0.2, 0.2),
            size: p.random(145, 175),
            tilt: p.random(-0.15, 0.15),
            aspectRatio: p.random(1.2, 1.45),
            flatness: p.random(0.65, 0.8)
          });
        }

        // Layer 2: Mid-Outer
        const midOuterCount = 6;
        for (let i = 0; i < midOuterCount; i++) {
          petals.push({
            layer: 2,
            angle: (p.TWO_PI / midOuterCount) * (i + 0.5) + p.random(-0.15, 0.15),
            size: p.random(110, 135),
            tilt: p.random(-0.12, 0.12),
            aspectRatio: p.random(1.1, 1.3),
            flatness: p.random(0.6, 0.75)
          });
        }

        // Layer 3: Mid-Inner
        const midInnerCount = 6;
        for (let i = 0; i < midInnerCount; i++) {
          petals.push({
            layer: 3,
            angle: (p.TWO_PI / midInnerCount) * i + p.random(-0.1, 0.1),
            size: p.random(80, 100),
            tilt: p.random(-0.1, 0.1),
            aspectRatio: p.random(1.0, 1.25),
            flatness: p.random(0.55, 0.7)
          });
        }

        // Layer 4: Inner Core
        const innerCount = 5;
        for (let i = 0; i < innerCount; i++) {
          petals.push({
            layer: 4,
            angle: (p.TWO_PI / innerCount) * (i + 0.3) + p.random(-0.08, 0.08),
            size: p.random(50, 70),
            tilt: p.random(-0.08, 0.08),
            aspectRatio: p.random(0.9, 1.15),
            flatness: p.random(0.5, 0.65)
          });
        }

        // Layer 5: Spiral Centre Tight Bud
        const spiralCount = 7;
        for (let i = 0; i < spiralCount; i++) {
          petals.push({
            layer: 5,
            angle: (p.TWO_PI / 4) * i + (i * 0.4),
            size: p.map(i, 0, spiralCount, 38, 12),
            tilt: p.random(-0.05, 0.05),
            aspectRatio: p.random(0.7, 0.95),
            flatness: p.random(0.4, 0.5)
          });
        }

        document.getElementById('petal-counter-text').innerText = \`Sembrado: Pétalo 0 / \${petals.length}\`;
      }

      function easeInOutQuart(x) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      }

      function drawRosePetal(petal, progress, col1, col2) {
        const t = easeInOutQuart(progress);
        const currentSize = petal.size * t;

        p.push();
        p.rotate(petal.angle);
        p.rotate(petal.tilt * p.sin(p.frameCount * 0.015));

        const baseWidth = currentSize * petal.aspectRatio;
        const tipY = -currentSize;

        const ctx = p.drawingContext;

        if (petal.layer === 0) {
          const grad = ctx.createLinearGradient(0, 0, 0, tipY);
          grad.addColorStop(0, 'rgba(40, 95, 45, 0.65)');
          grad.addColorStop(0.5, 'rgba(80, 130, 85, 0.45)');
          grad.addColorStop(1, 'rgba(150, 190, 120, 0.1)');
          ctx.fillStyle = grad;
          ctx.strokeStyle = 'rgba(60, 110, 65, 0.25)';
          ctx.lineWidth = 1;
        } else {
          const grad = ctx.createRadialGradient(0, 0, currentSize * 0.1, 0, tipY * 0.5, currentSize);
          
          const colHex1 = \`rgba(\${Math.floor(p.red(col1))}, \${Math.floor(p.green(col1))}, \${Math.floor(p.blue(col1))}, 1)\`;
          const colHex2 = \`rgba(\${Math.floor(p.red(col2))}, \${Math.floor(p.green(col2))}, \${Math.floor(p.blue(col2))}, 1)\`;

          grad.addColorStop(0, colHex1);
          grad.addColorStop(0.7, colHex2);

          let tipAccent = 'rgba(255, 235, 240, 0.95)';
          const mood = "${roseMood}";
          if (mood === 'celestial') tipAccent = 'rgba(255, 250, 210, 0.95)';
          if (mood === 'aurora') tipAccent = 'rgba(235, 255, 250, 0.95)';
          if (mood === 'sunset') tipAccent = 'rgba(255, 235, 180, 0.95)';

          grad.addColorStop(1, tipAccent);
          ctx.fillStyle = grad;

          ctx.strokeStyle = \`rgba(255, 140, 170, \${0.12 + (petal.layer * 0.03)})\`;
          ctx.lineWidth = 0.6 + petal.layer * 0.2;
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);

        const cpLeftX1 = -baseWidth * 0.65;
        const cpLeftY1 = -currentSize * (0.2 + petal.flatness * 0.1);
        const cpLeftX2 = -baseWidth * 1.1;
        const cpLeftY2 = -currentSize * 0.85;

        const cpRightX1 = baseWidth * 1.1;
        const cpRightY1 = -currentSize * 0.85;
        const cpRightX2 = baseWidth * 0.65;
        const cpRightY2 = -currentSize * (0.2 + petal.flatness * 0.1);

        ctx.bezierCurveTo(cpLeftX1, cpLeftY1, cpLeftX2, cpLeftY2, 0, tipY);
        ctx.bezierCurveTo(cpRightX1, cpRightY1, cpRightX2, cpRightY2, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (t > 0.4 && petal.layer > 0 && petal.layer < 5) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-baseWidth * 0.05, tipY * 0.3, baseWidth * 0.05, tipY * 0.7, 0, tipY * 0.9);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        p.pop();

        if (progress > 0.1 && progress < 0.98 && p.random(1) > 0.84) {
          const pAngle = petal.angle + petal.tilt * p.sin(p.frameCount * 0.015);
          const currentScale = p.constrain(p.min(p.width, p.height) / 530, 0.45, 1.0);
          const tX = p.width / 2 + p.sin(pAngle) * (tipY * currentScale) * 0.7;
          const tY = p.height / 2 + p.cos(pAngle) * (tipY * currentScale) * 0.7;
          particles.push(new Sparkle(tX, tY));
        }
      }

      p.setup = () => {
        const container = document.getElementById('canvas-container');
        const w = Math.max(container.clientWidth || 360, 320);
        const h = Math.max(container.clientHeight || 360, 320);
        let canvas = p.createCanvas(w, h);
        canvas.parent('canvas-container');
        p.pixelDensity(Math.min(window.devicePixelRatio, 2));
        generateRosePetals();
        
        // Start fully bloomed by default
        activePetalIndex = petals.length;
        petalProgress = 1.0;
        isCompleted = true;
        setTimeout(() => {
          document.getElementById('petal-counter-text').innerText = 'Rosa Florecida por Completo';
          document.getElementById('bloom-progress-bar').style.width = '100%';
        }, 100);
      };

      p.windowResized = () => {
        const container = document.getElementById('canvas-container');
        const w = Math.max(container.clientWidth || 360, 320);
        const h = Math.max(container.clientHeight || 360, 320);
        p.resizeCanvas(w, h);
      };

      p.draw = () => {
        p.background(10, 6, 12);
        
        // Draw background radial gradient glow
        p.push();
        p.noStroke();
        const rGlow = p.min(p.width, p.height) * 0.75;
        const ctxBg = p.drawingContext;
        const bgGrad = ctxBg.createRadialGradient(
          p.width / 2, p.height / 2, 10,
          p.width / 2, p.height / 2, rGlow
        );
        
        const mood = "${roseMood}";
        if (mood === 'celestial') {
          bgGrad.addColorStop(0, 'rgba(40, 20, 50, 0.45)');
          bgGrad.addColorStop(0.5, 'rgba(15, 10, 30, 0.2)');
        } else if (mood === 'aurora') {
          bgGrad.addColorStop(0, 'rgba(15, 45, 55, 0.45)');
          bgGrad.addColorStop(0.5, 'rgba(10, 15, 25, 0.2)');
        } else if (mood === 'sunset') {
          bgGrad.addColorStop(0, 'rgba(55, 20, 20, 0.45)');
          bgGrad.addColorStop(0.5, 'rgba(20, 10, 15, 0.2)');
        } else {
          bgGrad.addColorStop(0, 'rgba(65, 15, 35, 0.45)');
          bgGrad.addColorStop(0.5, 'rgba(20, 8, 15, 0.2)');
        }
        bgGrad.addColorStop(1, 'rgba(10, 6, 12, 1)');
        ctxBg.fillStyle = bgGrad;
        p.rect(0, 0, p.width, p.height);
        p.pop();

        // Wind Sway Calculation
        const scaleFactor = p.constrain(p.min(p.width, p.height) / 530, 0.45, 1.0);
        const windSwayX = p.sin(p.frameCount * 0.018) * 18 * scaleFactor;
        const windSwayY = p.cos(p.frameCount * 0.012) * 4 * scaleFactor;

        // Draw elegant, curved organic green stem with leaves bending in the wind (BEFORE translating to the sways)
        p.push();
        const baseStemX = p.width / 2;
        const baseStemY = p.height;
        const targetStemX = p.width / 2 + windSwayX;
        const targetStemY = p.height / 2 + windSwayY + 8 * scaleFactor;

        // Draw stem
        p.stroke(46, 125, 50, 190); // Beautiful deep leaf green
        p.strokeWeight(6.5 * scaleFactor);
        p.noFill();
        p.beginShape();
        p.vertex(baseStemX, baseStemY);
        // Control points coordinate calculation
        const cp1x = p.width / 2 + windSwayX * 0.35;
        const cp1y = p.height - (p.height - targetStemY) * 0.35;
        const cp2x = p.width / 2 + windSwayX * 0.65;
        const cp2y = p.height - (p.height - targetStemY) * 0.70;
        p.bezierVertex(cp1x, cp1y, cp2x, cp2y, targetStemX, targetStemY);
        p.endShape();

        // Draw green leaves on the stem
        // Leaf 1
        const t1 = 0.45;
        const leaf1X = p.bezierPoint(baseStemX, cp1x, cp2x, targetStemX, t1);
        const leaf1Y = p.bezierPoint(baseStemY, cp1y, cp2y, targetStemY, t1);
        p.push();
        p.translate(leaf1X, leaf1Y);
        p.rotate(p.sin(p.frameCount * 0.02) * 0.12 + 0.6); // Slow sway
        p.fill(34, 110, 42, 220);
        p.stroke(20, 75, 25, 120);
        p.strokeWeight(1.2);
        p.beginShape();
        p.vertex(0, 0);
        p.bezierVertex(-22 * scaleFactor, -8 * scaleFactor, -15 * scaleFactor, -35 * scaleFactor, 0, -42 * scaleFactor);
        p.bezierVertex(12 * scaleFactor, -35 * scaleFactor, 22 * scaleFactor, -8 * scaleFactor, 0, 0);
        p.endShape(p.CLOSE);
        p.pop();

        // Leaf 2
        const t2 = 0.75;
        const leaf2X = p.bezierPoint(baseStemX, cp1x, cp2x, targetStemX, t2);
        const leaf2Y = p.bezierPoint(baseStemY, cp1y, cp2y, targetStemY, t2);
        p.push();
        p.translate(leaf2X, leaf2Y);
        p.rotate(p.sin(p.frameCount * 0.02 + 2.5) * 0.14 - 0.7); // Slow opposite sway
        p.fill(34, 110, 42, 220);
        p.stroke(20, 75, 25, 120);
        p.strokeWeight(1.2);
        p.beginShape();
        p.vertex(0, 0);
        p.bezierVertex(22 * scaleFactor, -8 * scaleFactor, 15 * scaleFactor, -35 * scaleFactor, 0, -42 * scaleFactor);
        p.bezierVertex(-12 * scaleFactor, -35 * scaleFactor, -22 * scaleFactor, -8 * scaleFactor, 0, 0);
        p.endShape(p.CLOSE);
        p.pop();

        p.pop(); // Restore stem drawing state

        // Translate stage to centered display, now applying the slow windSway offset
        p.push();
        p.translate(p.width / 2 + windSwayX, p.height / 2 + windSwayY);

        p.scale(scaleFactor);

        p.rotate(p.sin(p.frameCount * 0.005) * 0.05);

        let baseColor1, baseColor2;
        const colorFactor = p.sin(p.frameCount * 0.01) * 0.5 + 0.5;

        const moodId = "${roseMood}";
        if (moodId === 'celestial') {
          baseColor1 = p.lerpColor(p.color(170, 40, 80), p.color(230, 80, 120), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 175, 150), p.color(255, 215, 190), colorFactor);
        } else if (moodId === 'aurora') {
          baseColor1 = p.lerpColor(p.color(140, 25, 95), p.color(190, 40, 150), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 195, 230), p.color(220, 175, 255), colorFactor);
        } else if (moodId === 'sunset') {
          baseColor1 = p.lerpColor(p.color(180, 15, 55), p.color(215, 30, 80), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 135, 110), p.color(255, 180, 140), colorFactor);
        } else {
          baseColor1 = p.lerpColor(p.color(150, 10, 45), p.color(180, 25, 60), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 120, 165), p.color(255, 185, 205), colorFactor);
        }

        // Fully completed petals
        for (let i = 0; i < activePetalIndex; i++) {
          drawRosePetal(petals[i], 1.0, baseColor1, baseColor2);
        }

        // Active petal blooming
        if (activePetalIndex < petals.length) {
          drawRosePetal(petals[activePetalIndex], petalProgress, baseColor1, baseColor2);
          
          petalProgress += (progressOffset * bloomSpeed);

          if (petalProgress >= 1.0) {
            petalProgress = 0.0;
            activePetalIndex++;

            document.getElementById('petal-counter-text').innerText = \`Sembrando: Pétalo \${activePetalIndex} / \${petals.length}\`;
            document.getElementById('bloom-progress-bar').style.width = \`\${(activePetalIndex / petals.length) * 100}%\`;

            for (let s = 0; s < 5; s++) {
              particles.push(new Sparkle(p.width / 2 + p.random(-30, 30), p.height / 2 + p.random(-30, 30)));
            }

            if (activePetalIndex >= petals.length) {
              isCompleted = true;
              document.getElementById('petal-counter-text').innerText = 'Rosa Florecida por Completo';
              document.getElementById('restart-icon').classList.remove('animate-spin');
            }
          }
        }

        p.pop();

        // Spawn much more particles: ambient hearts & stars from bottom + from rose center
        if (p.random(1) > 0.58) {
          // Bottom spawning (makes them rise from the floor)
          particles.push(new Sparkle(p.random(p.width), p.height + 15));
        }
        if (p.random(1) > 0.78) {
          // Rose-centered spawning (emanating from the moving rose itself with sways!)
          particles.push(new Sparkle(p.width / 2 + windSwayX + p.random(-40, 40) * scaleFactor, p.height / 2 + windSwayY + p.random(-40, 40) * scaleFactor));
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw();
          if (particles[i].isDead()) {
            particles.splice(i, 1);
          }
        }

        if (isCompleted) {
          p.push();
          p.noFill();
          p.stroke(255, 180, 200, p.sin(p.frameCount * 0.03) * 35 + 40);
          p.strokeWeight(1);
          const ctxHalo = p.drawingContext;
          ctxHalo.shadowBlur = 15;
          ctxHalo.shadowColor = 'rgba(255, 140, 180, 0.4)';
          p.circle(p.width / 2, p.height / 2, p.min(p.width, p.height) * 0.78);
          p.pop();
        }

        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          if (p.random(1) > 0.82) {
            particles.push(new Sparkle(p.mouseX, p.mouseY));
          }
        }
      };

      p.restartLocalSketch = () => {
        activePetalIndex = 0;
        petalProgress = 0.0;
        particles = [];
        isCompleted = false;
        document.getElementById('bloom-progress-bar').style.width = '0%';
        document.getElementById('petal-counter-text').innerText = \`Sembrando: Pétalo 0 / \${petals.length}\`;
        document.getElementById('restart-icon').classList.add('animate-spin');
      };

      p.completeLocalSketch = () => {
        activePetalIndex = petals.length;
        petalProgress = 1.0;
        isCompleted = true;
        document.getElementById('bloom-progress-bar').style.width = '100%';
        document.getElementById('petal-counter-text').innerText = 'Rosa Florecida por Completo';
        document.getElementById('restart-icon').classList.remove('animate-spin');
      };

      p.triggerLocalBurst = () => {
        const x = p.width / 2;
        const y = p.height / 2;
        for (let i = 0; i < 40; i++) {
          particles.push(new Sparkle(x, y, true));
        }
      };
    };

    // Instantiate p5
    p5Instance = new p5(s);

    function resetLocalSketch() {
      if (p5Instance && typeof p5Instance.restartLocalSketch === 'function') {
        p5Instance.restartLocalSketch();
      }
    }

    function completeLocalSketch() {
      if (p5Instance && typeof p5Instance.completeLocalSketch === 'function') {
        p5Instance.completeLocalSketch();
      }
    }

    function triggerLocalBurst() {
      if (p5Instance && typeof p5Instance.triggerLocalBurst === 'function') {
        p5Instance.triggerLocalBurst();
      }
    }
  </script>
</body>
</html>`;
}
