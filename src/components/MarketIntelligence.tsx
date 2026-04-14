import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Cpu, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

import { GoogleGenAI } from "@google/genai";

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const MarketIntelligence = ({ mvsMode = 'spirit' }: { mvsMode?: 'capital' | 'spirit' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const fetchIntelligence = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const bias = mvsMode === 'capital' 
        ? "Focus on high-velocity ROI, market-rate leverage, and immediate financial opportunities." 
        : "Focus on systemic alignment, philosophical growth, and high-complexity architectural challenges.";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts: [{ text: `As a Market Intelligence Agent for a high-level Systems Architect, provide a concise, dot-matrix style report on: ${query}. ${bias} Focus on industry trends, JD overlaps, and competitor movements. Use Nothing OS 4.0 tone (minimal, stark, functional).` }] }],
        tools: [{ googleSearch: {} }]
      } as any);
      
      setReport(response.text || "No intelligence gathered.");
    } catch (err) {
      console.error(err);
      setReport("Error accessing neural vectors. Check API configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-2">
        <DotMatrixText color="text-nothing-yellow">MARKET_INTELLIGENCE // GROUNDED</DotMatrixText>
        <TrendingUp size={14} className="text-white/20" />
      </div>

      <div className="bg-white/5 rounded-[2.5rem] p-2 flex items-center gap-2 border border-white/5">
        <button 
          onClick={fetchIntelligence}
          disabled={loading}
          className="w-12 h-12 bg-nothing-yellow rounded-full flex items-center justify-center text-black hover:scale-105 transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw size={20} className="animate-spin" /> : <Search size={20} />}
        </button>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH_JD_OR_INDUSTRY" 
          className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs uppercase tracking-widest placeholder:text-white/10 px-2"
          onKeyDown={(e) => e.key === 'Enter' && fetchIntelligence()}
        />
      </div>

      <AnimatePresence mode="wait">
        {report ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="nothing-card-dark p-8 space-y-6"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <DotMatrixText color="text-nothing-yellow">AGENTIC_REPORT</DotMatrixText>
              <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Source: Google Search</span>
            </div>
            
            <div className="text-white/80 text-xs font-mono leading-relaxed uppercase tracking-wider whitespace-pre-wrap">
              {report}
            </div>

            <div className="flex gap-2 pt-4">
              <button className="flex-1 py-3 bg-white/5 rounded-full text-[8px] font-mono uppercase tracking-widest text-white/40 hover:bg-white/10 transition-all">
                Save to Vault
              </button>
              <button className="flex-1 py-3 bg-nothing-yellow rounded-full text-[8px] font-mono uppercase tracking-widest text-black">
                Align Identity
              </button>
            </div>
          </motion.div>
        ) : !loading && (
          <div className="h-48 flex flex-col items-center justify-center text-white/5 border border-dashed border-white/5 rounded-[3rem]">
            <Cpu size={32} className="mb-4 opacity-20" />
            <DotMatrixText>IDLE_READY</DotMatrixText>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 rounded-[2rem] p-6 flex gap-4 border border-white/5">
        <Zap size={20} className="text-nothing-yellow shrink-0" />
        <p className="text-[10px] font-mono text-white/40 leading-relaxed uppercase tracking-wider">
          Search grounding allows the system to cross-reference your identity against live market data, ensuring your "Signals" remain competitive.
        </p>
      </div>
    </div>
  );
};
