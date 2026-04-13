import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Music, Zap, Sliders, User, Tag, Globe, Briefcase, MessageSquare, Camera, X, Check } from 'lucide-react';
import { useVibe } from '../components/VibeProvider';
import { VibeMode, Identity } from '../types';
import { MOCK_IDENTITY } from '../mockData';
import { cn } from '../lib/utils';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

export const PersonalizationCenter = () => {
  const { state, setState } = useVibe();

  const modes = ['DEEP_LOGIC', 'EXPANSIVE', 'STEALTH', 'CREATIVE'];
  const [identity, setIdentity] = useState<Identity>(MOCK_IDENTITY);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setIdentity(prev => ({ ...prev, photoUrl: dataUrl }));
        stopCamera();
      }
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {showCamera && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8"
          >
            <div className="w-full max-w-md aspect-square bg-white/5 rounded-[3rem] overflow-hidden relative border border-white/10">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
            </div>
            
            <div className="flex gap-6 mt-12">
              <button 
                onClick={stopCamera}
                className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
              <button 
                onClick={takeSnapshot}
                className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl shadow-red-600/40 hover:scale-110 transition-transform"
              >
                <Camera size={32} />
              </button>
            </div>
            <DotMatrixText color="text-red-600" className="mt-8">CAPTURE_IDENTITY_FRAME</DotMatrixText>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <DotMatrixText className="mb-4">IDENTITY_CORE</DotMatrixText>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 relative group shrink-0">
              <img src={identity.photoUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <button 
                onClick={startCamera}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-mono uppercase"
              >
                Update
              </button>
            </div>
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Display Name</span>
              <input 
                type="text" 
                value={identity.name}
                onChange={(e) => setIdentity(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border-none outline-none text-white font-display font-bold text-xl"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-start gap-4">
            <User size={20} className="text-red-600 mt-1" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Bio / Spirit</span>
              <textarea 
                value={identity.bio}
                onChange={(e) => setIdentity(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full bg-transparent border-none outline-none text-white text-sm h-24 resize-none"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-start gap-4">
            <Tag size={20} className="text-red-600 mt-1" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Master Tags (Comma Separated)</span>
              <input 
                type="text" 
                value={identity.tags.join(', ')}
                onChange={(e) => setIdentity(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                className="w-full bg-transparent border-none outline-none text-white font-display font-bold text-lg"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-start gap-4">
            <MessageSquare size={20} className="text-red-600 mt-1" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Core Philosophy</span>
              <textarea 
                value={identity.corePhilosophy}
                onChange={(e) => setIdentity(prev => ({ ...prev, corePhilosophy: e.target.value }))}
                className="w-full bg-transparent border-none outline-none text-white text-sm h-20 resize-none"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-start gap-4">
            <Briefcase size={20} className="text-red-600 mt-1" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Availability</span>
              <select 
                value={identity.availability}
                onChange={(e) => setIdentity(prev => ({ ...prev, availability: e.target.value as any }))}
                className="w-full bg-transparent border-none outline-none text-white font-display font-bold text-lg appearance-none"
              >
                <option value="OPEN_FOR_COLLABORATION">OPEN_FOR_COLLABORATION</option>
                <option value="DEEP_WORK_ONLY">DEEP_WORK_ONLY</option>
                <option value="STEALTH_MODE">STEALTH_MODE</option>
              </select>
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-start gap-4">
            <Globe size={20} className="text-red-600 mt-1" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Social Vectors (GitHub, LinkedIn, Substack)</span>
              <div className="space-y-2 mt-2">
                <input 
                  type="text" 
                  placeholder="GitHub URL"
                  value={identity.socialLinks?.github || ''}
                  onChange={(e) => setIdentity(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, github: e.target.value } }))}
                  className="w-full bg-white/5 rounded-full px-4 py-2 text-white text-xs font-mono outline-none border border-white/5 focus:border-red-600"
                />
                <input 
                  type="text" 
                  placeholder="LinkedIn URL"
                  value={identity.socialLinks?.linkedin || ''}
                  onChange={(e) => setIdentity(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, linkedin: e.target.value } }))}
                  className="w-full bg-white/5 rounded-full px-4 py-2 text-white text-xs font-mono outline-none border border-white/5 focus:border-red-600"
                />
                <input 
                  type="text" 
                  placeholder="Substack URL"
                  value={identity.socialLinks?.substack || ''}
                  onChange={(e) => setIdentity(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, substack: e.target.value } }))}
                  className="w-full bg-white/5 rounded-full px-4 py-2 text-white text-xs font-mono outline-none border border-white/5 focus:border-red-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <DotMatrixText className="mb-4">TELEMETRY_OVERRIDE</DotMatrixText>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-center gap-4">
            <MapPin size={20} className="text-red-600" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Location</span>
              <input 
                type="text" 
                value={state.location}
                onChange={(e) => setState(prev => ({ ...prev, location: e.target.value }))}
                className="w-full bg-transparent border-none outline-none text-white font-display font-bold text-lg"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 flex items-center gap-4">
            <Music size={20} className="text-red-600" />
            <div className="flex-1">
              <span className="block text-[10px] font-mono text-white/20 uppercase mb-1">Now Playing</span>
              <input 
                type="text" 
                value={state.music}
                onChange={(e) => setState(prev => ({ ...prev, music: e.target.value }))}
                className="w-full bg-transparent border-none outline-none text-white font-display font-bold text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <DotMatrixText className="mb-4">SYSTEM_MODE</DotMatrixText>
        <div className="grid grid-cols-2 gap-4">
          {modes.map(mode => (
            <button
              key={mode}
              onClick={() => setState(prev => ({ ...prev, mode: mode as VibeMode }))}
              className={cn(
                "p-6 rounded-[2rem] border transition-all text-left group",
                state.mode === mode ? "bg-red-600 border-red-600" : "bg-white/5 border-white/5 hover:bg-white/10"
              )}
            >
              <Zap size={16} className={cn("mb-4", state.mode === mode ? "text-white" : "text-white/20 group-hover:text-white/40")} />
              <span className={cn(
                "font-display font-bold text-sm block",
                state.mode === mode ? "text-white" : "text-white/60"
              )}>
                {mode}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => {
          // Simulate saving to global state or backend
          alert('Identity Core Updated. Changes synchronized across 4 vectors.');
        }}
        className="w-full py-6 bg-red-600 rounded-full text-[10px] font-mono uppercase tracking-widest text-white font-bold shadow-lg shadow-red-600/20"
      >
        SAVE_IDENTITY_CHANGES
      </button>
    </div>
  );
};
