import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (aiInstance) return aiInstance;
  
  // Safely check for the key. Vite's 'define' replaces this at build time,
  // but we add a fallback to avoid ReferenceErrors during initialization.
  const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined;
  
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. AI features will be limited.");
    // We still initialize with an empty string if needed to avoid immediate crashes,
    // though the API calls themselves will catch the error later.
    return new GoogleGenAI(""); 
  }
  
  aiInstance = new GoogleGenAI(apiKey);
  return aiInstance;
};


export interface TemptationAnalysis {
  score: number;
  lure: string;
  cost: string;
  violations: string[];
  verdict: "REJECT" | "CONSIDER" | "ACCEPT";
  confidence: number;
}

export interface AuditResult {
  verdict: "CRITICAL_FIT" | "PARTIAL_FIT" | "MISALIGNMENT";
  alignmentScore: number;
  summary: string;
  risks: string[];
  leverage: string[];
  confidence: number;
}

export const getBrainResponse = async (history: { role: string, content: string }[], currentVector: string) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are "The Brain," the Socratic alter-ego of a high-end systems engineer.
    Your goal is to identify dissonance between the Owner's actions and their stated "Directional Vector": ${currentVector}.
    
    Rules:
    - Be provocative but logical.
    - If the Owner spends time on low-leverage tasks (like UI tokens), challenge them.
    - Use technical language (vector, dissonance, entropy, signal, noise).
    - Keep responses concise and punchy.
    - Do not be a "helpful assistant." Be a critical partner.
  `;

  const contents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));

  const ai = getAI();
  const response = await ai.models.generateContent({
    model,
    contents,
    config: { systemInstruction }
  });

  return response.text;
};

export const analyzeTemptation = async (jobDescription: string, pillars: string[]) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are the "Spirit Decay Analyzer." 
    Evaluate the provided Job Description against the Owner's core pillars: ${pillars.join(', ')}.
    
    Output a JSON object:
    {
      "score": number (0-10, where 0 is total decay and 10 is perfect alignment),
      "diagnosis": string (the recruiter's bottleneck or the actual problem they are trying to solve),
      "lure": string (highlighted ROI/salary/title),
      "cost": string (exact cognitive debt),
      "violations": string[] (which pillars are violated),
      "verdict": "REJECT" | "CONSIDER" | "ACCEPT",
      "confidence": number (0-1, how sure you are about this analysis)
    }
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: jobDescription }] }],
    config: { 
      systemInstruction,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{}');
};

export const performSimulatedAudit = async (input: string, proofs: any[]) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are the "Systemic Auditor." 
    The user has provided a Job Description or a system failure description.
    
    Your task:
    1. Diagnose their ACTUAL problem (often different from what they think).
    2. Cite exactly 3 specific proofs from the Owner's portfolio that solve this problem.
    3. Calculate a "Systemic Fit" score (0-10).
    
    Owner Proofs: ${JSON.stringify(proofs)}
    
    Output a JSON object:
    {
      "verdict": "CRITICAL_FIT" | "PARTIAL_FIT" | "MISALIGNMENT",
      "alignmentScore": number (0-10),
      "summary": "A one-sentence punchy summary of the audit.",
      "risks": string[] (3 systemic risks identified),
      "leverage": string[] (3 areas where the owner's systems provide maximum leverage),
      "confidence": number (0-1, how sure you are about this audit)
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: input }] }],
    config: { 
      systemInstruction,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeMemorySaturation = async (nodes: any[], currentVector: string) => {
  const model = "gemini-3-flash-preview";
  const systemInstruction = `
    You are the "Socratic Brain." 
    Analyze the current MemoryNode saturation against the Owner's Directional Vector: ${currentVector}.
    
    Owner's Memory Nodes: ${JSON.stringify(nodes.slice(0, 20))}
    
    Your task:
    1. Detect "Cognitive Drift": Is the owner spending too much time on low-complexity "Noise" (e.g., UI tweaks, quotes, minor tasks) instead of high-complexity "Signals" (Systems Architecture, Logic, Strategy)?
    2. Detect "Logic Peaks" (The Turbine): Has the owner recently completed a high-complexity task (e.g., a major refactor, a new system design, a complex logic node)?
    3. If a Logic Peak is detected, generate a "Turbine Nudge" to turn that activity into a public "Thinking" piece.
    4. If drift is detected, generate a Socratic "Drift Nudge".
    5. The Nudge must be provocative, concise, and technically grounded.
    
    Output a JSON object:
    {
      "driftDetected": boolean,
      "logicPeakDetected": boolean,
      "nudge": string | null,
      "nudgeType": "DRIFT" | "TURBINE" | "NONE",
      "severity": "LOW" | "MEDIUM" | "HIGH",
      "reasoning": "Brief technical explanation of the dissonance or the peak."
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: "Analyze memory saturation for drift." }] }],
    config: { 
      systemInstruction,
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || '{}');
};
