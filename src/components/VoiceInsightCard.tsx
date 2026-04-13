import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Lock, Unlock, Volume2, Clock, Tag as TagIcon } from 'lucide-react';
import { AudioInsight } from '../types';
import { cn } from '../lib/utils';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const VoiceInsightCard = ({ insight, isAuthorized = false }: { insight: AudioInsight, isAuthorized?: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (insight.isGated && !isAuthorized) return;

    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const isLocked = insight.isGated && !isAuthorized;

  return (
    <div className={cn(
      "bg-white/5 rounded-[2rem] p-6 border transition-all group relative overflow-hidden",
      isLocked ? "border-white/5 opacity-60" : "border-white/10 hover:border-red-600/20"
    )}>
      <div className="absolute inset-0 nothing-dot-grid opacity-5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <DotMatrixText color={isLocked ? "text-white/20" : "text-red-600"}>SPARK // {insight.id.toUpperCase()}</DotMatrixText>
              {insight.isGated && (
                <div className={cn("p-1 rounded-full", isLocked ? "bg-white/5 text-white/20" : "bg-red-600/10 text-red-600")}>
                  {isLocked ? <Lock size={10} /> : <Unlock size={10} />}
                </div>
              )}
            </div>
            <h4 className={cn("text-xl font-display font-bold", isLocked ? "text-white/40" : "text-white")}>
              {insight.title}
            </h4>
          </div>
          <button 
            onClick={togglePlay}
            disabled={isLocked}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all",
              isLocked ? "bg-white/5 text-white/10" : "bg-red-600 text-white shadow-lg shadow-red-600/20 hover:scale-105"
            )}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-red-600"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {insight.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-black/40 text-white/40 text-[8px] font-mono uppercase rounded-full border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-white/20">
              <Clock size={10} />
              <span>{insight.duration}s</span>
            </div>
          </div>

          {isPlaying && insight.transcript && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-white/60 italic leading-relaxed pt-2 border-t border-white/5"
            >
              "{insight.transcript}"
            </motion.p>
          )}

          {isLocked && (
            <div className="pt-2">
              <p className="text-[10px] font-mono text-red-600/60 uppercase tracking-widest">
                [AUTHORIZATION_REQUIRED_FOR_PLAYBACK]
              </p>
            </div>
          )}
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={insight.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
};
