import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { Brain, Layers, Target, ChevronRight, Zap, Combine } from 'lucide-react';
import { MOCK_IDENTITY_PILLARS, MOCK_VENTURES, MOCK_EXPERIENCE_MATRIX, MOCK_TESTIMONIALS } from '../mockData';

type Persona = 'Architect' | 'Founder' | 'Coach';

export const PolymathBento = () => {
  const [activeTile, setActiveTile] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona>('Architect');

  const getPillarIcon = (type: string) => {
    switch(type) {
      case 'Origin': return <Brain size={18} className="text-nothing-yellow" />;
      case 'Stack': return <Layers size={18} className="text-nothing-yellow" />;
      case 'Philosophy': return <Target size={18} className="text-nothing-yellow" />;
      case 'Obsession': return <Zap size={18} className="text-nothing-yellow" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto py-12 md:py-24 px-4 overflow-hidden">
      <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-black/10 pb-8">
        <div>
          <h2 className="font-display text-4xl font-bold tracking-tighter mb-4 text-black bg-nothing-yellow inline-block px-4 py-2">
             THE SYSTEM CORE
          </h2>
          <p className="text-black/60 font-mono text-xs uppercase tracking-widest mt-4">
             Modular Identity Blocks // Progressive Disclosure
          </p>
        </div>

        {/* Adaptive UX Persona Selector */}
        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          <span className="font-mono text-[9px] uppercase tracking-widest text-black/40 mb-2 flex items-center gap-2">
            <Combine size={12} className="text-nothing-yellow" />
            Adaptive Context Protocol
          </span>
          <div className="flex bg-black/5 p-1 rounded-full border border-black/10">
            {(['Architect', 'Founder', 'Coach'] as Persona[]).map(p => (
              <button
                key={p}
                onClick={() => setPersona(p)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                  persona === p ? "bg-nothing-yellow text-black shadow-md" : "text-black/50 hover:text-black"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Social Proof Injection */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          key={persona}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="mb-12 bg-black text-white p-6 rounded-[2rem] flex items-start gap-4 border border-black/10"
        >
          <div className="bg-nothing-yellow p-2 rounded-full text-black mt-1">
            <Target size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-nothing-yellow mb-2 block">
              Referral Sync // Verified {persona} Signal
            </span>
            <p className="font-serif text-lg md:text-xl font-bold">
              "{MOCK_TESTIMONIALS.find(t => t.persona === persona)?.text}"
            </p>
            <p className="font-mono text-xs mt-3 text-white/50">
              — {MOCK_TESTIMONIALS.find(t => t.persona === persona)?.author}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_IDENTITY_PILLARS.map((pillar, idx) => {
           const isExpanded = activeTile === pillar.id;

           return (
             <motion.div
               key={pillar.id}
               layout
               onClick={() => setActiveTile(isExpanded ? null : pillar.id)}
               className={cn(
                 "border rounded-[2.5rem] p-8 cursor-pointer transition-all duration-500 overflow-hidden relative group",
                 isExpanded 
                  ? "bg-nothing-yellow border-nothing-yellow text-black md:col-span-2 shadow-2xl nothing-yellow-glow" 
                  : "bg-black/5 hover:bg-black/10 border-black/10 text-black md:col-span-1"
               )}
             >
               <div className="flex items-center justify-between mb-8 cursor-pointer">
                 <div className="flex items-center gap-3">
                   {isExpanded ? React.cloneElement(getPillarIcon(pillar.type) as any, { className: "text-black" }) : getPillarIcon(pillar.type)}
                   <span className="font-mono text-xs uppercase tracking-widest">{pillar.type}</span>
                 </div>
                 <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                   <ChevronRight size={16} className={isExpanded ? "text-black" : "text-black/40"} />
                 </motion.div>
               </div>
               
               <motion.div layout className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
                 {pillar.content}
               </motion.div>

               {/* Progressive Disclosure Content Block */}
               <AnimatePresence>
                 {isExpanded && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.3 }}
                     className="pt-6 mt-6 border-t border-black/20"
                   >
                     {pillar.type === 'Origin' && (
                       <p className="text-black/80 font-serif text-lg leading-relaxed mb-6">
                         My fundamental framework is decoupling logic from surface aesthetics. A product isn't a collection of screens; it is a mapped decision matrix. I architect these structures 0→1 before any pixels are drawn.
                       </p>
                     )}

                     {pillar.type === 'Stack' && (
                       <div className="space-y-4">
                         <h4 className="font-mono text-xs uppercase text-black/60 tracking-widest mb-4">VENTURE_VAULT // DEEP INDEX</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {MOCK_VENTURES.map(v => (
                             <div key={v.id} className="bg-black text-white p-4 rounded-2xl bg-black">
                               <div className="text-[10px] text-nothing-yellow font-mono uppercase mb-2">{v.phase} / {v.role}</div>
                               <div className="font-bold">{v.name}</div>
                               <div className="flex gap-2 mt-4 text-[9px] font-mono opacity-60">
                                 {v.logic_tags.map(tag => <span key={tag}>#{tag}</span>)}
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}

                     {pillar.type === 'Philosophy' && (
                       <div className="flex flex-col gap-4">
                         {MOCK_EXPERIENCE_MATRIX.map(exp => (
                           <div key={exp.id} className="p-6 border border-black/10 rounded-[2rem] bg-white hover:border-black/20 transition-colors shadow-sm">
                             <div className="flex justify-between items-start mb-4">
                               <div className="text-[9px] font-mono font-bold tracking-widest text-black/40 uppercase relative">
                                 {exp.industry.join(' · ')}
                               </div>
                               {/* Proof of Human Logic Component */}
                               <div className="flex flex-col items-end gap-1">
                                 <span className="text-[8px] bg-nothing-yellow/20 text-nothing-yellow px-2 py-0.5 rounded font-mono uppercase">
                                   Logic Commit Verified
                                 </span>
                                 <span className="text-[8px] font-mono text-black/30">12:44 AM · RAW NOTE</span>
                               </div>
                             </div>

                             <div className="text-2xl font-bold font-display mb-3 tracking-tight">{exp.title}</div>
                             
                             {/* AI Formatted vs Raw Output Contrast */}
                             <div className="bg-black/5 p-4 rounded-xl border-l-2 border-nothing-yellow mb-4">
                               <p className="text-[10px] font-mono text-black/50 mb-1 uppercase tracking-widest">Raw Core Intention (Human)</p>
                               <p className="text-black/80 font-mono text-xs italic">"need to stop the bleeding on async orders... what if we decentralize the routing incentives instead of forcing it?"</p>
                             </div>

                             <div className="flex justify-between items-end mt-6">
                               <p className="text-black/70 font-serif text-sm w-3/4 leading-relaxed">" {exp.legacy_lessons} "</p>
                               <div className="text-[9px] font-mono tracking-widest bg-black text-white px-2 py-1 flex items-center justify-center rounded">
                                 {exp.logic_applied}
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}

                     {pillar.type === 'Obsession' && (
                       <div className="flex items-center justify-between bg-black text-white p-6 rounded-3xl">
                         <div>
                           <div className="text-nothing-yellow font-mono text-[10px] uppercase mb-2">Live Pulse</div>
                           <h3 className="text-xl font-bold">Orchestrating Agentic Swarms</h3>
                         </div>
                         <Zap size={24} className="text-nothing-yellow" />
                       </div>
                     )}
                   </motion.div>
                 )}
               </AnimatePresence>
             </motion.div>
           )
        })}
      </div>
    </div>
  );
};
