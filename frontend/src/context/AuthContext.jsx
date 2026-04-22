import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const API_URL = `${BASE_URL}/api/users`;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onboardingStep, setInternalOnboardingStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    iq: 0,
    eq: 0,
    fatigueLevel: 'normal',
    lifestyle: {},
    difficultSubjects: [],
    learningMode: 'visual',
    parentContact: '',
    academicData: { level: '', stream: '', subjects: [] }
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

      // DEMO CHECK
      if (token === 'demo-token-123') {
        setUser({
          _id: 'demo-user-id',
          name: 'Demo Student',
          email: 'demo@example.com',
          onboardingStep: 0
        });
        setIsAuthenticated(true);
        setInternalOnboardingStep(0);
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
        console.error("Auth check failed:", err);
        // Don't auto-logout on network error for better UX, maybe? 
        // No, standard is to logout if token invalid. But here it might be connection refused.
        // If connection refused, we might want to stay in loading or just fail.
        // For now, let's just clear if api fails.
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load metrics and profile from localStorage on user change
  useEffect(() => {
    if (user && user._id) {
      // Load Profile
      const savedProfile = localStorage.getItem(`profile_${user._id}`);
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to parse profile", e);
        }
      }

      // Load Metrics
      const savedMetrics = localStorage.getItem(`metrics_${user._id}`);
      if (savedMetrics) {
        try {
          setPerformanceMetrics(JSON.parse(savedMetrics));
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
    // DEMO LOGIN BYPASS
    if (userData.email === 'demo@example.com' || userData.password === 'demo123') {
      const demoUser = {
        _id: 'demo-user-id',
        name: 'Demo Student',
        email: 'demo@example.com',
        onboardingStep: 0,
        token: 'demo-token-123'
      };
      localStorage.setItem('token', demoUser.token);
      localStorage.removeItem(`metrics_demo-user-id`);
      setUser(demoUser);
      setIsAuthenticated(true);
      setInternalOnboardingStep(0);

      const demoSubjects = ["Physics", "Chemistry", "Mathematics", "English", "Computer Science"];
      setUserProfile(prev => ({
        ...prev,
        academicData: {
          level: "Class 12",
          stream: "PCM (Physics, Chem, Math)",
          subjects: demoSubjects
        }
      }));

      const demoMetrics = {
        Visual: 85,
        Auditory: 65,
        Logic: 90
      };
      demoSubjects.forEach(s => { demoMetrics[s] = 75; });
      updatePerformance(demoMetrics);

      return { success: true, onboardingStep: 0 };
    }

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
    setUserProfile({
      iq: 0,
      eq: 0,
      fatigueLevel: 'normal',
      lifestyle: {},
      difficultSubjects: [],
      learningMode: 'visual',
      parentContact: '',
      academicData: { level: '', stream: '', subjects: [] }
    });
    setPerformanceMetrics({
      Math: 50,
      Physics: 50,
      Visual: 50,
      Auditory: 50,
      Logic: 50
    });
  };

  const updateProfile = (data) => {
    setUserProfile((prev) => {
      const newProfile = { ...prev, ...data };
      if (user && user._id) {
        localStorage.setItem(`profile_${user._id}`, JSON.stringify(newProfile));
      }
      return newProfile;
    });
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
      if (user?._id === 'demo-user-id') return; // Skip API for demo
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

    // Phase 1 (p1) guards
    if (p1[7] === "17") math += 25;
    if (p1[8] === "Page") logic += 15;
    if (p1[9] === "No") logic += 20;
    if (p1[10] === "Circle") visual += 20;

    // Phase 2 (p2) guards
    if (p2 && p2["lifestyle_2"] && p2["lifestyle_2"].includes("Daily")) visual += 10;

    // Clamp values 0-100
    const clamp = (num) => Math.min(100, Math.max(10, num));

    const metrics = {};
    const academicSubjs = userProfile.academicData?.subjects || ["Mathematics", "Physics"];

    academicSubjs.forEach(s => {
      metrics[s] = 50;
    });

    metrics['Visual'] = clamp(visual);
    metrics['Auditory'] = clamp(auditory);
    metrics['Logic'] = clamp(logic);

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
