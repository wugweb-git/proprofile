import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Shield, Zap, Database, ChevronRight, X, Check, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { performSimulatedAudit, analyzeTemptation } from '../services/geminiService';
import { MOCK_PROOFS, MOCK_SIGNALS } from '../mockData';

import { useStore } from '../store/useStore';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export default function EvaluatorIntake() {
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditReport, setAuditReport] = useState<any>(null);
  const { mockJd, setMockJd } = useStore();

  useEffect(() => {
    if (mockJd) {
      setJdText(mockJd);
      handleAudit(mockJd);
      setMockJd(null); // Clear after use
    }
  }, [mockJd]);

  const handleAudit = async (textToAudit?: string) => {
    const finalJd = textToAudit || jdText;
    if (!finalJd.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const pillars = MOCK_SIGNALS.slice(0, 4).map(s => s.label);
      const result = await analyzeTemptation(finalJd, pillars);
      
      setAuditReport({
        score: result.score,
        diagnosis: result.diagnosis,
        lure: result.lure,
        cost: result.cost,
        violations: result.violations,
        verdict: result.verdict,
        handshakeAuthorized: result.score > 8.0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col p-8 md:p-12">
      <div className="max-w-[600px] mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-16">
          <DotMatrixText color="text-nothing-yellow">COMPLEXITY_PORT // EVALUATOR_INTAKE</DotMatrixText>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-nothing-yellow animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Listening</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!auditReport ? (
            <motion.div 
              key="intake"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-12">
                <h1 className="text-5xl font-display font-bold tracking-tighter leading-none mb-6">
                  SILENT_DROP_ZONE
                </h1>
                <p className="text-white/40 text-sm leading-relaxed max-w-[400px]">
                  Paste the Job Description or project brief. The engine will metabolize the complexity and calculate systemic alignment.
                </p>
              </div>

              <div className="flex-1 relative mb-8">
                <textarea 
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData('text');
                    if (pastedText.trim()) {
                      setJdText(pastedText);
                      handleAudit(pastedText);
                    }
                  }}
                  placeholder="DROP_JD_HERE..."
                  className="w-full h-full bg-white/5 border border-white/10 rounded-[3rem] p-10 text-white text-lg leading-relaxed outline-none focus:border-nothing-yellow transition-all resize-none font-light placeholder:text-white/5"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-2 border-nothing-yellow border-t-transparent rounded-full animate-spin" />
                    <DotMatrixText color="text-nothing-yellow">METABOLIZING_COMPLEXITY...</DotMatrixText>
                  </div>
                )}
              </div>

              <button 
                onClick={() => handleAudit()}
                disabled={isAnalyzing || !jdText.trim()}
                className="w-full py-8 bg-nothing-yellow rounded-full text-[12px] font-mono uppercase tracking-[0.3em] text-black font-bold shadow-2xl shadow-nothing-yellow/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                INITIATE_SIMULATED_AUDIT
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="report"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col space-y-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-display font-bold text-white mb-2">AUDIT_REPORT</h2>
                  <p className="text-nothing-yellow font-mono text-[10px] uppercase tracking-widest">Spirit Fit: {auditReport.score}/10</p>
                </div>
                <button 
                  onClick={() => setAuditReport(null)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* THE DIAGNOSIS */}
                <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <DotMatrixText color="text-nothing-yellow">THE_DIAGNOSIS</DotMatrixText>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Spirit_Decay</span>
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(10 - auditReport.score) * 10}%` }}
                          className="h-full bg-nothing-yellow"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-display font-bold text-white leading-tight">
                    {auditReport.diagnosis}
                  </p>
                </div>

                {/* LURE & COST */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                    <DotMatrixText className="mb-2">THE_LURE</DotMatrixText>
                    <p className="text-xs text-white/60 font-mono">{auditReport.lure}</p>
                  </div>
                  <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                    <DotMatrixText className="mb-2">COGNITIVE_COST</DotMatrixText>
                    <p className="text-xs text-nothing-yellow font-mono">{auditReport.cost}</p>
                  </div>
                </div>

                {/* PILLAR_VIOLATIONS */}
                <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5">
                  <DotMatrixText color="text-nothing-yellow" className="mb-6">PILLAR_VIOLATIONS</DotMatrixText>
                  <div className="flex flex-wrap gap-3">
                    {auditReport.violations.length > 0 ? auditReport.violations.map((node: string) => (
                      <div key={node} className="px-4 py-2 bg-nothing-yellow/10 rounded-full flex items-center gap-2 border border-nothing-yellow/20">
                        <X size={12} className="text-nothing-yellow" />
                        <span className="text-[10px] font-mono uppercase text-white tracking-widest">{node}</span>
                      </div>
                    )) : (
                      <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest">No major violations detected.</span>
                    )}
                  </div>
                </div>

                {/* THE GATE */}
                <div className={cn(
                  "rounded-[2.5rem] p-8 border flex items-center justify-between",
                  auditReport.handshakeAuthorized ? "bg-nothing-yellow/10 border-nothing-yellow/20" : "bg-white/5 border-white/10"
                )}>
                  <div>
                    <DotMatrixText color="text-nothing-yellow" className="mb-2">THE_GATE</DotMatrixText>
                    <div className="text-2xl font-display font-bold text-white">
                      {auditReport.handshakeAuthorized ? "AUTHORIZED" : "DECLINED"}
                    </div>
                  </div>
                  {auditReport.handshakeAuthorized ? (
                    <div className="w-12 h-12 rounded-full bg-nothing-yellow flex items-center justify-center text-black shadow-lg shadow-nothing-yellow/20">
                      <Check size={24} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                      <X size={24} />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-auto">
                {auditReport.handshakeAuthorized ? (
                  <button className="w-full py-6 bg-nothing-yellow rounded-full text-[10px] font-mono uppercase tracking-widest text-black font-bold shadow-2xl shadow-nothing-yellow/20">
                    REQUEST_HUMAN_HANDSHAKE
                  </button>
                ) : (
                  <button className="w-full py-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/40">
                    GENERATE_POLITE_DECLINE
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
