import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import {
    BookOpen, Calendar, Activity, Zap, PlayCircle, LogOut,
    Bell, Search, GraduationCap, Layout, Settings, User, ExternalLink, Filter, Save, CheckCircle, Info, TrendingUp, Clock, Target, FileText, HelpCircle, Globe, X, Layers, Cpu, Radio, ChevronRight, ChevronLeft, ArrowLeft, Bookmark, Shield, Sliders, Award, Brain, RefreshCw, List, Menu
} from 'lucide-react';
import libraryData from '../libraryData.json';
import '../dashboard.css';
import '../settings-mobile.css';

// RADAR_DATA moved inside component for dynamic access

const CognitiveMonitor = ({ themeColor }) => {
    const [currentScore, setCurrentScore] = useState(85);
    const [stressLevel, setStressLevel] = useState(24);
    const [history, setHistory] = useState([
        { time: '10:00', focus: 60, stress: 30 },
        { time: '10:15', focus: 75, stress: 45 },
        { time: '10:30', focus: 90, stress: 35 },
        { time: '10:45', focus: 85, stress: 40 },
        { time: '11:00', focus: 95, stress: 25 },
    ]);
    const [parentNotified, setParentNotified] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            // Simulating fluctuation - randomly spike stress occasionally for demo
            const stressSpike = Math.random() > 0.9 ? 40 : 0;
            const newFocus = Math.min(100, Math.max(0, currentScore + (Math.random() * 8 - 4)));
            const newStress = Math.min(100, Math.max(0, stressLevel + (Math.random() * 6 - 3) + stressSpike));

            setCurrentScore(parseFloat(newFocus.toFixed(1)));
            setStressLevel(parseFloat(newStress.toFixed(1)));
            setHistory(prev => [...prev.slice(-9), { time: timeStr, focus: newFocus, stress: newStress }]);

            if (newStress > 85 && !parentNotified) {
                setParentNotified(true);
                // In a real app, this would call an API endpoint to send SMS/Email
                console.log("High stress detected. Auto-notifying parent.");
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentScore, stressLevel, parentNotified]);

    return (
        <>
            <div className="card cognitive-card">
                <div className="card-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain className="icon-purple" />
                        <h3>Live Focus Stats</h3>
                    </div>
                    <div className="badge success">Tracking Active</div>
                </div>
                {parentNotified && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '12px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Activity size={18} color="#f87171" style={{ flexShrink: 0 }} />
                        <div>
                            <h4 style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.1rem' }}>Stress Threshold Exceeded</h4>
                            <p style={{ color: '#fca5a5', fontSize: '0.75rem' }}>Automated alert sent to emergency contact.</p>
                        </div>
                    </div>
                )}
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={themeColor || '#818cf8'} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={themeColor || '#818cf8'} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#4b5563" fontSize={12} />
                            <YAxis stroke="#4b5563" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey="focus" stroke={themeColor || '#818cf8'} strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                            <Area type="monotone" dataKey="stress" stroke="#f87171" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="card quick-stats">
                <div className="mini-stat">
                    <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--success-color)' }}><Target /></div>
                    <div className="stat-info"><h4>Daily Goal</h4><p>84%</p></div>
                </div>
                <div className="mini-stat">
                    <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)' }}><TrendingUp /></div>
                    <div className="stat-info"><h4>Focus</h4><p>Great!</p></div>
                </div>
                <div className="mini-stat">
                    <div className="stat-icon" style={{ background: 'rgba(244, 114, 182, 0.1)', color: 'var(--secondary-color)' }}><Award /></div>
                    <div className="stat-info"><h4>My Rank</h4><p>Top 5%</p></div>
                </div>
            </div>
        </>
    );
};

