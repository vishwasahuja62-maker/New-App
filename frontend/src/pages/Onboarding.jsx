import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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

const QuestionCard = ({ question, onAnswer, currentAnswer }) => {
    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="glass question-card"
        >
            <h3 className="question-text">{question.text}</h3>
            <div className="options-grid">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        className={`option-btn ${currentAnswer === option ? 'selected' : ''}`}
                        onClick={() => onAnswer(option)}
                    >
                        {option}
                    </button>
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
    const { user, completeOnboarding, updateProfile } = useAuth();
    const navigate = useNavigate();

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

    const handeContactSubmit = (contact) => {
        updateProfile({ parentContact: contact });
        completeOnboarding();
        navigate('/dashboard');
    };

    return (
        <div className="onboarding-container">
            {/* Dynamic Background */}
            <div className="bg-blobs">
                <div className="bg-glow-1"></div>
                <div className="bg-glow-2"></div>
                <div className="bg-glow-3"></div>
            </div>

            <header className="onboarding-header">
                <h2>Phase {phase} <span className="phase-name">{phase === 1 ? ": Cognitive Assessment" : phase === 2 ? ": Lifestyle & Learning" : ": Safety Net"}</span></h2>
            </header>

            <div className="main-content-area">
                <AnimatePresence mode="wait">
                    {phase < 3 ? (
                        <div className="question-wrapper">
                            <ProgressBar progress={(currentQIndex / totalQuestions) * 100} />
                            <QuestionCard
                                key={currentQuestions[currentQIndex].id}
                                question={currentQuestions[currentQIndex]}
                                onAnswer={handleAnswer}
                                currentAnswer={answers[currentQuestions[currentQIndex].id]}
                            />
                        </div>
                    ) : (
                        <ParentContactForm onSubmit={handeContactSubmit} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Onboarding;
