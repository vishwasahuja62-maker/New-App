import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Shield, ArrowRight, Sparkles, Heart, X, Mail, Lock, User as UserIcon, Menu, Globe, Zap, Users, Coffee } from 'lucide-react';

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
    const { login, register, isAuthenticated, logout, onboardingStep } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            if (isSignUp) {
                sessionStorage.setItem('onboardingIsNewUser', 'true');
            } else {
                sessionStorage.removeItem('onboardingIsNewUser');
            }
            if (result.onboardingStep >= 4) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        } else {
            setError(result.message);
        }
    };

    const openModal = (signupMode = false, customHeading = '') => {
        setIsSignUp(signupMode);
        setModalHeading(customHeading || (signupMode ? "Create Your Account" : "Welcome Back"));
        setFormData({ name: '', email: '', password: '' });
        setIsModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const openInfo = (key) => {
        // Convert key to URL-friendly slug
        const slug = key.toLowerCase().replace(/\s+/g, '-');
        navigate(`/info/${slug}`);
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

                    {/* Desktop Menu */}
                    <div className="nav-links">
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => navigate('/dashboard')} className="nav-link">Go to Dashboard</button>
                                <button onClick={() => logout()} className="btn btn-outline">Logout</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => openModal(false)} className="nav-link">Sign In</button>
                                <button onClick={() => openModal(true, "Get Started")} className="btn btn-primary">Get Started</button>
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
                        <span className="badge-dot"></span> A study buddy that understands you
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="hero-headline"
                    >
                        Learn Fast.<br />
                        <span className="gradient-text">Stress Less.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="hero-subtext"
                    >
                        Most apps treat every student the same. We use AI to learn how <i>you</i> learn, so you can master your subjects without ever feeling burnt out.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="hero-buttons"
                    >
                        <button
                            onClick={() => {
                                if (isAuthenticated) {
                                    if (onboardingStep >= 4) navigate('/dashboard');
                                    else navigate('/onboarding');
                                } else {
                                    openModal(true, "Start Your Assessment");
                                }
                            }}
                            className="btn btn-lg btn-primary"
                        >
                            {isAuthenticated ? (onboardingStep >= 4 ? "Enter Dashboard" : "Continue Session") : "Start Your Assessment"} <ArrowRight size={20} />
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
            </section >

            {/* Features Grid */}
            < section className="features-section" >
                <div className="section-header">
                    <h2>Studying That Feels Natural</h2>
                    <p>We use tech to keep you focused and happy while you work.</p>
                </div>
                <div className="features-grid">
                    <FeatureCard
                        icon={Brain}
                        title="Understanding How You Learn"
                        desc="We start by finding your unique learning style—whether you learn best by seeing, hearing, or doing."
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Your Perfect Pace"
                        desc="The app detects when you're tired and slows down, or speeds up when you've mastered a topic."
                        delay={0.3}
                    />
                    <FeatureCard
                        icon={Shield}
                        title="Stress Support"
                        desc="If you're feeling overwhelmed, we help you take a break and notify your trusted contact."
                        delay={0.5}
                    />
                </div>
            </section >

            {/* How It Works */}
            < section className="steps-section" >
                <div className="section-header">
                    <h2>3 Steps to Better Grades</h2>
                </div>
                <div className="steps-container-premium">
                    {[
                        { step: "01", title: "Take the Quiz", desc: "Start with a 2-minute assessment of your learning style and current mood.", icon: Brain },
                        { step: "02", title: "AI Calibration", desc: "Our AI builds a custom schedule that fits your daily energy levels.", icon: Sparkles },
                        { step: "03", title: "Enjoy Learning", desc: "Watch as your subjects adapt to you perfectly, making growth feel easy.", icon: Activity }
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
            </section >

            {/* Footer */}
            < footer className="landing-footer" >
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="/rabbit-logo.jpeg" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                            <h2>My True Companion</h2>
                        </div>
                        <p>We help you reach your goals by understanding how you learn, not just testing what you know.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <button className="footer-link-btn" onClick={() => openInfo('Assessment')}>Assessment</button>
                        <button className="footer-link-btn" onClick={() => openInfo('Learning Path')}>Learning Path</button>
                        <button className="footer-link-btn" onClick={() => openInfo('Resources')}>Resources</button>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <button className="footer-link-btn" onClick={() => openInfo('About Us')}>About Us</button>
                        <button className="footer-link-btn" onClick={() => openInfo('Careers')}>Careers</button>
                        <button className="footer-link-btn" onClick={() => openInfo('Privacy Policy')}>Privacy Policy</button>
                    </div>
                    <div className="footer-col">
                        <h4>Connect</h4>
                        <button className="footer-link-btn" onClick={() => openInfo('Twitter')}>Twitter</button>
                        <button className="footer-link-btn" onClick={() => openInfo('Discord')}>Discord</button>
                        <button className="footer-link-btn" onClick={() => openInfo('LinkedIn')}>LinkedIn</button>
                    </div>
                </div>
                <div className="footer-bottom">
                    © 2026 My True Companion Inc. All rights reserved.
                </div>
            </footer >

            <AnimatePresence>
                {isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <div className="auth-header">
                            <h2 className="modal-title" style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '1rem' }}>{modalHeading}</h2>
                            <p className="modal-subtitle" style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem' }}>
                                {isSignUp ? "Create your free account to see your learning profile." : "Pick up right where you left off."}
                            </p>
                        </div>

                        {error && <div className="auth-error-message" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{error}</div>}

                        <form onSubmit={handleSubmit} className="login-form-premium" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {isSignUp && (
                                <div className="premium-field-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}><UserIcon size={14} /> Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="premium-input-field"
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                            )}
                            <div className="premium-field-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}><Mail size={14} /> Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="premium-input-field"
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                            <div className="premium-field-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}><Lock size={14} /> Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="premium-input-field"
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="btn btn-primary btn-lg"
                                style={{ marginTop: '1rem', width: '100%' }}
                            >
                                {isSignUp ? "Start The Quiz" : "Login"}
                            </motion.button>

                            <p className="form-footer-premium" style={{ textAlign: 'center', marginTop: '1rem', color: '#64748b' }}>
                                {isSignUp ? "Already have an account?" : "New here?"}
                                <span className="link-premium" style={{ color: '#a78bfa', cursor: 'pointer', marginLeft: '0.5rem' }} onClick={() => setIsSignUp(!isSignUp)}>
                                    {isSignUp ? " Sign In" : " Get Started"}
                                </span>
                            </p>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div >
    );
};

export default LandingPage;
