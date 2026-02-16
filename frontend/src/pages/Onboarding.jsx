import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, motionValue, useSpring } from 'framer-motion';
import { Brain, Activity, Heart, Sparkles, ChevronRight, CheckCircle2, ShieldCheck, User, Phone, Users } from 'lucide-react';
import { phase1Questions, phase2Questions } from '../data';
import '../onboarding.css';

const ProgressBar = ({ progress }) => {
    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

const QuestionCard = ({ question, onAnswer, currentAnswer, totalSteps, currentIndex }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="premium-question-card"
        >
            <div className="question-header">
                <span className="question-count">Assessment {currentIndex + 1} of {totalSteps}</span>
                <h3 className="question-text">{question.text}</h3>
            </div>

            <div className="options-container">
                {question.options.map((option, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`premium-option-btn ${currentAnswer === option ? 'selected' : ''}`}
                        onClick={() => onAnswer(option)}
                    >
                        <div className="option-indicator">
                            {currentAnswer === option && <CheckCircle2 size={18} />}
                        </div>
                        <span className="option-label">{option}</span>
                        <ChevronRight className="option-arrow" size={16} />
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

const ParentContactForm = ({ onSubmit }) => {
    const [contact, setContact] = useState({ name: '', phone: '', relation: 'Parent' });

    const handleChange = (e) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass form-card"
        >
            <h3 className="form-title">Emergency Contact</h3>
            <p className="form-desc">In likely cases of high stress, we notify your trusted contact.</p>
            <div className="input-group">
                <label>Name</label>
                <input name="name" value={contact.name} onChange={handleChange} className="input-field" placeholder="Parent Name" />
            </div>
            <div className="input-group">
                <label>Phone Number</label>
                <input name="phone" value={contact.phone} onChange={handleChange} className="input-field" placeholder="+1 234 567 890" />
            </div>
            <div className="input-group">
                <label>Relation</label>
                <select name="relation" value={contact.relation} onChange={handleChange} className="input-field">
                    <option>Parent</option>
                    <option>Guardian</option>
                    <option>Therapist</option>
                </select>
            </div>
            <button onClick={() => onSubmit(contact)} className="btn btn-primary w-full mt-4">Complete Setup</button>
        </motion.div>
    );
};

const Onboarding = () => {
    const { user, onboardingStep, completeOnboarding, updateProfile } = useAuth();
    const navigate = useNavigate();
    const isNewUser = sessionStorage.getItem('onboardingIsNewUser') === 'true';

    useEffect(() => {
        if (onboardingStep >= 4) {
            navigate('/dashboard');
        }
    }, [onboardingStep, navigate]);

    const [phase, setPhase] = useState(1);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    // Flatten questions for phase handling if needed, or handle per phase
    const currentQuestions = phase === 1 ? phase1Questions : phase2Questions;
    const totalQuestions = currentQuestions.length;
    const progress = ((currentQIndex + 1) / totalQuestions) * 100;

    const handleAnswer = (answer) => {
        setAnswers(prev => ({ ...prev, [currentQuestions[currentQIndex].id]: answer }));

        setTimeout(() => {
            if (currentQIndex < totalQuestions - 1) {
                setCurrentQIndex(currentQIndex + 1);
            } else {
                handlePhaseCompletion();
            }
        }, 300); // slight delay for visual
    };

    const handlePhaseCompletion = () => {
        // Analyze answers here if real logic exist
        if (phase === 1) {
            updateProfile({ answersPhase1: answers });
            setPhase(2);
            setCurrentQIndex(0); // Reset for phase 2
            setAnswers({}); // Reset or keep separate? Keep separate is safer
        } else if (phase === 2) {
            updateProfile({ answersPhase2: answers });
            setPhase(3);
        }
    };

    const handeContactSubmit = async (contact) => {
        updateProfile({ parentContact: contact });
        await completeOnboarding();
        navigate('/dashboard');
    };

    return (
        <div className="onboarding-container">
            <div className="onboarding-bg-layer">
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
                <div className="noise-overlay"></div>
            </div>

            <div className="onboarding-inner">
                <header className="onboarding-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div className="brand-badge">
                            <Sparkles size={16} />
                            <span>My True Companion AI</span>
                        </div>
                        {!isNewUser && (
                            <button
                                onClick={() => completeOnboarding()}
                                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Skip Assessment
                            </button>
                        )}
                    </div>
                    <h1>
                        {phase === 1 ? "Cognitive Analysis" : phase === 2 ? "Lifestyle Calibration" : "Safety Protocol"}
                    </h1>
                    <p className="phase-desc">
                        {phase === 1 ? "Mapping your mental landscape for personalized support." :
                            phase === 2 ? "Understanding your world to optimize your environment." :
                                "Setting up your emergency support network."}
                    </p>
                </header>

                <div className="assessment-stage">
                    <AnimatePresence mode="wait">
                        {phase < 3 ? (
                            <div className="stage-content">
                                <ProgressBar progress={(currentQIndex / totalQuestions) * 100} />
                                <QuestionCard
                                    key={`${phase}-${currentQIndex}`}
                                    question={currentQuestions[currentQIndex]}
                                    onAnswer={handleAnswer}
                                    currentAnswer={answers[currentQuestions[currentQIndex].id]}
                                    totalSteps={totalQuestions}
                                    currentIndex={currentQIndex}
                                />
                            </div>
                        ) : (
                            <ParentContactForm onSubmit={handeContactSubmit} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
