import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mic, Settings, X, Check, Activity, Wifi, Battery, Signal as SignalIcon, Share, Clipboard, Plus, Minus, ChevronRight, Sliders, MessageSquare, Database, Layers, Zap, MapPin, RefreshCw, TrendingUp, GitCommit, Shield, Search } from 'lucide-react';
import { useStore } from '../store/useStore';

import { memoryEngine, MemoryNode } from '../services/memoryEngine';
import { cn } from '../lib/utils';
import { useVibe } from '../components/VibeProvider';
import { VentureVault } from '../components/VentureVault';
import { PersonalizationCenter } from '../components/PersonalizationCenter';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { VoiceInsightCard } from '../components/VoiceInsightCard';
import { SyncCenter } from '../components/SyncCenter';
import { MarketIntelligence } from '../components/MarketIntelligence';
import { NeuralTrace } from '../components/NeuralTrace';
import { CognitiveHeatmap } from '../components/CognitiveHeatmap';
import { LogicTraceModal } from '../components/LogicTraceModal';
import { getBrainResponse, analyzeTemptation, analyzeMemorySaturation, generateGeminiText, hasGeminiApiKey } from '../services/geminiService';
import EvaluatorIntake from '../components/EvaluatorIntake';
import { MOCK_IDENTITY, MOCK_SIGNALS, MOCK_AUDIO_INSIGHTS, MOCK_PROOFS } from '../mockData';
import { AudioInsight, Signal } from '../types';

// --- NOTHING OS COMPONENTS ---
const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

const NothingToggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center",
      active ? "bg-red-600" : "bg-white/10"
    )}
  >
    <motion.div 
      animate={{ x: active ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-4 h-4 bg-white rounded-full"
    />
  </button>
);

const VisibilitySlider = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
  <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 space-y-4">
    <div className="flex justify-between items-center">
      <span className="font-display font-bold text-white text-sm uppercase tracking-tight">{label}</span>
      <span className="font-mono text-[10px] text-red-600 font-bold">{value}%</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max="100" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-600"
    />
  </div>
);

