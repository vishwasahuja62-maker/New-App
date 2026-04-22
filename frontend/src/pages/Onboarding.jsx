import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence, motionValue, useSpring } from 'framer-motion';
import { Brain, Activity, Heart, Sparkles, ChevronRight, CheckCircle2, ShieldCheck, User, Phone, Users, ArrowRight, BadgeCheck } from 'lucide-react';
import { phase1Questions, phase2Questions, educationData } from '../data';
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
            <p className="form-desc">To help support your gentle learning journey, we stay connected with your trusted contact.</p>
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

const AcademicStage = ({ onComplete }) => {
    const [level, setLevel] = useState('');
    const [college, setCollege] = useState('');
    const [stream, setStream] = useState('');
    const [semester, setSemester] = useState('');

    const levels = Object.keys(educationData);
    const availableColleges = (level === 'College') ? educationData[level].colleges : null;
    const availableStreams = level ? educationData[level].streams : null;
    const availableSemesters = (level === 'College' && stream) ? educationData[level].semesters : null;

    const handleNext = () => {
        let subjects = [];
        const collegeSubjects = educationData[level].subjects;

        if (level === 'College') {
            const specificCol = collegeSubjects[college];
            if (specificCol && specificCol[stream]) {
                subjects = specificCol[stream][semester] || [];
            } else {
                subjects = collegeSubjects["Default"][stream]?.[semester] || [];
            }
        } else if (availableStreams) {
            subjects = collegeSubjects[stream];
        } else {
            subjects = collegeSubjects;
        }
        onComplete({ level, college, stream, semester, subjects });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="premium-question-card"
        >
            <div className="question-header">
                <span className="question-count">Curriculum Setup</span>
                <h3 className="question-text">Tell us about your studies</h3>
            </div>

            <div className="options-container">
                <AnimatePresence mode="wait">
                    {!level ? (
                        <motion.div
                            key="level-select"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <p className="modal-subtitle" style={{ marginBottom: '1.5rem', textAlign: 'left', color: '#94a3b8' }}>Select your current education level:</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                {levels.map((l, idx) => (
                                    <motion.button
                                        key={l}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="premium-option-btn"
                                        onClick={() => setLevel(l)}
                                        style={{ justifyContent: 'center', padding: '1.5rem' }}
                                    >
                                        <span style={{ fontWeight: 700 }}>{l}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (level === 'College' && !college) ? (
                        <motion.div
                            key="college-select"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <p className="modal-subtitle" style={{ marginBottom: '1rem', textAlign: 'left', color: '#94a3b8' }}>Select your institution:</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                                {availableColleges.map((c, idx) => (
                                    <motion.button
                                        key={c}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="premium-option-btn"
                                        onClick={() => setCollege(c)}
                                        style={{ padding: '1rem', fontSize: '0.85rem', justifyContent: 'center', height: 'auto' }}
                                    >
                                        <span style={{ fontWeight: 600 }}>{c}</span>
                                    </motion.button>
                                ))}
                            </div>
                            <button
                                className="btn-text"
                                style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
                                onClick={() => setLevel('')}
                            >
                                ← Back to Levels
                            </button>
                        </motion.div>
                    ) : availableStreams && !stream ? (
                        <motion.div
                            key="stream-select"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <p className="modal-subtitle" style={{ marginBottom: '1.5rem', textAlign: 'left', color: '#94a3b8' }}>Choose your stream for {level}:</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {availableStreams.map((s, idx) => (
                                    <motion.button
                                        key={s}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="premium-option-btn"
                                        onClick={() => setStream(s)}
                                    >
                                        <div className="option-indicator"><Sparkles size={14} /></div>
                                        <span className="option-label" style={{ fontWeight: 600 }}>{s}</span>
                                        <ChevronRight size={18} className="option-arrow" />
                                    </motion.button>
                                ))}
                            </div>
                            <button
                                className="btn-text"
                                style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
                                onClick={() => level === 'College' ? setCollege('') : setLevel('')}
                            >
                                ← Back
                            </button>
                        </motion.div>
                    ) : (level === 'College' && !semester) ? (
                        <motion.div
                            key="semester-select"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <p className="modal-subtitle" style={{ marginBottom: '1rem', textAlign: 'left', color: '#94a3b8' }}>Select your Current Semester:</p>
                            <p style={{ color: '#6366f1', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 600 }}>{college} // {stream}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                {availableSemesters.map((sem, idx) => (
                                    <motion.button
                                        key={sem}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="premium-option-btn"
                                        onClick={() => setSemester(sem)}
                                        style={{ padding: '1rem', fontSize: '0.9rem', justifyContent: 'center' }}
                                    >
                                        <span style={{ fontWeight: 600 }}>{sem}</span>
                                    </motion.button>
                                ))}
                            </div>
                            <button
                                className="btn-text"
                                style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
                                onClick={() => setStream('')}
                            >
                                ← Back to Streams
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="confirm-subjects"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            style={{ textAlign: 'center', width: '100%', maxWidth: '500px', margin: '0 auto' }}
                        >
                            <div className="glass" style={{
                                padding: '2.5rem 2rem',
                                borderRadius: '32px',
                                marginBottom: '2rem',
                                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(129, 140, 248, 0.03) 100%)',
                                border: '1px solid rgba(129, 140, 248, 0.2)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 0 20px rgba(129, 140, 248, 0.05)'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(129, 140, 248, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    border: '1px solid rgba(129, 140, 248, 0.2)'
                                }}>
                                    <BadgeCheck size={32} color="#818cf8" />
                                </div>

                                <h4 style={{ color: '#818cf8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>{level} Profile</h4>
                                <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>{college || 'Academic Core'}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                    {stream && <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>{stream}</span>}
                                    {stream && semester && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>}
                                    {semester && <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary-color)' }}>{semester}</span>}
                                </div>

                                <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Synchronized Curriculum</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                                    {(level === 'College'
                                        ? (educationData[level].subjects[college]?.[stream]?.[semester] || educationData[level].subjects["Default"]?.[stream]?.[semester])
                                        : (availableStreams ? educationData[level].subjects[stream] : educationData[level].subjects)
                                    )?.map((s, idx) => (
                                        <motion.span
                                            key={s}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 + (idx * 0.05) }}
                                            className="badge"
                                            style={{
                                                background: 'rgba(129, 140, 248, 0.06)',
                                                color: '#e2e8f0',
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: '14px',
                                                fontSize: '0.85rem',
                                                fontWeight: 600,
                                                border: '1px solid rgba(129, 140, 248, 0.15)',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {s}
                                        </motion.span>
                                    )) || <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Course mapping in progress...</p>}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0 1rem',
                                width: '100%'
                            }}>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -5px rgba(99, 102, 241, 0.5)' }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn btn-primary btn-lg premium-shadow"
                                    onClick={handleNext}
                                    style={{
                                        width: '100%',
                                        maxWidth: '420px',
                                        padding: '1.25rem',
                                        borderRadius: '20px',
                                        fontSize: '1.1rem',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                                        border: 'none',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Initialize My Dashboard <ArrowRight size={22} />
                                </motion.button>

                                <button
                                    className="btn-text"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s ease',
                                        opacity: 0.7
                                    }}
                                    onClick={() => { setSemester(''); setStream(''); setCollege(''); setLevel(''); }}
                                    onMouseOver={(e) => { e.target.style.opacity = '1'; e.target.style.color = '#818cf8'; }}
                                    onMouseOut={(e) => { e.target.style.opacity = '0.7'; e.target.style.color = '#64748b'; }}
                                >
                                    Start Over & Research
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const Onboarding = () => {
    const { user, onboardingStep, completeOnboarding, updateProfile, userProfile } = useAuth();
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
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Flatten questions for phase handling if needed, or handle per phase
    const getQuestions = () => {
        if (phase === 1) return phase1Questions;
        if (phase === 2) return phase2Questions(userProfile.academicData?.level || "Class 10", userProfile.academicData?.subjects);
        return [];
    };
    const currentQuestions = getQuestions();
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
        if (phase === 1) {
            updateProfile({ answersPhase1: answers });
            setPhase(0);
            setCurrentQIndex(0);
            setAnswers({});
        } else if (phase === 0) {
            setPhase(2);
        } else if (phase === 2) {
            updateProfile({ answersPhase2: answers });
            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setShowResults(true);
            }, 3500);
        }
    };

    const handleResultsComplete = () => {
        setShowResults(false);
        setPhase(3);
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative', marginBottom: '1rem' }}>
                        <div className="brand-badge" style={{ margin: '0' }}>
                            <Sparkles size={16} />
                            <span>My True Companion AI</span>
                        </div>
                        {!isNewUser && (
                            <button
                                onClick={() => completeOnboarding()}
                                style={{ position: 'absolute', right: '0', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', padding: '0.5rem' }}
                            >
                                Skip Assessment
                            </button>
                        )}
                    </div>
                    <h1>
                        {phase === 0 ? "Academic Background" : phase === 1 ? "Cognitive Analysis" : phase === 2 ? "Lifestyle Calibration" : "Safety Protocol"}
                    </h1>
                    <p className="phase-desc">
                        {phase === 0 ? "Personalizing your curriculum and study modules." :
                            phase === 1 ? "Mapping your mental landscape for personalized support." :
                                phase === 2 ? "Understanding your world to optimize your environment." :
                                    "Setting up your emergency support network."}
                    </p>
                </header>

                <div className="assessment-stage">
                    <AnimatePresence mode="wait">
                        {isAnalyzing ? (
                            <motion.div
                                key="analyzing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', py: '4rem' }}
                            >
                                <div className="glass" style={{
                                    padding: '4rem 3rem',
                                    borderRadius: '40px',
                                    background: 'rgba(15, 23, 42, 0.4)',
                                    border: '1px solid rgba(129, 140, 248, 0.2)',
                                    textAlign: 'center',
                                    width: '100%',
                                    maxWidth: '500px',
                                    boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, transparent, var(--primary-color), transparent)', animation: 'library-scan 2s infinite' }}></div>

                                    <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 2.5rem' }}>
                                        <div style={{ position: 'absolute', inset: 0, border: '2px dashed rgba(129, 140, 248, 0.3)', borderRadius: '50%', animation: 'spin-slow 10s linear infinite' }}></div>
                                        <div style={{ position: 'absolute', inset: '-10px', border: '1px solid rgba(129, 140, 248, 0.1)', borderRadius: '50%', animation: 'spin-slow 15s linear infinite reverse' }}></div>
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(129, 140, 248, 0.05)',
                                            borderRadius: '50%'
                                        }}>
                                            <Brain size={48} className="animate-pulse" style={{ color: 'var(--primary-color)', filter: 'drop-shadow(0 0 15px rgba(129, 140, 248, 0.5))' }} />
                                        </div>
                                    </div>

                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em', color: 'white' }}>Synthesizing Your Profile</h2>

                                    <div style={{
                                        background: 'rgba(0,0,0,0.3)',
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        textAlign: 'left',
                                        fontFamily: 'monospace'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <p style={{ color: '#818cf8', fontSize: '0.85rem', marginBottom: '2px', opacity: 0.8 }} className="animate-pulse">&gt; INITIALIZING_NEURAL_MAP...</p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#4ade80' }}>✓</span> Calibrating cognitive architecture...
                                            </p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#4ade80' }}>✓</span> Measuring emotional bounce-back rate...
                                            </p>
                                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#6366f1' }}>●</span> Mapping circadian energy peaks...
                                            </p>
                                        </div>
                                    </div>

                                    <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>AI is processing your unique architectural data...</p>
                                </div>
                            </motion.div>
                        ) : showResults ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>Your Companion Profile</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>We've identified your unique learning architecture.</p>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center' }}>
                                    <div className="card glass-card hover-scale" style={{ flex: '1 1 180px', textAlign: 'center', padding: '1.5rem 1.25rem', borderTop: '4px solid var(--primary-color)' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary-color)' }}>
                                            <Brain size={24} />
                                        </div>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>IQ Score</h4>
                                        <p style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', marginBottom: '1rem', lineHeight: '1' }}>118</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', fontStyle: 'italic', lineHeight: '1.5', border: '1px solid var(--glass-border)' }}>Prone to rote-fatigue.<br />Needs intense study bursts.</p>
                                    </div>
                                    <div className="card glass-card hover-scale" style={{ flex: '1 1 180px', textAlign: 'center', padding: '1.5rem 1.25rem', borderTop: '4px solid var(--secondary-color)' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'rgba(244, 114, 182, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--secondary-color)' }}>
                                            <Heart size={24} />
                                        </div>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Resilience</h4>
                                        <p style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', marginBottom: '1rem', lineHeight: '1' }}>64%</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', fontStyle: 'italic', lineHeight: '1.5', border: '1px solid var(--glass-border)' }}>High burnout risk.<br />Requires mapped emotional breaks.</p>
                                    </div>
                                    <div className="card glass-card hover-scale" style={{ flex: '1 1 180px', textAlign: 'center', padding: '1.5rem 1.25rem', borderTop: '4px solid var(--accent-color)' }}>
                                        <div style={{ width: '48px', height: '48px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-color)' }}>
                                            <Activity size={24} />
                                        </div>
                                        <h4 style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Peak Focus</h4>
                                        <p style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', marginBottom: '1rem', lineHeight: '1' }}>Morning</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', fontStyle: 'italic', lineHeight: '1.5', border: '1px solid var(--glass-border)' }}>Daily peaks at 8 AM.<br />Avoid heavy tasks post-lunch.</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                                    <button
                                        onClick={handleResultsComplete}
                                        className="btn btn-primary hover-scale"
                                        style={{ width: '100%', maxWidth: '350px', padding: '1rem', fontSize: '1rem', borderRadius: '12px', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 20px rgba(129, 140, 248, 0.4)' }}
                                    >
                                        Customize My Protocol <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ) : phase === 0 ? (
                            <AcademicStage onComplete={(data) => {
                                updateProfile({ academicData: data });
                                setCurrentQIndex(0);
                                setAnswers({});
                                setPhase(2);
                            }} />
                        ) : phase < 3 ? (
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
