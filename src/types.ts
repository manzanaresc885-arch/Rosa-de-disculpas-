export interface ApologyConfig {
  friendName: string;
  relationshipDuration: string;
  reasonCategory: 'misunderstanding' | 'distance' | 'harsh_words' | 'forgotten_event' | 'general';
  customReason: string;
  cherishedMemory: string;
  tone: 'poetic' | 'sincere' | 'nostalgic' | 'warm' | 'flirty';
  customApologyReasonDetails?: string;
  promisesForFuture: string[];
}

export interface PetalData {
  id: number;
  layer: number; // 0 = inner, 1 = mid-inner, 2 = mid-outer, 3 = outer, 4 = stem/leaves
  angleOffset: number;
  sizeMultiplier: number;
  colorGradStart: string;
  colorGradEnd: string;
  bezierPoints: {
    cx1: number; cy1: number;
    cx2: number; cy2: number;
    cx3: number; cy3: number;
    cx4: number; cy4: number;
    x1: number; y1: number;
    x2: number; y2: number;
  };
}
