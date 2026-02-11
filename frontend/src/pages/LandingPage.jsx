import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Shield, ArrowRight } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass modal-content"
            >
                <button className="close-btn" onClick={onClose}>✕</button>
                {children}
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.5 }}
        viewport={{ once: true }}
        className="glass feature-card"
    >
        <div className="feature-icon">
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        let result;
        if (isSignUp) {
            result = await register(formData);
        } else {
            result = await login({ email: formData.email, password: formData.password });
        }

        if (result.success) {
            setIsModalOpen(false);
            navigate('/onboarding');
        } else {
            setError(result.message);
        }
    };

    const openModal = (signupMode = false) => {
        setIsSignUp(signupMode);
        setIsModalOpen(true);
    };

    return (
        <div className="landing-container">
            {/* Premium Animated Background */}
            <div className="bg-blobs">
                <div className="bg-glow-1"></div>
                <div className="bg-glow-2"></div>
                <div className="bg-glow-3"></div>
                <div className="bg-noise"></div>
                <div className="bg-lines"></div>
            </div>

            {/* Navbar */}
            <header className="landing-navbar glass-nav">
                <div className="nav-content">
                    <h1 className="logo-text">CLASE</h1>
                    <div className="nav-links">
                        <button onClick={() => openModal(false)} className="nav-link">Sign In</button>
                        <button onClick={() => openModal(true)} className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-badge"
                    >
                        <span className="badge-dot"></span> AI-Powered Mental Wellness
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="hero-headline"
                    >
                        Master Your Mind.<br />
                        <span className="gradient-text">Optimize Your Future.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="hero-subtext"
                    >
                        An intelligent adaptive learning environment that monitors your cognitive load in real-time to prevent burnout and maximize retention.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="hero-buttons"
                    >
                        <button onClick={() => openModal(true)} className="btn btn-lg btn-primary">
                            Start Assessment <ArrowRight size={20} />
                        </button>
                        <button className="btn btn-lg btn-outline">
                            View Demo
                        </button>
                    </motion.div>
                </div>

                {/* Hero Visual Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="hero-visual"
                >
                    <div className="visual-card glass">
                        <div className="mock-chart">
                            <div className="mock-line"></div>
                            <div className="mock-dot"></div>
                        </div>
                        <div className="visual-caption">Real-time Cognitive Tracking</div>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="features-section">
                <div className="section-header">
                    <h2>Scientific Approach to Learning</h2>
                    <p>We combine psychology and AI to create the perfect study environment.</p>
                </div>
                <div className="features-grid">
                    <FeatureCard
                        icon={Brain}
                        title="Cognitive Analysis"
                        desc="Our initial assessment determines your IQ, EQ, and current mental state to tailor the curriculum."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Live Bio-Feedback"
                        desc="We monitor your interaction patterns to detect stress spikes and adjust difficulty in real-time."
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Safety Net"
                        desc="In moments of high depression or anxiety indicators, we discreetly notify your trusted contacts."
                        delay={0.5}
                    />
                </div>
            </section>

            {/* How It Works */}
            <section className="steps-section">
                <div className="section-header">
                    <h2>Your Journey to Balance</h2>
                </div>
                <div className="steps-container">
                    {[
                        { step: "01", title: "Assessment", desc: "Complete a quick cognitive & lifestyle quiz." },
                        { step: "02", title: "Calibration", desc: "AI builds your personalized dashboard." },
                        { step: "03", title: "Optimization", desc: "Learn with content that adapts to you." }
                    ].map((item, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            key={idx}
                            className="step-item"
                        >
                            <div className="step-number">{item.step}</div>
                            <div className="step-content">
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2>CLASE</h2>
                        <p>Optimizing human potential through adaptive learning and cognitive science.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <a href="#">Assessment</a>
                        <a href="#">Learning Path</a>
                        <a href="#">Resources</a>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <a href="#">About Us</a>
                        <a href="#">Careers</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                    <div className="footer-col">
                        <h4>Connect</h4>
                        <a href="#">Twitter</a>
                        <a href="#">Discord</a>
                        <a href="#">LinkedIn</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    © 2026 CLASE Inc. All rights reserved. Built with passion for better learning.
                </div>
            </footer>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <h2 className="modal-title">{isSignUp ? "Create Account" : "Welcome Back"}</h2>
                        {error && <div className="auth-error-message">{error}</div>}
                        <form onSubmit={handleSubmit} className="login-form">
                            {isSignUp && (
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full">
                                {isSignUp ? "Sign Up & Start" : "Log In"}
                            </button>

                            <p className="form-footer">
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                                <span className="link" onClick={() => setIsSignUp(!isSignUp)}>
                                    {isSignUp ? " Sign In" : " Sign Up"}
                                </span>
                            </p>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;
