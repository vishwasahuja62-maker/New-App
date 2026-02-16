import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import {
    BookOpen, Calendar, Activity, Zap, PlayCircle, LogOut,
    Bell, Search, GraduationCap, Layout, Settings, User, ExternalLink, Filter, Save, CheckCircle, Info, TrendingUp, Clock, Target, FileText, HelpCircle, Globe, X, Layers, Cpu, Radio, ChevronRight, ChevronLeft, Bookmark, Shield, Sliders, Award, Brain, RefreshCw, List, Menu
} from 'lucide-react';
import libraryData from '../libraryData.json';
import '../dashboard.css';

const RADAR_DATA = [
    { subject: 'Math', A: 85, fullMark: 100 },
    { subject: 'Physics', A: 70, fullMark: 100 },
    { subject: 'Visual', A: 95, fullMark: 100 },
    { subject: 'Auditory', A: 60, fullMark: 100 },
    { subject: 'Logic', A: 80, fullMark: 100 },
];

const CognitiveMonitor = () => {
    const [currentScore, setCurrentScore] = useState(85);
    const [stressLevel, setStressLevel] = useState(24);
    const [history, setHistory] = useState([
        { time: '10:00', focus: 60, stress: 30 },
        { time: '10:15', focus: 75, stress: 45 },
        { time: '10:30', focus: 90, stress: 35 },
        { time: '10:45', focus: 85, stress: 40 },
        { time: '11:00', focus: 95, stress: 25 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            const newFocus = Math.min(100, Math.max(0, currentScore + (Math.random() * 8 - 4)));
            const newStress = Math.min(100, Math.max(0, stressLevel + (Math.random() * 6 - 3)));
            setCurrentScore(parseFloat(newFocus.toFixed(1)));
            setStressLevel(parseFloat(newStress.toFixed(1)));
            setHistory(prev => [...prev.slice(-9), { time: timeStr, focus: newFocus, stress: newStress }]);
        }, 5000);
        return () => clearInterval(interval);
    }, [currentScore, stressLevel]);

    return (
        <>
            <div className="card cognitive-card">
                <div className="card-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain className="icon-purple" />
                        <h3>Real-time Cognitive Flow</h3>
                    </div>
                    <div className="badge success">Flow Active</div>
                </div>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#4b5563" fontSize={12} />
                            <YAxis stroke="#4b5563" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px' }} />
                            <Area type="monotone" dataKey="focus" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                            <Area type="monotone" dataKey="stress" stroke="#f87171" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="card quick-stats">
                <div className="mini-stat">
                    <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--success-color)' }}><Target /></div>
                    <div className="stat-info"><h4>Goal Progress</h4><p>84%</p></div>
                </div>
                <div className="mini-stat">
                    <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)' }}><TrendingUp /></div>
                    <div className="stat-info"><h4>Current Focus</h4><p>Elite</p></div>
                </div>
                <div className="mini-stat">
                    <div className="stat-icon" style={{ background: 'rgba(244, 114, 182, 0.1)', color: 'var(--secondary-color)' }}><Award /></div>
                    <div className="stat-info"><h4>Rank</h4><p>Top 5%</p></div>
                </div>
            </div>
        </>
    );
};