const SimulationSandbox = ({ topic, userProfile, setIsSimulating, setSelectionMode, learningContent, selectionMode, themeColor, playSound }) => {
    useEffect(() => {
        if (selectionMode) {
            const panel = document.getElementById('sandbox-main-panel');
            if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectionMode]);

    return (
        <div className="modal-overlay animate-fade-in" style={{ background: '#020617', padding: 0 }}>
            <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div
                            onClick={() => { setIsSimulating(false); setSelectionMode(null); }}
                            style={{ width: '40px', height: '40px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
                        >
                            <img src="/rabbit-logo.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.01em' }}>{topic} <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '400' }}>// STUDY RESOURCES</span></h2>
                        </div>
                    </div>
                    <button onClick={() => { playSound?.('click'); setIsSimulating(false); setSelectionMode(null); }} className="glass hover-card" style={{ color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.2)', padding: '0.6rem', borderRadius: '10px', cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
                </div>

                <div className="sandbox-layout" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', overflow: 'auto' }}>
                    <div className="simulation-panel" style={{ background: '#0f172a', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h4 style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Learning Goals</h4>
                            {learningContent?.objectives.map((obj, i) => (
                                <div key={i} className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '0.75rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                                    <CheckCircle size={14} color="#34d399" /> {obj}
                                </div>
                            ))}
                        </div>
                        <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Your Stats</h4>
                            {learningContent?.metrics.map(m => (
                                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.label}</span>
                                    <span style={{ fontSize: '0.75rem', color: themeColor || '#a78bfa', fontWeight: 'bold' }}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mobile-only" style={{ marginTop: '2rem', width: '100%' }}>
                            <button
                                onClick={() => document.getElementById('sandbox-main-panel')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: '700' }}
                            >
                                START EXPLORING &rarr;
                            </button>
                        </div>
                    </div>

                    <div id="sandbox-main-panel" className="simulation-panel sandbox-content-panel" style={{ background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {!selectionMode ? (
                            <div style={{ textAlign: 'center', maxWidth: '800px', animation: 'fadeIn 0.5s ease', marginTop: 'auto', marginBottom: 'auto' }}>
                                <div style={{ width: '100px', height: '100px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Layers size={45} color={themeColor || '#a78bfa'} />
                                </div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>{topic} Resources</h1>
                                <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>Pick how you'd like to learn! We found the best resources for <strong>{topic}</strong>.</p>
                                <div className="sandbox-options-grid">
                                    <button onClick={() => { playSound?.('click'); setSelectionMode('sim'); }} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <PlayCircle size={32} color={themeColor || '#a78bfa'} style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>WATCH & PLAY</h4>
                                    </button>
                                    <button onClick={() => { playSound?.('click'); setSelectionMode('blueprint'); }} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <FileText size={32} color="#34d399" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>READ NOTES</h4>
                                    </button>
                                    <button onClick={() => { playSound?.('click'); setSelectionMode('resources'); }} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <Bookmark size={32} color="#fcd34d" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>EXTRA HELP</h4>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ width: '100%', maxWidth: '800px', animation: 'fadeInRight 0.4s ease' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                    <button onClick={() => setSelectionMode(null)} className="glass hover-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: themeColor || '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer' }}><ArrowLeft size={20} /></button>
                                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectionMode === 'sim' ? 'Videos & Activities' : selectionMode === 'blueprint' ? 'Study Notes' : 'Extra Help'}</h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
                                    {((selectionMode === 'sim' ? learningContent?.simulations : selectionMode === 'blueprint' ? learningContent?.blueprints : learningContent?.keyResources) || []).map((res, i) => (
                                        <a key={i} href={res.url} target="_blank" rel="noreferrer" className="glass hover-card" style={{ padding: '1.5rem 2rem', borderRadius: '24px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: themeColor || '#a78bfa' }}>{res.icon}</div>
                                                <div><h4 style={{ color: 'white', marginBottom: '0.25rem' }}>{res.title}</h4><p style={{ color: '#64748b', fontSize: '0.8rem' }}>Provided by {res.provider}</p></div>
                                            </div>
                                            <ChevronRight size={20} color="#64748b" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};

const Dashboard = () => {
    const { user, userProfile, logout, updateProfile, performanceMetrics, updatePerformance } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [topic, setTopic] = useState('');
    const [learningContent, setLearningContent] = useState(null);
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [selectionMode, setSelectionMode] = useState(null);
    const [curriculumModule, setCurriculumModule] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeSettingsCategory, setActiveSettingsCategory] = useState(null);

    // Detailed Schedule State
    const [schedule, setSchedule] = useState([
        { id: 1, time: '09:00 AM', task: 'Mathematics (Calculus)', priority: 'High', status: 'Upcoming', type: 'Focus' },
        { id: 2, time: '11:00 AM', task: 'Physics Sandbox', priority: 'Medium', status: 'Paused', type: 'Interactive' },
        { id: 3, time: '02:00 PM', task: 'Cognitive Break', priority: 'Low', status: 'Syncing', type: 'Rest' },
        { id: 4, time: '04:00 PM', task: 'AI Lab Session', priority: 'High', status: 'Ready', type: 'Practical' }
    ]);

    const [settingsForm, setSettingsForm] = useState(() => {
        const defaults = {
            name: user?.name || '',
            email: user?.email || '',
            bio: 'Advanced visual learner focused on Quantum Physics and Machine Learning.',
            learningMode: userProfile?.learningMode || 'visual',
            notifications: true,
            highContrast: false,
            viewDensity: 'Comfortable',
            sidebarPosition: 'Left',
            dynamicBackground: false,
            soundEffects: false,
            autoSave: true,
            themeColor: '#818cf8'
        };
        const saved = localStorage.getItem('dashboard-settings');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    });

    const playSound = (type) => {
        if (!settingsForm.soundEffects) return;
        const sounds = {
            click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
            success: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
        };
        const audio = new Audio(sounds[type]);
        audio.volume = 0.4;
        audio.play().catch(e => console.log('Audio disabled by browser'));
    };

    const [filterCategory, setFilterCategory] = useState('All');

    // Load and apply theme color on mount
    useEffect(() => {
        const savedColor = localStorage.getItem('theme-color');
        if (savedColor) {
            document.documentElement.style.setProperty('--primary-color', savedColor);
            setSettingsForm(prev => ({ ...prev, themeColor: savedColor }));
        }
    }, []);

    // Apply settings whenever they change
    useEffect(() => {
        // Save to localStorage
        localStorage.setItem('dashboard-settings', JSON.stringify(settingsForm));

        // Apply theme color
        if (settingsForm.themeColor) {
            document.documentElement.style.setProperty('--primary-color', settingsForm.themeColor);
        }

        // Apply high contrast
        if (settingsForm.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }

        // Apply view density
        document.body.setAttribute('data-density', settingsForm.viewDensity?.toLowerCase() || 'comfortable');

        // Apply sidebar position
        document.body.setAttribute('data-sidebar', settingsForm.sidebarPosition?.toLowerCase() || 'left');
    }, [settingsForm]);

    const handleGenerateContent = (e) => {
        if (e) e.preventDefault();
        if (!topic) return;
        setIsLoadingContent(true);
        setLearningContent(null);
        setTimeout(() => {
            const dynamic = generateTopicData(topic);
            setLearningContent({
                ...dynamic,
                mode: userProfile.learningMode || 'visual',
                summary: `Here's your personalized ${userProfile.learningMode} study plan for "${topic}". Pick from videos, notes, or extra help below!`,
            });
            setIsLoadingContent(false);
        }, 1200);
    };

    const generateTopicData = (query) => {
        const encoded = encodeURIComponent(query);
        const simulations = [
            { title: `${query} PhET Virtual Lab`, url: `https://phet.colorado.edu/en/simulations/filter?searchTerm=${encoded}`, provider: 'PhET Colorado', icon: <Layers size={20} /> },
            { title: `${query} Interactive 3D Model`, url: `https://sketchfab.com/search?q=${encoded}+interactive`, provider: 'Sketchfab', icon: <Layers size={20} /> },
            { title: `${query} Virtual Sandbox`, url: `https://www.google.com/search?q=${encoded}+interactive+sandbox+tool`, provider: 'Google Web', icon: <Cpu size={20} /> },
            { title: `${query} Behavior Simulation`, url: `https://www.google.com/search?q=${encoded}+logic+simulation+site:ck12.org`, provider: 'CK-12', icon: <Cpu size={20} /> },
            { title: `${query} Hands-on Experiment`, url: `https://www.google.com/search?q=${encoded}+step+by+step+experiment`, provider: 'ScienceBuddy', icon: <Zap size={20} /> }
        ];

        const blueprints = [
            { title: `${query} Wikipedia Blueprint`, url: `https://en.wikipedia.org/wiki/${encoded}`, provider: 'Wikipedia', icon: <FileText size={20} /> },
            { title: `${query} Academic Detailed Notes`, url: `https://www.google.com/search?q=${encoded}+detailed+notes+site:edu`, provider: 'University Index', icon: <BookOpen size={20} /> },
            { title: `${query} Engineering Schematic`, url: `https://www.google.com/search?q=${encoded}+schematic+diagram+logic`, provider: 'Diagram Hub', icon: <Target size={20} /> },
            { title: `${query} Research Insight`, url: `https://scholar.google.com/scholar?q=${encoded}`, provider: 'Google Scholar', icon: <GraduationCap size={20} /> },
            { title: `${query} Concept Breakdown`, url: `https://www.google.com/search?q=${encoded}+expert+explanation+simply`, provider: 'Companion Verified', icon: <Info size={20} /> }
        ];

        const resources = [
            { title: `${query} Master Quiz`, url: `https://www.google.com/search?q=${encoded}+interactive+quiz+test`, provider: 'Google Assessment', icon: <HelpCircle size={20} /> },
            { title: `${query} Exam Prep Notes`, url: `https://www.google.com/search?q=${encoded}+study+notes+pdf`, provider: 'Academic Cloud', icon: <FileText size={20} /> },
            { title: `Global Research: ${query}`, url: `https://scholar.google.com/scholar?q=${encoded}`, provider: 'Google Scholar', icon: <Globe size={20} /> },
            { title: `${query} Video Masterclass`, url: `https://www.youtube.com/results?search_query=${encoded}+educational+lecture`, provider: 'YouTube Education', icon: <PlayCircle size={20} /> },
            { title: `Interactive Flashcards: ${query}`, url: `https://www.google.com/search?q=${encoded}+quizlet+flashcards`, provider: 'Quizlet', icon: <Bookmark size={20} /> }
        ];

        return {
            title: `${query} Study Guide`,
            objectives: [`Understand the basics of ${query}`, `Practice ${query} with examples`, `Apply what you learned about ${query}`],
            metrics: [{ label: 'Difficulty', value: 'Medium' }, { label: 'Goal Completion', value: '92%' }, { label: 'Time Needed', value: '~30 min' }],
            simulations, blueprints, keyResources: resources
        };
    };

    const handleOptimizeSchedule = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            setSchedule([...schedule].sort(() => Math.random() - 0.5));
            setIsOptimizing(false);
        }, 1500);
    };

    const enterScheduledSession = (item) => {
        setTopic(item.task.split(' (')[0]);
        setActiveTab('dashboard');
        // Auto trigger generation
        setTimeout(() => {
            const btn = document.querySelector('.learning-card .btn-primary');
            if (btn) btn.click();
        }, 100);
    };


    const renderOverview = () => (
        <div className="dashboard-grid animate-fade-in">
            <CognitiveMonitor themeColor={settingsForm.themeColor} />
            <div className={`card learning-card ${learningContent ? 'expanded' : ''}`}>
                <div className="card-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain className="icon-purple" size={24} />
                        <div>
                            <h3>Ask My Companion</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>Search any topic and start learning instantly.</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleGenerateContent} className="learning-input-container">
                    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Search size={18} style={{ marginLeft: '12px', color: 'var(--text-muted)' }} />
                        <input
                            className="learning-input"
                            placeholder="What do you want to learn? (e.g. Photosynthesis, Algebra, World War 2)..."
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '12px' }}>
                        {isLoadingContent ? 'Loading...' : 'Let\'s Go!'}
                    </button>
                </form>
                {learningContent && (
                    <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{learningContent.title}</h4>
                                <span className="badge active">{learningContent.mode?.toUpperCase()} MODE</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1.05rem' }}>{learningContent.summary}</p>
                            <div style={{ display: 'flex' }}>
                                <button onClick={() => setIsSimulating(true)} className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', borderRadius: '12px', fontWeight: '600', fontSize: '0.95rem' }}>
                                    <PlayCircle size={18} style={{ marginRight: '8px' }} /> START INTERACTIVE SESSION
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div className="view-container animate-fade-in">
            <div className="view-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Calendar size={40} className="icon-purple" />
                    <div>
                        <h2 className="view-title">My Schedule</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your personalized study plan.</p>
                    </div>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                    <RefreshCw size={18} style={{ marginRight: '8px' }} /> UPDATE PLAN
                </button>
            </div>
            <div className="schedule-grid">
                {[
                    { time: '09:00 AM', task: 'Advanced Calculus', type: 'Peak Focus', duration: '90m', color: 'var(--primary-color)' },
                    { time: '11:30 AM', task: 'Quantum Mechanics', type: 'Deep Work', duration: '120m', color: 'var(--accent-color)' },
                    { time: '02:00 PM', task: 'Organic Chemistry', type: 'Review', duration: '60m', color: 'var(--success-color)' },
                    { time: '04:30 PM', task: 'Linguistic Analysis', type: 'Creative', duration: '45m', color: 'var(--secondary-color)' }
                ].map((item, i) => (
                    <div key={i} className="card schedule-card hover-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div className="badge active" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>{item.duration}</div>
                            <Clock size={18} style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.task}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Scheduled for {item.time}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: item.color }}>{item.type}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLibrary = () => (
        <div className="view-container animate-fade-in">
            <div className="view-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <BookOpen size={40} className="icon-purple" />
                    <div>
                        <h2 className="view-title">My Library</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Books, videos, and practice materials.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                    {['All', 'Mathematics', 'Physics', 'Biology'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`btn ${filterCategory === cat ? 'btn-primary' : ''}`}
                            style={{ borderRadius: '10px', fontSize: '0.8rem', padding: '0.6rem 1.25rem', border: 'none', background: filterCategory === cat ? 'var(--primary-color)' : 'transparent', color: filterCategory === cat ? 'white' : 'var(--text-muted)' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
            <div className="library-grid">
                {libraryData.filter(item => filterCategory === 'All' || item.title === filterCategory).map(subject => (
                    <div key={subject.id} className="card hover-card" style={{ padding: '0', background: 'rgba(15, 23, 42, 0.4)' }}>
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, transparent 100%)' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{subject.title}</h3>
                                <div className="badge active" style={{ fontSize: '0.65rem' }}>12 LESSONS • 4.5 HRS</div>
                            </div>
                            <div className="stat-icon" style={{ borderRadius: '12px' }}><Layers size={20} /></div>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                {subject.videos.slice(0, 3).map((vid, idx) => (
                                    <div key={idx} className="nav-item" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1rem', marginBottom: '0.75rem', borderRadius: '16px' }}>
                                        <div style={{ width: '32px', height: '32px', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                                            <PlayCircle size={16} color="var(--primary-color)" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h5 style={{ fontSize: '0.9rem', fontWeight: '600' }}>{vid.title}</h5>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Foundational Theory</p>
                                        </div>
                                        <ChevronRight size={16} color="var(--text-muted)" />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setCurriculumModule(subject)} className="btn btn-outline" style={{ width: '100%', borderRadius: '12px', padding: '1rem', fontWeight: '600', borderStyle: 'dashed' }}>
                                <FileText size={18} style={{ marginRight: '8px' }} /> EXPLORE FULL CURRICULUM
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPerformance = () => {
        const dynamicRadarData = [
            { subject: 'Math', A: performanceMetrics?.Math || 50, fullMark: 100 },
            { subject: 'Physics', A: performanceMetrics?.Physics || 50, fullMark: 100 },
            { subject: 'Visual', A: performanceMetrics?.Visual || 50, fullMark: 100 },
            { subject: 'Auditory', A: performanceMetrics?.Auditory || 50, fullMark: 100 },
            { subject: 'Logic', A: performanceMetrics?.Logic || 50, fullMark: 100 },
        ];

        return (
            <div className="view-container animate-fade-in">
                <div className="view-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <TrendingUp size={40} className="icon-purple" />
                        <div>
                            <h2 className="view-title">My Progress</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Track your learning journey and improvements.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="badge success" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Shield size={14} /> PARENTAL SYNC ACTIVE
                        </div>
                    </div>
                </div>
                <div className="perf-grid">
                    <div className="card perf-chart-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h4 className="perf-chart-title" style={{ margin: 0 }}>My Subject Skills</h4>
                            <div className="badge active" style={{ fontSize: '0.6rem' }}>LIVE STATUS</div>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dynamicRadarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} />
                                    <Radar name="User" dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.3} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="card perf-chart-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h4 className="perf-chart-title" style={{ margin: 0 }}>Study Consistency</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FOCUS</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LOAD</span>
                                </div>
                            </div>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[{ day: 'Mon', focus: 80, load: 40 }, { day: 'Tue', focus: 65, load: 30 }, { day: 'Wed', focus: 90, load: 50 }, { day: 'Thu', focus: 75, load: 45 }, { day: 'Fri', focus: 85, load: 35 }]}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '11px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
                                    <Bar dataKey="focus" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={24} />
                                    <Bar dataKey="load" fill="var(--success-color)" radius={[4, 4, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="metric-grid">
                    <div className="card metric-card">
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Focus Level</h4>
                        <p className="metric-value">92%</p>
                        <div style={{ fontSize: '0.7rem', color: 'var(--success-color)', fontWeight: '700' }}>↑ 4.2% IMPROVEMENT</div>
                    </div>
                    <div className="card metric-card">
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Response Time</h4>
                        <p className="metric-value" style={{ background: 'linear-gradient(135deg, var(--success-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FAST</p>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>GOOD REFLEXES</div>
                    </div>
                    <div className="card metric-card">
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>My Class Rank</h4>
                        <p className="metric-value" style={{ background: 'var(--premium-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ELITE</p>
                        <div style={{ fontSize: '0.7rem', color: 'var(--secondary-color)', fontWeight: '700' }}>PERCENTILE: 99.2</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSettings = () => {
        const themeColors = [
            { name: 'Indigo', value: '#818cf8' },
            { name: 'Emerald', value: '#10b981' },
            { name: 'Rose', value: '#f43f5e' },
            { name: 'Amber', value: '#f59e0b' },
            { name: 'Cyan', value: '#06b6d4' },
            { name: 'Purple', value: '#a855f7' },
        ];

        const categories = [
            { id: 'account', title: 'Account & Profile', icon: <User />, desc: 'Manage your name, email and avatar', color: '#818cf8' },
            { id: 'appearance', title: 'Appearance & Theme', icon: <Zap />, desc: 'Customize theme colors and effects', color: '#f472b6' },
            { id: 'interface', title: 'Interface & Layout', icon: <Layout />, desc: 'Density and sidebar preferences', color: '#38bdf8' },
            { id: 'experience', title: 'Learning Experience', icon: <Activity />, desc: 'Notifications and auto-save options', color: '#34d399' },
            { id: 'learning', title: 'Learning Mode', icon: <Brain />, desc: 'Set your preferred learning style', color: '#fbbf24' }
        ];

        return (
            <div className="view-container animate-fade-in">
                <div className="view-header">
                    <div className="settings-header-content">
                        <Settings size={32} className="icon-purple" />
                        <div>
                            <h2 className="view-title">Settings Control Center</h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Personalize your AI-enhanced study environment</p>
                        </div>
                    </div>
                </div>

                <div className="settings-grid-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div className="settings-category-grid">
                        {categories.map(cat => (
                            <div key={cat.id} className="card glass hover-card settings-category-card" onClick={() => {
                                playSound('click');
                                setActiveSettingsCategory(cat.id);
                            }}>
                                <div className="category-icon-wrapper" style={{ background: `${cat.color}15`, color: cat.color, margin: '0 0 0.5rem 0' }}>
                                    {cat.icon}
                                </div>
                                <div className="category-info">
                                    <h4 className="category-title">{cat.title}</h4>
                                    <p className="category-desc">{cat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="settings-footer-actions">
                    <div className="footer-main-buttons">
                        <button
                            onClick={async () => {
                                try {
                                    playSound('success');
                                    await updateProfile({
                                        name: settingsForm.name,
                                        learningMode: settingsForm.learningMode
                                    });
                                    localStorage.setItem('dashboard-settings', JSON.stringify(settingsForm));
                                    localStorage.setItem('theme-color', settingsForm.themeColor);
                                    document.documentElement.style.setProperty('--primary-color', settingsForm.themeColor);
                                    setActiveSettingsCategory('success-saved');
                                } catch (error) {
                                    setActiveSettingsCategory('error-failed');
                                }
                            }}
                            className="btn btn-primary main-save-btn"
                        >
                            <Save size={18} /> Save All Changes
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Reset all settings to default?')) {
                                    const defaults = {
                                        name: user?.name || '',
                                        email: user?.email || '',
                                        bio: 'Advanced visual learner focused on Quantum Physics and Machine Learning.',
                                        learningMode: 'visual',
                                        notifications: true,
                                        highContrast: false,
                                        viewDensity: 'Comfortable',
                                        sidebarPosition: 'Left',
                                        dynamicBackground: false,
                                        soundEffects: false,
                                        autoSave: true,
                                        themeColor: '#818cf8'
                                    };
                                    setSettingsForm(defaults);
                                    localStorage.setItem('dashboard-settings', JSON.stringify(defaults));
                                    localStorage.setItem('theme-color', '#818cf8');
                                }
                            }}
                            className="btn btn-outline"
                        >
                            <RefreshCw size={18} /> Reset Defaults
                        </button>
                    </div>
                    <button onClick={logout} className="btn logout-btn">
                        <LogOut size={18} /> Logout Account
                    </button>
                </div>

                {/* Settings Prompt/Modal */}
                {activeSettingsCategory && (
                    <div className="modal-overlay animate-fade-in" style={{ zIndex: 3000 }}>
                        <div className="card glass settings-prompt-card">
                            <button className="prompt-close-btn" onClick={() => setActiveSettingsCategory(null)}><X size={24} /></button>

                            {/* Account Category */}
                            {activeSettingsCategory === 'account' && (
                                <div className="prompt-content">
                                    <div className="prompt-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                        <div className="prompt-icon-bg" style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', margin: '0 auto 1rem' }}><User size={24} /></div>
                                        <h3 className="prompt-title">Profile Settings</h3>
                                    </div>
                                    <div className="profile-edit-section">
                                        <div className="avatar-preview-wrapper" style={{ position: 'relative' }}>
                                            <div className="settings-avatar-large">{user?.name?.[0]}</div>
                                            <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--primary-color)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #111' }}>
                                                <RefreshCw size={14} color="white" />
                                            </div>
                                        </div>
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div className="input-group">
                                                <label>Full Name</label>
                                                <input
                                                    className="settings-input"
                                                    value={settingsForm.name}
                                                    onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Email Address</label>
                                                <input
                                                    className="settings-input"
                                                    disabled
                                                    value={settingsForm.email}
                                                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Category */}
                            {activeSettingsCategory === 'appearance' && (
                                <div className="prompt-content">
                                    <div className="prompt-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                        <div className="prompt-icon-bg" style={{ background: 'rgba(244, 114, 182, 0.1)', color: '#f472b6', margin: '0 auto 1rem' }}><Zap size={24} /></div>
                                        <h3 className="prompt-title">Appearance</h3>
                                    </div>
                                    <div className="appearance-section">
                                        <div className="control-group">
                                            <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Accent Theme Color</label>
                                            <div className="theme-grid-mini">
                                                {themeColors.map(color => (
                                                    <button
                                                        key={color.value}
                                                        onClick={() => {
                                                            playSound('click');
                                                            setSettingsForm({ ...settingsForm, themeColor: color.value });
                                                        }}
                                                        className={`theme-dot ${settingsForm.themeColor === color.value ? 'active' : ''}`}
                                                        style={{ backgroundColor: color.value }}
                                                        title={color.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="toggle-list">
                                            <label className="settings-toggle-row" onClick={() => {
                                                playSound('click');
                                                setSettingsForm({ ...settingsForm, dynamicBackground: !settingsForm.dynamicBackground });
                                            }}>
                                                <div className="toggle-info">
                                                    <span className="toggle-label">Dynamic Background</span>
                                                    <span className="toggle-desc">Animated workspace effects</span>
                                                </div>
                                                <div className={`custom-toggle ${settingsForm.dynamicBackground ? 'active' : ''}`} />
                                            </label>
                                            <label className="settings-toggle-row" onClick={() => {
                                                playSound('click');
                                                setSettingsForm({ ...settingsForm, highContrast: !settingsForm.highContrast });
                                            }}>
                                                <div className="toggle-info">
                                                    <span className="toggle-label">High Contrast</span>
                                                    <span className="toggle-desc">Better readability</span>
                                                </div>
                                                <div className={`custom-toggle ${settingsForm.highContrast ? 'active' : ''}`} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Interface Category */}
                            {activeSettingsCategory === 'interface' && (
                                <div className="prompt-content">
                                    <div className="prompt-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                        <div className="prompt-icon-bg" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', margin: '0 auto 1rem' }}><Layout size={24} /></div>
                                        <h3 className="prompt-title">Interface & Layout</h3>
                                    </div>
                                    <div className="interface-section">
                                        <div className="control-group">
                                            <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>View Density</label>
                                            <div className="segmented-control">
                                                {['Comfortable', 'Compact'].map(d => (
                                                    <button key={d} onClick={() => {
                                                        playSound('click');
                                                        setSettingsForm({ ...settingsForm, viewDensity: d });
                                                    }} className={settingsForm.viewDensity === d ? 'active' : ''}>{d}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="control-group">
                                            <label style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sidebar Position</label>
                                            <div className="segmented-control">
                                                {['Left', 'Right'].map(p => (
                                                    <button key={p} onClick={() => {
                                                        playSound('click');
                                                        setSettingsForm({ ...settingsForm, sidebarPosition: p });
                                                    }} className={settingsForm.sidebarPosition === p ? 'active' : ''}>{p}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Experience Category */}
                            {activeSettingsCategory === 'experience' && (
                                <div className="prompt-content">
                                    <div className="prompt-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                        <div className="prompt-icon-bg" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399', margin: '0 auto 1rem' }}><Activity size={24} /></div>
                                        <h3 className="prompt-title">Learning Experience</h3>
                                    </div>
                                    <div className="experience-section">
                                        <div className="toggle-list">
                                            {[
                                                { key: 'notifications', label: 'Push Notifications', desc: 'Real-time study alerts' },
                                                { key: 'soundEffects', label: 'Sound Effects', desc: 'Audio feedback on actions' },
                                                { key: 'autoSave', label: 'Auto-Save', desc: 'Never lose your progress' }
                                            ].map(s => (
                                                <label key={s.key} className="settings-toggle-row" onClick={() => {
                                                    playSound('click');
                                                    setSettingsForm({ ...settingsForm, [s.key]: !settingsForm[s.key] });
                                                }}>
                                                    <div className="toggle-info">
                                                        <span className="toggle-label">{s.label}</span>
                                                        <span className="toggle-desc">{s.desc}</span>
                                                    </div>
                                                    <div className={`custom-toggle ${settingsForm[s.key] ? 'active' : ''}`} />
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Learning Category */}
                            {activeSettingsCategory === 'learning' && (
                                <div className="prompt-content">
                                    <div className="prompt-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                        <div className="prompt-icon-bg" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', margin: '0 auto 1rem' }}><Brain size={24} /></div>
                                        <h3 className="prompt-title">Learning Mode</h3>
                                    </div>
                                    <div className="learning-selection-list">
                                        {[
                                            { value: 'visual', label: 'Visual', icon: '👁️', desc: 'Images & diagrams' },
                                            { value: 'auditory', label: 'Auditory', icon: '🎧', desc: 'Sound & speech' },
                                            { value: 'kinesthetic', label: 'Kinesthetic', icon: '✋', desc: 'Activities' },
                                            { value: 'reading', label: 'Reading/Writing', icon: '📖', desc: 'Text & notes' }
                                        ].map(mode => (
                                            <div
                                                key={mode.value}
                                                onClick={() => {
                                                    playSound('click');
                                                    setSettingsForm({ ...settingsForm, learningMode: mode.value });
                                                }}
                                                className={`learning-option-card ${settingsForm.learningMode === mode.value ? 'active' : ''}`}
                                            >
                                                <span className="option-icon">{mode.icon}</span>
                                                <div className="option-info">
                                                    <span className="option-label">{mode.label}</span>
                                                    <span className="option-desc">{mode.desc}</span>
                                                </div>
                                                <div className="option-check">
                                                    {settingsForm.learningMode === mode.value ? <CheckCircle size={18} /> : <div style={{ width: 18, height: 18 }} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Success Prompt */}
                            {activeSettingsCategory === 'success-saved' && (
                                <div className="prompt-status-content">
                                    <div className="status-icon success-bg"><CheckCircle size={40} /></div>
                                    <h3 className="status-title">Settings Synced!</h3>
                                    <p className="status-desc">Your preferences are now active across all devices.</p>
                                    <button onClick={() => setActiveSettingsCategory(null)} className="btn btn-primary status-btn">Return to Hub</button>
                                </div>
                            )}

                            {/* Error Prompt */}
                            {activeSettingsCategory === 'error-failed' && (
                                <div className="prompt-status-content">
                                    <div className="status-icon error-bg"><X size={40} /></div>
                                    <h3 className="status-title">Save Failed</h3>
                                    <p className="status-desc">We couldn't reach the server. Please check your connection.</p>
                                    <button onClick={() => setActiveSettingsCategory(null)} className="btn btn-primary status-btn error-retry">Try Again</button>
                                </div>
                            )}

                            {!['success-saved', 'error-failed'].includes(activeSettingsCategory) && (
                                <div className="prompt-footer">
                                    <p className="footer-hint">Changes are staged and applied when you click Save All.</p>
                                    <button onClick={() => setActiveSettingsCategory(null)} className="btn btn-primary done-btn">Done</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`dashboard-container ${settingsForm.viewDensity?.toLowerCase()} ${settingsForm.sidebarPosition?.toLowerCase() === 'right' ? 'sidebar-right' : ''}`}>
            {/* Dynamic Background Effect */}
            {settingsForm.dynamicBackground && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: `radial-gradient(circle at 20% 50%, ${settingsForm.themeColor}15 0%, transparent 50%), radial-gradient(circle at 80% 80%, #f472b615 0%, transparent 50%)`,
                        animation: 'rotate 20s linear infinite'
                    }} />
                </div>
            )}
            {isSimulating && (
                <SimulationSandbox
                    topic={topic}
                    userProfile={userProfile}
                    setIsSimulating={setIsSimulating}
                    setSelectionMode={setSelectionMode}
                    learningContent={learningContent}
                    selectionMode={selectionMode}
                    themeColor={settingsForm.themeColor}
                    playSound={playSound}
                />
            )}
            {curriculumModule && (
                <div className="modal-overlay animate-fade-in" style={{ zIndex: 2000 }}>
                    <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative' }}>
                        <button onClick={() => setCurriculumModule(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(129, 140, 248,0.1)', borderRadius: '16px' }}><List size={32} color="#818cf8" /></div>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{curriculumModule.title} Curriculum</h2>
                                <p style={{ color: '#94a3b8' }}>Topics you'll learn and milestones to hit.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['1. Introduction & History', '2. Core Concepts', '3. Practice Problems', '4. Connecting the Dots', '5. Hands-on Projects'].map((step, idx) => (
                                <div key={idx} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800' }}>{idx + 1}</div>
                                    <span style={{ fontSize: '0.95rem' }}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container" onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}>
                        <img src="/rabbit-logo.jpeg" alt="Logo" className="logo-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                        <span className="app-name">My True Companion</span>
                    </div>
                    <button className="collapse-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
                        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                    <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}><X size={20} /></button>
                </div>
                <nav className="nav-section">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} title="Dashboard">
                        <Layout size={18} /> <span>Dashboard</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => { setActiveTab('timetable'); setIsMobileMenuOpen(false); }} title="My Schedule">
                        <Calendar size={18} /> <span>My Schedule</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => { setActiveTab('library'); setIsMobileMenuOpen(false); }} title="My Library">
                        <BookOpen size={18} /> <span>My Library</span>
                    </button>
                    <div className="nav-divider"></div>
                    <button className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => { setActiveTab('performance'); setIsMobileMenuOpen(false); }} title="My Progress">
                        <TrendingUp size={18} /> <span>My Progress</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} title="Settings">
                        <Settings size={18} /> <span>Settings</span>
                    </button>
                </nav>
            </aside>
            {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
            <main className="main-content">
                <header className="header-bar">
                    <div className="header-left">
                        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <div className="welcome-text">
                            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                            <p>Hey there, {user?.name}! 👋</p>
                        </div>
                    </div>
                    <div className="user-profile"><div className="avatar" onClick={() => setActiveTab('settings')}>{user?.name?.[0]}</div></div>
                </header>
                {activeTab === 'dashboard' && renderOverview()}
                {activeTab === 'timetable' && renderSchedule()}
                {activeTab === 'library' && renderLibrary()}
                {activeTab === 'performance' && renderPerformance()}
                {activeTab === 'settings' && renderSettings()}
            </main>
        </div>
    );
};

export default Dashboard;
