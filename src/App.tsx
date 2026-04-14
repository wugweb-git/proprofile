import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VibeProvider } from './components/VibeProvider';
import { GlobalNav } from './components/GlobalNav';
import { TestingDashboard } from './components/TestingDashboard';
import { AmbientVoicePulse } from './components/AmbientVoicePulse';
import { MinimalFooter } from './components/MinimalFooter';
import PublicProxy from './environments/PublicProxy';
import OwnerHub from './environments/OwnerHub';
import EvaluatorIntake from './components/EvaluatorIntake';
import MediaVault from './components/MediaVault';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen flex flex-col font-sans text-black bg-white overflow-x-hidden selection:bg-nothing-yellow selection:text-black">
      {/* Persistent Ambient Pulse (Offline Tracker & Voice) */}
      <AmbientVoicePulse />

      {/* Persistent UI Controls */}
      <TestingDashboard />
      
      {/* Route Content wrapped with proper padding-bottom to avoid overlay collisions */}
      <main className="flex-1 w-full pb-28 md:pb-32 isolate" role="main">
        {children}
        <MinimalFooter />
      </main>

      {/* Global Nav Bottom Overlay */}
      <GlobalNav />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <VibeProvider>
        <AppLayout>
          <Routes>
            {/* Environment A: Public Proxy (The Manuscript) */}
            <Route path="/" element={<PublicProxy />} />
            
            {/* Environment B: Owner HUD (Command Center) */}
            <Route path="/owner/*" element={<OwnerHub />} />

            {/* Environment C: Complexity Port (Standalone Intake) */}
            <Route path="/port/*" element={<EvaluatorIntake />} />

            {/* Environment D: Media Vault */}
            <Route path="/media" element={<MediaVault />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </VibeProvider>
    </Router>
  );
}
