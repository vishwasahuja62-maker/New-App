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

  const [performanceMetrics, setPerformanceMetrics] = useState({
    Math: 50,
    Physics: 50,
    Visual: 50,
    Auditory: 50,
    Logic: 50
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

  // Load performance metrics for specific user
  useEffect(() => {
    if (user && user._id) {
      const saved = localStorage.getItem(`metrics_${user._id}`);
      if (saved) {
        try {
          setPerformanceMetrics(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse metrics", e);
        }
      } else {
        // Reset to defaults for new user
        setPerformanceMetrics({
          Math: 50,
          Physics: 50,
          Visual: 50,
          Auditory: 50,
          Logic: 50
        });
      }
    }
  }, [user]);

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

  const updatePerformance = (metrics) => {
    setPerformanceMetrics((prev) => {
      const newMetrics = { ...prev, ...metrics };
      if (user && user._id) {
        localStorage.setItem(`metrics_${user._id}`, JSON.stringify(newMetrics));
      }
      return newMetrics;
    });
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
    // Calculate metrics based on Onboarding Answers
    const p1 = userProfile.answersPhase1 || {};
    const p2 = userProfile.answersPhase2 || {};

    let math = 50;
    let logic = 50;
    let visual = 50;
    let auditory = 50;
    let physics = 50;

    // Math Calculation
    if (p1[7] === "17") math += 25;
    if (p2[2] && p2[2].includes("practice problems")) math += 15;
    if (p2[1] && p2[1].includes("Mathematics")) math -= 15;

    // Logic Calculation
    if (p1[8] === "Page") logic += 15;
    if (p1[9] === "No") logic += 20;

    // Visual Calculation
    if (p1[10] === "Circle") visual += 20;
    if (p2[2] && p2[2].includes("Watching diagrams")) visual += 25;

    // Auditory Calculation
    if (p2[2] && p2[2].includes("Listening")) auditory += 30;

    // Physics Calculation (Derived + Interest)
    physics = (math + logic) / 2;
    if (p2[1] && p2[1].includes("Physics")) physics -= 15;

    // Clamp values 0-100
    const clamp = (num) => Math.min(100, Math.max(10, num));

    const metrics = {
      Math: clamp(math),
      Physics: clamp(physics),
      Visual: clamp(visual),
      Auditory: clamp(auditory),
      Logic: clamp(logic)
    };

    updatePerformance(metrics);
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
      performanceMetrics,
      updatePerformance,
      completeOnboarding
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
