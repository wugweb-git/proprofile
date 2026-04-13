import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight, Check, Activity, Zap, Shield, Cpu, ExternalLink, MapPin, Music, X, Lock, TrendingUp, Search, RefreshCw, AlertCircle, GitCommit } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { useStore } from '../store/useStore';
import { MOCK_PROOFS, MOCK_SIGNALS, MOCK_PATTERNS, MOCK_IDENTITY, MOCK_PULSE, MOCK_CAPABILITIES, MOCK_AUDIO_INSIGHTS } from '../mockData';
import { VoiceInsightCard } from '../components/VoiceInsightCard';
import { LogicTraceModal } from '../components/LogicTraceModal';
import { cn } from '../lib/utils';
import { useVibe } from '../components/VibeProvider';

// --- NOTHING OS COMPONENTS ---
const DotMatrixText = ({ children, className, color = 'text-black/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

const CapabilityAxis = ({ label, depth, status }: { label: string, depth: number, status: string }) => (
  <div className="flex flex-col gap-2 group">
    <div className="flex justify-between items-end">
      <span className="font-display font-bold text-sm text-black">{label}</span>
      <DotMatrixText color="text-red-600" className="text-[8px]">{status}</DotMatrixText>
    </div>
    <div className="h-px w-full bg-black/5 relative">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${depth * 100}%` }}
        transition={{ duration: 1, ease: "circOut" }}
        className="h-full bg-black group-hover:bg-red-600 transition-colors"
      />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-black/10" />
    </div>
  </div>
);

// --- TRACE LOG COMPONENT ---
const TraceLog = ({ proof }: { proof: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const { openTrace } = useStore();

  const traceNodes = [
    { type: 'RAW NOTE', date: '2023.08', content: proof.problem },
    { type: 'SIGNAL', date: '2023.10', content: proof.logic },
    { type: 'EXECUTION', date: '2024.01', content: proof.outcome }
  ];

  return (
    <div className="mb-6 border-b border-black/5 pb-6">
      <div className="w-full flex items-center justify-between py-4 group">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col items-start gap-1 text-left"
        >
          <DotMatrixText color="text-black/30">[{proof.id.replace('sys_', '').toUpperCase()}]</DotMatrixText>
          <span className="font-display font-bold text-xl tracking-tight text-black group-hover:text-red-600 transition-colors">{proof.title}</span>
        </button>
        <div className="flex items-center gap-3">
          {proof.story && (
            <button 
              onClick={() => setShowStory(true)}
              className="px-4 py-2 rounded-full bg-black text-white text-[9px] font-mono uppercase tracking-widest hover:bg-red-600 transition-all duration-300 active:scale-95"
            >
              Story
            </button>
          )}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500", isOpen ? "bg-red-600 text-white nothing-red-glow" : "bg-black/5 text-black/40 hover:bg-black/10")}
          >
            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showStory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 md:p-8"
          >
            <button onClick={() => setShowStory(false)} className="absolute top-8 right-8 text-white/40 hover:text-white z-10"><X size={32}/></button>
            <div className="w-full max-w-[450px] aspect-[9/16] bg-[#111] rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/5">
              <img src={proof.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt={proof.title} referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12 space-y-6">
                <div className="flex gap-2">
                  {proof.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] font-mono text-white uppercase tracking-widest border border-white/10">{tag}</span>
                  ))}
                </div>
                <h2 className="text-4xl font-display font-bold text-white leading-tight">{proof.title}</h2>
                <p className="text-white/70 text-lg leading-relaxed font-light italic">"{proof.story}"</p>
                <div className="pt-8 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <img src={MOCK_IDENTITY.photoUrl} alt="Vedanshu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold">{MOCK_IDENTITY.name}</span>
                    <span className="text-white/40 text-[10px] font-mono uppercase">{proof.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="py-6 pl-4 border-l-2 border-red-600/20 ml-2 relative">
              {/* Neural Thread SVG */}
              <svg className="absolute left-[-2px] top-0 w-full h-full pointer-events-none opacity-10" preserveAspectRatio="none">
                <motion.path 
                  d="M 0 0 Q 50 50 0 100" 
                  stroke="red" 
                  strokeWidth="1" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                />
              </svg>

              <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <DotMatrixText color="text-red-600">VERIFICATION_LAYER</DotMatrixText>
                  <button 
                    onClick={() => openTrace(proof.id)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600/10 rounded-full border border-red-600/20 group/stamp"
                  >
                    <Shield size={10} className="text-red-600" />
                    <span className="text-[8px] font-mono text-red-600 uppercase tracking-widest font-bold">Traceability_Stamp</span>
                  </button>
                </div>
                {traceNodes.map((node, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-red-600" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <DotMatrixText color="text-black/40">{node.type}</DotMatrixText>
                        <span className="text-[10px] font-mono text-black/20">{node.date}</span>
                      </div>
                      <p className="text-base text-black/70 leading-relaxed max-w-md">{node.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- COMPLEXITY PORT (THE GATE) ---
const ComplexityPort = () => {
  const [jd, setJd] = useState('');
  const [state, setState] = useState<'idle' | 'analyzing' | 'results'>('idle');

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setState('analyzing');
    setTimeout(() => setState('results'), 2000);
  };

  return (
    <div className="mt-32 mb-40">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-black/5" />
        <DotMatrixText color="text-black/60">THE_GATE // COMPLEXITY_PORT</DotMatrixText>
        <div className="h-px flex-1 bg-black/5" />
      </div>

      <div className="nothing-card relative overflow-hidden">
        <div className="absolute inset-0 nothing-dot-grid pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10">
              <h3 className="font-display font-bold text-2xl mb-4">Systemic Audit</h3>
              <p className="text-black/50 mb-8 text-sm">Paste a Job Description or Project Brief to evaluate systemic fit and logic alignment.</p>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="[PASTE_JD_OR_BRIEF_HERE]"
                className="w-full h-48 bg-black/5 border-none outline-none p-6 rounded-2xl font-mono text-sm resize-none placeholder:text-black/20 focus:ring-1 focus:ring-red-600/20 transition-all"
              />
              <div className="flex justify-end mt-6">
                <button 
                  onClick={handleAnalyze}
                  disabled={!jd.trim()}
                  className="px-8 py-4 bg-black text-white font-bold uppercase tracking-widest text-[10px] rounded-full disabled:opacity-20 transition-all flex items-center gap-3 hover:bg-red-600"
                >
                  Run Audit <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {state === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 h-64 flex flex-col items-center justify-center">
              <div className="relative">
                <Activity size={48} className="text-red-600 animate-pulse mb-6" />
                <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full animate-pulse" />
              </div>
              <DotMatrixText color="text-red-600">EXTRACTING_LOGIC_REQUIREMENTS...</DotMatrixText>
            </motion.div>
          )}

          {state === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
              <div className="flex justify-between items-end mb-12 pb-8 border-b border-black/5">
                <div>
                  <DotMatrixText color="text-black/40" className="mb-2">SYSTEMIC_FIT</DotMatrixText>
                  <div className="text-5xl font-display font-bold tracking-tighter text-black">High Match</div>
                </div>
                <div className="text-right">
                  <DotMatrixText color="text-red-600" className="mb-2">MVS_SCORE</DotMatrixText>
                  <div className="text-6xl font-display font-bold text-red-600">8.7<span className="text-xl text-black/20">/10</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div>
                  <DotMatrixText color="text-black/40" className="mb-6">DETECTED_COMPLEXITY</DotMatrixText>
                  <ul className="space-y-4">
                    <li className="text-base text-black/70 flex items-start gap-3"><Check size={18} className="text-red-600 mt-0.5 shrink-0"/> Legacy system stabilization</li>
                    <li className="text-base text-black/70 flex items-start gap-3"><Check size={18} className="text-red-600 mt-0.5 shrink-0"/> Cross-functional ops alignment</li>
                  </ul>
                </div>
                <div>
                  <DotMatrixText color="text-black/40" className="mb-6">VERIFIED_PROOF</DotMatrixText>
                  <ul className="space-y-4">
                    <li className="text-base text-black/70 flex items-start gap-3"><ArrowRight size={18} className="text-black/20 mt-0.5 shrink-0"/> Matches Adneto PRD automation</li>
                    <li className="text-base text-black/70 flex items-start gap-3"><ArrowRight size={18} className="text-black/20 mt-0.5 shrink-0"/> Matches Kotak retention logic</li>
                  </ul>
                </div>
              </div>

              <motion.button 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="w-full py-6 bg-red-600 text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-black transition-all shadow-xl shadow-red-600/20"
              >
                Book Systems Audit Call
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function PublicProxy() {
  const { state } = useVibe();
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent') || 'architect'; // Default to architect
  const { openTrace } = useStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'systems' | 'thinking'>('profile');
  const modeParam = searchParams.get('mode');
  const roleParam = searchParams.get('role');
  const authParam = searchParams.get('auth');

  const [jdInput, setJdInput] = useState('');
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const runAudit = async () => {
    if (!jdInput.trim()) return;
    setIsAuditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `As an Identity Auditor, evaluate the alignment between this Job Description and the Tenant's Identity Profile.
        
        TENANT_IDENTITY:
        Headline: ${MOCK_IDENTITY.headline}
        Bio: ${MOCK_IDENTITY.bio}
        Signals: ${MOCK_SIGNALS.map(s => s.label).join(', ')}
        
        JOB_DESCRIPTION:
        ${jdInput}
        
        Provide a concise, dot-matrix style report (Nothing OS 4.0 tone) highlighting:
        1. CRITICAL_OVERLAPS (Where the tenant excels)
        2. SYSTEMIC_GAPS (Where alignment is weak)
        3. ALIGNMENT_SCORE (0-100%)` }] }],
        tools: [{ googleSearch: {} }]
      } as any);
      
      setAuditResult(response.text || "Audit failed to synthesize.");
    } catch (err) {
      console.error(err);
      setAuditResult("NEURAL_LINK_FAILURE: Check API configuration.");
    } finally {
      setIsAuditing(false);
    }
  };

  const { creativeEntrepreneur, systemsArchitect, productOperator } = state.personaFocus;

  // Adaptive Logic
  const isArchitectMode = modeParam === 'architect' || roleParam === 'fintech';
  const isFounderMode = modeParam === 'founder' || roleParam === 'entrepreneur';
  const isAuthorized = authParam === 'true' || authParam === 'prism';

  const { name, tradeTitle, photoUrl, bio, tags, location, availability, socialLinks, corePhilosophy } = MOCK_IDENTITY;

  // Determine dominant persona for narrative shift
  const personas = [
    { id: 'entrepreneur', label: 'Creative Entrepreneur', value: creativeEntrepreneur, icon: <Zap size={14}/> },
    { id: 'architect', label: 'Systems Architect', value: systemsArchitect, icon: <Cpu size={14}/> },
    { id: 'operator', label: 'Product Operator', value: productOperator, icon: <Shield size={14}/> },
  ];
  const dominant = personas.reduce((prev, current) => (prev.value > current.value) ? prev : current);

  const getHeadline = () => {
    if (isArchitectMode) return "Indexing Logic, not just Titles.";
    if (isFounderMode) return "Building the Future of Value.";
    if (dominant.id === 'architect') return "Architecting clarity from chaos.";
    if (dominant.id === 'entrepreneur') return "Building the future of value.";
    return "Ruthless product execution.";
  };

  const getManifesto = () => {
    if (isArchitectMode) return "I focus on the structural integrity of digital systems. Rework is a decision failure, and I fix it at the root. My work spans Fintech, Adtech, and Retail turnaround.";
    if (isFounderMode) return "I build ventures that scale. From 0 to 1, I bridge the gap between vision and operational reality. I don't design interfaces; I work on decisions, systems, and leverage.";
    if (dominant.id === 'architect') return "I focus on the structural integrity of digital systems. Rework is a decision failure, and I fix it at the root.";
    if (dominant.id === 'entrepreneur') return "I build ventures that scale. From 0 to 1, I bridge the gap between vision and operational reality.";
    return "I deliver high-density product outcomes. My focus is on the layer beneath the surface where systems actually live.";
  };

  return (
    <div className={cn(
      "min-h-screen selection:bg-red-600 selection:text-white transition-all duration-700",
      intent === 'architect' ? "bg-[#0a0a0a] text-white font-mono tracking-tight" : "bg-white text-black font-sans"
    )}>
      
      {/* SYSTEM STATUS BAR */}
      <div className="fixed top-0 left-0 right-0 h-8 bg-black text-white z-[60] flex items-center px-8 overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">System Status: {state.mode} // Active</span>
          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Location: {state.location} // {new Date().toLocaleTimeString()}</span>
          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Neural Load: 42% // Stable</span>
          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Music: {state.music} // Syncing</span>
          {/* Duplicate for seamless marquee */}
          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">System Status: {state.mode} // Active</span>
          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Location: {state.location} // {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* THE SIGNAL LINE (Fixed Header) */}
      <div className={cn(
        "fixed top-8 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl border-b border-black/5 z-50 flex items-center justify-center transition-all duration-700",
        intent === 'architect' ? "border-red-600/20 bg-black/80 text-white" : ""
      )}>
        <div className={cn(
          "w-full max-w-[600px] px-8 flex justify-between items-center transition-all duration-700",
          intent === 'founder' ? "max-w-[800px]" : ""
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full overflow-hidden border border-black/5 bg-black/5",
              intent === 'founder' ? "w-16 h-16" : ""
            )}>
              <img src={photoUrl} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-display font-bold text-lg tracking-tight",
                intent === 'architect' ? "text-white" : "text-black",
                intent === 'founder' ? "text-2xl" : ""
              )}>{name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-black/40 uppercase tracking-widest">{intent.toUpperCase()}_MODE</span>
                <div className="text-red-600">{dominant.icon}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 bg-black/5 p-1 rounded-full">
              {['profile', 'systems', 'thinking'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[8px] font-mono uppercase tracking-widest transition-all",
                    activeTab === tab ? "bg-black text-white" : "text-black/40 hover:text-black"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <DotMatrixText color="text-red-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /> {state.mode}
            </DotMatrixText>
          </div>
        </div>
      </div>

      {/* THE MANUSCRIPT (Strict Editorial Column) */}
      <main className={cn(
        "w-full max-w-[600px] mx-auto px-8 pt-56 pb-32 transition-all duration-700",
        intent === 'founder' ? "max-w-[800px]" : ""
      )}>
        
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-32">
            {/* Philosophy / Hero */}
            <section className={cn(
              "space-y-12",
              intent === 'founder' ? "flex flex-col md:flex-row md:items-end justify-between gap-12" : ""
            )}>
              <div className="flex-1">
                <DotMatrixText color="text-black/20" className="mb-8">MANIFESTO // 01</DotMatrixText>
                <h1 className={cn(
                  "text-5xl md:text-7xl font-display font-bold tracking-tighter leading-[0.9] mb-12 transition-colors duration-700",
                  intent === 'architect' ? "text-white" : "text-black",
                  intent === 'founder' ? "text-8xl" : ""
                )}>
                  {getHeadline()}
                </h1>
                <div className={cn(
                  "space-y-8 text-xl leading-relaxed font-light transition-colors duration-700",
                  intent === 'architect' ? "text-white/70" : "text-black/80"
                )}>
                  <p>
                    {getManifesto()}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-black/5 rounded-full text-[10px] font-mono text-black/40 uppercase tracking-widest border border-black/5">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {intent === 'founder' && (
                <div className="md:w-64 space-y-12 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-black/40 mb-2">Capital_Deployed</span>
                    <span className="text-4xl font-display font-bold">$12.4M</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-black/40 mb-2">Systems_Scale</span>
                    <span className="text-4xl font-display font-bold">1.2M+</span>
                  </div>
                </div>
              )}
            </section>

            {/* Capability Line (Horizontal Axis) */}
            <section>
              <DotMatrixText color="text-black/20" className="mb-12">SCOPE // 02</DotMatrixText>
              <div className="relative h-24 flex items-center justify-between px-4">
                <div className="absolute inset-x-0 h-px bg-black/5 top-1/2 -translate-y-1/2" />
                {['UX', 'PRODUCT', 'SYSTEMS', 'OPS', 'TECH'].map((label) => (
                  <div key={label} className="relative flex flex-col items-center gap-4">
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-all duration-500",
                      label === 'SYSTEMS' ? "bg-red-600 nothing-red-glow scale-150" : "bg-black/10"
                    )} />
                    <span className={cn(
                      "text-[10px] font-mono uppercase tracking-widest transition-all",
                      label === 'SYSTEMS' ? "text-red-600 font-bold" : "text-black/20"
                    )}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Pulse Section */}
            <section>
              <div className="flex justify-between items-end mb-12">
                <DotMatrixText color={intent === 'architect' ? "text-red-600" : "text-black/20"}>LIVE_PULSE // 03</DotMatrixText>
                <div className={cn(
                  "flex items-center gap-2 text-[10px] font-mono uppercase transition-colors duration-700",
                  intent === 'architect' ? "text-white/40" : "text-black/40"
                )}>
                  Real-time sync <Activity size={10} className="text-red-600" />
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-8 hide-scrollbar snap-x">
                {MOCK_PULSE.map((pulse) => (
                  <div key={pulse.id} className={cn(
                    "min-w-[280px] rounded-3xl p-6 flex flex-col gap-4 snap-start border transition-all duration-700 group",
                    intent === 'architect' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5 hover:border-red-600/20"
                  )}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-red-600 font-bold uppercase tracking-widest">{pulse.platform}</span>
                      <span className={cn(
                        "text-[10px] font-mono uppercase transition-colors duration-700",
                        intent === 'architect' ? "text-white/20" : "text-black/20"
                      )}>{pulse.timestamp}</span>
                    </div>
                    <p className={cn(
                      "text-sm font-medium leading-snug flex-1 transition-colors duration-700",
                      intent === 'architect' ? "text-white/70 group-hover:text-white" : "text-black/70 group-hover:text-black"
                    )}>
                      {pulse.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", pulse.complexity === 'high' ? "bg-red-600" : (intent === 'architect' ? "bg-white/20" : "bg-black/20"))} />
                      <DotMatrixText color={intent === 'architect' ? "text-white/30" : "text-black/30"} className="text-[8px] uppercase tracking-tighter">Complexity: {pulse.complexity}</DotMatrixText>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trajectory */}
            <section>
              <DotMatrixText color={intent === 'architect' ? "text-red-600" : "text-black/20"} className="mb-12">TRAJECTORY // 04</DotMatrixText>
              <div className={cn(
                "relative pl-8 border-l space-y-16 transition-colors duration-700",
                intent === 'architect' ? "border-white/10" : "border-black/5"
              )}>
                {[
                  { year: '2024', role: 'Systems Architect', company: 'Prism OS', desc: 'Engineering the future of agentic identity layers.' },
                  { year: '2022', role: 'Product Lead', company: 'Kotak Rewards', desc: 'Scaled loyalty systems for 10M+ users.' },
                  { year: '2020', role: 'Founder', company: 'Adneto', desc: 'Built and exited a high-velocity adtech engine.' }
                ].map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[37px] top-0 w-4 h-4 rounded-full bg-white border-2 border-red-600 nothing-red-glow" />
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-red-600 font-bold tracking-widest">{item.year}</span>
                      <h4 className={cn(
                        "text-2xl font-display font-bold transition-colors duration-700",
                        intent === 'architect' ? "text-white" : "text-black"
                      )}>{item.role}</h4>
                      <p className={cn(
                        "font-mono text-xs uppercase tracking-widest transition-colors duration-700",
                        intent === 'architect' ? "text-white/40" : "text-black/40"
                      )}>{item.company}</p>
                      <p className={cn(
                        "text-sm leading-relaxed max-w-md mt-2 transition-colors duration-700",
                        intent === 'architect' ? "text-white/60" : "text-black/60"
                      )}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-6xl font-display font-bold tracking-tighter text-black uppercase leading-none">
                Engineering <br/> <span className="text-red-600">Clarity</span> <br/> From Chaos.
              </h2>
            </section>
          </motion.div>
        )}

        {activeTab === 'systems' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-32">
            <section>
              <DotMatrixText color={intent === 'architect' ? "text-red-600" : "text-black/20"} className="mb-12">DEEP_PROOF // SYSTEMS</DotMatrixText>
              <div className="space-y-12">
                {MOCK_PROOFS.map((proof) => (
                  <div key={proof.id} className="group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <DotMatrixText color={intent === 'architect' ? "text-white/30" : "text-black/30"} className="mb-2">[{proof.id.toUpperCase()}]</DotMatrixText>
                        <h3 className={cn(
                          "text-3xl font-display font-bold transition-colors duration-700",
                          intent === 'architect' ? "text-white" : "text-black"
                        )}>{proof.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        {proof.tags.map(t => (
                          <span key={t} className={cn(
                            "px-2 py-1 rounded-full text-[8px] font-mono uppercase tracking-widest transition-colors duration-700",
                            intent === 'architect' ? "bg-white/10 text-white/40" : "bg-black/5 text-black/40"
                          )}>{t}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className={cn(
                        "p-8 rounded-[2rem] border transition-all duration-700",
                        intent === 'architect' ? "bg-white/5 border-white/10 hover:border-red-600/20" : "bg-black/5 border-transparent hover:border-red-600/20"
                      )}>
                        <DotMatrixText color="text-red-600" className="mb-4">01_THE_PROBLEM</DotMatrixText>
                        <p className={cn(
                          "leading-relaxed transition-colors duration-700",
                          intent === 'architect' ? "text-white/70" : "text-black/70"
                        )}>{proof.problem}</p>
                      </div>
                      <div className={cn(
                        "p-8 rounded-[2rem] border transition-all duration-700",
                        intent === 'architect' ? "bg-white/5 border-white/10 hover:border-red-600/20" : "bg-black/5 border-transparent hover:border-red-600/20"
                      )}>
                        <DotMatrixText color="text-red-600" className="mb-4">02_THE_LOGIC</DotMatrixText>
                        <p className={cn(
                          "leading-relaxed transition-colors duration-700",
                          intent === 'architect' ? "text-white/70" : "text-black/70"
                        )}>{proof.logic}</p>
                      </div>
                      <div className="p-8 bg-black rounded-[2rem] text-white nothing-red-glow border border-white/5 relative group/outcome">
                        <DotMatrixText color="text-red-600" className="mb-4">03_THE_OUTCOME</DotMatrixText>
                        <p className="text-white/80 leading-relaxed mb-6">{proof.outcome}</p>
                        <button 
                          onClick={() => openTrace(proof.id)}
                          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-red-600 hover:text-white transition-colors"
                        >
                          <GitCommit size={14} />
                          Ancestry of this Thought
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'thinking' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-32">
            <section>
              <DotMatrixText color={intent === 'architect' ? "text-red-600" : "text-black/20"} className="mb-12">AUTHORITY // SPARKS</DotMatrixText>
              <div className="grid grid-cols-1 gap-6">
                {MOCK_AUDIO_INSIGHTS.map(insight => (
                  <div key={insight.id} className="bg-black rounded-[3rem] overflow-hidden nothing-red-glow border border-white/5">
                    <VoiceInsightCard insight={insight} isAuthorized={isAuthorized} />
                  </div>
                ))}
              </div>
            </section>
            
            <section>
              <DotMatrixText color={intent === 'architect' ? "text-red-600" : "text-black/20"} className="mb-12">SIGNALS // VERIFIED</DotMatrixText>
              <div className="space-y-8">
                {MOCK_SIGNALS.map((signal) => (
                  <div key={signal.id} className={cn(
                    "rounded-[2.5rem] p-8 border transition-all duration-700",
                    intent === 'architect' ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"
                  )}>
                    <h4 className={cn(
                      "font-display font-bold text-2xl mb-4 transition-colors duration-700",
                      intent === 'architect' ? "text-white" : "text-black"
                    )}>{signal.label}</h4>
                    <p className={cn(
                      "text-lg leading-relaxed transition-colors duration-700 mb-6",
                      intent === 'architect' ? "text-white/60" : "text-black/60"
                    )}>{signal.content}</p>
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => openTrace(signal.id)}
                        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-red-600 hover:text-black transition-colors"
                      >
                        <GitCommit size={14} />
                        Trace Logic
                      </button>
                      <div className="flex items-center gap-2">
                        <Shield size={10} className="text-red-600" />
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">[Verified via Logic Commit]</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {/* The Gate */}
        <ComplexityPort />

        {/* JD Intelligence Section */}
        <section className="mb-32">
          <DotMatrixText color="text-black/20" className="mb-12">JD_INTELLIGENCE // 09</DotMatrixText>
          <div className="bg-black rounded-[3rem] p-12 nothing-red-glow text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <Search size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold tracking-tight">JD Alignment Test</h3>
                <DotMatrixText color="text-white/40">Powered by Gemini + Google Search</DotMatrixText>
              </div>
            </div>
            
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-md">
              Paste a Job Description or Industry Requirement to see how my "Signals" and "Verified Proofs" align with your specific needs.
            </p>

            <div className="space-y-4">
              <textarea 
                value={jdInput}
                onChange={(e) => setJdInput(e.target.value)}
                placeholder="PASTE_JD_HERE..."
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 text-white text-xs font-mono uppercase tracking-widest outline-none focus:border-red-600 transition-all h-32 resize-none"
              />
              <button 
                onClick={runAudit}
                disabled={isAuditing}
                className="w-full py-5 bg-red-600 rounded-full text-[10px] font-mono uppercase tracking-[0.3em] font-bold hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAuditing ? <RefreshCw size={16} className="animate-spin" /> : 'Run Alignment Audit'}
              </button>
            </div>

            <AnimatePresence>
              {auditResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 p-8 bg-white/5 rounded-[2rem] border border-white/10"
                >
                  <div className="flex justify-between items-center mb-6">
                    <DotMatrixText color="text-red-600">AUDIT_REPORT // VERIFIED</DotMatrixText>
                    <button onClick={() => setAuditResult(null)} className="text-white/20 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="text-white/80 text-xs font-mono leading-relaxed uppercase tracking-wider whitespace-pre-wrap">
                    {auditResult}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 gap-8">
              <div>
                <DotMatrixText color="text-red-600" className="mb-2">SYSTEM_STATUS</DotMatrixText>
                <div className="text-xl font-display font-bold">READY</div>
              </div>
              <div>
                <DotMatrixText color="text-white/20" className="mb-2">LATENCY</DotMatrixText>
                <div className="text-xl font-display font-bold">~1.2s</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-20 border-t border-black/5 flex flex-col items-center text-center">
          <DotMatrixText color="text-black/20" className="mb-6">END_OF_TRANSMISSION</DotMatrixText>
          <p className="text-sm text-black/40 font-mono uppercase tracking-widest">© 2026 Vedanshu Srivastava // Built with Antigravity</p>
        </footer>

      </main>
      <LogicTraceModal />
    </div>
  );
}
