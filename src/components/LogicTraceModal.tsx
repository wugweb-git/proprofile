import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCommit, Clipboard, Database, ChevronRight, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

import { MOCK_PROOFS, MOCK_INSIGHTS, MOCK_TRACES } from '../mockData';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const LogicTraceModal = () => {
  const { traceModalOpen, activeTraceId, closeTrace } = useStore();
  
  // Find the source of the trace
  const proof = MOCK_PROOFS.find(p => p.id === activeTraceId);
  const insight = MOCK_INSIGHTS.find(i => i.id === activeTraceId);
  const trace = activeTraceId ? MOCK_TRACES[activeTraceId] : null;

  // Derive the ancestry data
  const ancestry = React.useMemo(() => {
    if (proof) {
      return {
        title: proof.title,
        raw: {
          date: proof.timestamp || '2014.06.12',
          content: proof.problem
        },
        evolution: {
          date: '2024.03.15',
          content: proof.logic
        },
        signal: {
          title: proof.title,
          content: proof.outcome
        }
      };
    }
    if (insight) {
      const associatedTrace = MOCK_TRACES[insight.traceId];
      return {
        title: 'Insight Evolution',
        raw: {
          date: associatedTrace?.timestamp || '2024.01.01',
          content: associatedTrace?.content || 'Initial observation captured.'
        },
        evolution: {
          date: insight.timestamp,
          content: insight.evolution?.resolution || insight.statement
        },
        signal: {
          title: 'Verified Insight',
          content: insight.statement
        }
      };
    }
    return null;
  }, [proof, insight, trace]);

  if (!ancestry) return null;

  return (
    <AnimatePresence>
      {traceModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTrace}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-[600px] mx-auto bg-[#0a0a0a] border-t border-white/10 rounded-t-[3rem] z-[101] overflow-hidden"
          >
            <div className="absolute inset-0 nothing-dot-grid opacity-5 pointer-events-none" />
            
            <div className="relative p-8 pt-12">
              <div className="flex justify-between items-center mb-12">
                <DotMatrixText color="text-red-600">LOGIC_TRACE // ANCESTRY_OF_A_THOUGHT</DotMatrixText>
                <button onClick={closeTrace} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-16 relative">
                {/* Neural Thread (Visual Connection) */}
                <div className="absolute left-[19px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-red-600 via-red-600/40 to-white/5" />

                {/* STAGE 1: RAW CAPTURE */}
                <div className="flex gap-6 relative group">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 z-10 group-hover:border-red-600/50 transition-colors">
                    <Database size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">RAW_CAPTURE</span>
                      <div className="h-px w-8 bg-white/10" />
                      <span className="text-[10px] font-mono text-red-600 font-bold">{ancestry.raw.date}</span>
                    </div>
                    <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5">
                      <p className="text-sm text-white/40 font-mono italic">
                        "{ancestry.raw.content}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* STAGE 2: SOCRATIC DISCUSSION */}
                <div className="flex gap-6 relative group">
                  <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-600 z-10 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                    <ChevronRight size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono text-red-600 uppercase tracking-widest">SOCRATIC_EVOLUTION</span>
                      <div className="h-px w-8 bg-red-600/20" />
                      <span className="text-[10px] font-mono text-white/40">{ancestry.evolution.date}</span>
                    </div>
                    <div className="bg-red-600/5 rounded-[2rem] p-6 border border-red-600/10">
                      <p className="text-sm text-white/80 leading-relaxed">
                        "{ancestry.evolution.content}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* STAGE 3: FINAL PUBLIC SIGNAL */}
                <div className="flex gap-6 relative group">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white z-10 shadow-xl shadow-red-600/40">
                    <GitCommit size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono text-white uppercase tracking-widest font-bold">PUBLIC_SIGNAL</span>
                      <div className="h-px w-8 bg-white/20" />
                      <span className="text-[10px] font-mono text-white/40">LIVE_NOW</span>
                    </div>
                    <div className="bg-white/10 rounded-[2rem] p-6 border border-white/20 backdrop-blur-sm">
                      <h4 className="text-lg font-display font-bold text-white mb-2">{ancestry.signal.title}</h4>
                      <p className="text-sm text-white/60 leading-relaxed mb-4">
                        {ancestry.signal.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <Shield size={10} className="text-red-600" />
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Verified_via_Logic_Commit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <button className="w-full py-6 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all">
                  DOWNLOAD_VERIFICATION_CERTIFICATE
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
