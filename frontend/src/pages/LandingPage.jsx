import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Shield, ArrowRight, Sparkles, Heart, X, Mail, Lock, User as UserIcon } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                className="premium-modal-card glass"
            >
                <button className="premium-close-btn" onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>
                <div className="modal-inner-content">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ delay, duration: 0.5, type: "spring", stiffness: 300 }}
        viewport={{ once: true }}
        className="glass feature-card-premium"
    >
        <div className="feature-icon-wrapper">
            <Icon size={32} strokeWidth={1.5} />
            <div className="icon-pulse-bg"></div>
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
        <div className="card-shine"></div>
    </motion.div>
);

const StepItem = ({ step, title, desc, icon: Icon, idx }) => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="step-item-premium"
    >
        <div className="step-visual">
            <div className="step-number-pill">{step}</div>
            <div className="step-line"></div>
        </div>
        <div className="step-card glass">
            <div className="step-icon-box">
                <Icon size={24} />
            </div>
            <div className="step-text">
                <h3>{title}</h3>
                <p>{desc}</p>
            </div>
        </div>
    </motion.div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const { login, register, isAuthenticated, logout } = useAuth();
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
            <header className="landing-navbar">
                <div className="nav-content">
                    <div className="logo-container" onClick={() => navigate('/')}>
                        <img src="/rabbit-logo.jpeg" alt="Logo" className="logo-icon-img" />
                        <h1 className="logo-text">My True Companion</h1>
                    </div>
                    <div className="nav-links">
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => navigate('/dashboard')} className="nav-link">Dashboard</button>
                                <button onClick={() => logout()} className="btn btn-outline">Logout</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => openModal(false)} className="nav-link">Sign In</button>
                                <button onClick={() => openModal(true)} className="btn btn-primary">Get Started</button>
                            </>
                        )}
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
                        <button
                            onClick={() => isAuthenticated ? navigate('/onboarding') : openModal(true)}
                            className="btn btn-lg btn-primary"
                        >
                            {isAuthenticated ? "Continue Session" : "Start Assessment"} <ArrowRight size={20} />
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
                    <div className="visual-card glass neural-harmony">
                        <div className="harmony-core">
                            <div className="pulse-ring"></div>
                            <div className="pulse-ring ring-2"></div>
                            <div className="pulse-ring ring-3"></div>
                            <div className="core-icon">
                                <Sparkles size={48} className="icon-glow" />
                            </div>
                        </div>
                        <div className="floating-nodes">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className={`node node-${i}`}></div>
                            ))}
                        </div>
                        <div className="visual-caption">Neural Harmony & Growth</div>
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
                <div className="steps-container-premium">
                    {[
                        { step: "01", title: "Cognitive Assessment", desc: "Complete a quick neuroscience-backed quiz to map your brain's unique rhythms.", icon: Brain },
                        { step: "02", title: "Personalized Calibration", desc: "Our AI builds a custom biometric dashboard tailored to your cognitive load.", icon: Sparkles },
                        { step: "03", title: "Dynamic Optimization", desc: "Interact with content that shifts in difficulty and style based on your real-time state.", icon: Activity }
                    ].map((item, idx) => (
                        <StepItem
                            key={idx}
                            idx={idx}
                            step={item.step}
                            title={item.title}
                            desc={item.desc}
                            icon={item.icon}
                        />
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="/rabbit-logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                            <h2>My True Companion</h2>
                        </div>
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
                    © 2026 My True Companion Inc. All rights reserved. Built with passion for better learning.
                </div>
            </footer>

            <AnimatePresence>
                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <div className="auth-header">
                            <h2 className="modal-title">{isSignUp ? "Create Journey" : "Welcome Back"}</h2>
                            <p className="modal-subtitle">
                                {isSignUp ? "Start your personalized cognitive optimization." : "Resume your progress with My True Companion."}
                            </p>
                        </div>

                        {error && <div className="auth-error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form-premium">
                            {isSignUp && (
                                <div className="premium-field-group">
                                    <label><UserIcon size={14} /> Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="premium-input-field"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            )}
                            <div className="premium-field-group">
                                <label><Mail size={14} /> Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="premium-input-field"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div className="premium-field-group">
                                <label><Lock size={14} /> Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="premium-input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn btn-primary btn-lg w-full mt-4"
                            >
                                {isSignUp ? "Initialize Account" : "Access Dashboard"}
                            </motion.button>

                            <p className="form-footer-premium">
                                {isSignUp ? "Already a companion?" : "New to the platform?"}
                                <span className="link-premium" onClick={() => setIsSignUp(!isSignUp)}>
                                    {isSignUp ? " Sign In" : " Get Started"}
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
