export type VibeMode = 'DEEP_LOGIC' | 'EXPANSIVE' | 'STEALTH' | 'CREATIVE';

export interface PulseItem {
  id: string;
  platform: 'GitHub' | 'Figma' | 'Substack' | 'Voice';
  content: string;
  timestamp: string;
  complexity: 'low' | 'high';
  status: 'pulse' | 'hold' | 'signal';
}

export interface DirectionalVector {
  focus: string;
  activeDomains: string[];
  suppressedDomains: string[];
  evaluationBias: string;
}

export interface PersonaFocus {
  creativeEntrepreneur: number;
  systemsArchitect: number;
  productOperator: number;
}

export interface VibeState {
  mode: VibeMode;
  location: string;
  music: string;
  focus: string;
  vector: DirectionalVector;
  personaFocus: PersonaFocus;
  systemTheme: 'NOTHING_4.0' | 'INDUSTRIAL' | 'MINIMAL' | 'PRODUCT';
}

export interface SystemProof {
  id: string;
  title: string;
  problem: string;
  logic: string;
  outcome: string;
  industry: string;
  tags: string[];
  story?: string;
  imageUrl?: string;
  timestamp: string;
  link?: string;
}

export interface TraceLog {
  id: string;
  type: 'commit' | 'voice' | 'figma';
  content: string;
  timestamp: string;
  link?: string;
}

export interface IntelligenceInsight {
  id: string;
  statement: string;
  traceId: string;
  timestamp: string;
  evolution?: {
    from: string;
    resolution: string;
  };
  link?: string;
}

export interface TemporalNode {
  id: string;
  label: string;
  status: 'active' | 'deprecated' | 'signal';
  timestamp: string;
}

export interface Experiment {
  id: string;
  title: string;
  tag: string;
  tried: string;
  result: string;
}

export interface AudioInsight {
  id: string;
  title: string;
  duration: number;
  audioUrl: string;
  timestamp: string;
  isGated: boolean;
  tags: string[];
  transcript?: string;
}

export interface Signal {
  id: string;
  label: string;
  content: string;
  tags: string[];
  evidenceCount?: number;
  lastVerified?: string;
  strength?: number; // 0 to 1
}

export interface Identity {
  name: string;
  headline: string;
  bio: string;
  industry: string;
  tags: string[];
  signalLine: string;
  tradeTitle?: string;
  photoUrl?: string;
  location?: string;
  availability?: 'OPEN_FOR_COLLABORATION' | 'DEEP_WORK_ONLY' | 'STEALTH_MODE';
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    substack?: string;
  };
  corePhilosophy?: string;
}
