import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VibeProvider } from './components/VibeProvider';
import { GlobalNav } from './components/GlobalNav';

const PublicProxy = lazy(() => import('./environments/PublicProxy'));
const OwnerHub = lazy(() => import('./environments/OwnerHub'));
const EvaluatorIntake = lazy(() => import('./components/EvaluatorIntake'));
const MediaVault = lazy(() => import('./components/MediaVault'));
const TestingDashboard = import.meta.env.DEV
  ? lazy(() => import('./components/TestingDashboard').then((module) => ({ default: module.TestingDashboard })))
  : null;

const RouteFallback = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center text-sm tracking-widest">
    Loading environment...
  </div>
);

export default function App() {
  return (
    <Router>
      <VibeProvider>
        <GlobalNav />
        {TestingDashboard ? (
          <Suspense fallback={null}>
            <TestingDashboard />
          </Suspense>
        ) : null}
        <Suspense fallback={<RouteFallback />}>
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
        </Suspense>
      </VibeProvider>
    </Router>
  );
}
