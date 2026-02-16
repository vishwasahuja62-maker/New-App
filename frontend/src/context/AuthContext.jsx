import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5000/api/users';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onboardingStep, setInternalOnboardingStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    iq: 0,
    eq: 0,
    stressLevel: 'normal',
    lifestyle: {},
    difficultSubjects: [],
    learningMode: 'visual',
    parentContact: '',
  });

  // Setup axios to include token from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/profile`);
        if (res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
          if (res.data.onboardingStep !== undefined) {
            setInternalOnboardingStep(res.data.onboardingStep ?? 0);
          }
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/login`, userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      const step = res.data.onboardingStep ?? 0;
      setInternalOnboardingStep(step);
      return { success: true, onboardingStep: step };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setInternalOnboardingStep(0);
      return { success: true, onboardingStep: 0 };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setInternalOnboardingStep(0);
  };

  const updateProfile = (data) => {
    setUserProfile((prev) => ({ ...prev, ...data }));
  };

  const setOnboardingStep = async (step, persist = false) => {
    setInternalOnboardingStep(step);
    if (persist && isAuthenticated) {
      try {
        await axios.put(`${API_URL}/onboarding-step`, { onboardingStep: step });
        setUser(prev => prev ? ({ ...prev, onboardingStep: step }) : prev);
      } catch (err) {
        console.error('Failed to persist onboarding step', err);
      }
    }
  };

  const completeOnboarding = async () => {
    await setOnboardingStep(4, true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      onboardingStep,
      setOnboardingStep,
      userProfile,
      updateProfile,
      completeOnboarding
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
