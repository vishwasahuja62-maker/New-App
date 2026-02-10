import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0); // 0: Not started, 1: Phase 1, 2: Phase 2, 3: Phase 3
  const [userProfile, setUserProfile] = useState({
    iq: 0,
    eq: 0,
    stressLevel: 'normal',
    lifestyle: {},
    difficultSubjects: [],
    learningMode: 'visual', // 'visual' or 'auditory'
    parentContact: '',
  });

  // Mock login function
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // In a real app, we'd fetch profile from backend
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setOnboardingStep(0);
  };

  const updateProfile = (data) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    setOnboardingStep(4); // 4 means completed
    // Save to backend here
    localStorage.setItem('clase_user_profile', JSON.stringify(userProfile));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      onboardingStep, 
      setOnboardingStep, 
      userProfile, 
      updateProfile,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};
