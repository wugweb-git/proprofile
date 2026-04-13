import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Briefcase, Database, Check, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const DotMatrixText = ({ children, className, color = 'text-white/40' }: { children: React.ReactNode, className?: string, color?: string }) => (
  <span className={cn("nothing-dot-matrix", color, className)}>
    {children}
  </span>
);

interface SyncPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'connected' | 'syncing' | 'disconnected';
  lastSync?: string;
}

export const SyncCenter = () => {
  const [platforms, setPlatforms] = useState<SyncPlatform[]>([
    { id: 'naukri', name: 'Naukri', icon: <Briefcase size={16} />, status: 'connected', lastSync: '2m ago' },
    { id: 'substack', name: 'Substack', icon: <Database size={16} />, status: 'connected', lastSync: '4h ago' },
    { id: 'medium', name: 'Medium', icon: <Globe size={16} />, status: 'disconnected' },
    { id: 'behance', name: 'Behance', icon: <ExternalLink size={16} />, status: 'disconnected' },
    { id: 'dribbble', name: 'Dribbble', icon: <ExternalLink size={16} />, status: 'disconnected' },
    { id: 'linkedin', name: 'LinkedIn', icon: <ExternalLink size={16} />, status: 'connected', lastSync: '1h ago' },
  ]);

  const toggleSync = (id: string) => {
    if (id === 'linkedin') {
      // Simulate OAuth Popup
      const width = 600;
      const height = 700;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      const win = window.open('', 'LinkedIn OAuth', `width=${width},height=${height},left=${left},top=${top}`);
      if (win) {
        win.document.body.innerHTML = `
          <div style="background: #0077b5; color: white; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px;">
            <h1 style="margin-bottom: 20px;">LinkedIn Authorization</h1>
            <p style="margin-bottom: 40px; font-size: 18px;">The Spirit Engine is requesting access to your profile data.</p>
            <button id="auth-btn" style="background: white; color: #0077b5; border: none; padding: 15px 40px; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 16px;">Authorize Access</button>
            <script>
              document.getElementById('auth-btn').onclick = function() {
                this.innerText = 'Authorizing...';
                this.disabled = true;
                setTimeout(() => {
                  window.close();
                }, 2000);
              };
            </script>
          </div>
        `;
      }

      setPlatforms(prev => prev.map(p => p.id === 'linkedin' ? { ...p, status: 'syncing' } : p));
      
      setTimeout(() => {
        setPlatforms(prev => prev.map(p => p.id === 'linkedin' ? { ...p, status: 'connected', lastSync: 'Just now' } : p));
      }, 5000);
      
      return;
    }

    setPlatforms(prev => prev.map(p => {
      if (p.id === id) {
        if (p.status === 'disconnected') return { ...p, status: 'syncing' };
        if (p.status === 'syncing') return { ...p, status: 'connected', lastSync: 'Just now' };
        return { ...p, status: 'disconnected' };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <DotMatrixText color="text-red-600">EXTERNAL_SYNC_VECTORS</DotMatrixText>
        <RefreshCw size={14} className="text-white/20 animate-spin-slow" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {platforms.map((platform) => (
          <motion.div 
            key={platform.id}
            whileHover={{ scale: 1.02 }}
            className="nothing-card-dark flex items-center justify-between p-6"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                platform.status === 'connected' ? "bg-red-600/10 text-red-600" : "bg-white/5 text-white/20"
              )}>
                {platform.icon}
              </div>
              <div>
                <div className="text-white font-display font-bold text-sm tracking-tight">{platform.name}</div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[8px] font-mono uppercase tracking-widest",
                    platform.status === 'connected' ? "text-red-600" : "text-white/20"
                  )}>
                    {platform.status}
                  </span>
                  {platform.lastSync && (
                    <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">
                      • {platform.lastSync}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => toggleSync(platform.id)}
              className={cn(
                "px-4 py-2 rounded-full text-[8px] font-mono uppercase tracking-widest transition-all",
                platform.status === 'connected' ? "bg-white/5 text-white/40 hover:bg-white/10" : "bg-red-600 text-white"
              )}
            >
              {platform.status === 'connected' ? 'Disconnect' : platform.status === 'syncing' ? 'Syncing...' : 'Connect'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-red-600/5 border border-red-600/10 rounded-[2rem] p-6 flex gap-4">
        <AlertCircle size={20} className="text-red-600 shrink-0" />
        <p className="text-[10px] font-mono text-red-600/60 leading-relaxed uppercase tracking-wider">
          System is actively indexing Naukri & LinkedIn for JD overlaps. Real-time Notion sync is currently in Expansive Mode.
        </p>
      </div>
    </div>
  );
};
