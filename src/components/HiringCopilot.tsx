import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowRight, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_EXPERIENCE_MATRIX } from '../mockData';

export const HiringCopilot = () => {
  const [jd, setJd] = useState('');
  const [state, setState] = useState<'idle' | 'analyzing' | 'results'>('idle');

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setState('analyzing');
    // Simulate Supabase API query delay and Claude generation
    setTimeout(() => setState('results'), 3500);
  };

  return (
    <section aria-label="Hiring Copilot" className="w-full max-w-[1400px] mx-auto py-12 md:py-24 px-4">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-black/10" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-black/60 bg-nothing-yellow px-2 py-1">
          DECISION_SUPPORT // COPILOT
        </span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <div className="bg-white border-2 border-black/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h3 className="font-display text-3xl font-bold tracking-tight">Evaluate My Architecture</h3>
              <p className="text-black/60 font-serif text-lg leading-relaxed max-w-2xl">
                Paste your Job Description below. The embedded agent will query my Supabase <b>Experience Matrix</b> and generate a personalized viability report instantly.
              </p>

              <div className="relative mt-8 group">
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="[PASTE_JD_OR_ROLE_PARAMETERS_HERE]"
                  className="w-full h-40 bg-black/5 border-2 border-black/10 rounded-2xl p-6 text-sm font-mono focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow resize-none group-hover:border-black/20 transition-all placeholder:text-black/30"
                />
                
                <div className="flex justify-between items-center mt-6">
                  <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-nothing-yellow" /> Claude 3.5 Opus Engine
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    disabled={!jd.trim()}
                    aria-label="Generate Match Report"
                    className="px-8 py-4 bg-nothing-yellow text-black font-bold uppercase tracking-widest text-[10px] rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 hover:bg-black hover:text-nothing-yellow focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    Run Semantic Audit <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center text-center space-y-6"
            >
              <div className="w-16 h-16 border-4 border-black/10 border-t-nothing-yellow rounded-full animate-spin" />
              <div className="font-mono text-xs uppercase tracking-widest animate-pulse">
                Vectorizing JD & Querying Matrix...
              </div>
            </motion.div>
          )}

          {state === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono text-[10px] uppercase text-black/40 tracking-widest mb-2">Analysis Complete</div>
                  <h3 className="font-display text-2xl font-bold bg-nothing-yellow inline-block px-3 py-1">High-Signal Match Found</h3>
                </div>
                <button 
                  onClick={() => { setState('idle'); setJd(''); }}
                  className="w-10 h-10 rounded-full bg-black/5 flex flex-col items-center justify-center hover:bg-black hover:text-white transition-colors"
                >
                  <ArrowRight size={16} className="rotate-180" />
                </button>
              </div>

              <div className="bg-black/5 rounded-2xl p-6 border border-black/10">
                <p className="font-serif text-black/80 leading-relaxed mb-6">
                  Based on the submitted requirements targeting strict logistical architecture and technical product ownership, the system retrieved the following core proof points from the database:
                </p>

                <div className="space-y-4">
                  {MOCK_EXPERIENCE_MATRIX.map(exp => (
                    <div key={exp.id} className="p-4 bg-white rounded-xl shadow-sm border border-black/5 flex gap-4">
                      <div className="mt-1">
                        <CheckCircle2 size={18} className="text-nothing-yellow" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{exp.title}</h4>
                        <div className="text-xs font-mono bg-black text-white px-2 py-1 inline-block rounded mb-3">Logic: {exp.logic_applied}</div>
                        <p className="text-sm text-black/60 italic">{exp.legacy_lessons}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                aria-label="Extract PDF Bundle"
                className="w-full py-6 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-nothing-yellow hover:text-black transition-all shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
              >
                1-Click Extract Interview Pack (PDF)
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