const SwipeCard = ({ item, onSwipeLeft, onSwipeRight, onSynthesize, isTop }: { item: MemoryNode, onSwipeLeft: () => void, onSwipeRight: () => void, onSynthesize: () => void, isTop: boolean }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x > 100) onSwipeRight();
    else if (info.offset.x < -100) onSwipeLeft();
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      animate={{ scale: isTop ? 1 : 0.9, y: isTop ? 0 : 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      className={cn(
        "absolute inset-0 bg-[#111] border border-white/5 rounded-[2.5rem] p-8 flex flex-col shadow-2xl overflow-hidden",
        isTop ? "z-10 cursor-grab active:cursor-grabbing" : "z-0 pointer-events-none"
      )}
    >
      <div className="absolute inset-0 nothing-dot-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-8">
          <DotMatrixText color="text-red-600">HOLD // RAW</DotMatrixText>
          <div className="flex items-center gap-4">
            {isTop && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSynthesize(); }}
                className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all"
              >
                <Zap size={14} />
              </button>
            )}
            <span className="font-mono text-[10px] text-white/20 uppercase">
              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'NOW'}
            </span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center">
          <p className="text-3xl font-display font-bold leading-tight tracking-tight text-white">
            {item.content}
          </p>
        </div>
        
        {isTop && (
          <div className="flex justify-between items-center pt-8 border-t border-white/5">
            <div className="flex items-center gap-2 text-white/30">
              <X size={16}/> <span className="text-[10px] font-mono uppercase tracking-widest">Discard</span>
            </div>
            <div className="flex items-center gap-2 text-red-600">
              <span className="text-[10px] font-mono uppercase tracking-widest">Promote</span> <Check size={16}/>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function OwnerHub() {
  const { mvsMode, setMvsMode, traceModalOpen, openTrace, closeTrace } = useStore();
  const [holdItems, setHoldItems] = useState<MemoryNode[]>([]);
  const [linkingNode, setLinkingNode] = useState<MemoryNode | null>(null);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'lockscreen' | 'triage' | 'settings' | 'inbox' | 'consensus' | 'personalization' | 'vault' | 'sparks' | 'sync' | 'intelligence' | 'traces' | 'spirit' | 'briefing' | 'temptation' | 'magic' | 'telemetry' | 'media'>('lockscreen');
  const [audioInsights, setAudioInsights] = useState<AudioInsight[]>(MOCK_AUDIO_INSIGHTS);
  const [time, setTime] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  const [identityAnchor, setIdentityAnchor] = useState(MOCK_IDENTITY.headline);
  const [isEditingAnchor, setIsEditingAnchor] = useState(false);
  const [isAddingSignal, setIsAddingSignal] = useState(false);
  const [newSignalLabel, setNewSignalLabel] = useState('');
  const [signals, setSignals] = useState(MOCK_SIGNALS);
  const [spiritDecay, setSpiritDecay] = useState(15); // 15% decay initially
  const [brainMessages, setBrainMessages] = useState<{ role: string, content: string }[]>([
    { role: 'model', content: "System initialized. I am monitoring your cognitive drift." }
  ]);
  const [isBrainThinking, setIsBrainThinking] = useState(false);
  const [lastAnalysisTime, setLastAnalysisTime] = useState(0);
  const [unreadNudges, setUnreadNudges] = useState(0);
  const [driftAlert, setDriftAlert] = useState<{ nudge: string, severity: string } | null>(null);
  const { state, setState } = useVibe();

  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const runDriftAnalysis = async (force = false) => {
    if (!force && Date.now() - lastAnalysisTime < 60000) return; // Throttle to 60s for auto-runs
    
    setIsBrainThinking(true);
    try {
      const nodes = memoryEngine.getAllNodes();
      const result = await analyzeMemorySaturation(nodes, state.vector.focus);
      
      if (result.nudge) {
        const prefix = result.nudgeType === 'TURBINE' ? '[LOGIC_PEAK_DETECTED]' : '[DRIFT_DETECTED]';
        const newMessage = { role: 'model', content: `${prefix} ${result.nudge}` };
        setBrainMessages(prev => [...prev, newMessage]);
        
        if (activeView !== 'inbox') {
          setUnreadNudges(prev => prev + 1);
        }

        if (result.nudgeType === 'DRIFT') {
          setSpiritDecay(prev => Math.min(100, prev + (result.severity === 'HIGH' ? 15 : 5)));
          if (result.severity === 'HIGH' || result.severity === 'MEDIUM') {
            setDriftAlert({ nudge: result.nudge, severity: result.severity });
          }
        } else if (result.nudgeType === 'TURBINE') {
          setSpiritDecay(prev => Math.max(0, prev - 10));
        }
      }
      setLastAnalysisTime(Date.now());
    } catch (err) {
      console.error("Drift Analysis Error:", err);
    } finally {
      setIsBrainThinking(false);
    }
  };

  useEffect(() => {
    if (activeView === 'inbox') {
      setUnreadNudges(0);
      runDriftAnalysis(true);
    }
  }, [activeView]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const handleAddSignal = () => {
    if (newSignalLabel.trim()) {
      const newSignal: Signal = {
        id: `sig_${Date.now()}`,
        label: newSignalLabel,
        content: 'New signal captured manually.',
        tags: ['MANUAL'],
        lastVerified: new Date().toISOString().split('T')[0],
        strength: 0.5,
        evidenceCount: 1
      };
      setSignals([newSignal, ...signals]);
      setNewSignalLabel('');
      setIsAddingSignal(false);

      // Trigger brain nudge on manual signal addition
      triggerBrainNudge(`User manually added a signal: ${newSignalLabel}. Is this a distraction from the core vector?`);
    }
  };

  const triggerBrainNudge = async (prompt: string) => {
    setIsBrainThinking(true);
    try {
      const response = await getBrainResponse([...brainMessages, { role: 'user', content: prompt }], state.vector.focus);
      setBrainMessages(prev => [...prev, { role: 'user', content: prompt }, { role: 'model', content: response }]);
      
      // Calculate decay based on complexity of recent actions
      setSpiritDecay(prev => Math.min(100, prev + (prompt.length % 10)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsBrainThinking(false);
    }
  };

  useEffect(() => {
    const refreshHold = () => {
      setHoldItems(memoryEngine.getNodesByState('HOLD'));
      // Trigger analysis on new memory capture
      runDriftAnalysis();
    };
    refreshHold();
    
    window.addEventListener('memory_updated', refreshHold);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.removeEventListener('memory_updated', refreshHold);
      clearInterval(timer);
    };
  }, []);

  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSynthesize = async (node: MemoryNode) => {
    setIsSynthesizing(true);
    try {
      if (!hasGeminiApiKey()) {
        return;
      }

      const response = await generateGeminiText(`Synthesize this raw thought into a structured Identity Signal.

RAW_THOUGHT:
${node.content}

Return a JSON object with:
{
  "label": "Short, punchy label",
  "content": "Synthesized logic",
  "tags": ["Tag1", "Tag2"],
  "strength": 0.85
}`);

      const result = JSON.parse(response || "{}");
      if (result.label) {
        const newSignal = {
          id: `sig_${Date.now()}`,
          label: result.label,
          content: result.content,
          tags: result.tags,
          strength: result.strength,
          evidenceCount: 1,
          lastVerified: new Date().toISOString().split('T')[0]
        };
        setSignals([newSignal, ...signals]);
        handleSwipeLeft(node); // Remove from hold
        setActiveView('consensus');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleSwipeLeft = (node: MemoryNode) => {
    memoryEngine.discard(node.id);
    setHoldItems(prev => prev.filter(n => n.id !== node.id));
  };

  const handleSwipeRight = (node: MemoryNode) => {
    setLinkingNode(node);
  };

  const toggleLink = (link: string) => {
    setSelectedLinks(prev => 
      prev.includes(link) ? prev.filter(l => l !== link) : [...prev, link]
    );
  };

  const handleConfirmLink = () => {
    if (linkingNode && selectedLinks.length > 0) {
      memoryEngine.promote(linkingNode.id, 'SIGNAL', linkingNode.content, selectedLinks);
      
      // Update local signals state
      const newSignal: Signal = {
        id: `sig_${Date.now()}`,
        label: linkingNode.content.substring(0, 20) + '...',
        content: linkingNode.content,
        tags: selectedLinks,
        strength: 0.8,
        evidenceCount: 1,
        lastVerified: new Date().toISOString().split('T')[0]
      };
      setSignals([newSignal, ...signals]);
      
      setHoldItems(prev => prev.filter(n => n.id !== linkingNode.id));
      setLinkingNode(null);
      setSelectedLinks([]);
      
      // Trigger a visual shift (simulated)
      setActiveView('consensus');
      
      // Trigger brain nudge
      triggerBrainNudge(`You graduated a raw thought to a Logic Node: "${newSignal.label}". How does this impact the overall system entropy?`);
    }
  };

  const handleCapture = () => {
    if (inputValue.trim()) {
      memoryEngine.capture(inputValue, 'manual');
      setHoldItems(memoryEngine.getNodesByState('HOLD'));
      setInputValue('');
      setActiveView('triage');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      
      {/* Device Frame */}
      <div className="w-full max-w-[390px] h-[844px] bg-[#0a0a0a] rounded-[3.5rem] border-[12px] border-[#1a1a1a] relative overflow-hidden shadow-[0_0_100px_rgba(255,0,0,0.1)]">
        
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 px-8 flex justify-between items-center z-50">
          <span className="text-xs font-bold text-white">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <div className="flex items-center gap-2 text-white/40">
            <SignalIcon size={14} />
            <Wifi size={14} />
            <Battery size={14} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeView === 'lockscreen' && (
            <motion.div 
              key="lockscreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col p-8 pt-24"
            >
              <div className="mb-auto">
                <h1 className="text-8xl font-display font-bold tracking-tighter text-white mb-2">
                  {time.getHours()}:{time.getMinutes().toString().padStart(2, '0')}
                </h1>
                <div className="flex items-center gap-4">
                  <DotMatrixText color="text-red-600">PRISM_OS // 4.0</DotMatrixText>
                  <div className="flex items-center gap-2">
                    <MapPin size={10} className="text-white/20" />
                    <span className="text-[10px] font-mono text-white/20 uppercase">{state.location}</span>
                  </div>
                </div>
                
                {/* System Health & MVS Toggle */}
                <div className="mt-10 mb-8 space-y-6">
                  <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <DotMatrixText color="text-white/40">SPIRIT_DECAY_GAUGE</DotMatrixText>
                      <span className={cn(
                        "font-mono text-[10px] font-bold",
                        spiritDecay > 50 ? "text-red-600" : "text-white/40"
                      )}>{spiritDecay}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${spiritDecay}%` }}
                        className={cn(
                          "h-full transition-colors duration-500",
                          spiritDecay > 70 ? "bg-red-600 nothing-red-glow" : 
                          spiritDecay > 40 ? "bg-orange-500" : "bg-white/20"
                        )}
                      />
                    </div>
                    <p className="text-[8px] font-mono text-white/20 uppercase mt-3 tracking-widest">
                      {spiritDecay > 70 ? "CRITICAL_DRIFT_DETECTED // RECALIBRATE_NOW" : 
                       spiritDecay > 40 ? "MODERATE_ENTROPY // MONITOR_LOGIC" : "SYSTEM_STABLE // HIGH_ALIGNMENT"}
                    </p>
                  </div>

                  <div className="relative h-14 bg-white/5 rounded-full p-1 flex items-center border border-white/10">
                    <motion.div 
                      className="absolute inset-y-1 rounded-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)] z-0"
                      initial={false}
                      animate={{ 
                        left: mvsMode === 'capital' ? '4px' : '50%',
                        right: mvsMode === 'capital' ? '50%' : '4px'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    <button 
                      onClick={() => setMvsMode('capital')}
                      className={cn(
                        "flex-1 h-full rounded-full z-10 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-500",
                        mvsMode === 'capital' ? "text-white font-bold" : "text-white/20 hover:text-white/40"
                      )}
                    >
                      Capital
                    </button>
                    <button 
                      onClick={() => setMvsMode('spirit')}
                      className={cn(
                        "flex-1 h-full rounded-full z-10 text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-500",
                        mvsMode === 'spirit' ? "text-white font-bold" : "text-white/20 hover:text-white/40"
                      )}
                    >
                      Spirit
                    </button>
                  </div>
                </div>
              </div>

              {/* Widgets */}
              <div className="grid grid-cols-2 gap-4 mb-8 overflow-y-auto hide-scrollbar pr-2">
                <button 
                  onClick={() => setActiveView('inbox')} 
                  className={cn(
                    "bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left relative overflow-hidden",
                    unreadNudges > 0 && "border border-red-600/30"
                  )}
                >
                  <MessageSquare size={20} className={cn(unreadNudges > 0 ? "text-red-600" : "text-white/40")} />
                  <div>
                    <div className={cn("text-2xl font-display font-bold", unreadNudges > 0 ? "text-red-600" : "text-white")}>
                      {unreadNudges > 0 ? `${unreadNudges} NUDGES` : 'INBOX'}
                    </div>
                    <DotMatrixText>SOCRATIC_BRAIN</DotMatrixText>
                  </div>
                  {isBrainThinking && (
                    <motion.div 
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-red-600/5 pointer-events-none"
                    />
                  )}
                </button>

                {mvsMode === 'capital' ? (
                  <>
                    <button onClick={() => setActiveView('triage')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Activity size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white">{holdItems.length}</div>
                        <DotMatrixText>METABOLISM</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('consensus')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Shield size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase text-red-600">84%</div>
                        <DotMatrixText>CONSENSUS</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('intelligence')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <TrendingUp size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Intel</div>
                        <DotMatrixText>MARKET_PULSE</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('telemetry')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Wifi size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Health</div>
                        <DotMatrixText>SENSOR_STATUS</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('sync')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <RefreshCw size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Sync</div>
                        <DotMatrixText>EXTERNAL_VECTORS</DotMatrixText>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setActiveView('spirit')} className="bg-red-600/10 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-red-600/20 transition-all text-left border border-red-600/20">
                      <Plus size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Spirit</div>
                        <DotMatrixText color="text-red-600">RAW_INGESTION</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('inbox')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Activity size={20} className={cn(spiritDecay > 20 ? "text-red-600" : "text-white/40")} />
                      <div>
                        <div className={cn("text-2xl font-display font-bold", spiritDecay > 20 ? "text-red-600" : "text-white")}>{spiritDecay}%</div>
                        <DotMatrixText>SPIRIT_DECAY</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('personalization')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Zap size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Pillars</div>
                        <DotMatrixText>CORE_PHILOSOPHY</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('temptation')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Search size={20} className="text-white/40" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Scout</div>
                        <DotMatrixText>MANUAL_PARSER</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('vault')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Database size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Vault</div>
                        <DotMatrixText>MEMORY_LAYER</DotMatrixText>
                      </div>
                    </button>
                    <button onClick={() => setActiveView('magic')} className="bg-white/5 rounded-[2rem] p-6 flex flex-col gap-4 hover:bg-white/10 transition-all text-left">
                      <Share size={20} className="text-red-600" />
                      <div>
                        <div className="text-2xl font-display font-bold text-white uppercase">Magic</div>
                        <DotMatrixText>LINK_DEPLOYER</DotMatrixText>
                      </div>
                    </button>
                  </>
                )}
              </div>

              {/* Capture Bar */}
              <div className="bg-white/5 rounded-full p-2 flex items-center gap-2 mb-8 border border-white/5">
                <button onClick={handleCapture} className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:scale-105 transition-all">
                  <Mic size={20} />
                </button>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="CAPTURE_THOUGHT" 
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs uppercase tracking-widest placeholder:text-white/10 px-2"
                  onKeyDown={(e) => e.key === 'Enter' && handleCapture()}
                />
              </div>
            </motion.div>
          )}

          {activeView === 'triage' && (
            <motion.div 
              key="triage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">METABOLISM</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="flex-1 relative">
                {holdItems.length > 0 ? (
                  <AnimatePresence>
                    {holdItems.slice(0, 2).reverse().map((item, idx, arr) => (
                      <SwipeCard 
                        key={item.id} 
                        item={item} 
                        isTop={idx === arr.length - 1}
                        onSwipeLeft={() => handleSwipeLeft(item)}
                        onSwipeRight={() => handleSwipeRight(item)}
                        onSynthesize={() => handleSynthesize(item)}
                      />
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/10">
                    <Check size={64} className="mb-4" />
                    <DotMatrixText>CLEAR</DotMatrixText>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'consensus' && (
            <motion.div 
              key="consensus"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">CONSENSUS_HUB</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="space-y-4 overflow-y-auto hide-scrollbar pb-12">
                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-display font-bold text-white">Identity Anchor</h3>
                      <DotMatrixText color={isEditingAnchor ? "text-red-600" : "text-white/40"}>{isEditingAnchor ? "EDITING" : "LOCKED"}</DotMatrixText>
                    </div>
                    <button 
                      onClick={() => setIsEditingAnchor(!isEditingAnchor)}
                      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                    >
                      {isEditingAnchor ? <Check size={16} /> : <Settings size={16} />}
                    </button>
                  </div>
                  {isEditingAnchor ? (
                    <textarea 
                      value={identityAnchor}
                      onChange={(e) => setIdentityAnchor(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white text-sm leading-relaxed mb-6 outline-none focus:border-red-600 transition-all resize-none h-32"
                    />
                  ) : (
                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                      "{identityAnchor}"
                    </p>
                  )}
                  <button className="w-full py-3 bg-white/5 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all">
                    Request Refactor
                  </button>
                </div>

                <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <DotMatrixText>ACTIVE_PILLARS</DotMatrixText>
                    <button 
                      onClick={() => setIsAddingSignal(!isAddingSignal)}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
                    >
                      {isAddingSignal ? <X size={14} /> : <Plus size={14} />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {isAddingSignal && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-6 overflow-hidden"
                      >
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={newSignalLabel}
                            onChange={(e) => setNewSignalLabel(e.target.value)}
                            placeholder="NEW_SIGNAL_LABEL"
                            className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-2 text-white text-[10px] font-mono outline-none focus:border-red-600 transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSignal()}
                          />
                          <button 
                            onClick={handleAddSignal}
                            className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    {signals.map(s => (
                      <div key={s.id} className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-display font-bold text-sm uppercase tracking-tight">{s.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-mono text-white/20 uppercase">{s.evidenceCount || 0} PROOFS</span>
                            <Check size={12} className="text-red-600" />
                          </div>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(s.strength || 0) * 100}%` }}
                            className="h-full bg-red-600"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            {s.tags.map(tag => (
                              <span key={tag} className="text-[6px] font-mono text-white/20 uppercase border border-white/10 px-1 rounded-sm">{tag}</span>
                            ))}
                          </div>
                          <span className="text-[6px] font-mono text-white/20 uppercase">STRENGTH: {Math.round((s.strength || 0) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'inbox' && (
            <motion.div 
              key="inbox"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">SOCRATIC_INBOX</DotMatrixText>
                <button 
                  onClick={() => runDriftAnalysis()} 
                  disabled={isBrainThinking}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={cn(isBrainThinking && "animate-spin")} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar pb-12">
                {brainMessages.map((msg, idx) => (
                  <div key={idx} className={cn(
                    "rounded-[2rem] p-6 border",
                    msg.role === 'model' ? "bg-white/5 border-white/5" : "bg-red-600/10 border-red-600/20 ml-12"
                  )}>
                    <DotMatrixText color={msg.role === 'model' ? "text-red-600" : "text-white/40"} className="mb-2">
                      {msg.role === 'model' ? "BRAIN_PROMPT" : "OWNER_INPUT"}
                    </DotMatrixText>
                    <p className="text-white text-sm leading-relaxed">
                      "{msg.content}"
                    </p>
                    {msg.role === 'model' && idx === brainMessages.length - 1 && (
                      <div className="flex gap-2 mt-6">
                        <button className="flex-1 py-3 bg-red-600 rounded-full text-[10px] font-mono uppercase tracking-widest text-white">Acknowledge</button>
                        <button className="flex-1 py-3 bg-white/5 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/40">Defend Logic</button>
                      </div>
                    )}
                  </div>
                ))}
                {isBrainThinking && (
                  <div className="flex justify-center py-4">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeView === 'personalization' && (
            <motion.div 
              key="personalization"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">TELEMETRY_CENTER</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar pb-12">
                <PersonalizationCenter />
              </div>
            </motion.div>
          )}

          {activeView === 'vault' && (
            <motion.div 
              key="vault"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">VENTURE_VAULT</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar pb-12">
                <VentureVault />
              </div>
            </motion.div>
          )}

          {activeView === 'sparks' && (
            <motion.div 
              key="sparks"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">STRATEGIC_SPARKS</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar pb-12 space-y-8">
                <VoiceRecorder onSave={(data) => setAudioInsights(prev => [{ ...data, id: `a_${Date.now()}` }, ...prev])} />
                
                <div className="space-y-4">
                  <DotMatrixText>VAULTED_SPARKS</DotMatrixText>
                  {audioInsights.map(insight => (
                    <VoiceInsightCard key={insight.id} insight={insight} isAuthorized={true} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'sync' && (
            <motion.div 
              key="sync"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">SYNC_CENTER</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar pb-12">
                <SyncCenter />
              </div>
            </motion.div>
          )}

          {activeView === 'intelligence' && (
            <motion.div 
              key="intelligence"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">MARKET_INTELLIGENCE</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar pb-12">
                <MarketIntelligence mvsMode={mvsMode} />
              </div>
            </motion.div>
          )}

          {activeView === 'traces' && (
            <motion.div 
              key="traces"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">NEURAL_TRACES</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar pb-12">
                <NeuralTrace />
              </div>
            </motion.div>
          )}

          {activeView === 'spirit' && (
            <motion.div 
              key="spirit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">SPIRIT_DUMP</DotMatrixText>
                <div className="w-10" />
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <textarea 
                  placeholder="Paste long-form philosophy or career manifestos here..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-white text-sm leading-relaxed outline-none focus:border-red-600 transition-all resize-none font-light"
                />
                <button className="w-full py-6 bg-red-600 rounded-full text-[10px] font-mono uppercase tracking-widest text-white font-bold">
                  INITIATE_METABOLISM
                </button>
              </div>
            </motion.div>
          )}

          {activeView === 'briefing' && (
            <motion.div 
              key="briefing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">DAILY_BRIEFING</DotMatrixText>
                <div className="w-10" />
              </div>
              <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-12">
                <CognitiveHeatmap />
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                  <DotMatrixText color="text-red-600" className="mb-2">PULSE_STATS</DotMatrixText>
                  <div className="text-2xl font-display font-bold text-white">42% COGNITIVE_LOAD</div>
                  <p className="text-[10px] font-mono text-white/40 uppercase mt-2">Stable // 12 Signals Verified</p>
                </div>
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                  <DotMatrixText color="text-red-600" className="mb-2">LEAD_SCORE</DotMatrixText>
                  <div className="text-2xl font-display font-bold text-white">3 TIER-1 MATCHES</div>
                  <p className="text-[10px] font-mono text-white/40 uppercase mt-2">Scout found high-alignment ventures</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'temptation' && (
            <motion.div 
              key="temptation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">TEMPTATION_ANALYZER</DotMatrixText>
                <div className="w-10" />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto hide-scrollbar pb-12">
                {/* LEFT: THE LURE */}
                <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <DotMatrixText color="text-red-600">THE_LURE</DotMatrixText>
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">EXTERNAL_SIGNAL</span>
                  </div>
                  
                  <div className="flex-1 space-y-8">
                    <div>
                      <h3 className="text-3xl font-display font-bold text-white leading-tight">Staff Engineer @ Legacy Corp</h3>
                      <p className="text-red-600 font-mono text-sm mt-2 font-bold">$250k + Equity // Remote</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-white/40">
                        <Database size={14} />
                        <span className="text-[10px] font-mono uppercase">Stack: Java, Oracle, Jenkins</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/40">
                        <Layers size={14} />
                        <span className="text-[10px] font-mono uppercase">Focus: 80% Maintenance</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/40">
                        <Zap size={14} />
                        <span className="text-[10px] font-mono uppercase">Impact: Internal Tooling</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-white/5 mt-auto">
                    <button className="w-full py-4 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/40 hover:bg-white/5 transition-all">
                      VIEW_FULL_JD
                    </button>
                  </div>
                </div>

                {/* RIGHT: SPIRIT DECAY */}
                <div className="bg-red-600/5 rounded-[2.5rem] p-8 border border-red-600/10 flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 nothing-dot-grid opacity-5 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                      <DotMatrixText color="text-red-600">SPIRIT_DECAY</DotMatrixText>
                      <div className="flex items-center gap-2">
                        <Shield size={14} className="text-red-600" />
                        <span className="text-red-600 font-mono text-xs font-bold">CRITICAL_RISK</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="text-center mb-8">
                        <div className="text-7xl font-display font-bold text-red-600 mb-2">85%</div>
                        <p className="text-[10px] font-mono text-red-600/60 uppercase tracking-[0.2em]">Cognitive Debt Projection</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono uppercase text-white/40">
                            <span>Pillar Alignment</span>
                            <span>12%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '12%' }}
                              className="h-full bg-red-600" 
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono uppercase text-white/40">
                            <span>Autonomy Loss</span>
                            <span>92%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '92%' }}
                              className="h-full bg-red-600" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-8 border-t border-red-600/10 mt-auto">
                      <p className="text-[11px] text-red-600/80 leading-relaxed italic">
                        "This role is a strategic trap. It optimizes for short-term capital while eroding the 'Anti-Rework' and 'Systems Thinking' nodes. Accepting this will reset your Spirit Growth by 14 months."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 flex gap-4">
                <button className="flex-1 py-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all">
                  DISMISS_TEMPTATION
                </button>
                <button className="flex-1 py-6 bg-red-600 rounded-full text-[10px] font-mono uppercase tracking-widest text-white font-bold shadow-lg shadow-red-600/20">
                  NEGOTIATE_SPIRIT_TERMS
                </button>
              </div>
            </motion.div>
          )}

          {activeView === 'magic' && (
            <motion.div 
              key="magic"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">MAGIC_LINK_DEPLOYER</DotMatrixText>
                <div className="w-10" />
              </div>
              <div className="space-y-6">
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                  <DotMatrixText color="text-red-600" className="mb-4">PERSONA_TOGGLE</DotMatrixText>
                  <div className="flex gap-2">
                    {['ARCHITECT', 'FOUNDER', 'COACH'].map(p => (
                      <button key={p} className="flex-1 py-3 bg-white/5 rounded-full text-[8px] font-mono uppercase tracking-widest text-white/40 hover:text-white hover:bg-red-600 transition-all">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full py-8 bg-red-600 rounded-[2rem] text-xl font-display font-bold uppercase tracking-widest text-white shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                  GENERATE_LINK
                </button>
              </div>
            </motion.div>
          )}

          {activeView === 'telemetry' && (
            <motion.div 
              key="telemetry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">SENSOR_HEALTH</DotMatrixText>
                <button onClick={() => setActiveView('media')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <Layers size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 mb-4">
                  <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <DotMatrixText color="text-red-600">SPIRIT_DECAY_GAUGE</DotMatrixText>
                    <span className="text-[10px] font-mono text-red-600 font-bold">{spiritDecay}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${spiritDecay}%` }}
                      className="h-full bg-red-600"
                    />
                  </div>
                  <p className="text-[8px] font-mono text-white/20 uppercase mt-4 tracking-widest">
                    Cognitive debt accumulated through low-leverage decision cycles.
                  </p>
                </div>

                <DotMatrixText color="text-red-600" className="mb-4">NATIVE_OS_STATUS</DotMatrixText>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <button 
                        onClick={() => setIsRecording(!isRecording)}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                          isRecording ? "bg-red-600 text-white animate-pulse" : "bg-red-600/10 text-red-600"
                        )}
                      >
                        <Mic size={16} />
                      </button>
                      <span className="text-[8px] font-mono text-white/40 uppercase">{isRecording ? 'Recording...' : 'Mic_Ready'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button 
                        onClick={showCamera ? stopCamera : startCamera}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                          showCamera ? "bg-red-600 text-white" : "bg-red-600/10 text-red-600"
                        )}
                      >
                        <Activity size={16} />
                      </button>
                      <span className="text-[8px] font-mono text-white/40 uppercase">{showCamera ? 'Cam_Active' : 'Cam_Ready'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center text-red-600">
                        <MapPin size={16} />
                      </div>
                      <span className="text-[8px] font-mono text-white/40 uppercase">Geo_Ready</span>
                    </div>
                  </div>
                </div>

                {showCamera && (
                  <div className="bg-black rounded-[2rem] overflow-hidden aspect-video relative border border-white/10 mb-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <DotMatrixText color="text-red-600">LIVE_FEED</DotMatrixText>
                    </div>
                    <button 
                      onClick={stopCamera}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {[
                  { label: 'GITHUB_WEBHOOK', status: 'ACTIVE', color: 'text-red-600' },
                  { label: 'SUBSTACK_RSS', status: 'ACTIVE', color: 'text-red-600' },
                  { label: 'VOICE_PULSE', status: 'STABLE', color: 'text-white/40' },
                  { label: 'NEURAL_LINK', status: 'ERROR', color: 'text-red-600 animate-pulse' }
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-[1.5rem] p-6 border border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">{s.label}</span>
                    <span className={cn("text-[10px] font-mono uppercase tracking-widest font-bold", s.color)}>{s.status}</span>
                  </div>
                ))}
                <button className="w-full py-4 bg-white/5 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/40 mt-8 border border-white/10">
                  RESTART_PIPELINE
                </button>
              </div>
            </motion.div>
          )}

          {activeView === 'media' && (
            <motion.div 
              key="media"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('telemetry')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">MEDIA_VAULT</DotMatrixText>
                <div className="w-10" />
              </div>
              
              <div className="flex-1 overflow-y-auto hide-scrollbar pb-12">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400&q=80', label: 'SYSTEM_ARCH' },
                    { type: 'VIDEO', url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-lines-of-light-22606-large.mp4', label: 'LOGIC_FLOW' },
                    { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80', label: 'REACT_CORE' },
                    { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80', label: 'CYBER_SECURITY' },
                    { type: 'VIDEO', url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-14052-large.mp4', label: 'NEURAL_NET' },
                    { type: 'IMAGE', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', label: 'GLOBAL_SYNC' },
                  ].map((item, idx) => (
                    <div key={idx} className="group relative aspect-square bg-white/5 rounded-[2rem] overflow-hidden border border-white/5">
                      {item.type === 'IMAGE' ? (
                        <img src={item.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                      ) : (
                        <video src={item.url} autoPlay loop muted className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[8px] font-mono text-white uppercase tracking-widest bg-red-600 px-2 py-1 rounded-sm">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'temptation' && (
            <motion.div 
              key="temptation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 flex flex-col bg-[#050505] z-[60]"
            >
              <div className="flex justify-between items-center p-8 pt-20">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-red-600">MANUAL_PARSER</DotMatrixText>
                <div className="w-10" />
              </div>
              <div className="flex-1 overflow-hidden">
                <EvaluatorIntake />
              </div>
            </motion.div>
          )}

          {activeView === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 flex flex-col p-8 pt-20"
            >
              <div className="flex justify-between items-center mb-12">
                <button onClick={() => setActiveView('lockscreen')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <ChevronRight size={16} className="rotate-180" />
                </button>
                <DotMatrixText color="text-white">FOCUS_LAYERS</DotMatrixText>
                <div className="w-10" />
              </div>

              <div className="space-y-4 overflow-y-auto hide-scrollbar pb-12">
                <VisibilitySlider 
                  label="Creative Entrepreneur" 
                  value={state.personaFocus.creativeEntrepreneur} 
                  onChange={(val) => setState(prev => ({ 
                    ...prev, 
                    personaFocus: { ...prev.personaFocus, creativeEntrepreneur: val } 
                  }))}
                />
                <VisibilitySlider 
                  label="Systems Architect" 
                  value={state.personaFocus.systemsArchitect} 
                  onChange={(val) => setState(prev => ({ 
                    ...prev, 
                    personaFocus: { ...prev.personaFocus, systemsArchitect: val } 
                  }))}
                />
                <VisibilitySlider 
                  label="Product Operator" 
                  value={state.personaFocus.productOperator} 
                  onChange={(val) => setState(prev => ({ 
                    ...prev, 
                    personaFocus: { ...prev.personaFocus, productOperator: val } 
                  }))}
                />

                <div className="pt-8">
                  <DotMatrixText className="mb-4">SYSTEM_MODE</DotMatrixText>
                  <div className="bg-white/5 rounded-[2rem] p-6 flex justify-between items-center border border-white/5">
                    <span className="font-display font-bold text-white">DEEP_LOGIC</span>
                    <NothingToggle 
                      active={state.mode === 'DEEP_LOGIC'} 
                      onClick={() => setState(prev => ({ ...prev, mode: prev.mode === 'DEEP_LOGIC' ? 'EXPANSIVE' : 'DEEP_LOGIC' }))} 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drift Alert Overlay */}
        <AnimatePresence>
          {driftAlert && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute inset-x-6 bottom-32 z-[100] bg-red-600 rounded-[2rem] p-6 shadow-2xl nothing-red-glow"
            >
              <div className="flex justify-between items-start mb-4">
                <DotMatrixText color="text-white">DRIFT_ALERT // {driftAlert.severity}</DotMatrixText>
                <button onClick={() => setDriftAlert(null)} className="text-white/60 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <p className="text-white text-sm font-bold leading-tight mb-6">
                "{driftAlert.nudge}"
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setActiveView('inbox');
                    setDriftAlert(null);
                  }}
                  className="flex-1 py-3 bg-black text-white rounded-full text-[10px] font-mono uppercase tracking-widest font-bold"
                >
                  Enter Inbox
                </button>
                <button 
                  onClick={() => setDriftAlert(null)}
                  className="px-6 py-3 bg-white/20 text-white rounded-full text-[10px] font-mono uppercase tracking-widest"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Linking Overlay */}
        <AnimatePresence>
          {linkingNode && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-x-0 bottom-0 h-[80%] bg-[#111] rounded-t-[3rem] p-8 z-[60] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />
              <DotMatrixText color="text-red-600" className="mb-8">LINK_REQUIRED</DotMatrixText>
              
              <div className="flex-1 overflow-y-auto space-y-8 hide-scrollbar">
                <div>
                  <DotMatrixText className="mb-4">PATTERNS</DotMatrixText>
                  <div className="flex flex-wrap gap-2">
                    {['Decision Clarity', 'Anti-Rework', 'Ops-Driven UX'].map(p => (
                      <button 
                        key={p}
                        onClick={() => toggleLink(p)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                          selectedLinks.includes(p) ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/5"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <DotMatrixText className="mb-4">SYSTEMS</DotMatrixText>
                  <div className="flex flex-wrap gap-2">
                    {['Kotak Rewards', 'Adneto', 'Manyavar'].map(s => (
                      <button 
                        key={s}
                        onClick={() => toggleLink(s)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                          selectedLinks.includes(s) ? "bg-white text-black border-white" : "bg-white/5 text-white/40 border-white/5"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConfirmLink}
                disabled={selectedLinks.length === 0}
                className="w-full py-5 bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-full mt-8 disabled:opacity-20 transition-all"
              >
                Confirm Evolution
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <LogicTraceModal />
    </div>
  );
}

