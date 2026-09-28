import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { Sparkles, RefreshCw, Activity, Eye, FastForward, Hourglass } from 'lucide-react';

interface FloraSketchProps {
  flowerType: 'rose' | 'sunflower' | 'tulip' | 'lotus';
  interactiveMood?: 'romantic' | 'celestial' | 'aurora' | 'sunset' | 'cosmic_blue';
  onCountdownTick?: (secondsRemaining: number) => void;
  onBloomComplete?: () => void;
  speedMultiplier?: number;
  startFullyFormed?: boolean;
}

export default function FloraSketch({
  flowerType,
  interactiveMood = 'romantic',
  onCountdownTick,
  onBloomComplete,
  speedMultiplier = 1,
  startFullyFormed = false,
}: FloraSketchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPetal, setCurrentPetal] = useState(0);
  const [totalPetals, setTotalPetals] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [bloomSpeed, setBloomSpeed] = useState<number>(speedMultiplier);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    setBloomSpeed(speedMultiplier);
  }, [speedMultiplier]);

  const handleRestart = () => {
    if (p5InstanceRef.current) {
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

    containerRef.current.innerHTML = '';
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p: p5) => {
      interface PetalConfig {
        layer: number; // 0 = stem/sepals, 1 = outer, 2/3 = mid, 4 = inner
        angle: number;
        size: number;
        tilt: number;
        aspectRatio: number;
        flatness: number;
      }

      let currentFlowerType = flowerType;
      let currentInteractiveMood = interactiveMood;
      let currentBloomSpeed = speedMultiplier;

      // Type-safe fast precomputed color definition
      interface FlowerColors {
        r1: number; g1: number; b1: number;
        r2: number; g2: number; b2: number;
        rt: number; gt: number; bt: number;
      }

      function precomputeFlowerColors(type: string, mood: string, fact: number): FlowerColors {
        const lerpVal = (start: number, end: number, amt: number) => Math.floor(start + (end - start) * amt);
        
        let r1 = 0, g1 = 0, b1 = 0;
        let r2 = 0, g2 = 0, b2 = 0;
        let rt = 255, gt = 255, bt = 255;

        if (type === 'rose') {
          if (mood === 'celestial') {
            r1 = lerpVal(160, 220, fact); g1 = lerpVal(35, 75, fact); b1 = lerpVal(75, 110, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(170, 210, fact); b2 = lerpVal(140, 180, fact);
            rt = 255; gt = 252; bt = 210;
          } else if (mood === 'cosmic_blue') {
            r1 = lerpVal(10, 30, fact); g1 = lerpVal(40, 75, fact); b1 = lerpVal(140, 210, fact);
            r2 = lerpVal(25, 70, fact); g2 = lerpVal(110, 190, fact); b2 = lerpVal(255, 255, fact);
            rt = 215; gt = 245; bt = 255;
          } else if (mood === 'aurora') {
            r1 = lerpVal(130, 180, fact); g1 = lerpVal(20, 35, fact); b1 = lerpVal(90, 140, fact);
            r2 = lerpVal(255, 210, fact); g2 = lerpVal(190, 165, fact); b2 = lerpVal(220, 255, fact);
            rt = 230; gt = 255; bt = 252;
          } else if (mood === 'sunset') {
            r1 = lerpVal(170, 210, fact); g1 = lerpVal(10, 25, fact); b1 = lerpVal(50, 75, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(130, 175, fact); b2 = lerpVal(100, 130, fact);
            rt = 255; gt = 235; bt = 180;
          } else { // romantic
            r1 = lerpVal(140, 175, fact); g1 = lerpVal(8, 22, fact); b1 = lerpVal(40, 55, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(115, 180, fact); b2 = lerpVal(160, 200, fact);
            rt = 255; gt = 235; bt = 242;
          }
        } else if (type === 'sunflower') {
          if (mood === 'romantic') {
            r1 = lerpVal(155, 200, fact); g1 = lerpVal(30, 50, fact); b1 = 0;
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(175, 210, fact); b2 = 0;
            rt = 255; gt = 248; bt = 190;
          } else if (mood === 'celestial') {
            r1 = lerpVal(120, 160, fact); g1 = lerpVal(10, 20, fact); b1 = lerpVal(70, 100, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(190, 230, fact); b2 = lerpVal(20, 40, fact);
            rt = 255; gt = 255; bt = 210;
          } else if (mood === 'cosmic_blue') {
            r1 = lerpVal(10, 30, fact); g1 = lerpVal(55, 80, fact); b1 = lerpVal(150, 210, fact);
            r2 = lerpVal(45, 85, fact); g2 = lerpVal(140, 215, fact); b2 = lerpVal(255, 255, fact);
            rt = 220; gt = 248; bt = 255;
          } else if (mood === 'aurora') {
            r1 = lerpVal(10, 20, fact); g1 = lerpVal(80, 130, fact); b1 = lerpVal(60, 90, fact);
            r2 = lerpVal(190, 235, fact); g2 = lerpVal(235, 255, fact); b2 = lerpVal(40, 60, fact);
            rt = 240; gt = 255; bt = 245;
          } else { // sunset
            r1 = lerpVal(130, 170, fact); g1 = lerpVal(20, 40, fact); b1 = lerpVal(10, 15, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(100, 150, fact); b2 = lerpVal(10, 25, fact);
            rt = 255; gt = 220; bt = 130;
          }
        } else if (type === 'tulip') {
          if (mood === 'romantic') {
            r1 = lerpVal(150, 185, fact); g1 = lerpVal(10, 15, fact); b1 = lerpVal(35, 45, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(95, 130, fact); b2 = lerpVal(110, 145, fact);
            rt = 255; gt = 230; bt = 225;
          } else if (mood === 'celestial') {
            r1 = lerpVal(40, 70, fact); g1 = lerpVal(20, 40, fact); b1 = lerpVal(100, 140, fact);
            r2 = lerpVal(180, 210, fact); g2 = lerpVal(120, 160, fact); b2 = lerpVal(255, 255, fact);
            rt = 220; gt = 235; bt = 255;
          } else if (mood === 'cosmic_blue') {
            r1 = lerpVal(15, 35, fact); g1 = lerpVal(40, 75, fact); b1 = lerpVal(160, 220, fact);
            r2 = lerpVal(50, 95, fact); g2 = lerpVal(145, 210, fact); b2 = lerpVal(255, 255, fact);
            rt = 215; gt = 245; bt = 255;
          } else if (mood === 'aurora') {
            r1 = lerpVal(10, 20, fact); g1 = lerpVal(60, 90, fact); b1 = lerpVal(80, 110, fact);
            r2 = lerpVal(30, 80, fact); g2 = lerpVal(190, 225, fact); b2 = lerpVal(215, 240, fact);
            rt = 215; gt = 255; bt = 240;
          } else { // sunset
            r1 = lerpVal(180, 215, fact); g1 = lerpVal(20, 45, fact); b1 = lerpVal(0, 10, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(150, 190, fact); b2 = lerpVal(40, 70, fact);
            rt = 255; gt = 240; bt = 160;
          }
        } else { // lotus
          if (mood === 'romantic') {
            r1 = lerpVal(140, 175, fact); g1 = lerpVal(20, 30, fact); b1 = lerpVal(90, 120, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(120, 155, fact); b2 = lerpVal(190, 215, fact);
            rt = 255; gt = 245; bt = 255;
          } else if (mood === 'celestial') {
            r1 = lerpVal(60, 95, fact); g1 = lerpVal(15, 30, fact); b1 = lerpVal(110, 150, fact);
            r2 = lerpVal(110, 150, fact); g2 = lerpVal(210, 230, fact); b2 = lerpVal(255, 255, fact);
            rt = 240; gt = 255; bt = 255;
          } else if (mood === 'cosmic_blue') {
            r1 = lerpVal(10, 30, fact); g1 = lerpVal(35, 65, fact); b1 = lerpVal(150, 210, fact);
            r2 = lerpVal(40, 110, fact); g2 = lerpVal(160, 230, fact); b2 = lerpVal(255, 255, fact);
            rt = 215; gt = 245; bt = 255;
          } else if (mood === 'aurora') {
            r1 = lerpVal(15, 25, fact); g1 = lerpVal(75, 110, fact); b1 = lerpVal(80, 115, fact);
            r2 = lerpVal(100, 155, fact); g2 = lerpVal(235, 255, fact); b2 = lerpVal(210, 240, fact);
            rt = 235; gt = 255; bt = 248;
          } else { // sunset
            r1 = lerpVal(160, 195, fact); g1 = lerpVal(25, 35, fact); b1 = lerpVal(60, 80, fact);
            r2 = lerpVal(255, 255, fact); g2 = lerpVal(135, 170, fact); b2 = lerpVal(80, 110, fact);
            rt = 255; gt = 240; bt = 215;
          }
        }

        return { r1, g1, b1, r2, g2, b2, rt, gt, bt };
      }

      let petals: PetalConfig[] = [];
      let activePetalIndex = 0;
      let petalProgress = 0.0;
      // Define different progress speed per flower type for sweet balance
      let progressOffset = 0.03;
      if (currentFlowerType === 'rose') progressOffset = 0.034;
      else if (currentFlowerType === 'sunflower') progressOffset = 0.022; // many outer petals
      else if (currentFlowerType === 'tulip') progressOffset = 0.04;    // simpler goblet layers
      else if (currentFlowerType === 'lotus') progressOffset = 0.026;

      let timeAtCompletion = 0;
      let isSketchCompleted = false;
      let lastSecondsReported = -1;

      class Sparkle {
        pos: p5.Vector;
        vel: p5.Vector;
        size: number;
        color: p5.Color;
        life: number;
        maxLife: number;
        shimmerOffset: number;
        isHeart: boolean;
        isStar: boolean;

        constructor(x: number, y: number, isBurst = false) {
          this.pos = p.createVector(x, y);
          
          if (isBurst) {
            const angle = p.random(p.TWO_PI);
            const r = p.random(2.5, 7.5);
            this.vel = p.createVector(p.cos(angle) * r, p.sin(angle) * r);
          } else {
            this.vel = p.createVector(p.random(-1.5, 1.5), p.random(-2.8, -0.6));
          }
          
          this.size = p.random(4, 9);
          this.maxLife = p.random(80, 160);
          this.life = this.maxLife;
          this.shimmerOffset = p.random(100);
          
          // Flower specific particle icons
          this.isHeart = currentFlowerType === 'rose' || currentFlowerType === 'tulip' ? (p.random(1) > 0.3) : (p.random(1) > 0.65);
          this.isStar = currentFlowerType === 'sunflower' || currentFlowerType === 'lotus' ? (p.random(1) > 0.45) : (p.random(1) > 0.82);
          
          this.color = getMoodParticleColor();
        }

        update() {
          this.pos.add(this.vel);
          if (this.isHeart) {
            const zigzagSpeed = 0.08;
            const zigzagAmp = 2.0;
            this.pos.x += p.sin(p.frameCount * zigzagSpeed + this.shimmerOffset) * zigzagAmp;
            this.vel.y = p.constrain(this.vel.y, -3.0, -0.7);
          } else {
            // wavy floating drift
            this.vel.x += p.sin(p.frameCount * 0.05 + this.shimmerOffset) * 0.06;
          }
          this.life -= p.random(0.7, 1.4);
        }

        draw() {
          p.push();
          const alpha = p.map(this.life, 0, this.maxLife, 0, 255);
          const sizeMod = p.map(this.life, 0, this.maxLife, 0, this.size);
          const glow = p.sin(p.frameCount * 0.12 + this.shimmerOffset) * 110 + 145;
          p.fill(p.red(this.color), p.green(this.color), p.blue(this.color), alpha);
          p.noStroke();

          if (this.isHeart) {
            const pulseSpeed = 0.16;
            const wave = p.sin(p.frameCount * pulseSpeed + this.shimmerOffset);
            let heartbeatScale = wave > 0 ? (1.0 + Math.pow(wave, 3.2) * 0.4) : 1.0;
            const r = sizeMod * 1.5 * heartbeatScale;
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(p.sin(p.frameCount * 0.04 + this.shimmerOffset) * 0.35);
            p.beginShape();
            for (let angle = 0; angle < p.TWO_PI; angle += 0.2) {
              const xX = r * 16 * Math.pow(Math.sin(angle), 3) / 16;
              const yY = -r * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 16;
              p.vertex(xX, yY);
            }
            p.endShape(p.CLOSE);
            p.pop();
          } else if (this.isStar) {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.rotate(p.frameCount * 0.06 + this.shimmerOffset);
            p.stroke(255, 235, 120, alpha * 0.6);
            p.strokeWeight(1.2 * (sizeMod / 7));
            p.line(-sizeMod, 0, sizeMod, 0);
            p.line(0, -sizeMod, 0, sizeMod);
            p.pop();
          } else {
            p.circle(this.pos.x, this.pos.y, sizeMod + (glow > 215 ? 1.8 : 0));
          }
          p.pop();
        }

        isDead() {
          return this.life <= 0;
        }
      }

      let particles: Sparkle[] = [];

      function getMoodParticleColor(): p5.Color {
        // Soft rustic colors according to active moods and floral species
        if (currentFlowerType === 'sunflower') {
          return p.random(1) > 0.4
            ? p.color(255, 215, 0, 205) // brilliant honeycomb gold
            : p.color(255, 110, 0, 185); // glowing bronze orange
        }
        if (currentFlowerType === 'lotus') {
          return p.random(1) > 0.5
            ? p.color(255, 130, 210, 200) // soft lilac rose
            : p.color(180, 230, 255, 190); // crystal aquamarine water glow
        }

        if (currentInteractiveMood === 'cosmic_blue') {
          return p.random(1) > 0.5 ? p.color(50, 180, 255, 210) : p.color(200, 240, 255, 190);
        }

        switch (currentInteractiveMood) {
          case 'celestial':
            return p.random(1) > 0.5 ? p.color(255, 225, 160) : p.color(255, 175, 215);
          case 'aurora':
            return p.random(1) > 0.5 ? p.color(150, 240, 255) : p.color(220, 160, 255);
          case 'sunset':
            return p.random(1) > 0.5 ? p.color(255, 110, 75) : p.color(255, 185, 95);
          case 'romantic':
          default:
            return p.random(1) > 0.5 ? p.color(255, 130, 165, 190) : p.color(255, 65, 120, 175);
        }
      }

      function generateFlowerPetals() {
        petals = [];

        if (currentFlowerType === 'rose') {
          // ================= ROSE PETALS SYSTEM =================
          // Green Sepals Base leaf
          const greenSepalsCount = 5;
          for (let i = 0; i < greenSepalsCount; i++) {
            petals.push({
              layer: 0,
              angle: (p.TWO_PI / greenSepalsCount) * i + p.random(-0.08, 0.08),
              size: p.random(165, 195),
              tilt: p.random(-0.04, 0.04),
              aspectRatio: p.random(0.42, 0.58),
              flatness: p.random(0.3, 0.4)
            });
          }

          // Layer 1: Outermost Large Rose Petals
          const outerCount = 6;
          for (let i = 0; i < outerCount; i++) {
            petals.push({
              layer: 1,
              angle: (p.TWO_PI / outerCount) * i + p.random(-0.15, 0.15),
              size: p.random(140, 170),
              tilt: p.random(-0.12, 0.12),
              aspectRatio: p.random(1.15, 1.4),
              flatness: p.random(0.65, 0.8)
            });
          }

          // Layer 2: Mid-Outer
          const midOuterCount = 6;
          for (let i = 0; i < midOuterCount; i++) {
            petals.push({
              layer: 2,
              angle: (p.TWO_PI / midOuterCount) * (i + 0.5) + p.random(-0.12, 0.12),
              size: p.random(110, 130),
              tilt: p.random(-0.1, 0.1),
              aspectRatio: p.random(1.1, 1.28),
              flatness: p.random(0.6, 0.75)
            });
          }

          // Layer 3: Mid-Inner
          const midInnerCount = 6;
          for (let i = 0; i < midInnerCount; i++) {
            petals.push({
              layer: 3,
              angle: (p.TWO_PI / midInnerCount) * i + p.random(-0.08, 0.08),
              size: p.random(80, 95),
              tilt: p.random(-0.08, 0.08),
              aspectRatio: p.random(1.0, 1.2),
              flatness: p.random(0.55, 0.7)
            });
          }

          // Layer 4: Tight inner core bud
          const innerCount = 5;
          for (let i = 0; i < innerCount; i++) {
            petals.push({
              layer: 4,
              angle: (p.TWO_PI / innerCount) * (i + 0.3) + p.random(-0.06, 0.06),
              size: p.random(50, 68),
              tilt: p.random(-0.06, 0.06),
              aspectRatio: p.random(0.9, 1.12),
              flatness: p.random(0.5, 0.65)
            });
          }

          // Layer 5: Spiral Core center
          const spiralCount = 7;
          for (let i = 0; i < spiralCount; i++) {
            petals.push({
              layer: 5,
              angle: (p.TWO_PI / 4) * i + (i * 0.38),
              size: p.map(i, 0, spiralCount, 36, 12),
              tilt: p.random(-0.04, 0.04),
              aspectRatio: p.random(0.72, 0.9),
              flatness: p.random(0.4, 0.5)
            });
          }
        } else if (currentFlowerType === 'sunflower') {
          // ================= SUNFLOWER PETAL SYSTEM (LARGE CENTER RECEPTACLE) =================
          // Green Sepals
          const greenSepalsCount = 8;
          for (let i = 0; i < greenSepalsCount; i++) {
            petals.push({
              layer: 0,
              angle: (p.TWO_PI / greenSepalsCount) * i + p.random(-0.05, 0.05),
              size: p.random(175, 205),
              tilt: p.random(-0.05, 0.05),
              aspectRatio: p.random(0.35, 0.45),
              flatness: p.random(0.2, 0.35)
            });
          }

          // Layer 1: Outermost Yellow Crown (pointed)
          const outerCount = 18;
          for (let i = 0; i < outerCount; i++) {
            petals.push({
              layer: 1,
              angle: (p.TWO_PI / outerCount) * i + p.random(-0.04, 0.04),
              size: p.random(150, 175),
              tilt: p.random(-0.08, 0.08),
              aspectRatio: p.random(0.33, 0.42),
              flatness: p.random(0.3, 0.45)
            });
          }

          // Layer 2: Mid-Outer Yellow Crown
          const midOuterCount = 18;
          for (let i = 0; i < midOuterCount; i++) {
            petals.push({
              layer: 2,
              angle: (p.TWO_PI / midOuterCount) * (i + 0.5) + p.random(-0.04, 0.04),
              size: p.random(130, 155),
              tilt: p.random(-0.06, 0.06),
              aspectRatio: p.random(0.30, 0.40),
              flatness: p.random(0.3, 0.45)
            });
          }

          // Layer 3: Innermost Yellow Crown
          const innerCount = 16;
          for (let i = 0; i < innerCount; i++) {
            petals.push({
              layer: 3,
              angle: (p.TWO_PI / innerCount) * (i + 0.25) + p.random(-0.03, 0.03),
              size: p.random(110, 130),
              tilt: p.random(-0.05, 0.05),
              aspectRatio: p.random(0.28, 0.38),
              flatness: p.random(0.28, 0.42)
            });
          }

          // Layer 4: Giant seed disk (completed at last step)
          petals.push({
            layer: 4,
            angle: 0,
            size: 155, // Significantly enlarged size as explicitly requested by user!
            tilt: 0,
            aspectRatio: 1,
            flatness: 1
          });
        } else if (currentFlowerType === 'tulip') {
          // ================= TULIP GOBLET PETAL SYSTEM =================
          // Green base sepals (leaves holding the tulip base)
          const greenSepalsCount = 3;
          for (let i = 0; i < greenSepalsCount; i++) {
            petals.push({
              layer: 0,
              angle: (p.TWO_PI / greenSepalsCount) * i + p.random(-0.05, 0.05),
              size: p.random(100, 120),
              tilt: p.random(-0.02, 0.02),
              aspectRatio: p.random(0.4, 0.52),
              flatness: p.random(0.2, 0.3)
            });
          }

          // Layer 1: Outermost Elegant Goblet Petals (upright, tall, curving inwards)
          const outerCount = 3;
          for (let i = 0; i < outerCount; i++) {
            petals.push({
              layer: 1,
              angle: (p.TWO_PI / outerCount) * i,
              size: p.random(150, 175),
              tilt: p.random(-0.05, 0.05),
              aspectRatio: p.random(0.85, 1.05),
              flatness: p.random(0.45, 0.6)
            });
          }

          // Layer 2: Mid overlapping goblet layers
          const midCount = 3;
          for (let i = 0; i < midCount; i++) {
            petals.push({
              layer: 2,
              angle: (p.TWO_PI / midCount) * (i + 0.5),
              size: p.random(140, 162),
              tilt: p.random(-0.04, 0.04),
              aspectRatio: p.random(0.80, 0.98),
              flatness: p.random(0.5, 0.65)
            });
          }

          // Layer 3: Inner overlapping bulb petals
          const innerCount = 3;
          for (let i = 0; i < innerCount; i++) {
            petals.push({
              layer: 3,
              angle: (p.TWO_PI / innerCount) * i + p.random(-0.1, 0.1),
              size: p.random(115, 135),
              tilt: p.random(-0.03, 0.03),
              aspectRatio: p.random(0.75, 0.92),
              flatness: p.random(0.55, 0.7)
            });
          }

          // Layer 4: Tight inner center bud
          const budCount = 3;
          for (let i = 0; i < budCount; i++) {
            petals.push({
              layer: 4,
              angle: (p.TWO_PI / budCount) * (i + 0.3),
              size: p.random(85, 105),
              tilt: p.random(-0.02, 0.02),
              aspectRatio: p.random(0.68, 0.85),
              flatness: p.random(0.6, 0.72)
            });
          }
        } else if (currentFlowerType === 'lotus') {
          // ================= LOTUS STARBURST PETAL SYSTEM =================
          // Green base leaves holding lotus floating
          const flatSepalsCount = 6;
          for (let i = 0; i < flatSepalsCount; i++) {
            petals.push({
              layer: 0,
              angle: (p.TWO_PI / flatSepalsCount) * i,
              size: p.random(180, 215),
              tilt: p.random(-0.03, 0.03),
              aspectRatio: p.random(0.48, 0.65),
              flatness: p.random(0.3, 0.4)
            });
          }

          // Layer 1: Outermost star pointed petals
          const outerCount = 10;
          for (let i = 0; i < outerCount; i++) {
            petals.push({
              layer: 1,
              angle: (p.TWO_PI / outerCount) * i + p.random(-0.1, 0.1),
              size: p.random(140, 168),
              tilt: p.random(-0.08, 0.08),
              aspectRatio: p.random(0.55, 0.72),
              flatness: p.random(0.45, 0.6)
            });
          }

          // Layer 2: Mid-outer radiating petals
          const midOuterCount = 8;
          for (let i = 0; i < midOuterCount; i++) {
            petals.push({
              layer: 2,
              angle: (p.TWO_PI / midOuterCount) * (i + 0.5) + p.random(-0.08, 0.08),
              size: p.random(115, 138),
              tilt: p.random(-0.06, 0.06),
              aspectRatio: p.random(0.5, 0.66),
              flatness: p.random(0.42, 0.58)
            });
          }

          // Layer 3: Mid-inner petals
          const midInnerCount = 8;
          for (let i = 0; i < midInnerCount; i++) {
            petals.push({
              layer: 3,
              angle: (p.TWO_PI / midInnerCount) * i + p.random(-0.05, 0.05),
              size: p.random(90, 112),
              tilt: p.random(-0.04, 0.04),
              aspectRatio: p.random(0.45, 0.6),
              flatness: p.random(0.4, 0.55)
            });
          }

          // Layer 4: Tightest inner pink crown
          const innerCount = 6;
          for (let i = 0; i < innerCount; i++) {
            petals.push({
              layer: 4,
              angle: (p.TWO_PI / innerCount) * (i + 0.5) + p.random(-0.03, 0.03),
              size: p.random(60, 82),
              tilt: p.random(-0.02, 0.02),
              aspectRatio: p.random(0.42, 0.55),
              flatness: p.random(0.35, 0.5)
            });
          }
        }

        setTimeout(() => {
          setTotalPetals(petals.length);
        }, 0);
      }

      p.setup = () => {
        const cw = Math.max(containerRef.current?.clientWidth || 280, 240);
        const ch = Math.max(containerRef.current?.clientHeight || 320, 280);
        p.createCanvas(cw, ch);
        
        // Use full high-precision pixel density for maximum clarity and detail on all screens!
        p.pixelDensity(Math.min(window.devicePixelRatio, 2));
        
        generateFlowerPetals();
        completeSketchParams();
      };

      function resetSketchParams() {
        activePetalIndex = 0;
        petalProgress = 0.0;
        particles = [];
        isSketchCompleted = false;
        lastSecondsReported = -1;
        setSecondsLeft(null);
        setTimeout(() => {
          setIsCompleted(false);
          setCurrentPetal(0);
        }, 0);
      }

      function completeSketchParams() {
        activePetalIndex = petals.length;
        petalProgress = 1.0;
        isSketchCompleted = true;
        setSecondsLeft(null);
        setTimeout(() => {
          setIsCompleted(true);
          setCurrentPetal(petals.length);
        }, 0);
      }

      (p as any).restartSketch = () => {
        resetSketchParams();
      };

      (p as any).completeSketch = () => {
        completeSketchParams();
      };

      (p as any).updateParams = (newType: string, newMood: string, newSpeed: number, forceInstantForm = false) => {
        const typeChanged = currentFlowerType !== newType;
        currentFlowerType = newType as any;
        currentInteractiveMood = newMood as any;
        currentBloomSpeed = newSpeed;

        if (typeChanged) {
          if (currentFlowerType === 'rose') progressOffset = 0.034;
          else if (currentFlowerType === 'sunflower') progressOffset = 0.022;
          else if (currentFlowerType === 'tulip') progressOffset = 0.04;
          else if (currentFlowerType === 'lotus') progressOffset = 0.026;

          generateFlowerPetals();
        }
        if (forceInstantForm) {
          completeSketchParams();
        } else {
          resetSketchParams();
        }
      };

      (p as any).triggerBurst = () => {
        const x = p.width / 2;
        const y = p.height / 2;
        for (let i = 0; i < 40; i++) {
          particles.push(new Sparkle(x, y, true));
        }
      };

      p.windowResized = () => {
        if (!containerRef.current) return;
        const cw = Math.max(containerRef.current.clientWidth || 280, 240);
        const ch = Math.max(containerRef.current.clientHeight || 320, 280);
        p.resizeCanvas(cw, ch);
      };

      function easeInOutQuart(x: number): number {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
      }

      // Draw custom pointed pointed petals or beautiful round folds according to flower species
      function drawFlowerPetal(
        petal: PetalConfig, 
        progress: number, 
        col: FlowerColors
      ) {
        const t = easeInOutQuart(progress);
        const currentSize = petal.size * t;
        
        p.push();
        p.rotate(petal.angle);
        // slow breathing motion
        p.rotate(petal.tilt * p.sin(p.frameCount * 0.015));

        const baseWidth = currentSize * petal.aspectRatio;
        const tipY = -currentSize;

        const ctx = p.drawingContext as CanvasRenderingContext2D;

        if (petal.layer === 0) {
          // Leaf sepals base
          const grad = ctx.createLinearGradient(0, 0, 0, tipY);
          grad.addColorStop(0, 'rgba(46, 125, 50, 0.72)');
          grad.addColorStop(0.5, 'rgba(60, 140, 65, 0.55)');
          grad.addColorStop(1, 'rgba(120, 185, 100, 0.15)');
          ctx.fillStyle = grad;
          ctx.strokeStyle = 'rgba(60, 115, 65, 0.25)';
          ctx.lineWidth = 0.8;
        } else {
          // Radiant flower petal gradient
          const grad = ctx.createRadialGradient(0, 0, currentSize * 0.1, 0, tipY * 0.4, currentSize);
          
          if (currentFlowerType === 'sunflower') {
            grad.addColorStop(0, 'rgba(235, 75, 0, 1.0)'); // fiery deep bronze base
            grad.addColorStop(0.32, 'rgba(255, 136, 0, 1.0)'); // honeycomb hot amber
            grad.addColorStop(0.72, 'rgba(255, 210, 0, 1.0)'); // brilliant radiant yellow body
            grad.addColorStop(1.0, 'rgba(255, 255, 160, 0.98)'); // sparkling pale yellow tips
            ctx.fillStyle = grad;
            ctx.strokeStyle = `rgba(225, 105, 0, ${0.08 + petal.layer * 0.02})`;
            ctx.lineWidth = 0.4 + petal.layer * 0.15;
          } else if (currentFlowerType === 'tulip') {
            // Elegant glowing ruby tulip with sunset peach highlights
            const colHex1 = `rgba(180, 15, 45, 1.0)`; // rich crimson base
            const colHex2 = `rgba(255, 90, 80, 1.0)`; // coral body
            grad.addColorStop(0, colHex1);
            grad.addColorStop(0.68, colHex2);
            
            let tipAccent = 'rgba(255, 210, 120, 0.98)'; // flaming yellow/gold tips
            if (currentInteractiveMood === 'celestial') tipAccent = 'rgba(255, 180, 240, 0.98)';
            if (currentInteractiveMood === 'cosmic_blue') tipAccent = 'rgba(180, 235, 255, 0.98)';
            if (currentInteractiveMood === 'aurora') tipAccent = 'rgba(215, 255, 240, 0.98)';
            if (currentInteractiveMood === 'sunset') tipAccent = 'rgba(255, 230, 150, 0.98)';
            grad.addColorStop(1.0, tipAccent);
            ctx.fillStyle = grad;
            ctx.strokeStyle = `rgba(255, 120, 120, ${0.12 + petal.layer * 0.02})`;
            ctx.lineWidth = 0.6 + petal.layer * 0.18;
          } else if (currentFlowerType === 'lotus') {
            // Serene floating pink lotus water lily
            const colHex1 = 'rgba(165, 30, 120, 1.0)'; // dark orchid rose base
            const colHex2 = 'rgba(255, 140, 210, 1.0)'; // pure glowing pink body
            grad.addColorStop(0, colHex1);
            grad.addColorStop(0.7, colHex2);
            grad.addColorStop(1.0, 'rgba(255, 245, 255, 0.96)'); // sacred pure white margin tips
            ctx.fillStyle = grad;
            ctx.strokeStyle = `rgba(230, 120, 190, 0.15)`;
            ctx.lineWidth = 0.5 + petal.layer * 0.15;
          } else { // rose
            // Corrected oscilating pink colors for Rose
            const colorFact = Math.sin(p.frameCount * 0.01) * 0.5 + 0.5;
            let col1 = p.color(140, 8, 40);
            let col2 = p.color(255, 115, 160);
            if (currentInteractiveMood === 'celestial') {
              col1 = p.lerpColor(p.color(160, 35, 75), p.color(220, 75, 110), colorFact);
              col2 = p.lerpColor(p.color(255, 170, 140), p.color(255, 210, 180), colorFact);
            } else if (currentInteractiveMood === 'cosmic_blue') {
              col1 = p.lerpColor(p.color(10, 40, 140), p.color(30, 80, 210), colorFact);
              col2 = p.lerpColor(p.color(80, 170, 255), p.color(180, 230, 255), colorFact);
            } else if (currentInteractiveMood === 'aurora') {
              col1 = p.lerpColor(p.color(130, 20, 90), p.color(180, 35, 140), colorFact);
              col2 = p.lerpColor(p.color(255, 190, 220), p.color(210, 165, 255), colorFact);
            } else if (currentInteractiveMood === 'sunset') {
              col1 = p.lerpColor(p.color(170, 10, 50), p.color(210, 25, 75), colorFact);
              col2 = p.lerpColor(p.color(255, 130, 100), p.color(255, 175, 130), colorFact);
            } else {
              col1 = p.lerpColor(p.color(140, 8, 40), p.color(175, 22, 55), colorFact);
              col2 = p.lerpColor(p.color(255, 115, 160), p.color(255, 180, 200), colorFact);
            }
            const colHex1 = `rgba(${Math.floor(p.red(col1))}, ${Math.floor(p.green(col1))}, ${Math.floor(p.blue(col1))}, 1)`;
            const colHex2 = `rgba(${Math.floor(p.red(col2))}, ${Math.floor(p.green(col2))}, ${Math.floor(p.blue(col2))}, 1)`;
            grad.addColorStop(0, colHex1);
            grad.addColorStop(0.72, colHex2);
            
            let tipAccent = 'rgba(255, 235, 242, 0.96)';
            if (currentInteractiveMood === 'celestial') tipAccent = 'rgba(255, 252, 210, 0.96)';
            if (currentInteractiveMood === 'cosmic_blue') tipAccent = 'rgba(225, 250, 255, 0.96)';
            if (currentInteractiveMood === 'aurora') tipAccent = 'rgba(230, 255, 252, 0.96)';
            if (currentInteractiveMood === 'sunset') tipAccent = 'rgba(255, 235, 180, 0.96)';
            grad.addColorStop(1.0, tipAccent);
            ctx.fillStyle = grad;
            ctx.strokeStyle = `rgba(255, 135, 165, ${0.1 + petal.layer * 0.02})`;
            ctx.lineWidth = 0.5 + petal.layer * 0.18;
          }
        }

        ctx.beginPath();
        ctx.moveTo(0, 0);

        if (currentFlowerType === 'rose') {
          // Smooth round blushing curves
          const cpLeftX1 = -baseWidth * 0.65;
          const cpLeftY1 = -currentSize * (0.2 + petal.flatness * 0.1);
          const cpLeftX2 = -baseWidth * 1.08;
          const cpLeftY2 = -currentSize * 0.85;

          const cpRightX1 = baseWidth * 1.08;
          const cpRightY1 = -currentSize * 0.85;
          const cpRightX2 = baseWidth * 0.65;
          const cpRightY2 = -currentSize * (0.2 + petal.flatness * 0.1);

          ctx.bezierCurveTo(cpLeftX1, cpLeftY1, cpLeftX2, cpLeftY2, 0, tipY);
          ctx.bezierCurveTo(cpRightX1, cpRightY1, cpRightX2, cpRightY2, 0, 0);
        } else if (currentFlowerType === 'sunflower' || currentFlowerType === 'lotus') {
          // Pointed tropical petal contours
          const cpLeftX1 = -baseWidth * 0.52;
          const cpLeftY1 = -currentSize * 0.28;
          const cpLeftX2 = -baseWidth * 0.82;
          const cpLeftY2 = -currentSize * 0.72;

          const cpRightX1 = baseWidth * 0.82;
          const cpRightY1 = -currentSize * 0.72;
          const cpRightX2 = baseWidth * 0.52;
          const cpRightY2 = -currentSize * 0.28;

          ctx.bezierCurveTo(cpLeftX1, cpLeftY1, cpLeftX2, cpLeftY2, 0, tipY);
          ctx.bezierCurveTo(cpRightX1, cpRightY1, cpRightX2, cpRightY2, 0, 0);
        } else if (currentFlowerType === 'tulip') {
          // Goblet tall cup styling (curves inwards slightly at the top)
          const cpLeftX1 = -baseWidth * 0.45;
          const cpLeftY1 = -currentSize * 0.22;
          const cpLeftX2 = -baseWidth * 0.62;
          const cpLeftY2 = -currentSize * 0.98;

          const cpRightX1 = baseWidth * 0.62;
          const cpRightY1 = -currentSize * 0.98;
          const cpRightX2 = baseWidth * 0.45;
          const cpRightY2 = -currentSize * 0.22;

          ctx.bezierCurveTo(cpLeftX1, cpLeftY1, cpLeftX2, cpLeftY2, 0, tipY);
          ctx.bezierCurveTo(cpRightX1, cpRightY1, cpRightX2, cpRightY2, 0, 0);
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw highly detailed structural veins for realistic organic textures
        if (t > 0.35 && petal.layer > 0 && petal.layer < 4) {
          ctx.beginPath();
          // Center main vein
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-baseWidth * 0.05, tipY * 0.35, baseWidth * 0.05, tipY * 0.7, 0, tipY * 0.9);
          
          // Mid branching left vein
          ctx.moveTo(0, tipY * 0.25);
          ctx.bezierCurveTo(-baseWidth * 0.3, tipY * 0.45, -baseWidth * 0.42, tipY * 0.72, -baseWidth * 0.2, tipY * 0.85);
          
          // Mid branching right vein
          ctx.moveTo(0, tipY * 0.25);
          ctx.bezierCurveTo(baseWidth * 0.3, tipY * 0.45, baseWidth * 0.42, tipY * 0.72, baseWidth * 0.2, tipY * 0.85);
          
          // Lower branching left vein
          ctx.moveTo(0, tipY * 0.5);
          ctx.bezierCurveTo(-baseWidth * 0.4, tipY * 0.65, -baseWidth * 0.45, tipY * 0.82, -baseWidth * 0.1, tipY * 0.92);
          
          // Lower branching right vein
          ctx.moveTo(0, tipY * 0.5);
          ctx.bezierCurveTo(baseWidth * 0.4, tipY * 0.65, baseWidth * 0.45, tipY * 0.82, baseWidth * 0.1, tipY * 0.92);

          ctx.strokeStyle = currentFlowerType === 'rose' || currentFlowerType === 'lotus' 
            ? 'rgba(255, 255, 255, 0.14)' 
            : 'rgba(255, 235, 140, 0.20)';
          ctx.lineWidth = 0.45;
          ctx.stroke();
        }

        p.pop();

        // Trace light pollen sparks (abundant and highly interactive!)
        const sparkThreshold = 0.78;
        if (progress > 0.18 && progress < 0.98 && p.random(1) > sparkThreshold) {
          const pAngle = petal.angle + petal.tilt * p.sin(p.frameCount * 0.015);
          const currentScale = p.constrain(p.min(p.width, p.height) / 480, 0.45, 1.0);
          const tX = p.width / 2 + p.sin(pAngle) * (tipY * currentScale) * 0.72;
          const tY = p.height / 2 + p.cos(pAngle) * (tipY * currentScale) * 0.72;
          particles.push(new Sparkle(tX, tY));
        }
      }

      p.draw = () => {
        p.background(10, 6, 12);
        
        // Dynamic Radial glow overlay
        p.push();
        p.noStroke();
        const glowRadius = p.min(p.width, p.height) * 0.78;
        const ctxBg = p.drawingContext as CanvasRenderingContext2D;
        const bgGrad = ctxBg.createRadialGradient(
          p.width / 2, p.height / 2, 5,
          p.width / 2, p.height / 2, glowRadius
        );

        if (currentFlowerType === 'sunflower') {
          bgGrad.addColorStop(0, 'rgba(55, 36, 10, 0.35)');
          bgGrad.addColorStop(0.5, 'rgba(15, 12, 10, 0.15)');
        } else if (currentFlowerType === 'lotus') {
          bgGrad.addColorStop(0, 'rgba(38, 14, 52, 0.35)');
          bgGrad.addColorStop(0.5, 'rgba(12, 8, 16, 0.15)');
        } else if (currentFlowerType === 'tulip') {
          bgGrad.addColorStop(0, 'rgba(58, 15, 20, 0.35)');
          bgGrad.addColorStop(0.5, 'rgba(16, 8, 10, 0.15)');
        } else {
          if (currentInteractiveMood === 'celestial') {
            bgGrad.addColorStop(0, 'rgba(40, 18, 52, 0.4)');
          } else if (currentInteractiveMood === 'aurora') {
            bgGrad.addColorStop(0, 'rgba(12, 42, 58, 0.4)');
          } else if (currentInteractiveMood === 'sunset') {
            bgGrad.addColorStop(0, 'rgba(58, 18, 18, 0.4)');
          } else {
            bgGrad.addColorStop(0, 'rgba(64, 12, 32, 0.4)');
          }
          bgGrad.addColorStop(0.5, 'rgba(15, 8, 15, 0.15)');
        }
        bgGrad.addColorStop(1, 'rgba(10, 6, 12, 1)');
        ctxBg.fillStyle = bgGrad;
        p.rect(0, 0, p.width, p.height);
        p.pop();

        // ================= NATURAL COMPOSITE WIND SWEEP ENGINE =================
        const scaleFactor = p.constrain(p.min(p.width, p.height) / 480, 0.45, 1.0);
        // Combine low and high frequencies for highly realistic gusts!
        const timeVal = p.frameCount * 0.015;
        const windSwayX = (p.sin(timeVal) * 14 + p.cos(timeVal * 2.3) * 4) * scaleFactor;
        const windSwayY = (p.cos(timeVal * 0.9) * 2.5 + p.sin(timeVal * 1.6) * 1.2) * scaleFactor;

        // Draw natural green stem
        p.push();
        const baseStemX = p.width / 2;
        const baseStemY = p.height;
        const targetStemX = p.width / 2 + windSwayX;
        const targetStemY = p.height / 2 + windSwayY + 10 * scaleFactor;

        // Leafy custom green shades
        p.stroke(currentFlowerType === 'rose' || currentFlowerType === 'tulip' ? p.color(38, 120, 45, 195) : p.color(52, 138, 58, 205));
        p.strokeWeight(currentFlowerType === 'sunflower' ? 8.0 * scaleFactor : 6.0 * scaleFactor);
        p.noFill();
        p.beginShape();
        p.vertex(baseStemX, baseStemY);
        const cp1x = p.width / 2 + windSwayX * 0.35;
        const cp1y = p.height - (p.height - targetStemY) * 0.35;
        const cp2x = p.width / 2 + windSwayX * 0.65;
        const cp2y = p.height - (p.height - targetStemY) * 0.70;
        (p as any).bezierVertex(cp1x, cp1y, cp2x, cp2y, targetStemX, targetStemY);
        p.endShape();

        // Draw bending leaves on the stem in a desynchronized pattern
        // Leaf 1
        const t1 = 0.45;
        const leaf1X = p.bezierPoint(baseStemX, cp1x, cp2x, targetStemX, t1);
        const leaf1Y = p.bezierPoint(baseStemY, cp1y, cp2y, targetStemY, t1);
        p.push();
        p.translate(leaf1X, leaf1Y);
        p.rotate(p.sin(p.frameCount * 0.024 + (currentFlowerType === 'rose' ? 0 : 1.2)) * 0.12 + 0.6);
        p.fill(28, 108, 38, 215);
        p.stroke(18, 70, 24, 110);
        p.strokeWeight(1.0);
        p.beginShape();
        p.vertex(0, 0);
        if (currentFlowerType === 'rose' || currentFlowerType === 'tulip') {
          (p as any).bezierVertex(-20 * scaleFactor, -8 * scaleFactor, -14 * scaleFactor, -32 * scaleFactor, 0, -40 * scaleFactor);
          (p as any).bezierVertex(11 * scaleFactor, -32 * scaleFactor, 20 * scaleFactor, -8 * scaleFactor, 0, 0);
        } else {
          // Sunflower / Lotus heart broader leaflets
          (p as any).bezierVertex(-32 * scaleFactor, -10 * scaleFactor, -24 * scaleFactor, -36 * scaleFactor, 0, -46 * scaleFactor);
          (p as any).bezierVertex(18 * scaleFactor, -36 * scaleFactor, 32 * scaleFactor, -10 * scaleFactor, 0, 0);
        }
        p.endShape(p.CLOSE);
        p.pop();

        // Leaf 2
        const t2 = 0.72;
        const leaf2X = p.bezierPoint(baseStemX, cp1x, cp2x, targetStemX, t2);
        const leaf2Y = p.bezierPoint(baseStemY, cp1y, cp2y, targetStemY, t2);
        p.push();
        p.translate(leaf2X, leaf2Y);
        p.rotate(p.sin(p.frameCount * 0.022 + 2.2) * 0.14 - 0.68);
        p.fill(28, 108, 38, 215);
        p.stroke(18, 70, 24, 110);
        p.strokeWeight(1.0);
        p.beginShape();
        p.vertex(0, 0);
        if (currentFlowerType === 'rose' || currentFlowerType === 'tulip') {
          (p as any).bezierVertex(20 * scaleFactor, -8 * scaleFactor, 14 * scaleFactor, -32 * scaleFactor, 0, -40 * scaleFactor);
          (p as any).bezierVertex(-11 * scaleFactor, -32 * scaleFactor, -20 * scaleFactor, -8 * scaleFactor, 0, 0);
        } else {
          (p as any).bezierVertex(32 * scaleFactor, -10 * scaleFactor, 24 * scaleFactor, -36 * scaleFactor, 0, -46 * scaleFactor);
          (p as any).bezierVertex(-18 * scaleFactor, -36 * scaleFactor, -32 * scaleFactor, -10 * scaleFactor, 0, 0);
        }
        p.endShape(p.CLOSE);
        p.pop();

        p.pop(); // Restore stem drawing

        // Align coordinates to the moving flower head center
        p.push();
        p.translate(p.width / 2 + windSwayX, p.height / 2 + windSwayY);
        p.scale(scaleFactor);
        
        // Gentle rotation sway
        p.rotate(p.sin(p.frameCount * 0.004) * 0.05);

        // Precompute high-performance active flower palette
        const precolors = precomputeFlowerColors(currentFlowerType, currentInteractiveMood, p.frameCount);

        // Draw fully opened petals
        const currentDrawCount = activePetalIndex;

        if (currentFlowerType === 'rose' || currentFlowerType === 'tulip' || currentFlowerType === 'lotus') {
          for (let i = 0; i < currentDrawCount; i++) {
            drawFlowerPetal(petals[i], 1.0, precolors);
          }
        } else {
          // Sunflower renders crown layers in order up to max center step
          for (let i = 0; i < p.min(currentDrawCount, petals.length - 1); i++) {
            drawFlowerPetal(petals[i], 1.0, precolors);
          }
        }

        // Draw active blooming petal layer
        if (activePetalIndex < petals.length) {
          const skipCenterStepPlay = currentFlowerType === 'sunflower' && activePetalIndex === petals.length - 1;
          
          if (!skipCenterStepPlay) {
            drawFlowerPetal(petals[activePetalIndex], petalProgress, precolors);
            petalProgress += (progressOffset * currentBloomSpeed);

            if (petalProgress >= 1.0) {
              petalProgress = 0.0;
              const nextIndex = activePetalIndex + 1;
              activePetalIndex = nextIndex;

              setTimeout(() => {
                setCurrentPetal(nextIndex);
              }, 0);

              // Burst sparkles
              for (let s = 0; s < 5; s++) {
                particles.push(new Sparkle(p.width / 2 + p.random(-25, 25), p.height / 2 + p.random(-25, 25)));
              }

              if (nextIndex >= petals.length) {
                isSketchCompleted = true;
                timeAtCompletion = p.millis();
                setTimeout(() => {
                  setIsCompleted(true);
                }, 0);
                if (onBloomComplete) {
                  onBloomComplete();
                }
              }
            }
          } else {
            // Sunflower Center Disc blooming progression
            petalProgress += (0.015 * currentBloomSpeed);
            setTimeout(() => {
              setCurrentPetal(petals.length);
            }, 0);

            if (petalProgress >= 1.0) {
              petalProgress = 1.0;
              activePetalIndex = petals.length;
              isSketchCompleted = true;
              timeAtCompletion = p.millis();
              setTimeout(() => {
                setIsCompleted(true);
              }, 0);
              if (onBloomComplete) {
                onBloomComplete();
              }
            }
          }
        }

        // ================= DRAW SUNFLOWER FIBONACCI RECEPTACLE CENTER =================
        if (currentFlowerType === 'sunflower') {
          const discBloomingProgress = activePetalIndex === petals.length ? 1.0 : (activePetalIndex === petals.length - 1 ? petalProgress : 0.0);
          
          if (discBloomingProgress > 0.02) {
            const maxCenterDiscSize = petals[petals.length - 1].size; // use configured larger size (125)
            const centerSize = maxCenterDiscSize * discBloomingProgress;
            
            p.push();
            p.noStroke();
            // Deep glowing dark chocolate & bronze charcoal gradient
            const ctxC = p.drawingContext as CanvasRenderingContext2D;
            const darkG = ctxC.createRadialGradient(0, 0, 4, 0, 0, centerSize / 1.9);
            darkG.addColorStop(0, 'rgba(18, 8, 3, 0.99)');
            darkG.addColorStop(0.4, 'rgba(36, 18, 6, 0.98)');
            darkG.addColorStop(0.85, 'rgba(64, 34, 12, 0.96)');
            darkG.addColorStop(1.0, 'rgba(92, 54, 20, 0.95)');
            ctxC.fillStyle = darkG;
            p.circle(0, 0, centerSize);
            p.pop();

            // Render rich Fibonacci spiral seeds with denser counts for beautiful detailed accuracy!
            // Mobile Optimization: Reduce seed iterations on smaller screens for flawless 60fps performance
            p.push();
            p.noStroke();
            const numSeeds = 350; 
            const goldenAngle = 137.5;
            for (let s = 0; s < numSeeds * discBloomingProgress; s++) {
              const r = 2.45 * Math.sqrt(s) * scaleFactor;
              if (r > (centerSize / 2) - 2) continue;
              const theta = p.radians(s * goldenAngle);
              const xX = r * p.cos(theta);
              const yY = r * p.sin(theta);
              
              const shine = p.sin(p.frameCount * 0.045 + s * 1.5) * 100 + 155;
              const colVal = p.map(s, 0, numSeeds, 40, 145);
              if (s % 8 === 0 && shine > 210) {
                p.fill(255, 195, 0, 225); // shining seed
              } else if (s % 5 === 0) {
                p.fill(215, 140, 30, 210); // bronze seed
              } else {
                p.fill(colVal + 18, colVal * 0.72 + 10, colVal * 0.35, 230); // seeds depth shadings
              }
              p.circle(xX, yY, 3.2 * scaleFactor);
            }
            p.pop();
            
            // Glowing border transition ring
            p.push();
            p.noFill();
            p.stroke(245, 150, 0, 38 * discBloomingProgress);
            p.strokeWeight(1.4);
            p.circle(0, 0, centerSize);
            p.pop();
          }
        }

        p.pop(); // End wind sways coordinates

        // Spawn ambient particles (Throttled on mobile screens to protect CPU and thermal throttling)
        const isMobileScreen = p.width < 768 || window.innerWidth < 768;
        const spawnChance1 = isMobileScreen ? 0.80 : 0.52;
        const spawnChance2 = isMobileScreen ? 0.92 : 0.72;

        if (p.random(1) > spawnChance1) {
          particles.push(new Sparkle(p.random(p.width), p.height + 15));
        }
        if (p.random(1) > spawnChance2) {
          particles.push(new Sparkle(p.width / 2 + windSwayX + p.random(-35, 35) * scaleFactor, p.height / 2 + windSwayY + p.random(-35, 35) * scaleFactor));
        }

        // Limit maximum simultaneous particles to prevent performance degradation on slow processors
        const maxParticles = isMobileScreen ? 25 : 80;
        while (particles.length > maxParticles) {
          particles.shift();
        }

        // Draw and update sparkles
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].update();
          particles[i].draw();
          if (particles[i].isDead()) {
            particles.splice(i, 1);
          }
        }

        // Mouse hover sparks
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          if (p.random(1) > 0.8) {
            particles.push(new Sparkle(p.mouseX, p.mouseY));
          }
        }

        // ================= AUTOMATIC 15-SECOND RE-BLOOM CYCLE =================
        if (isSketchCompleted) {
          const elapsed = p.millis() - timeAtCompletion;
          const secondsRemaining = Math.max(0, Math.ceil((15000 - elapsed) / 1000));
          
          if (secondsRemaining !== lastSecondsReported) {
            lastSecondsReported = secondsRemaining;
            setTimeout(() => {
              setSecondsLeft(secondsRemaining);
            }, 0);
            if (onCountdownTick) {
              onCountdownTick(secondsRemaining);
            }
          }

          if (elapsed >= 15000) {
            resetSketchParams();
          }

          // Shimmer Completed Halos
          p.push();
          p.noFill();
          let rColor = p.color(255, 140, 180);
          if (currentFlowerType === 'sunflower') rColor = p.color(255, 205, 0);
          else if (currentFlowerType === 'tulip') rColor = p.color(255, 95, 80);
          else if (currentFlowerType === 'lotus') rColor = p.color(230, 130, 255);

          p.stroke(p.red(rColor), p.green(rColor), p.blue(rColor), p.sin(p.frameCount * 0.038) * 28 + 32);
          p.strokeWeight(1);
          const ctxH = p.drawingContext as any;
          ctxH.shadowBlur = 14;
          ctxH.shadowColor = `rgba(${p.red(rColor)}, ${p.green(rColor)}, ${p.blue(rColor)}, 0.38)`;
          p.circle(p.width / 2, p.height / 2, p.min(p.width, p.height) * 0.78);
          p.pop();
        }
      };
    };

    const myp5 = new p5(sketch, containerRef.current);
    p5InstanceRef.current = myp5;

    return () => {
      myp5.remove();
    };
  }, []);

  // Sync state changes dynamically into the running sketch in a lightning fast way without rebuilding canvas!
  useEffect(() => {
    if (p5InstanceRef.current) {
      const p = p5InstanceRef.current as any;
      if (typeof p.updateParams === 'function') {
        p.updateParams(flowerType, interactiveMood, bloomSpeed, startFullyFormed);
      }
    }
  }, [flowerType, interactiveMood, bloomSpeed, startFullyFormed]);

  const getHeaderLabel = () => {
    switch (flowerType) {
      case 'rose':
        return {
          name: 'Rosa Rubor de Amor para Mari 🌹',
          desc: 'Amor eterno, pasión profunda y devoción infinita para Mari.'
        };
      case 'sunflower':
        return {
          name: 'Girasol Radiante de Mari 🌻',
          desc: 'Lleno de luz, calidez y el brillo de la sonrisa de Mari.'
        };
      case 'tulip':
        return {
          name: 'Tulipán de Amor Eterno de Mari 🌷',
          desc: 'Elegancia, ternura incondicional y susurros de romance.'
        };
      case 'lotus':
        return {
          name: 'Flor de Loto Sagrada de Mari 🌸',
          desc: 'Pureza del alma, paz espiritual y amor verdadero para Mari.'
        };
    }
  };

  const headerLabel = getHeaderLabel();

  return (
    <div className="flex flex-col h-full bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-850/80 shadow-2xl relative group backdrop-blur-sm">
      <div ref={containerRef} className="flex-grow w-full min-h-[320px] md:min-h-[360px] relative" />

      <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 text-[11px] text-pink-300 font-mono tracking-tight pointer-events-none">
        <Activity className="w-3.5 h-3.5 animate-pulse text-pink-400" />
        <span>
          {isCompleted 
            ? 'Florecido por completo ✨' 
            : `Fase: ${currentPetal} / ${totalPetals}`
          }
        </span>
      </div>

      {secondsLeft !== null && (
        <div className="absolute top-4 right-4 bg-pink-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-500/30 flex items-center gap-1.5 text-xs font-bold text-pink-200 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-bounce font-mono">
          <Hourglass className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>Auto-Rebrote en {secondsLeft}s ⏳</span>
        </div>
      )}

      <div className="p-4 bg-slate-950/90 border-t border-slate-850/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white text-sm font-bold tracking-wide flex items-center gap-1.5 font-serif">
              {flowerType === 'rose' && "🌹"}
              {flowerType === 'sunflower' && "🌻"}
              {flowerType === 'tulip' && "🌷"}
              {flowerType === 'lotus' && "🌸"}
              {headerLabel.name}
            </h4>
            <p className="text-[11px] text-slate-400 leading-tight pr-2">{headerLabel.desc}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onClick={() => setBloomSpeed(prev => prev === 1 ? 2 : prev === 2 ? 3.5 : 1)}
              className="p-1.5 text-[11px] bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg flex items-center gap-1 transition-all active:scale-95"
              title="Ajustar velocidad"
            >
              <FastForward className="w-3 h-3 text-rose-400" />
              <span className="font-mono font-bold">{bloomSpeed}x</span>
            </button>

            <button
              onClick={handleBurst}
              className="p-1.5 bg-slate-900 hover:bg-slate-850 active:scale-95 text-pink-300 hover:text-white rounded-lg border border-slate-800 transition"
              title="Derramar destellos"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            </button>

            <button
              onClick={handleComplete}
              className="px-2 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 active:scale-95 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
              title="Abrir flor instantáneamente"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Abrir</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-1.5 bg-slate-900 hover:bg-slate-850 active:scale-95 text-slate-300 hover:text-white rounded-lg transition border border-slate-800"
              title="Reiniciar florecimiento"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${!isCompleted ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-slate-850">
          <div 
            className={`h-full transition-all duration-300 ease-out bg-gradient-to-r ${
              flowerType === 'rose' 
                ? 'from-pink-500 via-rose-400 to-amber-300' 
                : flowerType === 'sunflower'
                ? 'from-amber-600 via-yellow-500 to-yellow-250'
                : flowerType === 'tulip'
                ? 'from-red-600 via-orange-500 to-amber-300'
                : 'from-purple-600 via-pink-400 to-teal-200'
            }`}
            style={{ width: `${totalPetals > 0 ? (currentPetal / totalPetals) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
