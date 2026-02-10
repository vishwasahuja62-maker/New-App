import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid
} from 'recharts';
import {
    BookOpen, Calendar, Activity, Zap, PlayCircle, LogOut,
    Bell, Search, GraduationCap, Layout, Settings, User, ExternalLink, Filter, Save, CheckCircle, Info, TrendingUp, Clock, Target, FileText, HelpCircle, Globe, X, Layers, Cpu, Radio, ChevronRight, Bookmark
} from 'lucide-react';
import libraryData from '../libraryData.json';
import '../dashboard.css';

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
                <div className="card-title"><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Activity className="icon-purple" /><h3>Cognitive Flow State</h3></div><div className="badge success">Peak</div></div>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer><AreaChart data={history}><defs><linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} /><stop offset="95%" stopColor="#8884d8" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="time" stroke="#4b5563" fontSize={12} /><YAxis stroke="#4b5563" fontSize={12} /><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px' }} /><Area type="monotone" dataKey="focus" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" /><Area type="monotone" dataKey="stress" stroke="#f87171" strokeWidth={2} fill="transparent" /></AreaChart></ResponsiveContainer>
                </div>
            </div>
            <div className="card quick-stats">
                <div className="mini-stat"><div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#10b981' }}><Zap size={20} /></div><div className="stat-info"><h4>Focus</h4><p>{currentScore}%</p></div></div>
                <div className="mini-stat"><div className="stat-icon" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}><Activity size={20} /></div><div className="stat-info"><h4>Stress</h4><p>{stressLevel}%</p></div></div>
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
    const [selectionMode, setSelectionMode] = useState(null); // 'sim', 'blueprint', or 'resources'

    const [notifications] = useState([
        { id: 1, text: "Focus state detected. Optimal learning window active.", type: "success" },
        { id: 2, text: "Approaching math session. Prepare for visual mode.", type: "info" }
    ]);

    const [settingsForm, setSettingsForm] = useState({ name: user?.name || '', password: '••••••••' });

    // Dynamic Logic: Generates Top 5 Resources
    const generateTopicData = (query) => {
        const encoded = encodeURIComponent(query);
        const mode = userProfile.learningMode || 'visual';

        // Top 5 Simulations
        const simulations = [
            { title: `${query} PhET Virtual Lab`, url: `https://phet.colorado.edu/en/simulations/filter?searchTerm=${encoded}`, provider: 'PhET Colorado', icon: <Layers size={20} /> },
            { title: `${query} Interactive 3D Model`, url: `https://sketchfab.com/search?q=${encoded}+interactive`, provider: 'Sketchfab', icon: <Layers size={20} /> },
            { title: `${query} Virtual Sandbox`, url: `https://www.google.com/search?q=${encoded}+interactive+sandbox+tool`, provider: 'Google Web', icon: <Cpu size={20} /> },
            { title: `${query} Behavior Simulation`, url: `https://www.google.com/search?q=${encoded}+logic+simulation+site:ck12.org`, provider: 'CK-12', icon: <Cpu size={20} /> },
            { title: `${query} Hands-on Experiment`, url: `https://www.google.com/search?q=${encoded}+step+by+step+experiment`, provider: 'ScienceBuddy', icon: <Zap size={20} /> }
        ];

        // Top 5 Blueprints
        const blueprints = [
            { title: `${query} Wikipedia Blueprint`, url: `https://en.wikipedia.org/wiki/${encoded}`, provider: 'Wikipedia', icon: <FileText size={20} /> },
            { title: `${query} Academic Detailed Notes`, url: `https://www.google.com/search?q=${encoded}+detailed+notes+site:edu`, provider: 'University Index', icon: <BookOpen size={20} /> },
            { title: `${query} Engineering Schematic`, url: `https://www.google.com/search?q=${encoded}+schematic+diagram+logic`, provider: 'Diagram Hub', icon: <Target size={20} /> },
            { title: `${query} Research Insight`, url: `https://scholar.google.com/scholar?q=${encoded}`, provider: 'Google Scholar', icon: <GraduationCap size={20} /> },
            { title: `${query} Concept Breakdown`, url: `https://www.google.com/search?q=${encoded}+expert+explanation+simply`, provider: 'CLASE Verified', icon: <Info size={20} /> }
        ];

        // Key Resources (Notes, Quizzes, Scholar Papers)
        const resources = [
            { title: `${query} Master Quiz`, url: `https://www.google.com/search?q=${encoded}+interactive+quiz+test`, provider: 'Google Assessment', icon: <HelpCircle size={20} /> },
            { title: `${query} Exam Prep Notes`, url: `https://www.google.com/search?q=${encoded}+study+notes+pdf`, provider: 'Academic Cloud', icon: <FileText size={20} /> },
            { title: `Global Research: ${query}`, url: `https://scholar.google.com/scholar?q=${encoded}`, provider: 'Google Scholar', icon: <Globe size={20} /> },
            { title: `${query} Video Masterclass`, url: `https://www.youtube.com/results?search_query=${encoded}+educational+lecture`, provider: 'YouTube Education', icon: <PlayCircle size={20} /> },
            { title: `Interactive Flashcards: ${query}`, url: `https://www.google.com/search?q=${encoded}+quizlet+flashcards`, provider: 'Quizlet', icon: <Bookmark size={20} /> }
        ];

        return {
            title: `${query} Mastery Pathway`,
            objectives: [
                `Breakdown core architecture of ${query}`,
                `Analyze ${query} interactions`,
                `Synthesize applications of ${query}`
            ],
            steps: [
                { id: 1, title: 'Foundations', desc: `Core principles of ${query}.` },
                { id: 2, title: 'Modeling', desc: `Variable conditions in ${query}.` },
                { id: 3, title: 'Integration', desc: `Systemic ${query} connections.` }
            ],
            metrics: [
                { label: 'Analytical Load', value: '78%' },
                { label: 'Retention Target', value: '92%' },
                { label: 'Intensity', value: 'High' }
            ],
            simulations,
            blueprints,
            keyResources: resources
        };
    };

    const handleGenerateContent = (e) => {
        e.preventDefault();
        if (!topic) return;
        setIsLoadingContent(true);
        setLearningContent(null);
        setTimeout(() => {
            const dynamic = generateTopicData(topic);
            setLearningContent({
                ...dynamic,
                mode: userProfile.learningMode || 'visual',
                summary: `CLASE AI has synchronized an adaptive ${userProfile.learningMode} lesson for "${topic}". Select from simulations, blueprints, or key resources to begin.`,
            });
            setIsLoadingContent(false);
        }, 1500);
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        updateProfile({ name: settingsForm.name });
        alert("Settings saved successfully!");
    };

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
                    {/* Left Panel: Active Dashboard */}
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

                    {/* Right Panel: Resource Selection Overlay */}
                    <div className="simulation-panel" style={{ background: '#020617', padding: '2rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {!selectionMode ? (
                            <div style={{ textAlign: 'center', maxWidth: '800px', animation: 'fadeIn 0.5s ease', marginTop: 'auto', marginBottom: 'auto' }}>
                                <div style={{ width: '100px', height: '100px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Cpu size={40} color="#818cf8" />
                                </div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>{topic} Sandbox</h1>
                                <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: '1.6' }}>Choose your interactive pathway. CLASE has scanned the top resources specifically for <strong>{topic}</strong>.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', width: '100%' }}>
                                    <button onClick={() => setSelectionMode('sim')} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <PlayCircle size={32} color="#a78bfa" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>LAUNCH ENGINE</h4>
                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>5 Simulations</p>
                                    </button>
                                    <button onClick={() => setSelectionMode('blueprint')} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <FileText size={32} color="#34d399" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>VIEW BLUEPRINT</h4>
                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>5 Academic Maps</p>
                                    </button>
                                    <button onClick={() => setSelectionMode('resources')} className="glass hover-card" style={{ padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                        <Bookmark size={32} color="#fcd34d" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', color: 'white' }}>KEY RESOURCES</h4>
                                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>Notes & Quizzes</p>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ width: '100%', maxWidth: '800px', animation: 'fadeInRight 0.4s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                    <button onClick={() => setSelectionMode(null)} style={{ background: 'transparent', border: 'none', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
                                        &larr; Back to Selection
                                    </button>
                                    <h2 style={{ fontSize: '1.5rem' }}>
                                        {selectionMode === 'sim' ? 'Interactive Simulations' : selectionMode === 'blueprint' ? 'Academic Blueprints' : 'Key Study Resources'}
                                    </h2>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '3rem' }}>
                                    {(selectionMode === 'sim' ? learningContent?.simulations : selectionMode === 'blueprint' ? learningContent?.blueprints : learningContent?.keyResources).map((res, i) => (
                                        <a key={i} href={res.url} target="_blank" rel="noreferrer" className="glass hover-card" style={{ padding: '1.5rem 2rem', borderRadius: '24px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
                                                    {res.icon}
                                                </div>
                                                <div>
                                                    <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{res.title}</h4>
                                                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Provided by {res.provider}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Open</span>
                                                <ChevronRight size={20} color="#64748b" />
                                            </div>
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
                <div className="card-title"><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Zap className="icon-yellow" /><h3>Dynamic AI Tutor</h3></div></div>
                <form onSubmit={handleGenerateContent} className="learning-input-container">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                        <input className="learning-input" style={{ paddingLeft: '40px' }} placeholder="Identify a concept (e.g. DNA, Calculus, History)..." value={topic} onChange={e => setTopic(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 2rem' }}>{isLoadingContent ? 'Analyzing...' : 'Generate'}</button>
                </form>

                {learningContent && (
                    <div className="view-container animate-fade-in" style={{ marginTop: '1.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: '900' }}>{learningContent.title}</h4>
                                <span className="badge active" style={{ borderRadius: '8px' }}>{learningContent.mode.toUpperCase()} MODE</span>
                            </div>
                            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>{learningContent.summary}</p>
                            <button onClick={() => setIsSimulating(true)} className="btn btn-primary" style={{ width: '100%', padding: '1.5rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '18px' }}>
                                <PlayCircle size={22} /> START INTERACTIVE SESSION
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div className="view-container animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Calendar size={28} className="icon-purple" />
                <h2>Smart Schedule</h2>
            </div>
            <div className="schedule-detail-card">
                <h3>Adaptive Planning Strategy</h3>
                <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Staggering difficulty to maintain Peak Flow for <strong>{userProfile.difficultSubjects?.[0] || 'Core Areas'}</strong>.</p>
            </div>
            <div style={{ marginTop: '2rem' }}>
                {['09:00 AM', '11:00 AM', '02:00 PM'].map(time => (
                    <div key={time} className="card" style={{ marginBottom: '1rem', flexDirection: 'row', alignItems: 'center', padding: '1.5rem' }}>
                        <div style={{ minWidth: '100px', fontWeight: 'bold', color: '#a78bfa', fontSize: '1.1rem' }}>{time}</div>
                        <div style={{ flex: 1 }}>Personalized Study Session</div>
                        <div className="badge success">Optimal</div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLibrary = () => (
        <div className="view-container animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <BookOpen size={28} className="icon-purple" />
                <h2>Personalized Resources</h2>
            </div>
            <div className="library-grid">
                {libraryData.slice(0, 4).map(item => (
                    <div key={item.id} className="video-card" style={{ padding: '2rem' }}>
                        <PlayCircle size={32} color="#a78bfa" style={{ marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>AI recommendation for your profile.</p>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.8rem' }}>EXPLORE MODULE</button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPerformance = () => (
        <div className="view-container animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <TrendingUp size={28} className="icon-purple" />
                <h2>Biometric Performance</h2>
            </div>
            <div className="perf-grid">
                <div className="metric-card"><h4 style={{ color: '#94a3b8' }}>Focus Index</h4><p className="metric-value">92%</p></div>
                <div className="metric-card"><h4 style={{ color: '#94a3b8' }}>Efficiency</h4><p className="metric-value">8.5</p></div>
                <div className="metric-card"><h4 style={{ color: '#94a3b8' }}>Retention</h4><p className="metric-value">88%</p></div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="view-container animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <Settings size={28} className="icon-purple" />
                <h2>Account Preferences</h2>
            </div>
            <div className="card settings-header-card">
                <div className="settings-avatar-large" style={{ borderRadius: '24px' }}>{user?.name?.[0]}</div>
                <div>
                    <h3 style={{ fontSize: '1.8rem' }}>{user?.name}</h3>
                    <p style={{ color: '#94a3b8' }}>{user?.email}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <span className="badge wellness">{userProfile.learningMode?.toUpperCase()} MODE</span>
                        <span className="badge success">LEVEL 4</span>
                    </div>
                </div>
            </div>
            <div className="card" style={{ marginTop: '2rem', padding: '3rem' }}>
                <form className="settings-form" onSubmit={handleSaveSettings}>
                    <div className="settings-group"><label>Display Name</label><input className="settings-input" value={settingsForm.name} onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })} /></div>
                    <div className="settings-group"><label>Access Password</label><input className="settings-input" type="password" value={settingsForm.password} onChange={e => setSettingsForm({ ...settingsForm, password: e.target.value })} /></div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem 3rem' }}>SAVE CHANGES</button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {isSimulating && <SimulationSandbox />}
            <aside className="sidebar">
                <div className="logo-container"><div className="logo-icon">C</div><span className="app-name">CLASE</span></div>
                <nav className="nav-section">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Layout size={18} /> Dashboard</button>
                    <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}><Calendar size={18} /> Schedule</button>
                    <button className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}><BookOpen size={18} /> Library</button>
                    <div className="nav-divider"></div>
                    <button className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}><TrendingUp size={18} /> Performance</button>
                    <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={18} /> Settings</button>
                </nav>
            </aside>
            <main className="main-content">
                <header className="header-bar">
                    <div className="welcome-text"><h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1><p>Welcome back, {user?.name}</p></div>
                    <div className="user-profile">
                        <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}><Bell size={20} />{notifications.length > 0 && <span className="notification-dot"></span>}</div>
                        <div className="avatar" onClick={() => setActiveTab('settings')}>{user?.name?.[0]}</div>
                    </div>
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
