import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, onboardingStep } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (onboardingStep < 4) return <Navigate to="/onboarding" replace />;
  return children;
};

// Wrapper because useAuth must be inside provider
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
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