const Dashboard = () => {
    const { user, userProfile, logout, updateProfile } = useAuth();
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

    // Detailed Schedule State
    const [schedule, setSchedule] = useState([
        { id: 1, time: '09:00 AM', task: 'Mathematics (Calculus)', priority: 'High', status: 'Upcoming', type: 'Focus' },
        { id: 2, time: '11:00 AM', task: 'Physics Sandbox', priority: 'Medium', status: 'Paused', type: 'Interactive' },
        { id: 3, time: '02:00 PM', task: 'Cognitive Break', priority: 'Low', status: 'Syncing', type: 'Rest' },
        { id: 4, time: '04:00 PM', task: 'AI Lab Session', priority: 'High', status: 'Ready', type: 'Practical' }
    ]);

    const [settingsForm, setSettingsForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: 'Advanced visual learner focused on Quantum Physics and Machine Learning.',
        learningMode: userProfile.learningMode || 'visual',
        notifications: true,
        highContrast: false
    });

    const [filterCategory, setFilterCategory] = useState('All');

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
                summary: `My True Companion AI has synchronized an adaptive ${userProfile.learningMode} lesson for "${topic}". Select from simulations, blueprints, or key resources below.`,
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
            title: `${query} Mastery Pathway`,
            objectives: [`Breakdown core architecture of ${query}`, `Analyze ${query} interactions`, `Synthesize applications of ${query}`],
            metrics: [{ label: 'Analytical Load', value: '78%' }, { label: 'Retention Target', value: '92%' }, { label: 'Intensity', value: 'High' }],
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

    const CurriculumModal = () => (
        <div className="modal-overlay animate-fade-in" style={{ zIndex: 2000 }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative' }}>
                <button onClick={() => setCurriculumModule(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ padding: '1rem', background: 'rgba(129, 140, 248,0.1)', borderRadius: '16px' }}><List size={32} color="#818cf8" /></div>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{curriculumModule.title} Curriculum</h2>
                        <p style={{ color: '#94a3b8' }}>Core syllabus and learning milestones.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {['1. Fundamentals & Historical Context', '2. First Principles & Structural Modeling', '3. Dynamic Pattern Interplay', '4. Advanced Integration & Synthesis', '5. Practical Application Sandbox'].map((step, idx) => (
                        <div key={idx} className="glass" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800' }}>{idx + 1}</div>
                            <span style={{ fontSize: '0.95rem' }}>{step}</span>
                        </div>
                    ))}
                </div>
                <button onClick={() => { setTopic(curriculumModule.title); setActiveTab('dashboard'); setCurriculumModule(null); }} className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem' }}>Launch Full Learning Pathway</button>
            </div>
        </div>
    );

    const SimulationSandbox = () => (
        <div className="modal-overlay animate-fade-in" style={{ background: '#020617', padding: 0 }}>
            <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem 3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.5)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div className="logo-icon">C</div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{topic} <span style={{ color: '#a78bfa', fontSize: '0.9rem', letterSpacing: '2px' }}>// {userProfile.learningMode?.toUpperCase()} MODE</span></h2>
                            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>EST. DURATION: 45 MINS</p>
                        </div>
                    </div>
                    <button onClick={() => { setIsSimulating(false); setSelectionMode(null); }} style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.2)', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(320px, 350px) 1fr', gap: '1px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div className="simulation-panel" style={{ background: '#0f172a', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h4 style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>Dynamic Objectives</h4>
                            {learningContent?.objectives.map((obj, i) => (
                                <div key={i} className="glass" style={{ padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '0.75rem', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                                    <CheckCircle size={14} color="#34d399" /> {obj}
                                </div>
                            ))}
                        </div>
                        <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h4 style={{ color: '#94a3b8', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Cognitive Metrics</h4>
                            {learningContent?.metrics.map(m => (
                                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{m.label}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 'bold' }}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="simulation-panel" style={{ background: '#020617', padding: '2rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {!selectionMode ? (
                            <div style={{ textAlign: 'center', maxWidth: '800px', animation: 'fadeIn 0.5s ease', marginTop: 'auto', marginBottom: 'auto' }}>
                                <div style={{ width: '100px', height: '100px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Cpu size={40} color="#818cf8" />
                                </div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>{topic} Sandbox</h1>
                                <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>Choose your interactive pathway. My True Companion has scanned the top resources specifically for <strong>{topic}</strong>.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%' }}>
                                    <button onClick={() => setSelectionMode('sim')} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <PlayCircle size={32} color="#a78bfa" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>LAUNCH ENGINE</h4>
                                    </button>
                                    <button onClick={() => setSelectionMode('blueprint')} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <FileText size={32} color="#34d399" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>VIEW BLUEPRINT</h4>
                                    </button>
                                    <button onClick={() => setSelectionMode('resources')} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <Bookmark size={32} color="#fcd34d" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>KEY RESOURCES</h4>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ width: '100%', maxWidth: '800px', animation: 'fadeInRight 0.4s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                    <button onClick={() => setSelectionMode(null)} style={{ background: 'transparent', border: 'none', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>&larr; Back to Selection</button>
                                    <h2 style={{ fontSize: '1.5rem' }}>{selectionMode === 'sim' ? 'Top Simulations' : selectionMode === 'blueprint' ? 'Academic Blueprints' : 'Key Resources'}</h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
                                    {(selectionMode === 'sim' ? learningContent?.simulations : selectionMode === 'blueprint' ? learningContent?.blueprints : learningContent?.keyResources).map((res, i) => (
                                        <a key={i} href={res.url} target="_blank" rel="noreferrer" className="glass hover-card" style={{ padding: '1.5rem 2rem', borderRadius: '24px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>{res.icon}</div>
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
        </div>
    );

    const renderOverview = () => (
        <div className="dashboard-grid animate-fade-in">
            <CognitiveMonitor />
            <div className={`card learning-card ${learningContent ? 'expanded' : ''}`}>
                <div className="card-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Brain className="icon-purple" size={24} />
                        <div>
                            <h3>Dynamic AI Tutor</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>Deep-dive into any academic concept instantly.</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleGenerateContent} className="learning-input-container">
                    <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Search size={18} style={{ marginLeft: '12px', color: 'var(--text-muted)' }} />
                        <input
                            className="learning-input"
                            placeholder="Ask me anything (e.g. Quasar Physics, Roman Law, Cellular Respiration)..."
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem', borderRadius: '12px' }}>
                        {isLoadingContent ? <RefreshCw className="animate-spin" size={18} /> : 'Generate Insights'}
                    </button>
                </form>
                {learningContent && (
                    <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{learningContent.title}</h4>
                                <span className="badge active">{learningContent.mode?.toUpperCase()} ANALYSIS</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2.5rem', fontSize: '1.05rem' }}>{learningContent.summary}</p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => setIsSimulating(true)} className="btn btn-primary" style={{ flex: 1, padding: '1.25rem', borderRadius: '14px', fontWeight: '600' }}>
                                    <PlayCircle size={20} style={{ marginRight: '8px' }} /> START INTERACTIVE SESSION
                                </button>
                                <button className="btn btn-outline" style={{ padding: '0 1.25rem', borderRadius: '14px' }}>
                                    <Bookmark size={20} />
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
                        <h2 className="view-title">Smart Planner</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>AI-optimized neuro-cognitive study windows.</p>
                    </div>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                    <RefreshCw size={18} style={{ marginRight: '8px' }} /> RE-OPTIMIZE SCHEDULE
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
                        <h2 className="view-title">Research Library</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Curated intellectual tracks and cognitive resources.</p>
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

    const renderPerformance = () => (
        <div className="view-container animate-fade-in">
            <div className="view-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <TrendingUp size={40} className="icon-purple" />
                    <div>
                        <h2 className="view-title">Neural Analytics</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>High-fidelity biometric assessment of cognitive performance.</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" style={{ borderRadius: '12px', padding: '0.75rem 1.25rem' }}>
                        <FileText size={18} style={{ marginRight: '8px' }} /> EXPORT REPORT
                    </button>
                    <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.75rem 1.25rem' }}>
                        <RefreshCw size={18} style={{ marginRight: '8px' }} /> RE-PLAYBACK SESSION
                    </button>
                </div>
            </div>
            <div className="perf-grid">
                <div className="card perf-chart-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h4 className="perf-chart-title" style={{ margin: 0 }}>Cognitive Mastery Profile</h4>
                        <div className="badge active" style={{ fontSize: '0.6rem' }}>NORMALIZED DATA</div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 600 }} />
                                <Radar name="User" dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card perf-chart-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h4 className="perf-chart-title" style={{ margin: 0 }}>Retention Efficiency Index</h4>
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
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Peak Focus Velocity</h4>
                    <p className="metric-value">92%</p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--success-color)', fontWeight: '700' }}>↑ 4.2% FROM BASELINE</div>
                </div>
                <div className="card metric-card">
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Latency Index</h4>
                    <p className="metric-value" style={{ background: 'linear-gradient(135deg, var(--success-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>LOW</p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>STABLE RANGE</div>
                </div>
                <div className="card metric-card">
                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Global Session Rank</h4>
                    <p className="metric-value" style={{ background: 'var(--premium-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ELITE</p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--secondary-color)', fontWeight: '700' }}>PERCENTILE: 99.2</div>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="view-container animate-fade-in">
            <div className="view-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <Settings size={32} className="icon-purple" />
                    <div><h2 className="view-title">Control Center</h2><p style={{ color: '#94a3b8' }}>Application behavior.</p></div>
                </div>
            </div>
            <div className="settings-grid">
                <div className="card glass settings-user-card">
                    <div className="settings-avatar-large" style={{ margin: '0 auto 1.5rem' }}>{user?.name?.[0]}</div>
                    <h3>{user?.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                        <div className="badge success">Active</div>
                        <div className="badge active">Pro</div>
                    </div>
                </div>
                <div className="settings-form-container">
                    <form onSubmit={e => { e.preventDefault(); alert("Profile Sync Complete!"); }} className="card glass settings-form-card">
                        <div className="settings-form-inputs">
                            <div className="settings-group"><label>Name</label><input className="settings-input" value={settingsForm.name} onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })} /></div>
                            <div className="settings-group"><label>Email</label><input className="settings-input" value={settingsForm.email} readOnly /></div>
                        </div>
                        <div className="settings-actions">
                            <button type="submit" className="btn btn-primary">Synchronize Profile</button>
                            <button type="button" onClick={logout} className="btn btn-outline btn-danger">Logout</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {isSimulating && <SimulationSandbox />}
            {curriculumModule && <CurriculumModal />}
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
                    <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => { setActiveTab('timetable'); setIsMobileMenuOpen(false); }} title="Smart Planner">
                        <Calendar size={18} /> <span>Smart Planner</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => { setActiveTab('library'); setIsMobileMenuOpen(false); }} title="Library">
                        <BookOpen size={18} /> <span>Library</span>
                    </button>
                    <div className="nav-divider"></div>
                    <button className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => { setActiveTab('performance'); setIsMobileMenuOpen(false); }} title="Performance">
                        <TrendingUp size={18} /> <span>Performance</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }} title="Control Center">
                        <Settings size={18} /> <span>Control Center</span>
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
                            <p>Welcome, investigator {user?.name}</p>
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
