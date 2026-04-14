import React, { useState } from 'react';
import { Play, Square, MapPin, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_IDENTITY } from '../mockData';

export const AmbientVoicePulse = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between border-b border-black/10 py-4 px-6 md:px-12 bg-black/5 backdrop-blur-md sticky top-0 z-[100]">
      
      {/* Instagram-Style Avatar & Location Trigger */}
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        
        {/* Insta-Ring Avatar */}
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-tr from-nothing-yellow via-yellow-400 to-orange-500 rounded-full animate-spin-slow opacity-80 group-hover:opacity-100 transition-opacity blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-nothing-yellow via-yellow-400 to-orange-500 rounded-full animate-spin-slow"></div>
          <div className="relative p-[2px] bg-white rounded-full">
            <img 
              src={MOCK_IDENTITY.photoUrl} 
              alt="Vedanshu Srivastava" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
          </div>
        </div>

        {/* Offline Reality Trigger */}
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-black/60">
          <MapPin size={14} className="text-nothing-yellow" />
          <span>Tokyo / Base</span>
          <span className="hidden md:inline"> // </span>
          <span className="hidden md:inline font-bold text-black border border-black/20 px-2 py-0.5 rounded">Deep Work</span>
        </div>
      </div>

      {/* Ambient Voice Pulse */}
      <div className="flex items-center gap-4 bg-white border border-black/10 rounded-full px-2 py-1 pr-6 shadow-sm">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Stop Voice Pulse" : "Play Latest Voice Pulse"}
          className="w-8 h-8 flex items-center justify-center bg-nothing-yellow text-black rounded-full hover:bg-black hover:text-nothing-yellow transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black"
        >
          {isPlaying ? <Square size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
        </button>

        <div className="flex flex-col items-start min-w-[200px]">
          <div className="flex items-center gap-2">
            <Radio size={12} className={isPlaying ? "text-red-500 animate-pulse" : "text-black/30"} />
            <span className="text-[9px] font-mono uppercase text-black/50 tracking-widest leading-none">
              Strategic Spark / -30s
            </span>
          </div>
          <span className="text-xs font-bold leading-tight mt-1 text-black/80">
            "Agentic State Management"
          </span>
        </div>

        {/* Audio Simulation Waveform */}
        <div className="hidden lg:flex items-center gap-1 h-4 ml-4">
          {[...Array(12)].map((_, i) => (
            <motion.div 
              key={i}
              animate={isPlaying ? { height: ['20%', '100%', '30%', '80%', '20%'] } : { height: '20%' }}
              transition={{ repeat: Infinity, duration: 1 + Math.random(), ease: 'easeInOut' }}
              className="w-1 bg-black/30 rounded-full"
              style={{ minHeight: '4px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
