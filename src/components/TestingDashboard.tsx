import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Zap, Database, GitCommit, User, Sliders, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { memoryEngine } from '../services/memoryEngine';
import { useNavigate } from 'react-router-dom';
import { useVibe } from './VibeProvider';
import { VibeMode } from '../types';
import { cn } from '../lib/utils';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const TestingDashboard = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { state, setState } = useVibe();
  const { setMockJd, setIntent } = useStore();
  const navigate = useNavigate();

  const personas: { label: string, mode: VibeMode, focus: string, intent: 'architect' | 'founder' | 'coach' }[] = [
    { label: 'ARCHITECT', mode: 'DEEP_LOGIC', focus: 'Systems Architecture', intent: 'architect' },
    { label: 'FOUNDER', mode: 'EXPANSIVE', focus: 'Market Expansion', intent: 'founder' },
    { label: 'COACH', mode: 'CREATIVE', focus: 'Cognitive Growth', intent: 'coach' },
  ];

  const handlePersonaShift = (p: typeof personas[0]) => {
    setState(prev => ({ ...prev, mode: p.mode, focus: p.focus }));
    setIntent(p.intent);
    // Also update URL if in PublicProxy
    if (window.location.pathname === '/') {
      navigate(`/?intent=${p.intent}`);
    }
  };

  const injectHighSignalCommit = () => {
    memoryEngine.capture("Refactored pgvector indexing to optimize cosine similarity for multi-tenant RAG queries.", "github");
    // Force a refresh of the triage view if open
    window.dispatchEvent(new CustomEvent('memory_updated'));
  };

  const injectLowMvsJd = () => {
    const lowMvsJd = `
      Role: Senior UI Designer
      Company: Legacy Global Bank
      Scope: 
      - Maintain existing design system components in Figma.
      - Attend 15+ alignment meetings weekly with legacy stakeholders.
      - Execute high-fidelity mocks for stakeholder approval.
      - 80% maintenance of legacy code and design assets.
      Pay: Top-tier market rate.
    `;
    setMockJd(lowMvsJd);
    navigate('/port');
  };

  const injectHighMvsJd = () => {
    const highMvsJd = `
      Role: Systems Architect (0 to 1)
      Company: Stealth AI Startup
      Scope:
      - Design the core data orchestration layer for a multi-agent system.
      - Bridge the gap between R&D and production-ready UX.
      - High autonomy; direct reporting to CTO.
      - Focus on anti-fragile architecture and scalability.
    `;
    setMockJd(highMvsJd);
    navigate('/port');
  };

  return (
    <>
      <div className="fixed top-8 right-8 z-[200]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-controls="testing-dashboard-panel"
          aria-label="Toggle Testing Dashboard"
          className="w-12 h-12 rounded-full bg-nothing-yellow text-black flex items-center justify-center shadow-2xl shadow-nothing-yellow/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-nothing-yellow focus-visible:ring-offset-black"
        >
          {isOpen ? <X size={20} /> : <Settings size={20} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="testing-dashboard-panel"
            role="dialog"
            aria-modal="false"
            aria-label="Testing Dashboard Control Panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-24 right-8 z-[200] w-[320px] bg-black/90 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl"
          >
            <div className="space-y-8">
              <div>
                <DotMatrixText color="text-nothing-yellow" className="mb-4">PERSONA_TOGGLE</DotMatrixText>
                <div className="grid grid-cols-1 gap-2">
                  {personas.map(p => (
                    <button
                      key={p.label}
                      onClick={() => handlePersonaShift(p)}
                      className={cn(
                        "w-full py-3 px-4 rounded-xl border text-[10px] font-mono uppercase tracking-widest transition-all text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow",
                        state.mode === p.mode ? "bg-nothing-yellow border-nothing-yellow text-black" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                      )}
                    >
                      {p.label}
                      {state.mode === p.mode && <Zap size={10} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <DotMatrixText color="text-nothing-yellow" className="mb-4">SEED_DATA</DotMatrixText>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={injectHighMvsJd}
                    className="py-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-mono uppercase text-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow"
                  >
                    High Complexity JD
                  </button>
                  <button 
                    onClick={injectLowMvsJd}
                    className="py-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-mono uppercase text-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow"
                  >
                    Low Complexity JD
                  </button>
                </div>
              </div>

              <div>
                <DotMatrixText color="text-nothing-yellow" className="mb-4">SIMULATE_WEBHOOKS</DotMatrixText>
                <div className="space-y-2">
                  <button 
                    onClick={injectHighSignalCommit}
                    className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-mono uppercase text-white/40 hover:bg-white/10 flex items-center gap-3 px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow"
                  >
                    <GitCommit size={12} /> GitHub Commit
                  </button>
                  <button 
                    onClick={() => {
                      memoryEngine.capture("Spent 4 hours tweaking the border-radius of the primary button to match Nothing OS 4.0 specs.", "manual");
                      window.dispatchEvent(new CustomEvent('memory_updated'));
                    }}
                    className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-mono uppercase text-white/40 hover:bg-white/10 flex items-center gap-3 px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow"
                  >
                    <Sliders size={12} /> Trigger Drift
                  </button>
                  <button className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[8px] font-mono uppercase text-white/40 hover:bg-white/10 flex items-center gap-3 px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow">
                    <Database size={12} /> Substack Post
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <DotMatrixText className="mb-2">SYSTEM_THEME</DotMatrixText>
                <div className="flex gap-2">
                  {[
                    { value: 'NOTHING_4.0', label: 'NOTHING' },
                    { value: 'PRODUCT', label: 'APPLE' },
                  ].map((themeOption) => (
                    <button
                      key={themeOption.value}
                      onClick={() => setState(prev => ({ ...prev, systemTheme: themeOption.value as any }))}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-[8px] font-mono uppercase transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-nothing-yellow",
                        state.systemTheme === themeOption.value ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white/70"
                      )}
                    >
                      {themeOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
