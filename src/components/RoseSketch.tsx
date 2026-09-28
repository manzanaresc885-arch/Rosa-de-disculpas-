import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { Sparkles, RefreshCw, Activity, Palette, Eye, FastForward } from 'lucide-react';

interface RoseSketchProps {
  onBloomComplete?: () => void;
  speedMultiplier?: number;
  interactiveMood?: 'romantic' | 'celestial' | 'aurora' | 'sunset';
}

export default function RoseSketch({
  onBloomComplete,
  speedMultiplier = 1,
  interactiveMood = 'romantic',
}: RoseSketchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPetal, setCurrentPetal] = useState(0);
  const [totalPetals, setTotalPetals] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bloomSpeed, setBloomSpeed] = useState<number>(speedMultiplier);
  const p5InstanceRef = useRef<p5 | null>(null);

  // Speed multiplier effect
  useEffect(() => {
    setBloomSpeed(speedMultiplier);
  }, [speedMultiplier]);

  const handleRestart = () => {
    if (p5InstanceRef.current) {
      // Access custom restart function attached to sketch in draw cycle
      const p = p5InstanceRef.current as any;
      if (typeof p.restartSketch === 'function') {
        p.restartSketch();
      }
    }
  };

  const handleBurst = () => {
    if (p5InstanceRef.current) {
      const p = p5InstanceRef.current as any;
      if (typeof p.triggerBurst === 'function') {
        p.triggerBurst();
      }
    }
  };

  const handleComplete = () => {
    if (p5InstanceRef.current) {
      const p = p5InstanceRef.current as any;
      if (typeof p.completeSketch === 'function') {
        p.completeSketch();
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Remove any leftover HTML canvas residues to avoid duplicate overlays
    containerRef.current.innerHTML = '';

    // Remove existing sketch if any
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p: p5) => {
      // Configuration for petals sequential drawing
      // We draw from OUTER layers to INNER layers so they overlay correctly in 2D.
      interface PetalConfig {
        layer: number;
        angle: number;
        size: number;
        tilt: number;
        aspectRatio: number; // width multiplier
        flatness: number; // lower curve control
      }

      let petals: PetalConfig[] = [];
      let petalBloomTimes: number[] = []; // frames allocated for each petal
      let activePetalIndex = 0;
      let petalProgress = 0.0; // 0.0 -> 1.0 for the currently blooming petal
      let progressOffset = 0.03; // Base bloom rate per frame

      // Particles
      class Sparkle {
        pos: p5.Vector;
        vel: p5.Vector;
        size: number;
        color: p5.Color;
        life: number;
        maxLife: number;
        shimmerOffset: number;
        isHeart: boolean;

        constructor(x: number, y: number, isBurst = false) {
          this.pos = p.createVector(x, y);
          
          if (isBurst) {
            const angle = p.random(p.TWO_PI);
            const r = p.random(2.5, 6.5);
            this.vel = p.createVector(p.cos(angle) * r, p.sin(angle) * r);
          } else {
            // Drift up and out
            this.vel = p.createVector(p.random(-1.0, 1.0), p.random(-2.8, -0.6));
          }
          
          this.size = p.random(4, 8);
          this.maxLife = p.random(90, 160); // Longer life so they fill the space better
          this.life = this.maxLife;
          this.shimmerOffset = p.random(100);
          this.isHeart = p.random(1) > 0.30; // 70% chance of being a gorgeous floating heart

          // Get colors based on mood
          this.color = getMoodParticleColor();
        }

        update() {
          this.pos.add(this.vel);
          if (this.isHeart) {
            // Zigzag upward motion
            const zigzagSpeed = 0.08;
            const zigzagAmp = 1.6;
            this.pos.x += p.sin(p.frameCount * zigzagSpeed + this.shimmerOffset) * zigzagAmp;
            // Guide upward drift smoothly
            this.vel.y = p.constrain(this.vel.y, -3.0, -0.8);
          } else {
            this.vel.x += p.sin(p.frameCount * 0.05 + this.shimmerOffset) * 0.04; // wave drift
          }
          this.life -= p.random(0.7, 1.4); // slightly slower decay for stunning persistence
        }

        draw() {
          p.push();
          const alpha = p.map(this.life, 0, this.maxLife, 0, 255);
          const sizeMod = p.map(this.life, 0, this.maxLife, 0, this.size);
          
          // Shimmer glow
          const glow = p.sin(p.frameCount * 0.1 + this.shimmerOffset) * 100 + 155;
          p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
          p.noStroke();
          
          if (this.isHeart) {
            // Heartbeat Palpitation Beat Rhythm (Double pulse)
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
            // Swaying oscillation tilt
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
            // Slightly draw fuzzy core
            p.circle(this.pos.x, this.pos.y, sizeMod + (glow > 200 ? 1.8 : 0));
          }
          p.pop();
        }

        isDead() {
          return this.life <= 0;
        }
      }

      let particles: Sparkle[] = [];
      let globalHueShift = 0;
      let isSketchCompleted = false;

      // Mood coloring generator
      function getMoodParticleColor(): p5.Color {
        const t = p.frameCount * 0.01;
        switch (interactiveMood) {
          case 'celestial': // Pink gold & stars
            return p.random(1) > 0.5 
              ? p.color(255, 230, 160) // Soft gold
              : p.color(255, 180, 220); // Cosmic Pink
          case 'aurora': // Rosy violet & teal
            return p.random(1) > 0.5 
              ? p.color(180, 240, 255) // Soft teal
              : p.color(230, 160, 255); // Violet rose
          case 'sunset': // Vivid orange, warm coral
            return p.random(1) > 0.5 
              ? p.color(255, 120, 80) // Coral
              : p.color(255, 190, 100); // Amber peach
          case 'romantic': // Dreamy pinks & magentas
          default:
            return p.random(1) > 0.5 
              ? p.color(255, 150, 180, 200) // Rose blush
              : p.color(255, 80, 140, 180); // Cerise pink
        }
      }

      // Generate a comprehensive set of overlapping nested petals
      function generateRosePetals() {
        petals = [];
        // Layer 0: Stem / Sepals / Base Green leaflets (drawn first underneath)
        const greenSepalsCount = 5;
        for (let i = 0; i < greenSepalsCount; i++) {
          petals.push({
            layer: 0, // Sepals
            angle: (p.TWO_PI / greenSepalsCount) * i + p.random(-0.1, 0.1),
            size: p.random(170, 200),
            tilt: p.random(-0.05, 0.05),
            aspectRatio: p.random(0.4, 0.6),
            flatness: p.random(0.3, 0.4)
          });
        }

        // Layer 1: Outermost Large Petals (layer 1)
        const outerCount = 6;
        for (let i = 0; i < outerCount; i++) {
          petals.push({
            layer: 1, // Outer
            angle: (p.TWO_PI / outerCount) * i + p.random(-0.2, 0.2),
            size: p.random(145, 175),
            tilt: p.random(-0.15, 0.15),
            aspectRatio: p.random(1.2, 1.45),
            flatness: p.random(0.65, 0.8)
          });
        }

        // Layer 2: Mid-Outer Petals (layer 2)
        const midOuterCount = 6;
        for (let i = 0; i < midOuterCount; i++) {
          petals.push({
            layer: 2, // Mid-Outer
            angle: (p.TWO_PI / midOuterCount) * (i + 0.5) + p.random(-0.15, 0.15),
            size: p.random(110, 135),
            tilt: p.random(-0.12, 0.12),
            aspectRatio: p.random(1.1, 1.3),
            flatness: p.random(0.6, 0.75)
          });
        }

        // Layer 3: Mid-Inner Petals (layer 3)
        const midInnerCount = 6;
        for (let i = 0; i < midInnerCount; i++) {
          petals.push({
            layer: 3, // Mid-Inner
            angle: (p.TWO_PI / midInnerCount) * i + p.random(-0.1, 0.1),
            size: p.random(80, 100),
            tilt: p.random(-0.1, 0.1),
            aspectRatio: p.random(1.0, 1.25),
            flatness: p.random(0.55, 0.7)
          });
        }

        // Layer 4: Inner Core Petals (layer 4)
        const innerCount = 5;
        for (let i = 0; i < innerCount; i++) {
          petals.push({
            layer: 4, // Inner
            angle: (p.TWO_PI / innerCount) * (i + 0.3) + p.random(-0.08, 0.08),
            size: p.random(50, 70),
            tilt: p.random(-0.08, 0.08),
            aspectRatio: p.random(0.9, 1.15),
            flatness: p.random(0.5, 0.65)
          });
        }

        // Layer 5: Tight Bud Center Spiral (layer 5)
        const spiralCount = 7;
        for (let i = 0; i < spiralCount; i++) {
          petals.push({
            layer: 5, // Tight center spiral
            angle: (p.TWO_PI / 4) * i + (i * 0.4),
            size: p.map(i, 0, spiralCount, 38, 12),
            tilt: p.random(-0.05, 0.05),
            aspectRatio: p.random(0.7, 0.95),
            flatness: p.random(0.4, 0.5)
          });
        }

        setTimeout(() => {
          setTotalPetals(petals.length);
        }, 0);
      }

      // Main Setup
      p.setup = () => {
        const canvWidth = Math.max(containerRef.current?.clientWidth || 400, 320);
        const canvHeight = Math.max(containerRef.current?.clientHeight || 450, 350);
        p.createCanvas(canvWidth, canvHeight);
        
        // Anti-aliasing quality options
        p.pixelDensity(Math.min(window.devicePixelRatio, 2));
        
        generateRosePetals();
        // Start fully bloomed by default so she sees her magical rose instantly
        completeSketchParams();
      };

      function resetSketchParams() {
        activePetalIndex = 0;
        petalProgress = 0.0;
        particles = [];
        isSketchCompleted = false;
        setTimeout(() => {
          setIsCompleted(false);
          setCurrentPetal(0);
        }, 0);
      }

      function completeSketchParams() {
        activePetalIndex = petals.length;
        petalProgress = 1.0;
        isSketchCompleted = true;
        setTimeout(() => {
          setIsCompleted(true);
          setCurrentPetal(petals.length);
        }, 0);
      }

      // Expose restart function to React parent
      (p as any).restartSketch = () => {
        resetSketchParams();
      };

      // Expose complete function to React parent
      (p as any).completeSketch = () => {
        completeSketchParams();
      };

      // Trigger massive particle burst
      (p as any).triggerBurst = () => {
        const x = p.width / 2;
        const y = p.height / 2;
        for (let i = 0; i < 40; i++) {
          particles.push(new Sparkle(x, y, true));
        }
      };

      // Handle custom size adjustment
      p.windowResized = () => {
        const canvWidth = Math.max(containerRef.current?.clientWidth || 400, 320);
        const canvHeight = Math.max(containerRef.current?.clientHeight || 400, 320);
        p.resizeCanvas(canvWidth, canvHeight);
      };

      // Smooth Easing function
      function easeInOutQuart(x: number): number {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      }

      // Drawing individual custom petal using Bézier Curves & native gradients
      function drawRosePetal(
        petal: PetalConfig, 
        progress: number, 
        baseColor1: p5.Color, 
        baseColor2: p5.Color
      ) {
        // Apply smooth growth easing
        const t = easeInOutQuart(progress);
        const currentSize = petal.size * t;
        
        p.push();
        // Translate and align petal around rose origin
        p.rotate(petal.angle);
        p.rotate(petal.tilt * p.sin(p.frameCount * 0.015)); // slow breathing motion

        const baseWidth = currentSize * petal.aspectRatio;
        const tipY = -currentSize;

        // Fetch drawing 2D context to apply premium smooth radial/linear gradients
        const ctx = p.drawingContext as CanvasRenderingContext2D;
        
        // Sepal leaf vs standard pink petal coloring
        if (petal.layer === 0) {
          // Soft olive green, forest green sepals
          const grad = ctx.createLinearGradient(0, 0, 0, tipY);
          grad.addColorStop(0, 'rgba(40, 95, 45, 0.65)');
          grad.addColorStop(0.5, 'rgba(80, 130, 85, 0.45)');
          grad.addColorStop(1, 'rgba(150, 190, 120, 0.1)');
          ctx.fillStyle = grad;
          ctx.strokeStyle = 'rgba(60, 110, 65, 0.25)';
          ctx.lineWidth = 1;
        } else {
          // Standard petal gradients with high-contrast soft shades
          const grad = ctx.createRadialGradient(0, 0, currentSize * 0.1, 0, tipY * 0.5, currentSize);
          
          // Inject custom color properties based on active mood
          const colHex1 = `rgba(${Math.floor(p.red(baseColor1))}, ${Math.floor(p.green(baseColor1))}, ${Math.floor(p.blue(baseColor1))}, 1)`;
          const colHex2 = `rgba(${Math.floor(p.red(baseColor2))}, ${Math.floor(p.green(baseColor2))}, ${Math.floor(p.blue(baseColor2))}, 1)`;
          
          grad.addColorStop(0, colHex1); // Inner petal core
          grad.addColorStop(0.7, colHex2); // Outer petal body
          
          // Tips highlighting (glowing border edge)
          let tipAccent = 'rgba(255, 235, 240, 0.95)';
          if (interactiveMood === 'celestial') tipAccent = 'rgba(255, 250, 210, 0.95)';
          if (interactiveMood === 'aurora') tipAccent = 'rgba(235, 255, 250, 0.95)';
          if (interactiveMood === 'sunset') tipAccent = 'rgba(255, 235, 180, 0.95)';
          
          grad.addColorStop(1, tipAccent);
          ctx.fillStyle = grad;
          
          // Subtle soft rose borders rather than harsh black borders
          ctx.strokeStyle = `rgba(255, 140, 170, ${0.12 + (petal.layer * 0.03)})`;
          ctx.lineWidth = 0.6 + petal.layer * 0.2;
        }

        // Draw Petal using native HTML5 Canvas 2D context for absolute drawing reliability
        ctx.beginPath();
        ctx.moveTo(0, 0);

        // Control points left-edge of petal
        const cpLeftX1 = -baseWidth * 0.65;
        const cpLeftY1 = -currentSize * (0.2 + petal.flatness * 0.1);
        const cpLeftX2 = -baseWidth * 1.1;
        const cpLeftY2 = -currentSize * 0.85;

        // Control points right-edge of petal
        const cpRightX1 = baseWidth * 1.1;
        const cpRightY1 = -currentSize * 0.85;
        const cpRightX2 = baseWidth * 0.65;
        const cpRightY2 = -currentSize * (0.2 + petal.flatness * 0.1);

        ctx.bezierCurveTo(cpLeftX1, cpLeftY1, cpLeftX2, cpLeftY2, 0, tipY);
        ctx.bezierCurveTo(cpRightX1, cpRightY1, cpRightX2, cpRightY2, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw organic veins if the petal is fully open or mostly open
        if (t > 0.4 && petal.layer > 0 && petal.layer < 5) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-baseWidth * 0.05, tipY * 0.3, baseWidth * 0.05, tipY * 0.7, 0, tipY * 0.9);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        p.pop();
        
        // Spawn active trail of pollen particles from the tip of currently growing petal
        if (progress > 0.1 && progress < 0.98 && p.random(1) > 0.84) {
          // transform coordinates to feed into canvas particle system
          const pAngle = petal.angle + petal.tilt * p.sin(p.frameCount * 0.015);
          const currentScale = p.constrain(p.min(p.width, p.height) / 530, 0.45, 1.0);
          const tX = p.width / 2 + p.sin(pAngle) * (tipY * currentScale) * 0.7;
          const tY = p.height / 2 + p.cos(pAngle) * (tipY * currentScale) * 0.7;
          particles.push(new Sparkle(tX, tY));
        }
      }

      // Drawing function
      p.draw = () => {
        // High-end ambient backdrop with slow, deep, luxurious color transitions
        globalHueShift += 0.003;
        
        // Soft backdrop gradient
        p.background(10, 6, 12);
        
        // Ambient backdrop texture/glow in center
        p.push();
        p.noStroke();
        const glowRadius = p.min(p.width, p.height) * 0.75;
        const ctxBg = p.drawingContext as CanvasRenderingContext2D;
        const bgGrad = ctxBg.createRadialGradient(
          p.width / 2, p.height / 2, 10,
          p.width / 2, p.height / 2, glowRadius
        );
        
        // Dynamic shifts in background radial glow based on mood selection
        if (interactiveMood === 'celestial') {
          bgGrad.addColorStop(0, 'rgba(40, 20, 50, 0.45)');
          bgGrad.addColorStop(0.5, 'rgba(15, 10, 30, 0.2)');
        } else if (interactiveMood === 'aurora') {
          bgGrad.addColorStop(0, 'rgba(15, 45, 55, 0.45)');
          bgGrad.addColorStop(0.5, 'rgba(10, 15, 25, 0.2)');
        } else if (interactiveMood === 'sunset') {
          bgGrad.addColorStop(0, 'rgba(55, 20, 20, 0.45)');
          bgGrad.addColorStop(0.5, 'rgba(20, 10, 15, 0.2)');
        } else { // romantic default
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
        (p as any).bezierVertex(cp1x, cp1y, cp2x, cp2y, targetStemX, targetStemY);
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
        (p as any).bezierVertex(-22 * scaleFactor, -8 * scaleFactor, -15 * scaleFactor, -35 * scaleFactor, 0, -42 * scaleFactor);
        (p as any).bezierVertex(12 * scaleFactor, -35 * scaleFactor, 22 * scaleFactor, -8 * scaleFactor, 0, 0);
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
        (p as any).bezierVertex(22 * scaleFactor, -8 * scaleFactor, 15 * scaleFactor, -35 * scaleFactor, 0, -42 * scaleFactor);
        (p as any).bezierVertex(-12 * scaleFactor, -35 * scaleFactor, -22 * scaleFactor, -8 * scaleFactor, 0, 0);
        p.endShape(p.CLOSE);
        p.pop();

        p.pop(); // Restore stem drawing state

        // Translate stage to centered display, now applying the slow windSway offset
        p.push();
        p.translate(p.width / 2 + windSwayX, p.height / 2 + windSwayY);

        p.scale(scaleFactor);

        // Slow global breathing rotation
        p.rotate(p.sin(p.frameCount * 0.005) * 0.05);

        // Dynamically compute the gradient colors of the petals based on active mood (all styled as beautiful variations of a glowing Pink Rose!)
        let baseColor1: p5.Color;
        let baseColor2: p5.Color;
        const colorFactor = p.sin(p.frameCount * 0.01) * 0.5 + 0.5;

        if (interactiveMood === 'celestial') {
          // Romantic pink-gold and glowing celestial peach rose
          baseColor1 = p.lerpColor(p.color(170, 40, 80), p.color(230, 80, 120), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 175, 150), p.color(255, 215, 190), colorFactor);
        } else if (interactiveMood === 'aurora') {
          // Icy lilac rose with soft lavender-pink pastel mist
          baseColor1 = p.lerpColor(p.color(140, 25, 95), p.color(190, 40, 150), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 195, 230), p.color(220, 175, 255), colorFactor);
        } else if (interactiveMood === 'sunset') {
          // Rich warm coral pink and bright gold-amber blossom
          baseColor1 = p.lerpColor(p.color(180, 15, 55), p.color(215, 30, 80), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 135, 110), p.color(255, 180, 140), colorFactor);
        } else { // romantic
          // Exquisite pure blushing princess rose with deep magenta core
          baseColor1 = p.lerpColor(p.color(150, 10, 45), p.color(180, 25, 60), colorFactor);
          baseColor2 = p.lerpColor(p.color(255, 120, 165), p.color(255, 185, 205), colorFactor);
        }

        // Draw established petals that are already fully completed (at progress 1.0)
        for (let i = 0; i < activePetalIndex; i++) {
          drawRosePetal(petals[i], 1.0, baseColor1, baseColor2);
        }

        // Draw the currently active blooming petal
        if (activePetalIndex < petals.length) {
          drawRosePetal(petals[activePetalIndex], petalProgress, baseColor1, baseColor2);
          
          // Accumulate progress factor based on speed setting
          // The fewer frames, the faster they open
          petalProgress += (progressOffset * bloomSpeed);

          if (petalProgress >= 1.0) {
            petalProgress = 0.0;
            const nextIdx = activePetalIndex + 1;
            activePetalIndex = nextIdx;
            
            // Decouple React state updates from the synchronous draw loop
            setTimeout(() => {
              setCurrentPetal(nextIdx);
            }, 0);

            // Trigger a mini sparkle burst on each completed petal layer
            for (let s = 0; s < 5; s++) {
              particles.push(new Sparkle(p.width / 2 + p.random(-30, 30), p.height / 2 + p.random(-30, 30)));
            }

            if (nextIdx >= petals.length) {
              isSketchCompleted = true;
              setTimeout(() => {
                setIsCompleted(true);
              }, 0);
              if (onBloomComplete) {
                onBloomComplete();
              }
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
          // Rose-centered spawning (emanating from the moving rose itself!)
          particles.push(new Sparkle(p.width / 2 + windSwayX + p.random(-40, 40) * scaleFactor, p.height / 2 + windSwayY + p.random(-40, 40) * scaleFactor));
        }

        // Draw and update active particles
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw();
          if (particles[i].isDead()) {
            particles.splice(i, 1);
          }
        }

        // Show a beautiful glowing halo around completed rose
        if (isSketchCompleted) {
          p.push();
          p.noFill();
          p.stroke(255, 180, 200, p.sin(p.frameCount * 0.03) * 35 + 40);
          p.strokeWeight(1);
          const ctxHalo = p.drawingContext as any;
          ctxHalo.shadowBlur = 15;
          ctxHalo.shadowColor = 'rgba(255, 140, 180, 0.4)';
          p.circle(p.width / 2, p.height / 2, p.min(p.width, p.height) * 0.78);
          p.pop();
        }

        // Let particles react to mouse movement
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          if (p.random(1) > 0.82) {
            particles.push(new Sparkle(p.mouseX, p.mouseY));
          }
        }
      };
    };

    const myp5 = new p5(sketch, containerRef.current);
    p5InstanceRef.current = myp5;

    return () => {
      myp5.remove();
    };
  }, [interactiveMood, bloomSpeed]);

  const moodDetails = {
    romantic: { name: 'Rosa Silvestre Clásica 🌸', desc: 'Pétalos rosados carmín con rubor natural' },
    celestial: { name: 'Rosa Rosada Celestial ✨', desc: 'Tonos rosa pastel con destellos de estrellas' },
    aurora: { name: 'Rosa Aurora de Reencuentro 💜', desc: 'Matices violetas-rosas con rocío de luz mística' },
    sunset: { name: 'Rosa Atardecer Coral 🌅', desc: 'Rosa cálido intenso con reflejos ámbar y sol' },
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group">
      {/* Absolute canvas wrapper */}
      <div ref={containerRef} className="flex-1 w-full min-h-[350px] relative" />

      {/* Floating status display */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 flex items-center gap-2 text-xs text-rose-300 font-mono tracking-tight pointer-events-none">
        <Activity className="w-3.5 h-3.5 animate-pulse text-rose-400" />
        <span>
          {isCompleted 
            ? 'Rosa Florecida por Completo' 
            : `Sembrando: Pétalo ${currentPetal} / ${totalPetals}`
          }
        </span>
      </div>

      {/* Control panel & interaction layer */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col gap-3 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              {moodDetails[interactiveMood].name}
            </h4>
            <p className="text-xs text-slate-400">{moodDetails[interactiveMood].desc}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Adjuster */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button 
                onClick={() => setBloomSpeed(prev => prev === 1 ? 2 : prev === 2 ? 3.5 : 1)}
                className="px-2 py-1 text-xs text-slate-300 hover:text-white rounded flex items-center gap-1 transition"
                title="Cambiar velocidad de florecimiento"
              >
                <FastForward className="w-3 h-3 text-rose-400" />
                <span className="font-mono">{bloomSpeed}x</span>
              </button>
            </div>

            {/* Sparkle Burst Trigger */}
            <button
              onClick={handleBurst}
              className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-pink-300 hover:text-white p-2 rounded-lg border border-slate-700 transition flex items-center justify-center cursor-pointer"
              title="Derramar polen de luz"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Instant complete open button */}
            <button
              onClick={handleComplete}
              className="bg-gradient-to-r from-pink-650 to-rose-600 hover:from-pink-600 hover:to-rose-500 active:scale-95 text-white px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(244,63,94,0.15)]"
              title="Ver rosa completamente abierta"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Abrir Flor 🌹</span>
            </button>

            {/* Restart button */}
            <button
              onClick={handleRestart}
              className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white p-2 rounded-lg transition border border-slate-700 flex items-center justify-center cursor-pointer"
              title="Ver florecer paso a paso"
            >
              <RefreshCw className={`w-4 h-4 ${!isCompleted ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300 h-full transition-all duration-300 ease-out"
            style={{ width: `${totalPetals > 0 ? (currentPetal / totalPetals) * 100 : 0}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-500 text-center font-mono italic">
          * Desliza el puntero o haz clic sobre la rosa para interactuar con el polen de luz
        </p>
      </div>
    </div>
  );
}
