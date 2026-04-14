import React, { useState } from 'react';
import { Calendar, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AvailabilityAgent = () => {
  const [step, setStep] = useState<'prompt' | 'input' | 'calendar'>('prompt');
  const [intent, setIntent] = useState('');

  return (
    <div className="w-full bg-white border-2 border-black/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden my-16">
      <div className="flex items-center gap-4 mb-12">
        <div className="h-px flex-1 bg-black/10" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-black/60 bg-nothing-yellow px-2 py-1">
          INTENT_GATEKEEPER
        </span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <AnimatePresence mode="wait">
        {step === 'prompt' && (
          <motion.div 
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center text-center space-y-6 py-8"
          >
            <Clock size={48} className="text-black/20 mb-4" />
            <h3 className="font-display text-4xl font-bold tracking-tight">Time is the only unscalable asset.</h3>
            <p className="text-black/60 font-serif text-xl max-w-xl">
              I do not accept blind calendar blocks. Before unlocking my schedule, the agent requires context.
            </p>
            <button 
              onClick={() => setStep('input')}
              className="mt-8 px-12 py-4 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-nothing-yellow hover:text-black transition-all shadow-xl flex items-center gap-3"
            >
              Declare Intent <ArrowRight size={14} />
            </button>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 py-4"
          >
            <h3 className="font-display text-2xl font-bold">What problem are we solving?</h3>
            <div className="relative">
              <textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                placeholder="[e.g., We need a System Architecture overhaul for a Fintech scaling phase...]"
                className="w-full h-32 bg-black/5 border-2 border-black/10 rounded-2xl p-6 font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow resize-none placeholder:text-black/30"
              />
            </div>
            
            <div className="flex justify-between items-center bg-nothing-yellow/10 p-4 rounded-xl border border-nothing-yellow/20">
              <span className="text-xs font-mono font-bold text-black/70 flex items-center gap-2">
                <MessageSquare size={14} className="text-nothing-yellow" /> Semantic filter active
              </span>
              <button 
                onClick={() => setStep('calendar')}
                disabled={intent.length < 10}
                className="px-6 py-3 bg-nothing-yellow text-black font-bold uppercase tracking-widest text-[10px] rounded-full disabled:opacity-50 transition-all flex items-center gap-2"
              >
                Submit Logic <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'calendar' && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-black/5 rounded-2xl p-6 border border-black/10 flex items-start gap-4">
              <div className="bg-white p-2 rounded-full mt-1">
                <Calendar size={18} className="text-nothing-yellow" />
              </div>
              <div>
                <p className="font-serif text-black/80 font-bold mb-2">Intent Approved.</p>
                <p className="text-sm text-black/60 leading-relaxed">
                  "This structure mirrors an upcoming bandwidth slot. I am currently focusing on heavy architecture problems on Tuesday mornings. Proceed to calendar mapping."
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <a 
                href="https://calendly.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-full text-center px-8 py-5 bg-black text-nothing-yellow font-bold uppercase tracking-widest text-xs rounded-full hover:bg-nothing-yellow hover:text-black transition-all shadow-2xl"
              >
                Access Tuesday Calendar Mappings
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
