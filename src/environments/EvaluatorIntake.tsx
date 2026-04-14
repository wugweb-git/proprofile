import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldCheck, Zap, Cpu, AlertCircle, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '../lib/utils';
import { MOCK_IDENTITY, MOCK_SIGNALS } from '../mockData';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export default function EvaluatorIntake() {
  const [step, setStep] = useState<'drop' | 'audit'>('drop');
  const [jdInput, setJdInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);

  const runAudit = async () => {
    if (!jdInput.trim()) return;
    
    setIsAuditing(true);
    setStep('audit');
    
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
        
        Provide a structured, stark report (Nothing OS 4.0 tone) with these exact sections:
        1. THE_DIAGNOSIS: (What is their actual problem?)
        2. THE_PROOF: (3 specific trace-logs or signals that solve this)
        3. SYSTEMIC_FIT: (Score 0-10.0)
        
        If Fit > 8.0, include a [HANDSHAKE_AUTHORIZED] flag.` }] }],
      } as any);
      
      setAuditResult(response.text || "Audit failed to synthesize.");
    } catch (err) {
      console.error(err);
      setAuditResult("NEURAL_LINK_FAILURE: Check API configuration.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-black font-sans selection:bg-nothing-yellow selection:text-black flex flex-col items-center justify-center p-8">
      
      <AnimatePresence mode="wait">
        {step === 'drop' ? (
          <motion.div 
            key="drop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[800px] space-y-12"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <DotMatrixText color="text-nothing-yellow">INTAKE_PORT // 01</DotMatrixText>
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter uppercase">
                Silent Metabolism
              </h1>
            </div>

            <div className="relative group">
              <textarea 
                value={jdInput}
                onChange={(e) => setJdInput(e.target.value)}
                placeholder="Paste the Job Description or describe the system failure here."
                className="w-full h-64 bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-xl font-light leading-relaxed outline-none focus:border-nothing-yellow transition-all resize-none placeholder:text-white/10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    runAudit();
                  }
                }}
              />
              <div className="absolute bottom-8 right-12 flex items-center gap-4">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">CMD + ENTER TO SYNC</span>
                <button 
                  onClick={runAudit}
                  disabled={!jdInput.trim()}
                  className="w-12 h-12 bg-nothing-yellow rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="audit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[700px] space-y-12"
          >
            <div className="flex justify-between items-center">
              <button onClick={() => setStep('drop')} className="text-[10px] font-mono text-white/40 hover:text-nothing-yellow transition-colors uppercase tracking-widest flex items-center gap-2">
                <ChevronRight size={14} className="rotate-180" /> Back to Intake
              </button>
              <DotMatrixText color="text-nothing-yellow">AUDIT_REPORT // 02</DotMatrixText>
            </div>

            {isAuditing ? (
              <div className="space-y-8 py-24">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-16 h-16 border-4 border-nothing-yellow/20 border-t-nothing-yellow rounded-full animate-spin" />
                  <DotMatrixText className="animate-pulse">SCANNING_SYSTEMIC_FIT...</DotMatrixText>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8">
                    {auditResult?.includes('HANDSHAKE_AUTHORIZED') ? (
                      <div className="flex flex-col items-end">
                        <ShieldCheck size={48} className="text-nothing-yellow mb-2" />
                        <span className="text-[10px] font-mono text-nothing-yellow uppercase font-bold">Authorized</span>
                      </div>
                    ) : (
                      <AlertCircle size={48} className="text-white/10" />
                    )}
                  </div>

                  <div className="prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/80">
                      {auditResult}
                    </div>
                  </div>
                </div>

                {auditResult?.includes('HANDSHAKE_AUTHORIZED') && (
                  <motion.button 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full py-8 bg-nothing-yellow rounded-[2rem] text-xl font-display font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-[0_0_50px_rgba(220,38,38,0.3)]"
                  >
                    Request Human Handshake
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Grid */}
      <div className="fixed inset-0 nothing-dot-grid opacity-10 pointer-events-none -z-10" />
    </div>
  );
}
