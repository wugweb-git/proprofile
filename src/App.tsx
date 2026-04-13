import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VibeProvider } from './components/VibeProvider';
import { GlobalNav } from './components/GlobalNav';
import { TestingDashboard } from './components/TestingDashboard';
import PublicProxy from './environments/PublicProxy';
import OwnerHub from './environments/OwnerHub';
import EvaluatorIntake from './components/EvaluatorIntake';
import MediaVault from './components/MediaVault';

export default function App() {
  return (
    <Router>
      <VibeProvider>
        <GlobalNav />
        <TestingDashboard />
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
      </VibeProvider>
    </Router>
  );
}
