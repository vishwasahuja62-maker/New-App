import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Lazy load pages for performance optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// Wrapper because useAuth must be inside provider
const AppRoutes = () => {
  const { isAuthenticated, onboardingStep, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={{ fontSize: '1.2rem', fontWeight: '500', opacity: 0.8, letterSpacing: '0.05em' }}>
          VERIFYING NEURAL LINK...
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div className="loading-spinner" style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <div style={{ fontSize: '1.2rem', fontWeight: '500', opacity: 0.8, letterSpacing: '0.05em' }}>
          INITIALIZING SECURE LINK...
        </div>
      </div>
    }>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? <Onboarding /> : <Navigate to="/" />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
