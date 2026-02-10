import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const LandingPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        login({ name: "User", email });
        setIsLoginOpen(false);
        navigate('/onboarding');
    };

    return (
        <div className="landing-container">
            {/* Background Orbs */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>

            <header className="landing-header">
                <h1 className="logo">CLASE</h1>
                <button onClick={() => setIsLoginOpen(true)} className="glass btn-header">
                    Sign In
                </button>
            </header>

            <main className="landing-main">
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="hero-title"
                >
                    Your Mind, Your Pace.
                </motion.h2>
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="hero-subtitle"
                >
                    An adaptive learning environment designed to understand your cognitive state and personalize your journey.
                </motion.p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLoginOpen(true)}
                    className="btn btn-primary btn-hero"
                >
                    Start Your Journey
                </motion.button>
            </main>

            <AnimatePresence>
                {isLoginOpen && (
                    <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
                        <h2 className="modal-title">Welcome Back</h2>
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                Continue
                            </button>
                            <p className="form-footer">
                                Don't have an account? <span className="link">Sign up</span>
                            </p>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LandingPage;
