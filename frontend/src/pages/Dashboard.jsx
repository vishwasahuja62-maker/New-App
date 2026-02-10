import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid
} from 'recharts';
import {
    BookOpen, Calendar, Activity, Zap, PlayCircle, LogOut,
    Bell, Search, GraduationCap, Layout, Settings, User, ExternalLink, Filter, Save, CheckCircle
} from 'lucide-react';
import libraryData from '../libraryData.json';
import '../dashboard.css';

// Sub-component to isolate real-time updates
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

            setHistory(prev => {
                const updated = [...prev, { time: timeStr, focus: newFocus, stress: newStress }];
                return updated.slice(-10);
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [currentScore, stressLevel]);

    return (
        <>
            <div className="card cognitive-card">
                <div className="card-title">
                    <h3>Real-time Cognitive Load</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="badge success">Peak Flow</div>
                    </div>
                </div>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                        <AreaChart data={history}>
                            <defs>
                                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#4b5563" fontSize={12} />
                            <YAxis stroke="#4b5563" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                            <Area type="monotone" dataKey="focus" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                            <Area type="monotone" dataKey="stress" stroke="#f87171" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card quick-stats">
                <div className="mini-stat">
                    <Zap size={20} color="#34d399" />
                    <div className="stat-info">
                        <h4>Focus Score</h4>
                        <p>{currentScore}%</p>
                    </div>
                </div>
                <div className="mini-stat">
                    <Activity size={20} color="#f87171" />
                    <div className="stat-info">
                        <h4>Stress Level</h4>
                        <p>{stressLevel}%</p>
                    </div>
                </div>
                <div className="mini-stat">
                    <GraduationCap size={20} color="#a78bfa" />
                    <div className="stat-info">
                        <h4>Streak</h4>
                        <p>12 Days</p>
                    </div>
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

    const [notifications] = useState([
        { id: 1, text: "Focus state detected. Optimal learning window active.", type: "success" },
        { id: 2, text: "Approaching math session. Prepare for visual mode.", type: "info" }
    ]);

    const [settingsForm, setSettingsForm] = useState({ name: user?.name || '', password: '••••••••' });

    const handleGenerateContent = (e) => {
        e.preventDefault();
        if (!topic) return;
        setIsLoadingContent(true);
        setTimeout(() => {
            setLearningContent({
                title: `Mastering ${topic}`,
                mode: userProfile.learningMode || 'visual',
                summary: `An AI-generated summary about ${topic} tailored for your ${userProfile.learningMode} learning style. Key concepts include X, Y, and Z.`,
            });
            setIsLoadingContent(false);
        }, 2000);
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        updateProfile({ name: settingsForm.name });
        alert("Settings saved successfully!");
    };

    // Render methods instead of sub-components to prevent remount on type
    const renderOverview = () => (
        <div className="dashboard-grid animate-fade-in">
            <CognitiveMonitor />

            <div className="card learning-card">
                <div className="card-title"><h3>Adaptive Tutor</h3></div>
                <form onSubmit={handleGenerateContent} className="learning-input-container">
                    <input className="learning-input" placeholder="What are you studying?" value={topic} onChange={e => setTopic(e.target.value)} />
                    <button type="submit" className="btn btn-primary">{isLoadingContent ? '...' : 'Generate'}</button>
                </form>
                {learningContent && (
                    <div className="view-container">
                        <h4>{learningContent.title}</h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{learningContent.summary}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSchedule = () => (
        <div className="view-container">
            <h2 style={{ marginBottom: '1.5rem' }}>AI-Generated Optimized Schedule</h2>
            <div className="schedule-detail-card">
                <h3>Adaptive Planning Strategy</h3>
                <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
                    Based on your IQ assessment and learning mode ({userProfile.learningMode}), we have staggered
                    subject difficulty to maintain your "Flow State". Cognitive load is prioritized for {userProfile.difficultSubjects?.[0] || 'core subjects'}
                    during your high-focus morning window.
                </p>
            </div>
            <div className="schedule-list">
                {[
                    { time: '08:00 AM', title: 'Cognitive Primer', desc: '10 min mindfulness to lower baseline stress.', type: 'wellness' },
                    { time: '09:00 AM', title: 'High-Load: Mathematics', desc: 'Abstract reasoning focus based on your IQ pattern.', type: 'heavy' },
                    { time: '11:00 AM', title: 'Modality Refresh: Literature', desc: 'Switching to verbal mode to reduce analytical fatigue.', type: 'light' },
                    { time: '02:00 PM', title: 'Adaptive Practice', desc: 'Interactive session with AI Tutor for chemistry.', type: 'active' }
                ].map((item, i) => (
                    <div key={i} className="card" style={{ marginBottom: '1rem', flexDirection: 'row', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ color: '#6366f1', fontWeight: '800', fontSize: '1.1rem', minWidth: '100px' }}>{item.time}</div>
                        <div>
                            <h4 style={{ color: 'white' }}>{item.title}</h4>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{item.desc}</p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                            <span className={`badge ${item.type}`} style={{ opacity: 0.7 }}>{item.type.toUpperCase()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLibrary = () => (
        <div className="view-container">
            <h2 style={{ marginBottom: '1.5rem' }}>Suggested Resources</h2>
            <div className="library-grid">
                {libraryData.map(item => (
                    <div key={item.id} className="video-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div className="icon-box" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', padding: '10px', borderRadius: '8px' }}>
                                <PlayCircle size={20} />
                            </div>
                            <h4 style={{ fontSize: '1.1rem' }}>{item.title}</h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {item.videos.map((vid, idx) => (
                                <a key={idx} href={vid.url} target="_blank" rel="noreferrer" className="nav-item" style={{ background: 'rgba(0,0,0,0.2)', textDecoration: 'none' }}>
                                    <div style={{ flex: 1 }}>{vid.title}</div>
                                    <ExternalLink size={14} />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPerformance = () => (
        <div className="view-container">
            <h2 style={{ marginBottom: '1.5rem' }}>Deep Cognitive Analytics</h2>
            <div className="dashboard-grid">
                <div className="card cognitive-card" style={{ gridColumn: 'span 12' }}>
                    <div className="card-title"><h3>Longitudinal Focus Data</h3></div>
                    <p style={{ color: '#94a3b8' }}>Session analysis from primary flow monitoring.</p>
                </div>
                <div className="card" style={{ gridColumn: 'span 6' }}>
                    <h3>Efficiency Analysis</h3>
                    <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Focus consistency is optimized.</p>
                </div>
                <div className="card" style={{ gridColumn: 'span 6' }}>
                    <h3>Burnout Risk</h3>
                    <p style={{ marginTop: '1rem', color: '#34d399', fontWeight: 'bold' }}>Low Potential</p>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="view-container">
            <h2 style={{ marginBottom: '1.5rem' }}>Account Preferences</h2>
            <div className="card">
                <form className="settings-form" onSubmit={handleSaveSettings}>
                    <div className="settings-group">
                        <label>Display Name</label>
                        <input className="settings-input" value={settingsForm.name} onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })} />
                    </div>
                    <div className="settings-group">
                        <label>Change Password</label>
                        <input className="settings-input" type="password" value={settingsForm.password} onChange={e => setSettingsForm({ ...settingsForm, password: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                        <Save size={18} /> Update Profile
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div className="logo-container"><div className="logo-icon">C</div><span className="app-name">CLASE</span></div>
                <nav className="nav-section">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Layout size={18} /> Dashboard</button>
                    <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}><Calendar size={18} /> Schedule</button>
                    <button className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}><BookOpen size={18} /> Library</button>
                    <div className="nav-divider"></div>
                    <button className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}><Activity size={18} /> Performance</button>
                    <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={18} /> Settings</button>
                </nav>
                <button onClick={logout} className="nav-item" style={{ marginTop: 'auto', color: '#f87171' }}><LogOut size={18} /> Logout</button>
            </aside>

            <main className="main-content">
                <header className="header-bar">
                    <div className="welcome-text">
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p>{activeTab === 'dashboard' ? `Welcome back, ${user?.name}` : 'Personalized AI Analysis'}</p>
                    </div>
                    <div className="user-profile">
                        <div className="notification-bell" onClick={() => setShowNotifications(!showNotifications)}>
                            <Bell size={20} />
                            {notifications.length > 0 && <span className="notification-dot"></span>}
                            {showNotifications && (
                                <div className="notifications-dropdown animate-fade-in">
                                    <h4 style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #374151' }}>Alerts</h4>
                                    {notifications.map(n => (
                                        <div key={n.id} className="notif-item">
                                            <div style={{ color: n.type === 'success' ? '#34d399' : '#fbbf24' }}>●</div>
                                            {n.text}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="avatar">{user?.name?.[0] || 'U'}</div>
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
