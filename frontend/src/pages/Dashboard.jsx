import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BookOpen, Calendar, Activity, Zap, PlayCircle, Eye, VolumeX, Menu, LogOut } from 'lucide-react';
import '../dashboard.css';

const mockCognitiveData = [
    { time: '10:00', focus: 60, stress: 30 },
    { time: '10:15', focus: 75, stress: 45 },
    { time: '10:30', focus: 90, stress: 35 },
    { time: '10:45', focus: 85, stress: 40 },
    { time: '11:00', focus: 95, stress: 25 },
];

const mockTimetable = [
    { id: 1, time: '09:00 AM', subject: 'Mathematics', desc: 'Calculus Review', status: 'completed' },
    { id: 2, time: '10:30 AM', subject: 'Physics', desc: 'Quantum Mechanics Basics', status: 'current' },
    { id: 3, time: '01:00 PM', subject: 'Break', desc: 'Meditation & Lunch', status: 'upcoming' },
    { id: 4, time: '02:00 PM', subject: 'Literature', desc: 'Essay Drafting', status: 'upcoming' },
];

const Dashboard = () => {
    const { user, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [topic, setTopic] = useState('');
    const [learningContent, setLearningContent] = useState(null);
    const [isLoadingContent, setIsLoadingContent] = useState(false);

    // Real-time cognitive score simulation
    const [currentScore, setCurrentScore] = useState(85);

    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly fluctuate score slightly to mimic real-time analysis
            setCurrentScore(prev => Math.min(100, Math.max(0, prev + (Math.random() * 4 - 2))));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleGenerateContent = () => {
        if (!topic) return;
        setIsLoadingContent(true);
        // Mock API call to notebook llm
        setTimeout(() => {
            setLearningContent({
                title: `Mastering ${topic}`,
                mode: userProfile.learningMode || 'visual',
                summary: `An AI-generated summary about ${topic} tailored for your ${userProfile.learningMode} learning style.`,
                videoUrl: "https://via.placeholder.com/640x360", // Mock video
                audioUrl: "#" // Mock audio
            });
            setIsLoadingContent(false);
        }, 2000);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar glass">
                <div className="sidebar-header">
                    <h2 className="logo-text">CLASE</h2>
                </div>
                <nav className="sidebar-nav">
                    <button className="nav-item active"><Activity size={20} /> Dashboard</button>
                    <button className="nav-item"><Calendar size={20} /> Timetable</button>
                    <button className="nav-item"><BookOpen size={20} /> Library</button>
                    <button className="nav-item"><Zap size={20} /> Live Stats</button>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="nav-item logout"><LogOut size={20} /> Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header glass">
                    <div>
                        <h1>Hello, {user?.name || 'Student'}</h1>
                        <p className="subtitle">Your mind is in a flow state today.</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-pill glass">
                            <Activity size={16} color="#34d399" />
                            <span>Cognitive Load: Low</span>
                        </div>
                        <div className="profile-pic">
                            {user?.name?.[0] || 'U'}
                        </div>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {/* Cognitive Monitor Chart */}
                    <div className="grid-item score-card glass">
                        <div className="card-header">
                            <h3>Cognitive Performance</h3>
                            <div className="live-badge">Live</div>
                        </div>
                        <div className="chart-container" style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <AreaChart data={mockCognitiveData}>
                                    <defs>
                                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="focus" stroke="#8884d8" fillOpacity={1} fill="url(#colorFocus)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="score-display">
                            <span className="score-value">{Math.round(currentScore)}</span>
                            <span className="score-label">Focus Score</span>
                        </div>
                    </div>

                    {/* Timetable */}
                    <div className="grid-item timetable-card glass">
                        <h3>Today's Schedule</h3>
                        <div className="timetable-list">
                            {mockTimetable.map(item => (
                                <div key={item.id} className={`timetable-item ${item.status}`}>
                                    <div className="time">{item.time}</div>
                                    <div className="details">
                                        <h4>{item.subject}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                    {item.status === 'current' && <div className="status-indicator current"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Adaptive Learning Module */}
                    <div className="grid-item learning-card glass">
                        <h3>Adaptive AI Tutor</h3>
                        <div className="learning-input-area">
                            <input
                                type="text"
                                placeholder="What do you want to learn today?"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="input-field"
                            />
                            <button onClick={handleGenerateContent} className="btn btn-primary" disabled={isLoadingContent}>
                                {isLoadingContent ? 'Generating...' : <Zap size={18} />}
                            </button>
                        </div>

                        {learningContent && (
                            <div className="generated-content animate-fade-in">
                                <h4>{learningContent.title}</h4>
                                <p>{learningContent.summary}</p>

                                <div className="media-placeholder glass">
                                    {learningContent.mode === 'visual' ? (
                                        <div className="video-mock">
                                            <PlayCircle size={48} className="play-icon" />
                                            <span>AI Visual Explanation</span>
                                        </div>
                                    ) : (
                                        <div className="audio-mock">
                                            <VolumeX size={48} className="audio-icon" />
                                            <span>AI Audio Lecture</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
