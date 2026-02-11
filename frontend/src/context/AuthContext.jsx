import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Ensure axios sends cookies with every request
axios.defaults.withCredentials = true;
const API_URL = 'http://localhost:5000/api/users';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
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

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile`);
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
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
      setUser(res.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      setUser(res.data);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`);
      setUser(null);
      setIsAuthenticated(false);
      setOnboardingStep(0);
    } catch (err) {
      console.error('Logout failed', err);
    }
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
