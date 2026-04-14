import React from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Mic, Layout, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_TRACES, MOCK_SIGNALS } from '../mockData';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const NeuralTrace = () => {
  const traces = Object.values(MOCK_TRACES);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-2">
        <DotMatrixText color="text-nothing-yellow">NEURAL_TRACE // VERIFICATION_LAYER</DotMatrixText>
        <GitCommit size={14} className="text-white/20" />
      </div>

      <div className="space-y-4">
        {traces.map((trace) => (
          <div key={trace.id} className="bg-white/5 rounded-[2rem] p-6 border border-white/5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                  {trace.type === 'commit' && <GitCommit size={14} />}
                  {trace.type === 'voice' && <Mic size={14} />}
                  {trace.type === 'figma' && <Layout size={14} />}
                </div>
                <div>
                  <DotMatrixText color="text-white/20" className="text-[8px] uppercase tracking-widest">{trace.type} // {trace.timestamp}</DotMatrixText>
                  <div className="text-[10px] font-mono text-white/60 uppercase tracking-wider">ID: {trace.id}</div>
                </div>
              </div>
              <button className="text-white/20 hover:text-nothing-yellow transition-colors">
                <ExternalLink size={14} />
              </button>
            </div>

            <p className="text-white text-sm leading-relaxed font-light italic">
              "{trace.content}"
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LinkIcon size={12} className="text-nothing-yellow" />
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Linked Signals</span>
              </div>
              <div className="flex gap-2">
                {MOCK_SIGNALS.slice(0, 1).map(s => (
                  <span key={s.id} className="px-2 py-1 bg-nothing-yellow/10 rounded-full text-[8px] font-mono text-nothing-yellow uppercase tracking-widest border border-nothing-yellow/20">
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-nothing-yellow/5 rounded-[2rem] p-6 border border-nothing-yellow/10 flex gap-4">
        <GitCommit size={20} className="text-nothing-yellow shrink-0" />
        <p className="text-[10px] font-mono text-white/40 leading-relaxed uppercase tracking-wider">
          The Verification Layer ensures every AI-synthesized claim is backed by a raw temporal trace. This creates an immutable audit trail for your identity.
        </p>
      </div>
    </div>
  );
};
