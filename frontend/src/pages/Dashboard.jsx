import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import {
    BookOpen, Calendar, Activity, Zap, Heart, Star, PlayCircle, LogOut,
    Bell, Search, GraduationCap, Layout, Settings, User, ExternalLink, Filter, Save, CheckCircle, Info, TrendingUp, Clock, Target, FileText, HelpCircle, Globe, X, Layers, Cpu, Radio, ChevronRight, ChevronLeft, ArrowLeft, Bookmark, Shield, Sliders, Award, Brain, RefreshCw, List, Menu, ChevronDown, Edit, GripVertical, MessageCircle, MessageSquare, Flame, ShieldCheck, Lock, ImageIcon, Send, ArrowRight, UploadCloud, AlertTriangle, Download, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import libraryData from '../libraryData.json';
import '../dashboard.css';
import '../settings-mobile.css';

const TIME_SLOTS = [
    '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM',
    '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
];

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// RADAR_DATA moved inside component for dynamic access

const CognitiveMonitor = ({ themeColor }) => {
    const [currentScore, setCurrentScore] = useState(85);
    const [fatigueLevel, setFatigueLevel] = useState(24);
    const [history, setHistory] = useState([
        { time: '10:00', focus: 60, fatigue: 30 },
        { time: '10:15', focus: 75, fatigue: 45 },
        { time: '10:30', focus: 90, fatigue: 35 },
        { time: '10:45', focus: 85, fatigue: 40 },
        { time: '11:00', focus: 95, fatigue: 25 },
    ]);
    const [parentNotified, setParentNotified] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
            // Simulating fluctuation - randomly spike fatigue occasionally for demo
            const fatigueSpike = Math.random() > 0.9 ? 40 : 0;
            const newFocus = Math.min(100, Math.max(0, currentScore + (Math.random() * 8 - 4)));
            const newFatigue = Math.min(100, Math.max(0, fatigueLevel + (Math.random() * 6 - 3) + fatigueSpike));

            setCurrentScore(parseFloat(newFocus.toFixed(1)));
            setFatigueLevel(parseFloat(newFatigue.toFixed(1)));
            setHistory(prev => [...prev.slice(-9), { time: timeStr, focus: newFocus, fatigue: newFatigue }]);

            if (newFatigue > 85 && !parentNotified) {
                setParentNotified(true);
                // In a real app, this would call an API endpoint to send SMS/Email
                console.log("High fatigue detected. Auto-notifying parent.");
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentScore, fatigueLevel, parentNotified]);

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
                            <h4 style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.1rem' }}>Fatigue Threshold Exceeded</h4>
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
                            <Area type="monotone" dataKey="fatigue" stroke="#f87171" strokeWidth={2} fill="transparent" />
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

                <div className="sandbox-layout">
                    <div className="simulation-panel" style={{ background: '#0f172a' }}>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Target size={14} color="var(--primary-color)" /> Learning Goals
                            </h4>
                            {learningContent?.objectives.map((obj, i) => (
                                <div key={i} className="glass" style={{ padding: '1rem', borderRadius: '16px', marginBottom: '0.75rem', fontSize: '0.85rem', display: 'flex', gap: '0.75rem', border: '1px solid rgba(255,255,255,0.03)', lineHeight: '1.4' }}>
                                    <CheckCircle size={16} color="#34d399" style={{ shrink: 0, marginTop: '2px' }} /> {obj}
                                </div>
                            ))}
                        </div>
                        <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }}>
                            <h4 style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem' }}>Performance Data</h4>
                            {learningContent?.metrics.map(m => (
                                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.label}</span>
                                    <span style={{ fontSize: '0.8rem', color: themeColor || '#818cf8', fontWeight: '800' }}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div id="sandbox-main-panel" className="sandbox-content-panel">
                        {!selectionMode ? (
                            <div style={{ textAlign: 'center', maxWidth: '850px', width: '100%', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.6s ease-out' }}>
                                <div style={{ width: '120px', height: '120px', background: 'rgba(129, 140, 248, 0.08)', borderRadius: '40px', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', rotate: '-5deg', border: '1px solid rgba(129, 140, 248, 0.1)' }}>
                                    <Layers size={56} color={themeColor || '#818cf8'} />
                                </div>
                                <h1 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>{topic} <span className="text-gradient">Mastery</span></h1>
                                <p style={{ color: '#94a3b8', fontSize: '1.25rem', marginBottom: '3.5rem', lineHeight: '1.6', maxWidth: '600px' }}>Choose your preferred learning medium. We've synthesized the best resources for <strong>{topic}</strong>.</p>

                                <div className="sandbox-options-grid">
                                    <div onClick={() => { playSound?.('click'); setSelectionMode('sim'); }} className="card glass hover-card" style={{ padding: '2.5rem', borderRadius: '32px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                        <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <PlayCircle size={32} color={themeColor || '#818cf8'} />
                                        </div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', letterSpacing: '0.02em' }}>VIDEOS & PLAY</h4>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Visual & Interactive</p>
                                    </div>
                                    <div onClick={() => { playSound?.('click'); setSelectionMode('blueprint'); }} className="card glass hover-card" style={{ padding: '2.5rem', borderRadius: '32px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                        <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={32} color="#34d399" />
                                        </div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', letterSpacing: '0.02em' }}>STUDY NOTES</h4>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Deep Theoretical Reading</p>
                                    </div>
                                    <div onClick={() => { playSound?.('click'); setSelectionMode('resources'); }} className="card glass hover-card" style={{ padding: '2.5rem', borderRadius: '32px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.03)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                        <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Bookmark size={32} color="#fbbf24" />
                                        </div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', letterSpacing: '0.02em' }}>EXTRA HELP</h4>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Quick Reference Guides</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ width: '100%', maxWidth: '900px', animation: 'fadeInRight 0.4s ease-out' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <button onClick={() => setSelectionMode(null)} className="btn-icon glass hover-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <ArrowLeft size={22} />
                                        </button>
                                        <div>
                                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>{selectionMode === 'sim' ? 'Videos & Activities' : selectionMode === 'blueprint' ? 'Study Notes' : 'Extra Help'}</h2>
                                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>AI-curated content for {topic}</p>
                                        </div>
                                    </div>
                                    <div className="badge active" style={{ padding: '0.5rem 1rem' }}>{((selectionMode === 'sim' ? learningContent?.simulations : selectionMode === 'blueprint' ? learningContent?.blueprints : learningContent?.keyResources) || []).length} ITEMS</div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', paddingBottom: '3rem' }}>
                                    {((selectionMode === 'sim' ? learningContent?.simulations : selectionMode === 'blueprint' ? learningContent?.blueprints : learningContent?.keyResources) || []).map((res, i) => (
                                        <a key={i} href={res.url} target="_blank" rel="noreferrer" className="glass hover-card" style={{ padding: '1.5rem 2rem', borderRadius: '24px', textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.01)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                                <div style={{ width: '56px', height: '56px', background: 'rgba(129, 140, 248, 0.08)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: themeColor || '#818cf8', flexShrink: 0 }}>
                                                    {res.icon}
                                                </div>
                                                <div>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.4rem' }}>{res.title}</h4>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Provider: <strong>{res.provider}</strong></span>
                                                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: '700' }}>OPEN RESOURCE</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
};

const SortableScheduleItem = ({ item, onEdit, onRemove, playSound, toggleTaskCompletion }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'auto'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="card schedule-card hover-card"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div
                        {...attributes}
                        {...listeners}
                        style={{ cursor: 'grab', display: 'flex', alignItems: 'center', color: 'var(--text-muted)', touchAction: 'none' }}
                        className="drag-handle"
                    >
                        <GripVertical size={18} />
                    </div>
                    <div className="badge active" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>{item.type}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <button
                        onClick={() => { playSound('click'); toggleTaskCompletion(item.id); }}
                        style={{ 
                            background: item.status === 'Completed' ? 'var(--success-color)' : 'rgba(255,255,255,0.05)', 
                            border: '1px solid var(--glass-border)', 
                            color: item.status === 'Completed' ? 'white' : 'var(--text-muted)', 
                            padding: '6px', 
                            borderRadius: '10px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.3s ease'
                        }}
                        className="hover-scale"
                        title={item.status === 'Completed' ? 'Mark as Pending' : 'Mark as Completed'}
                    >
                        <CheckCircle size={14} />
                        {item.status === 'Completed' && <span style={{ fontSize: '0.6rem', fontWeight: '800' }}>DONE</span>}
                    </button>
                    <div style={{ width: '1px', height: '14px', background: 'var(--glass-border)' }}></div>
                    <button
                        onClick={() => { playSound('click'); onEdit(item); }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        className="hover-scale"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onRemove(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', opacity: 0.6 }}
                        className="hover-scale"
                    >
                        <Trash2 size={16} />
                    </button>
                    <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{item.task}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Scheduled for {item.time}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: item.priority === 'High' ? 'var(--danger-color)' : item.priority === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)',
                    boxShadow: `0 0 10px ${item.priority === 'High' ? 'var(--danger-color)' : item.priority === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)'}`
                }}></div>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: item.priority === 'High' ? 'var(--danger-color)' : item.priority === 'Medium' ? 'var(--warning-color)' : 'var(--success-color)'
                }}>{item.status}</span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user, userProfile, logout, updateProfile, performanceMetrics, updatePerformance } = useAuth();
    const navigate = useNavigate();

    const formatMessage = (text) => {
        if (!text) return null;
        // Match [text](url) or plain URLs
        const parts = text.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s]+|(?:\n))/g);
        
        return parts.map((part, index) => {
            const markdownMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (markdownMatch) {
                return (
                    <a key={index} href={markdownMatch[2]} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}>
                        {markdownMatch[1]}
                    </a>
                );
            }
            
            const urlMatch = part.match(/^https?:\/\/[^\s]+$/);
            if (urlMatch) {
                return (
                    <a key={index} href={part} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 'bold', textDecoration: 'underline' }}>
                        {part}
                    </a>
                );
            }

            if (part === '\n') {
                return <br key={index} />;
            }
            
            return part;
        });
    };

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
    const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
    const [isLibraryDropdownOpen, setIsLibraryDropdownOpen] = useState(false);

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [displayedSummary, setDisplayedSummary] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [mentorSessions, setMentorSessions] = useState([
        { 
            id: 'default', 
            title: 'Welcome Session', 
            messages: [
                { sender: 'mentor', text: "Hello! I am your AI Study Mentor. How can I assist you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ],
            lastActive: Date.now() 
        }
    ]);
    const [activeMentorSessionId, setActiveMentorSessionId] = useState('default');
    const [editingMentorSessionId, setEditingMentorSessionId] = useState(null);
    const [editingMentorSessionTitle, setEditingMentorSessionTitle] = useState('');
    const [mentorSearchQuery, setMentorSearchQuery] = useState('');
    const [mentorInput, setMentorInput] = useState('');
    const [mentorMode, setMentorMode] = useState('friendly');
    const [companionMessages, setCompanionMessages] = useState([
        { sender: 'companion', text: 'Hi! Remember our deal? 2 hours of solid focus, then we watch that new movie trailer! You got this.', time: '09:00 AM' }
    ]);
    const [companionInput, setCompanionInput] = useState('');
    const [isConsentGiven, setIsConsentGiven] = useState(localStorage.getItem('companion-consent') === 'true');
    const [chatLocked, setChatLocked] = useState(false);
    const [doubts, setDoubts] = useState([]);
    const [activeDoubtTab, setActiveDoubtTab] = useState('saved');
    const [pendingDeleteDoubt, setPendingDeleteDoubt] = useState(null);
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

    // Detailed Schedule State
    const [schedule, setSchedule] = useState([]);

    // Initialize schedule based on profile
    useEffect(() => {
        if (userProfile?.academicData?.subjects) {
            const subjs = userProfile.academicData.subjects;
            const newSchedule = [
                { id: 1, time: '09:00 AM', task: `${subjs[0] || 'General'} Masterclass`, priority: 'High', status: 'Upcoming', type: 'Focus' },
                { id: 2, time: '11:00 AM', task: `${subjs[1] || 'General'} Workshop`, priority: 'Medium', status: 'Paused', type: 'Interactive' },
                { id: 3, time: '02:00 PM', task: 'Cognitive Break', priority: 'Low', status: 'Syncing', type: 'Rest' },
                { id: 4, time: '04:00 PM', task: `${subjs[2] || 'Specialized'} Session`, priority: 'High', status: 'Ready', type: 'Practical' }
            ];
            setSchedule(newSchedule);
        } else {
            setSchedule([
                { id: 1, time: '09:00 AM', task: 'Mathematics Masterclass', priority: 'High', status: 'Upcoming', type: 'Focus' },
                { id: 2, time: '11:00 AM', task: 'Physics Workshop', priority: 'Medium', status: 'Paused', type: 'Interactive' },
                { id: 3, time: '02:00 PM', task: 'Cognitive Break', priority: 'Low', status: 'Syncing', type: 'Rest' },
                { id: 4, time: '04:00 PM', task: 'General Study', priority: 'High', status: 'Ready', type: 'Practical' }
            ]);
        }
    }, [userProfile?.academicData?.subjects]);
    const [isLinkPortalOpen, setIsLinkPortalOpen] = useState(false);
    const [isEditingSchedule, setIsEditingSchedule] = useState(null);
    const [tempScheduleItem, setTempScheduleItem] = useState(null);
    const [scheduleError, setScheduleError] = useState('');

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSchedule((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);

                // Create a copy to work with
                const newItems = [...items];

                // Swap the time slots between the two items
                const timeA = newItems[oldIndex].time;
                const timeB = newItems[newIndex].time;

                newItems[oldIndex] = { ...newItems[oldIndex], time: timeB };
                newItems[newIndex] = { ...newItems[newIndex], time: timeA };

                // Return the array with the moved item
                return arrayMove(newItems, oldIndex, newIndex);
            });
            playSound('click');
        }
    };

    const handleSaveScheduleEdit = () => {
        const conflict = schedule.find(item => item.time === tempScheduleItem.time && item.id !== tempScheduleItem.id);
        if (conflict) {
            setScheduleError(`Time conflict: ${conflict.task} is already scheduled for ${tempScheduleItem.time}`);
            return;
        }

        if (isEditingSchedule === 'add') {
            setSchedule(prev => [...prev, tempScheduleItem].sort((a, b) => {
                const timeA = TIME_SLOTS.indexOf(a.time);
                const timeB = TIME_SLOTS.indexOf(b.time);
                return timeA - timeB;
            }));
        } else {
            setSchedule(schedule.map(item => item.id === tempScheduleItem.id ? tempScheduleItem : item).sort((a, b) => {
                const timeA = TIME_SLOTS.indexOf(a.time);
                const timeB = TIME_SLOTS.indexOf(b.time);
                return timeA - timeB;
            }));
        }
        setIsEditingSchedule(null);
        setTempScheduleItem(null);
        setScheduleError('');
    };

    const settingsKey = user?._id ? `dashboard-settings-${user._id}` : 'dashboard-settings';

    const [settingsForm, setSettingsForm] = useState(() => {
        const defaults = {
            name: user?.name || 'New Companion',
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
            themeColor: '#818cf8',
            avatarSeed: Math.random().toString(36).substring(7)
        };
        const saved = localStorage.getItem(settingsKey);
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    });

    const playSound = (type) => {
        if (!settingsForm.soundEffects) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            if (type === 'click') {
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.1);
            } else if (type === 'success') {
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(400, ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.3);
            }
        } catch (err) {
            console.error('Web Audio error:', err);
        }
    };

    // User interaction "unlock" for audio
    useEffect(() => {
        const unlockAudio = () => {
            if (settingsForm.soundEffects) {
                // Play a brief silent audio to "unlock" the audio context if needed
                const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAP8A/wD/');
                audio.play().catch(() => { });
            }
            window.removeEventListener('mousedown', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
        window.addEventListener('mousedown', unlockAudio);
        window.addEventListener('keydown', unlockAudio);
        return () => {
            window.removeEventListener('mousedown', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
    }, [settingsForm.soundEffects]);

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
        // Save to localStorage using user specific key
        localStorage.setItem(settingsKey, JSON.stringify(settingsForm));

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
        const density = settingsForm.viewDensity?.toLowerCase() || 'comfortable';
        document.body.className = document.body.className
            .replace(/\b(comfortable|compact)\b/g, '')
            .trim() + ' ' + density;
        document.body.setAttribute('data-density', density);

        // Apply sidebar position
        const position = settingsForm.sidebarPosition?.toLowerCase() || 'left';
        document.body.setAttribute('data-sidebar', position);

        // Ensure sidebar-right class is in sync on container
        const container = document.querySelector('.dashboard-container');
        if (container) {
            if (position === 'right') {
                container.classList.add('sidebar-right');
            } else {
                container.classList.remove('sidebar-right');
            }
        }
    }, [settingsForm]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setIsNavDropdownOpen(false);
            setIsUserDropdownOpen(false);
            setIsLibraryDropdownOpen(false);
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // Load doubts from backend
    useEffect(() => {
        const fetchDoubts = async () => {
            if (user?._id || user?.id) {
                try {
                    const userId = user._id || user.id;
                    const { data } = await axios.get(`${BASE_URL}/api/doubts/user/${userId}`);
                    setDoubts(data.map(d => ({
                        id: d.id,
                        question: d.question,
                        subject: d.subject || "General",
                        topic: d.topic || "AI Assisted",
                        date: new Date(d.created_at).toLocaleDateString(),
                        status: d.status,
                        aiAnswer: d.answer
                    })));
                } catch (error) {
                    console.error("Failed to fetch doubts:", error);
                }
            }
        };
        fetchDoubts();
    }, [user]);

    const handleGenerateContent = (e) => {
        if (e) e.preventDefault();
        if (!topic) return;
        setIsLoadingContent(true);
        setLearningContent(null);
        setDisplayedSummary('');
        setIsTyping(true);

        setTimeout(() => {
            const dynamic = generateTopicData(topic);
            const fullSummary = `Here's your personalized ${userProfile.learningMode || 'visual'} study plan for "${topic}". Pick from videos, notes, or extra help below!`;

            setLearningContent({
                ...dynamic,
                mode: userProfile.learningMode || 'visual',
                summary: fullSummary,
            });
            setIsLoadingContent(false);

            // Start typing effect
            let i = 0;
            const typeChar = () => {
                if (i < fullSummary.length) {
                    setDisplayedSummary(fullSummary.substring(0, i + 1));
                    i++;
                    setTimeout(typeChar, 20); // Typing speed
                } else {
                    setIsTyping(false);
                }
            };
            typeChar();

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
        playSound('success');

        setTimeout(() => {
            // Get subjects relevant to user - fallback to library only if user hasn't selected any
            let subjects = userProfile.academicData?.subjects || [];
            
            if (subjects.length === 0) {
                subjects = ['Mathematics', 'Physics', 'Chemistry'];
            }

            // Also mix in some general interest topics from library
            const interestTopics = libraryData
                .filter(s => s.type === 'topic')
                .map(s => s.title);
            
            const pool = [...subjects, ...interestTopics.slice(0, 3)];
            const shuffledPool = [...pool].sort(() => 0.5 - Math.random());

            // Define some session variations
            const types = ['Focus', 'Practical', 'Interactive', 'Review', 'Deep Work'];
            const priorities = ['High', 'Medium', 'Low'];

            // Pick a set of time slots
            const morningSlots = ['09:00 AM', '10:00 AM', '11:00 AM'];
            const afternoonSlots = ['02:00 PM', '03:00 PM', '04:00 PM'];
            const eveningSlots = ['06:00 PM', '07:00 PM', '08:00 PM'];

            const selectedTimeSlots = [...morningSlots, ...afternoonSlots, ...eveningSlots];

            const newSchedule = selectedTimeSlots.map((time, index) => {
                // Every 3rd slot is a break/rest
                if ((index + 1) % 3 === 0) {
                    return {
                        id: Math.random(),
                        time,
                        task: 'Cognitive Rest & Sync',
                        priority: 'Low',
                        status: 'Upcoming',
                        type: 'Rest'
                    };
                }

                const subject = shuffledPool[index % shuffledPool.length];
                return {
                    id: Math.random(),
                    time,
                    task: `${subject} Masterclass`,
                    priority: priorities[Math.floor(Math.random() * priorities.length)],
                    status: 'Upcoming',
                    type: types[Math.floor(Math.random() * types.length)]
                };
            });

            setSchedule(newSchedule);
            setIsOptimizing(false);
        }, 1800);
    };

    const handleAddSchedule = () => {
        setTempScheduleItem({
            id: Math.random(),
            time: '09:00 AM',
            task: 'New Study Session',
            priority: 'Medium',
            status: 'Upcoming',
            type: 'Focus'
        });
        setIsEditingSchedule('add');
    };

    const handleRemoveSchedule = (id) => {
        if (confirm('Are you sure you want to remove this session?')) {
            playSound('click');
            setSchedule(prev => prev.filter(item => item.id !== id));
        }
    };

    const toggleTaskCompletion = (id) => {
        setSchedule(prev => prev.map(item => {
            if (item.id === id) {
                const isNowCompleted = item.status !== 'Completed';
                if (isNowCompleted) playSound('success');
                return { ...item, status: isNowCompleted ? 'Completed' : 'Upcoming' };
            }
            return item;
        }));
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
        <div className="view-container animate-fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Hi {user?.name.split(' ')[0] || 'Scholar'}! 👋</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>
                        Welcome back to your <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>{userProfile?.academicData?.college || userProfile?.academicData?.level || 'Academic'}</span> Success Center.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <div className="badge active" style={{ background: 'rgba(129, 140, 248, 0.1)', color: 'var(--primary-color)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.65rem' }}>
                            OFFICIAL STUDENT HQ
                        </div>
                        <div className="badge success" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.65rem' }}>
                            <ShieldCheck size={12} /> SECURE ACCESS
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className="badge active" style={{ marginBottom: '0.5rem' }}><Clock size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SYSTEM STATUS: OPTIMAL</p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* 1. Today's Master Plan */}
                <div className="card cognitive-card">
                    <div className="card-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Calendar className="icon-purple" />
                            <h3>Today's Master Plan</h3>
                        </div>
                        <button onClick={() => setActiveTab('timetable')} className="btn-text" style={{ fontSize: '0.8rem', color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer' }}>View Full →</button>
                    </div>
                    <div className="schedule-list">
                        {schedule.slice(0, 3).map((item, idx) => (
                            <div key={idx} className={`schedule-item ${idx === 0 ? 'active' : ''}`}>
                                <div className="schedule-time">{item.time}</div>
                                <div className="schedule-details">
                                    <h4>{item.task}</h4>
                                    <p>{item.type} • {item.priority} Priority</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Live Cognitive Stats */}
                <div className="card quick-stats">
                    <div className="card-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Brain className="icon-purple" />
                            <h3>Cognitive Metrics</h3>
                        </div>
                    </div>
                    <div className="mini-stat">
                        <div className="stat-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--success-color)' }}><Target /></div>
                        <div className="stat-info"><h4>Readiness</h4><p>84%</p></div>
                    </div>
                    <div className="mini-stat">
                        <div className="stat-icon" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-color)' }}><TrendingUp /></div>
                        <div className="stat-info"><h4>Focus Level</h4><p>Optimal</p></div>
                    </div>
                </div>

                {/* 3. AI Learning Bar relocated side-by-side with Quick Actions */}
                <div className={`card learning-card ${learningContent ? 'expanded' : ''}`}>
                    <div className="card-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Brain className="icon-purple" size={24} />
                            <div>
                                <h3 style={{ fontSize: '1rem' }}>Instant Learning Lab</h3>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '400' }}>Generate study guides.</p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={(e) => { playSound('click'); handleGenerateContent(e); }} className="learning-input-container">
                        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                            <Search size={16} style={{ marginLeft: '12px', color: 'var(--text-muted)' }} />
                            <input
                                className="learning-input"
                                placeholder="Topic? (e.g. Algebra)..."
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', fontSize: '0.85rem' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 1.25rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                            {isLoadingContent ? '...' : 'Go!'}
                        </button>
                    </form>
                    {learningContent && (
                        <div className="animate-fade-in" style={{ marginTop: '1.5rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.01)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{learningContent.title}</h4>
                                    <span className="badge active" style={{ fontSize: '0.6rem' }}>{learningContent.mode?.toUpperCase()}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
                                    {displayedSummary.slice(0, 150)}...
                                </p>
                                <button onClick={() => { playSound('click'); setIsSimulating(true); }} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                                    START SESSION
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. Quick Action Cards */}
                <div className="card quick-stats">
                    <div className="card-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Zap className="icon-purple" />
                            <h3>Quick Actions</h3>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
                        <div onClick={() => setActiveTab('mentor')} className="card glass hover-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
                            <MessageSquare size={20} style={{ marginBottom: '0.5rem', color: 'var(--primary-color)', alignSelf: 'center' }} />
                            <p style={{ fontSize: '0.65rem', fontWeight: '800' }}>ASK MENTOR</p>
                        </div>
                        <div onClick={() => setActiveTab('doubts')} className="card glass hover-card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: 0 }}>
                            <Flame size={20} style={{ marginBottom: '0.5rem', color: '#f97316', alignSelf: 'center' }} />
                            <p style={{ fontSize: '0.65rem', fontWeight: '800' }}>SAVE DOUBT</p>
                        </div>
                    </div>
                </div>
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
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => { playSound('click'); handleAddSchedule(); }} className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                        <List size={18} style={{ marginRight: '8px' }} /> ADD SESSION
                    </button>
                    <button onClick={() => { playSound('click'); handleOptimizeSchedule(); }} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                        <RefreshCw size={18} style={{ marginRight: '8px' }} /> UPDATE PLAN
                    </button>
                </div>
            </div>
            <div className="schedule-grid" style={{ opacity: isOptimizing ? 0.6 : 1, transition: 'opacity 0.3s ease' }}>
                {isOptimizing ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--glass-border)' }}>
                        <RefreshCw size={48} className="icon-purple animate-spin" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>AI Optimizing Your Plan...</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Analyzing focus metrics and subject weights</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={schedule.map(i => i.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {schedule.map((item) => (
                                <SortableScheduleItem
                                    key={item.id}
                                    item={item}
                                    onEdit={(it) => { setTempScheduleItem({ ...it }); setIsEditingSchedule('edit'); }}
                                    onRemove={handleRemoveSchedule}
                                    toggleTaskCompletion={toggleTaskCompletion}
                                    playSound={playSound}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );

    const renderLibrary = () => (
        <div className="view-container animate-fade-in" onClick={() => isLibraryDropdownOpen && setIsLibraryDropdownOpen(false)}>
            <div className="view-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <BookOpen size={40} className="icon-purple" />
                    <div>
                        <h2 className="view-title">Knowledge Library</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>AI-curated learning paths and resources.</p>
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); playSound('click'); setIsLibraryDropdownOpen(!isLibraryDropdownOpen); }}
                        className="btn glass hover-card"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '16px',
                            border: '1px solid var(--glass-border)',
                            color: 'white',
                            minWidth: '200px',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={18} color="var(--primary-color)" />
                            <span style={{ fontWeight: '600' }}>{filterCategory}</span>
                        </div>
                        <ChevronDown size={18} style={{ transform: isLibraryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                    </button>

                    {isLibraryDropdownOpen && (
                        <div className="nav-dropdown animate-scale-in" style={{
                            top: 'calc(100% + 10px)',
                            right: 0,
                            minWidth: '220px',
                            padding: '0.5rem',
                            display: 'block'
                        }}>
                            {['All', ...((userProfile.academicData?.subjects || ['Mathematics', 'Physics']).filter(s => libraryData.some(lib => lib.title === s)))].map(cat => (
                                <div
                                    key={cat}
                                    className={`dropdown-item ${filterCategory === cat ? 'active' : ''}`}
                                    onClick={() => {
                                        playSound('click');
                                        setFilterCategory(cat);
                                        setIsLibraryDropdownOpen(false);
                                    }}
                                >
                                    <span>{cat}</span>
                                    {filterCategory === cat && <CheckCircle size={14} color="var(--primary-color)" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recommended Path Banner */}
            <div className="card" style={{ background: 'var(--premium-gradient)', color: 'white', padding: '2.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', filter: 'blur(100px)', translate: '50% -50%' }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.75rem', fontWeight: '700' }}>🎯 AI RECOMMENDED PATH</span>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Master {userProfile.academicData?.subjects?.[0] || 'Fundamentals'}</h2>
                    <p style={{ opacity: 0.9, maxWidth: '600px', fontSize: '1.05rem', lineHeight: '1.5' }}>Based on your {userProfile.academicData?.level} curriculum, this curated 3-step masterclass will improve your proficiency by an estimated +15%.</p>
                </div>
                <button
                    onClick={() => { playSound('click'); setActiveTab('dashboard'); setTopic('Thermodynamics'); }}
                    className="btn"
                    style={{ background: 'white', color: 'var(--primary-color)', padding: '1rem 2.5rem', borderRadius: '14px', fontWeight: '800', zIndex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                >
                    Start Path
                </button>
            </div>

            <div className="library-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '1.5rem',
                marginTop: '1.5rem'
            }}>
                {libraryData
                    .filter(item => {
                        const isRelevant = item.type === 'topic' || (userProfile.academicData?.subjects || []).includes(item.title) || (userProfile.academicData?.subjects || []).length === 0;
                        return isRelevant && (filterCategory === 'All' || item.title === filterCategory);
                    })
                    .map(subject => (
                        <div key={subject.id} className="card hover-card" style={{ padding: '0', background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, transparent 100%)' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <div className="stat-icon" style={{ borderRadius: '10px', width: '32px', height: '32px', minWidth: '32px' }}><Layers size={16} /></div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.01em' }}>{subject.title}</h3>
                                    </div>
                                    <div className="badge active" style={{ fontSize: '0.65rem', padding: '0.35rem 0.75rem' }}>{subject.videos.length} RESOURCES • AI VERIFIED</div>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                    {subject.videos.map((vid, idx) => (
                                        <a
                                            key={idx}
                                            href={vid.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="glass hover-card"
                                            style={{
                                                border: '1px solid rgba(255,255,255,0.03)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '0.875rem 1rem',
                                                borderRadius: '16px',
                                                textDecoration: 'none',
                                                color: 'white',
                                                transition: 'all 0.3s ease',
                                                background: 'rgba(255, 255, 255, 0.01)'
                                            }}
                                        >
                                            <div style={{ width: '40px', height: '40px', minWidth: '40px', background: 'rgba(129, 140, 248, 0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem' }}>
                                                <PlayCircle size={20} color="var(--primary-color)" />
                                            </div>
                                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                                <h5 style={{ fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{vid.title}</h5>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{idx % 2 === 0 ? 'Video Lecture' : 'Interactive Guide'}</p>
                                                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)' }}></span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning-color)' }}>
                                                        <Star size={10} fill="var(--warning-color)" />
                                                        <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>4.9</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }} />
                                        </a>
                                    ))}
                                </div>
                                <button onClick={() => { playSound('click'); setCurriculumModule(subject); }} className="btn btn-outline" style={{ marginTop: 'auto', width: '100%', borderRadius: '14px', padding: '0.875rem', fontWeight: '700', fontSize: '0.85rem', borderStyle: 'solid', borderColor: 'var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <FileText size={16} /> EXPLORE CURRICULUM
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    const renderPerformance = () => {
        // Calculate dynamic metrics from schedule
        const totalTasks = schedule.length || 1;
        const completedTasks = schedule.filter(t => t.status === 'Completed').length;
        const completionRate = Math.round((completedTasks / totalTasks) * 100);
        
        // Priority weighted focus score
        const highPriorityCompleted = schedule.filter(t => t.priority === 'High' && t.status === 'Completed').length;
        const totalHighPriority = schedule.filter(t => t.priority === 'High').length || 1;
        const focusScore = Math.round((highPriorityCompleted / totalHighPriority) * 100);

        const subjects = userProfile.academicData?.subjects || ['Mathematics', 'Physics', 'Chemistry'];
        const dynamicRadarData = [
            ...subjects.map(s => {
                // Calculate completion rate per subject
                const subjectTasks = schedule.filter(t => t.task.toLowerCase().includes(s.toLowerCase()));
                const done = subjectTasks.filter(t => t.status === 'Completed').length;
                const score = subjectTasks.length > 0 ? (done / subjectTasks.length) * 100 : 40 + Math.random() * 20; // fallback mock for unstarted
                return {
                    subject: s,
                    A: Math.round(score),
                    fullMark: 100
                };
            }),
            { subject: 'Consistency', A: completionRate, fullMark: 100 },
            { subject: 'Intensity', A: focusScore, fullMark: 100 },
        ];

        // Weekly Activity Mock (Real-ish for today)
        const weeklyData = [
            { day: 'Mon', focus: 60, load: 40 },
            { day: 'Tue', focus: 45, load: 30 },
            { day: 'Wed', focus: 85, load: 50 },
            { day: 'Thu', focus: completionRate > 0 ? completionRate : 70, load: totalTasks * 10 },
            { day: 'Fri (Today)', focus: focusScore, load: totalTasks * 12 },
        ];

        return (
            <div className="view-container animate-fade-in">
                <div className="view-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <TrendingUp size={40} className="icon-purple" />
                        <div>
                            <h2 className="view-title">My Progress Analytics</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Real-time data synchronization with your {userProfile.academicData?.level || 'current'} curriculum.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="badge success" style={{ padding: '0.6rem 1.2rem', display: 'flex', gap: '0.6rem', alignItems: 'center', borderRadius: '12px' }}>
                            <ShieldCheck size={16} /> LIVE DATA FEED
                        </div>
                        {userProfile?.academicData?.college && (
                            <div className="badge active" style={{ padding: '0.6rem 1.2rem', display: 'flex', gap: '0.6rem', alignItems: 'center', background: 'rgba(251, 191, 36, 0.05)', color: '#fcd34d', borderColor: 'rgba(251, 191, 36, 0.2)', borderRadius: '12px' }}>
                                <Award size={16} /> CAMPUS RANK: 01
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Completion Rate</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>{completionRate}%</h3>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '1rem' }}>
                            <div style={{ width: `${completionRate}%`, height: '100%', background: 'var(--success-color)', borderRadius: '2px', transition: 'width 1s ease' }}></div>
                        </div>
                    </div>
                    <div className="card glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Focus Intensity</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary-color)' }}>{focusScore}%</h3>
                        <p style={{ fontSize: '0.65rem', color: 'var(--success-color)', marginTop: '0.5rem' }}>🔥 OPTIMIZED STATE</p>
                    </div>
                    <div className="card glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Study Hours</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>{(totalTasks * 1.5).toFixed(1)}h</h3>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>ESTIMATED FOR TODAY</p>
                    </div>
                    <div className="card glass-card" style={{ padding: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Knowledge Velocity</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: '900', color: '#34d399' }}>FAST</h3>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>AI CONFIDENCE: 98%</p>
                    </div>
                </div>

                <div className="perf-grid">
                    {/* Radar Chart: Subject Skills */}
                    <div className="card perf-chart-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h4 className="perf-chart-title" style={{ margin: 0 }}>Subject Mastery Radar</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skill distribution based on task completion.</p>
                            </div>
                            <div className="badge active" style={{ fontSize: '0.6rem' }}>SYNCHRONIZED</div>
                        </div>
                        <div className="chart-container" style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dynamicRadarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} />
                                    <Radar name="Proficiency" dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.4} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart: Weekly Activity */}
                    <div className="card perf-chart-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h4 className="perf-chart-title" style={{ margin: 0 }}>Study Load vs Focus</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily activity patterns and focus benchmarks.</p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>FOCUS</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success-color)' }}></div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>LOAD</span>
                                </div>
                            </div>
                        </div>
                        <div className="chart-container" style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="day" stroke="var(--text-muted)" tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }} 
                                    />
                                    <Bar dataKey="focus" fill="var(--primary-color)" radius={[6, 6, 0, 0]} barSize={30} />
                                    <Bar dataKey="load" fill="var(--success-color)" radius={[6, 6, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Progress Timeline / Velocity */}
                <div className="card glass-card" style={{ marginTop: '1.5rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h4 style={{ margin: 0, fontWeight: '800' }}>Daily Knowledge Velocity</h4>
                        <span style={{ color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: '700' }}>+12.5% GROWTH CURVE</span>
                    </div>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { t: '09:00 AM', velocity: 10 },
                                { t: '11:00 AM', velocity: 45 },
                                { t: '01:00 PM', velocity: 30 },
                                { t: '03:00 PM', velocity: 85 },
                                { t: '05:00 PM', velocity: completionRate },
                                { t: '07:00 PM', velocity: focusScore },
                            ]}>
                                <defs>
                                    <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                                <Area type="monotone" dataKey="velocity" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorVelocity)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
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
            { id: 'academic', title: 'Academic Profile', icon: <GraduationCap />, desc: 'Update your level, college and subjects', color: '#6366f1' },
            { id: 'appearance', title: 'Appearance & Theme', icon: <Zap />, desc: 'Customize theme colors and effects', color: '#f472b6' },
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
                                        themeColor: '#818cf8',
                                        avatarSeed: Math.random().toString(36).substring(7)
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

                {activeSettingsCategory && (
                    <div className="modal-overlay animate-fade-in" style={{ zIndex: 3000 }}>
                        <div className="card glass settings-prompt-card">
                            <button className="prompt-close-btn" onClick={() => setActiveSettingsCategory(null)}><X size={24} /></button>

                            {activeSettingsCategory === 'account' && (
                                <div className="prompt-content">
                                    <div className="prompt-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                        <div className="prompt-icon-bg" style={{ background: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', margin: '0 auto 1rem' }}><User size={24} /></div>
                                        <h3 className="prompt-title">Profile Settings</h3>
                                    </div>
                                    <div className="profile-edit-section">
                                        <div className="avatar-preview-wrapper" style={{ position: 'relative' }}>
                                            <div className="settings-avatar-large" style={{
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'var(--primary-color)15',
                                                border: `2px solid var(--primary-color)40`,
                                                borderRadius: '24px',
                                                width: '100px',
                                                height: '100px'
                                            }}>
                                                <img
                                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${settingsForm.avatarSeed || 'default'}`}
                                                    alt="Avatar"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    playSound('click');
                                                    setSettingsForm({ ...settingsForm, avatarSeed: Math.random().toString(36).substring(7) });
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: -2,
                                                    right: -2,
                                                    background: 'var(--primary-color)',
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '4px solid #111',
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                    zIndex: 10
                                                }}
                                                className="hover-scale"
                                            >
                                                <RefreshCw size={16} color="white" />
                                            </button>
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

                            {activeSettingsCategory === 'academic' && (
                                <div className="prompt-content">
                                    <div className="prompt-header" style={{ justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
                                        <div className="prompt-icon-bg" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', margin: '0 auto 1rem' }}><GraduationCap size={24} /></div>
                                        <h3 className="prompt-title">Academic Profile</h3>
                                    </div>
                                    <div className="profile-edit-section">
                                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div className="input-group">
                                                <label>Education Level</label>
                                                <input
                                                    className="settings-input"
                                                    value={userProfile.academicData?.level || ''}
                                                    onChange={e => updateProfile({ academicData: { ...userProfile.academicData, level: e.target.value } })}
                                                    placeholder="e.g. Class 12, B.Tech"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Institution / College</label>
                                                <input
                                                    className="settings-input"
                                                    value={userProfile.academicData?.college || ''}
                                                    onChange={e => updateProfile({ academicData: { ...userProfile.academicData, college: e.target.value } })}
                                                    placeholder="e.g. IIT Delhi"
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Current Subjects (comma separated)</label>
                                                <textarea
                                                    className="settings-input"
                                                    style={{ minHeight: '100px', resize: 'vertical' }}
                                                    value={userProfile.academicData?.subjects?.join(', ') || ''}
                                                    onChange={e => updateProfile({ academicData: { ...userProfile.academicData, subjects: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '') } })}
                                                    placeholder="Mathematics, Physics, Chemistry..."
                                                />
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>These subjects will appear in your AI Timetable and Knowledge Library.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

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

                            {activeSettingsCategory === 'success-saved' && (
                                <div className="prompt-status-content">
                                    <div className="status-icon success-bg"><CheckCircle size={40} /></div>
                                    <h3 className="status-title">Settings Synced!</h3>
                                    <p className="status-desc">Your preferences are now active across all devices.</p>
                                    <button onClick={() => setActiveSettingsCategory(null)} className="btn btn-primary status-btn">Return to Hub</button>
                                </div>
                            )}

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

    const renderMentor = () => {
        const activeSession = mentorSessions.find(s => s.id === activeMentorSessionId) || mentorSessions[0];

        return (
            <div className="view-container animate-fade-in">
                <div className="view-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <MessageSquare size={40} className="icon-purple" />
                        <div>
                            <h2 className="view-title">AI Study Mentor</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Get instant explanations and guidance.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '14px' }}>
                        {['Strict', 'Friendly', 'Expert'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => { playSound('click'); setMentorMode(mode.toLowerCase()); }}
                                className={`btn ${mentorMode === mode.toLowerCase() ? 'btn-primary' : ''}`}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px' }}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', height: '650px', alignItems: 'stretch' }}>
                    {/* Chat Sidebar */}
                    <div className="card glass-card" style={{ width: '280px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input 
                                placeholder="Search chats..." 
                                value={mentorSearchQuery}
                                onChange={e => setMentorSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    padding: '0.6rem 1rem 0.6rem 2.2rem',
                                    borderRadius: '10px',
                                    fontSize: '0.8rem',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        
                        <button 
                            className="btn btn-outline" 
                            onClick={createNewMentorSession}
                            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', display: 'flex', alignItems: 'center', padding: '0.8rem', borderRadius: '12px', background: 'rgba(129, 140, 248, 0.05)', border: '1px solid rgba(129, 140, 248, 0.2)' }}
                        >
                            <MessageCircle size={18} /> NEW CHAT
                        </button>
                        
                        <div className="library-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '0.5rem' }}>
                            {/* Grouping Logic */}
                            {[
                                { label: 'Today', filter: (s) => (Date.now() - s.lastActive) < 24 * 60 * 60 * 1000 },
                                { label: 'Previous Chats', filter: (s) => (Date.now() - s.lastActive) >= 24 * 60 * 60 * 1000 }
                            ].map(group => {
                                const sessions = mentorSessions
                                    .filter(group.filter)
                                    .filter(s => s.title.toLowerCase().includes(mentorSearchQuery.toLowerCase()));
                                
                                if (sessions.length === 0) return null;

                                return (
                                    <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'rgba(129, 140, 248, 0.6)', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '0.5rem' }}>{group.label}</p>
                                        {sessions.map(session => (
                                            <div 
                                                key={session.id} 
                                                onClick={() => setActiveMentorSessionId(session.id)}
                                                className={`session-item ${activeMentorSessionId === session.id ? 'active' : ''}`}
                                                style={{
                                                    padding: '0.8rem 1rem',
                                                    borderRadius: '14px',
                                                    cursor: 'pointer',
                                                    background: activeMentorSessionId === session.id ? 'linear-gradient(90deg, rgba(129, 140, 248, 0.15) 0%, transparent 100%)' : 'transparent',
                                                    border: activeMentorSessionId === session.id ? '1px solid rgba(129, 140, 248, 0.3)' : '1px solid transparent',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    gap: '0.5rem',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {activeMentorSessionId === session.id && (
                                                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--primary-color)' }}></div>
                                                )}
                                                
                                                {editingMentorSessionId === session.id ? (
                                                    <input 
                                                        autoFocus
                                                        value={editingMentorSessionTitle}
                                                        onChange={e => setEditingMentorSessionTitle(e.target.value)}
                                                        onBlur={() => saveMentorSessionTitle(session.id)}
                                                        onKeyPress={e => e.key === 'Enter' && saveMentorSessionTitle(session.id)}
                                                        style={{
                                                            background: 'rgba(0,0,0,0.3)',
                                                            border: 'none',
                                                            color: 'white',
                                                            fontSize: '0.85rem',
                                                            padding: '0',
                                                            width: '100%',
                                                            outline: 'none'
                                                        }}
                                                        onClick={e => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <>
                                                        <span style={{ 
                                                            fontSize: '0.85rem', 
                                                            color: activeMentorSessionId === session.id ? 'white' : 'var(--text-muted)', 
                                                            fontWeight: activeMentorSessionId === session.id ? '600' : '400',
                                                            overflow: 'hidden', 
                                                            textOverflow: 'ellipsis', 
                                                            whiteSpace: 'nowrap', 
                                                            maxWidth: '140px' 
                                                        }}>
                                                            {session.title}
                                                        </span>
                                                        <div style={{ display: 'flex', gap: '0.4rem', opacity: activeMentorSessionId === session.id ? 1 : 0, transition: 'opacity 0.2s' }}>
                                                            <button 
                                                                onClick={(e) => startEditingMentorSession(session, e)}
                                                                className="btn-icon"
                                                                style={{ color: 'var(--text-muted)', padding: '4px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }}
                                                            >
                                                                <Edit size={12} />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => deleteMentorSession(session.id, e)}
                                                                className="btn-icon"
                                                                style={{ color: '#f87171', padding: '4px', borderRadius: '6px', background: 'rgba(248, 113, 113, 0.05)' }}
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                            
                            {mentorSessions.filter(s => s.title.toLowerCase().includes(mentorSearchQuery.toLowerCase())).length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    No chats found matching "{mentorSearchQuery}"
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="library-scroll">
                            {activeSession.messages.map((msg, i) => (
                                <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                    <div style={{
                                        background: msg.sender === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        padding: '1rem 1.5rem',
                                        borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)'
                                    }}>
                                        {msg.modeAnswers ? (
                                            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                                {formatMessage(msg.modeAnswers[mentorMode] || msg.text)}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                                {formatMessage(msg.text)}
                                            </p>
                                        )}
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.5)' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                                <input
                                    className="learning-input"
                                    placeholder="Ask mentor anything..."
                                    value={mentorInput}
                                    onChange={e => setMentorInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleMentorSend()}
                                    style={{
                                        flex: 1,
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        padding: '1rem 3.5rem 1rem 1.5rem',
                                        borderRadius: '16px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border 0.2s ease',
                                        margin: 0
                                    }}
                                />
                                <button
                                    onClick={handleMentorSend}
                                    className="btn btn-primary btn-icon hover-scale"
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: 'calc(100% - 1rem)',
                                        width: '3.5rem',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleMentorSend = async () => {
        if (!mentorInput.trim()) return;
        playSound('click');

        const currentActiveId = activeMentorSessionId;
        const activeSession = mentorSessions.find(s => s.id === currentActiveId);
        
        const userMsg = { sender: 'user', text: mentorInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        
        // Update local session messages
        setMentorSessions(prev => prev.map(s => 
            s.id === currentActiveId ? { ...s, messages: [...s.messages, userMsg], lastActive: Date.now() } : s
        ));

        const currentInput = mentorInput;
        setMentorInput('');

        try {
            const { data } = await axios.post(`${BASE_URL}/api/ai/mentor`, {
                message: currentInput,
                history: activeSession.messages.slice(-8)
            });

            const aiMsg = {
                sender: 'mentor',
                modeAnswers: data,
                text: data[mentorMode] || data.text || "Perspective generated.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMentorSessions(prev => prev.map(s => 
                s.id === currentActiveId ? { ...s, messages: [...s.messages, aiMsg], lastActive: Date.now() } : s
            ));
            
            // If it's the first message from user, rename the session
            if (activeSession.messages.length <= 1) {
                setMentorSessions(prev => prev.map(s => 
                    s.id === currentActiveId ? { ...s, title: currentInput.slice(0, 30) + (currentInput.length > 30 ? '...' : '') } : s
                ));
            }

            playSound('success');
        } catch (error) {
            console.error("AI Mentor error:", error);
            const errorMsg = {
                sender: 'mentor',
                text: "My neural link is flickering. Please try again or check your API key.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMentorSessions(prev => prev.map(s => 
                s.id === currentActiveId ? { ...s, messages: [...s.messages, errorMsg] } : s
            ));
        }
    };

    const createNewMentorSession = () => {
        playSound('click');
        const newId = 'session-' + Date.now();
        const newSession = {
            id: newId,
            title: 'New Chat',
            messages: [
                { sender: 'mentor', text: "New session started. What shall we learn today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ],
            lastActive: Date.now()
        };
        setMentorSessions(prev => [newSession, ...prev]);
        setActiveMentorSessionId(newId);
    };

    const deleteMentorSession = (id, e) => {
        e.stopPropagation();
        playSound('click');
        if (mentorSessions.length === 1) {
            createNewMentorSession();
        }
        setMentorSessions(prev => prev.filter(s => s.id !== id));
        if (activeMentorSessionId === id) {
            setActiveMentorSessionId(mentorSessions[0].id);
        }
    };

    const startEditingMentorSession = (session, e) => {
        e.stopPropagation();
        setEditingMentorSessionId(session.id);
        setEditingMentorSessionTitle(session.title);
    };

    const saveMentorSessionTitle = (id) => {
        setMentorSessions(prev => prev.map(s => 
            s.id === id ? { ...s, title: editingMentorSessionTitle || 'Untitled Chat' } : s
        ));
        setEditingMentorSessionId(null);
        playSound('success');
    };

    const handleCompanionSend = async () => {
        if (!companionInput.trim() || chatLocked) return;
        playSound('click');
        const userMsg = { sender: 'user', text: companionInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setCompanionMessages(prev => [...prev, userMsg]);
        const currentInput = companionInput;
        setCompanionInput('');

        try {
            const { data } = await axios.post(`${BASE_URL}/api/ai/companion`, {
                message: currentInput,
                history: companionMessages.slice(-8)
            });

            setCompanionMessages(prev => [...prev, {
                sender: 'companion',
                text: data.text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            playSound('success');
        } catch (error) {
            console.error("AI Companion error:", error);
            setCompanionMessages(prev => [...prev, {
                sender: 'companion',
                text: "I'm having trouble connecting to your persona. Let's try again in a moment!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    };

    const renderCompanion = () => (
        <div className="view-container animate-fade-in">
            {!isConsentGiven ? (
                <div className="card" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '4rem' }}>
                    <div className="stat-icon" style={{ margin: '0 auto 2rem', width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
                        <Heart size={40} />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Emotional Companion</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        This feature allows parents to create a uniquely tailored support persona.
                        Parental consent is required to process text prompts for simulation.
                    </p>
                    <button
                        onClick={() => { playSound('success'); setIsConsentGiven(true); localStorage.setItem('companion-consent', 'true'); }}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.25rem', borderRadius: '16px' }}
                    >
                        AGREE & SETUP COMPANION
                    </button>
                </div>
            ) : (
                <div className="card" style={{ height: '700px', display: 'flex', flexDirection: 'column', padding: 0 }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Heart size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Mom AI Persona</h3>
                                <p style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online & Monitoring</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => { playSound('click'); setIsLinkPortalOpen(!isLinkPortalOpen); }}
                            className={`btn btn-icon ${isLinkPortalOpen ? 'active' : ''}`}
                            style={{ 
                                background: isLinkPortalOpen ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                                color: isLinkPortalOpen ? '#f43f5e' : '#94a3b8',
                                borderRadius: '12px',
                                border: isLinkPortalOpen ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent'
                            }}
                            title="Toggle Link Portal"
                        >
                            <Globe size={20} />
                        </button>
                        <button onClick={() => setChatLocked(!chatLocked)} className={`btn ${chatLocked ? 'btn-danger' : 'btn-outline'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                            {chatLocked ? <Lock size={16} /> : <TrendingUp size={16} />} Focus Mode
                        </button>
                    </div>
                    <AnimatePresence>
                        {isLinkPortalOpen && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden' }}
                            >
                                {/* Global Link Portal */}
                                {!chatLocked && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem', padding: '1.5rem', background: 'rgba(244, 63, 94, 0.03)', borderRadius: '24px', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: '900', color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '2px' }}>🌐 Global Link Portal</p>
                                            <div className="badge active" style={{ fontSize: '0.6rem' }}>80+ LINKS LOADED</div>
                                        </div>
                                        
                                        {/* Direct URL Input */}
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input 
                                                type="text" 
                                                placeholder="Type any website (e.g. apple.com) and press Enter..." 
                                                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: '12px', color: 'white', fontSize: '0.8rem' }}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && e.target.value) {
                                                        let url = e.target.value.trim();
                                                        if (!url.startsWith('http')) url = 'https://' + url;
                                                        window.open(url, '_blank');
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.75rem' }}>GO</button>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }} className="library-scroll">
                                            {[
                                                // SOCIAL
                                                { name: 'YouTube', url: 'https://youtube.com', color: '#ff0000' },
                                                { name: 'Instagram', url: 'https://instagram.com', color: '#e4405f' },
                                                { name: 'Twitter (X)', url: 'https://twitter.com', color: '#000000' },
                                                { name: 'Facebook', url: 'https://facebook.com', color: '#1877f2' },
                                                { name: 'LinkedIn', url: 'https://linkedin.com', color: '#0a66c2' },
                                                { name: 'Reddit', url: 'https://reddit.com', color: '#ff4500' },
                                                { name: 'Discord', url: 'https://discord.com', color: '#5865f2' },
                                                { name: 'WhatsApp', url: 'https://web.whatsapp.com', color: '#25d366' },
                                                { name: 'Telegram', url: 'https://web.telegram.org', color: '#0088cc' },
                                                { name: 'Snapchat', url: 'https://snapchat.com', color: '#fffc00' },
                                                { name: 'Threads', url: 'https://threads.net', color: '#ffffff' },
                                                { name: 'Pinterest', url: 'https://pinterest.com', color: '#bd081c' },
                                                { name: 'TikTok', url: 'https://tiktok.com', color: '#ff0050' },
                                                { name: 'Tumblr', url: 'https://tumblr.com', color: '#35465c' },
                                                { name: 'Mastodon', url: 'https://mastodon.social', color: '#6364ff' },

                                                // AI & TECH
                                                { name: 'ChatGPT', url: 'https://chat.openai.com', color: '#10a37f' },
                                                { name: 'Claude AI', url: 'https://claude.ai', color: '#d97757' },
                                                { name: 'Gemini', url: 'https://gemini.google.com', color: '#4285f4' },
                                                { name: 'Perplexity', url: 'https://perplexity.ai', color: '#20b2aa' },
                                                { name: 'Hugging Face', url: 'https://huggingface.co', color: '#ffbd2e' },
                                                { name: 'Midjourney', url: 'https://midjourney.com', color: '#ffffff' },
                                                { name: 'GitHub', url: 'https://github.com', color: '#ffffff' },
                                                { name: 'Stack Overflow', url: 'https://stackoverflow.com', color: '#f48024' },
                                                { name: 'LeetCode', url: 'https://leetcode.com', color: '#ffa116' },
                                                { name: 'HackerRank', url: 'https://hackerrank.com', color: '#2ec866' },
                                                { name: 'CodePen', url: 'https://codepen.io', color: '#ffffff' },
                                                { name: 'Dev.to', url: 'https://dev.to', color: '#ffffff' },
                                                { name: 'MDN Docs', url: 'https://developer.mozilla.org', color: '#ffffff' },
                                                { name: 'Vercel', url: 'https://vercel.com', color: '#ffffff' },
                                                { name: 'Netlify', url: 'https://netlify.com', color: '#00c7b7' },
                                                { name: 'Product Hunt', url: 'https://producthunt.com', color: '#da552f' },

                                                // STUDY & ED
                                                { name: 'Notion', url: 'https://notion.so', color: '#ffffff' },
                                                { name: 'Medium', url: 'https://medium.com', color: '#ffffff' },
                                                { name: 'Wikipedia', url: 'https://wikipedia.org', color: '#ffffff' },
                                                { name: 'Coursera', url: 'https://coursera.org', color: '#0056d2' },
                                                { name: 'Udemy', url: 'https://udemy.com', color: '#a435f0' },
                                                { name: 'Khan Academy', url: 'https://khanacademy.org', color: '#14bf96' },
                                                { name: 'edX', url: 'https://edx.org', color: '#02262b' },
                                                { name: 'Duolingo', url: 'https://duolingo.com', color: '#58cc02' },
                                                { name: 'Brilliant', url: 'https://brilliant.org', color: '#00a9e0' },
                                                { name: 'WolframAlpha', url: 'https://wolframalpha.com', color: '#ff7e00' },
                                                { name: 'Google Scholar', url: 'https://scholar.google.com', color: '#4285f4' },
                                                { name: 'JSTOR', url: 'https://jstor.org', color: '#9d1b1c' },

                                                // ENTERTAINMENT
                                                { name: 'Netflix', url: 'https://netflix.com', color: '#e50914' },
                                                { name: 'Prime Video', url: 'https://primevideo.com', color: '#00a8e1' },
                                                { name: 'Disney+', url: 'https://disneyplus.com', color: '#113ccf' },
                                                { name: 'Hotstar', url: 'https://hotstar.com', color: '#001524' },
                                                { name: 'HBO Max', url: 'https://max.com', color: '#ffffff' },
                                                { name: 'Twitch', url: 'https://twitch.tv', color: '#9146ff' },
                                                { name: 'Kick', url: 'https://kick.com', color: '#53fc18' },
                                                { name: 'Spotify', url: 'https://spotify.com', color: '#1db954' },
                                                { name: 'SoundCloud', url: 'https://soundcloud.com', color: '#ff3300' },
                                                { name: 'Apple Music', url: 'https://music.apple.com', color: '#fa243c' },
                                                { name: 'Steam', url: 'https://steampowered.com', color: '#171a21' },
                                                { name: 'Epic Games', url: 'https://epicgames.com', color: '#ffffff' },
                                                { name: 'Roblox', url: 'https://roblox.com', color: '#ffffff' },

                                                // LIFE & SHOPPING
                                                { name: 'Amazon', url: 'https://amazon.com', color: '#ff9900' },
                                                { name: 'Flipkart', url: 'https://flipkart.com', color: '#2874f0' },
                                                { name: 'eBay', url: 'https://ebay.com', color: '#86b817' },
                                                { name: 'Myntra', url: 'https://myntra.com', color: '#ff3f6c' },
                                                { name: 'Nike', url: 'https://nike.com', color: '#ffffff' },
                                                { name: 'BookMyShow', url: 'https://bookmyshow.com', color: '#f84464' },
                                                { name: 'Ticketmaster', url: 'https://ticketmaster.com', color: '#026cdf' },
                                                { name: 'Uber', url: 'https://uber.com', color: '#ffffff' },
                                                { name: 'Ola', url: 'https://olacabs.com', color: '#d4ed3d' },
                                                { name: 'Airbnb', url: 'https://airbnb.com', color: '#ff5a5f' },
                                                { name: 'Expedia', url: 'https://expedia.com', color: '#00355f' },

                                                // TOOLS & UTILS
                                                { name: 'Gmail', url: 'https://mail.google.com', color: '#ea4335' },
                                                { name: 'Outlook', url: 'https://outlook.com', color: '#0078d4' },
                                                { name: 'Canva', url: 'https://canva.com', color: '#00c4cc' },
                                                { name: 'Figma', url: 'https://figma.com', color: '#f24e1e' },
                                                { name: 'Adobe Express', url: 'https://adobe.com/express', color: '#ff0000' },
                                                { name: 'Remove.bg', url: 'https://remove.bg', color: '#155694' },
                                                { name: 'TinyPNG', url: 'https://tinypng.com', color: '#ffffff' },
                                                { name: 'PDF2Go', url: 'https://pdf2go.com', color: '#f87b0c' },
                                                { name: 'Speedtest', url: 'https://speedtest.net', color: '#0ed8ff' },
                                                { name: 'Google Maps', url: 'https://maps.google.com', color: '#4285f4' },
                                                { name: 'DeepL', url: 'https://deepl.com', color: '#0f2b46' },

                                                // NEWS
                                                { name: 'BBC News', url: 'https://bbc.com/news', color: '#bb1919' },
                                                { name: 'CNN', url: 'https://cnn.com', color: '#cc0000' },
                                                { name: 'The Verge', url: 'https://theverge.com', color: '#e41238' },
                                                { name: 'TechCrunch', url: 'https://techcrunch.com', color: '#02ad4c' },
                                                { name: 'Reuters', url: 'https://reuters.com', color: '#ffffff' }
                                            ].map(link => (
                                                <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="glass hover-card" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', textDecoration: 'none', color: 'white', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: link.color }}></div>
                                                    {link.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: chatLocked ? 'rgba(0,0,0,0.2)' : 'transparent' }}>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="library-scroll">
                            {companionMessages.map((msg, i) => (
                                <div key={i} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                                    <div style={{
                                        background: msg.sender === 'user' ? 'var(--secondary-color)' : 'rgba(244, 63, 94, 0.05)',
                                        color: 'white',
                                        padding: '1rem 1.5rem',
                                        borderRadius: '20px',
                                        border: '1px solid rgba(244, 63, 94, 0.1)'
                                    }}>
                                        <p style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{formatMessage(msg.text)}</p>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.4rem', display: 'block', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(15, 23, 42, 0.5)', borderBottomLeftRadius: '32px', borderBottomRightRadius: '32px' }}>
                            <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
                                <input
                                    className="learning-input"
                                    placeholder={chatLocked ? "Chat is locked for focus..." : "Message your true companion..."}
                                    disabled={chatLocked}
                                    value={companionInput}
                                    onChange={e => setCompanionInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleCompanionSend()}
                                    style={{
                                        flex: 1,
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        padding: '1rem 3.5rem 1rem 1.5rem',
                                        borderRadius: '16px',
                                        color: 'white',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border 0.2s ease',
                                        opacity: chatLocked ? 0.5 : 1
                                    }}
                                />
                                <button
                                    onClick={handleCompanionSend}
                                    className="btn btn-primary btn-icon hover-scale"
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: 'calc(100% - 1rem)',
                                        width: '3.5rem',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--secondary-color)',
                                        borderColor: 'var(--secondary-color)',
                                        opacity: chatLocked ? 0.5 : 1
                                    }}
                                    disabled={chatLocked}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderDoubts = () => (
        <div className="view-container animate-fade-in">
            <div className="view-header">
                <div>
                    <h2 className="view-title">Doubt Recovery</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Never lose a good question. AI powered recovery.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setActiveDoubtTab('saved')} className={`btn ${activeDoubtTab === 'saved' ? 'btn-primary' : 'btn-outline'}`}>Saved</button>
                    <button onClick={() => setActiveDoubtTab('scan')} className={`btn ${activeDoubtTab === 'scan' ? 'btn-primary' : 'btn-outline'}`}>Scan New</button>
                </div>
            </div>
            {activeDoubtTab === 'saved' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {doubts.map(doubt => (
                        <div key={doubt.id} className="card hover-card" style={{ borderLeft: '4px solid #f97316', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div className="badge active">{doubt.subject} // {doubt.topic}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{doubt.date}</span>
                                    <button
                                        onClick={() => {
                                            playSound?.('click');
                                            setPendingDeleteDoubt(doubt);
                                        }}
                                        className="btn-icon"
                                        style={{ color: '#f87171', opacity: 0.6, cursor: 'pointer', background: 'none', border: 'none', padding: 4 }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>{doubt.question}</h4>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{doubt.aiAnswer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', border: '2px dashed var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <div className="icon-purple" style={{ opacity: 0.5 }}><ImageIcon size={48} /></div>
                    <div style={{ maxWidth: '400px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Instant Recovery</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Type the question you're stuck on. Our AI will break it down and save it for your review.</p>
                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            className="learning-input"
                            placeholder="Type your question here..."
                            id="new-doubt-input"
                            onKeyPress={async (e) => {
                                if (e.key === 'Enter') {
                                    const val = e.target.value;
                                    if (!val.trim()) return;
                                    playSound('click');

                                    try {
                                        const { data } = await axios.post(`${BASE_URL}/api/ai/doubt`, {
                                            question: val
                                        });

                                        // Save to database
                                        const userId = user._id || user.id;
                                        const saveRes = await axios.post(`${BASE_URL}/api/doubts/save`, {
                                            userId,
                                            question: val,
                                            answer: data.answer,
                                            subject: data.subject,
                                            topic: data.topic
                                        });

                                        const newDoubt = {
                                            id: saveRes.data.id,
                                            question: val,
                                            subject: data.subject || "General",
                                            topic: data.topic || "AI Assisted",
                                            date: "Just now",
                                            status: "resolved",
                                            aiAnswer: data.answer
                                        };
                                        setDoubts(prev => [newDoubt, ...prev]);
                                        e.target.value = '';
                                        setActiveDoubtTab('saved');
                                        playSound('success');
                                    } catch (error) {
                                        console.error("AI Doubt error:", error);
                                        // Fallback/Error state
                                        const errorDoubt = {
                                            id: Date.now(),
                                            question: val,
                                            subject: "Error",
                                            topic: "System",
                                            date: "Just now",
                                            status: "error",
                                            aiAnswer: "I couldn't solve this right now. Please check your connection or AI configuration."
                                        };
                                        setDoubts(prev => [errorDoubt, ...prev]);
                                        e.target.value = '';
                                        setActiveDoubtTab('saved');
                                    }
                                }
                            }}
                        />
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Press Enter to recover answer</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    </div>

                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem' }}>
                        <UploadCloud size={20} /> UPLOAD PHOTO
                    </button>
                </div>
            )}
        </div>
    );


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
            {isEditingSchedule && (
                <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999, background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)' }}>
                    <div className="card glass-card animate-modal-slide-up" style={{ width: '90%', maxWidth: '500px', padding: '2.5rem', position: 'relative', background: '#0f172a', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
                        <button onClick={() => { playSound('click'); setIsEditingSchedule(false); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-scale"><X size={20} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.75rem', background: isEditingSchedule === 'add' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(129, 140, 248,0.1)', borderRadius: '16px' }}>
                                {isEditingSchedule === 'add' ? <List size={24} color="#34d399" /> : <Edit size={24} color="var(--primary-color)" />}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{isEditingSchedule === 'add' ? 'Add Session' : 'Edit Session'}</h2>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Subject / Task</label>
                                <input
                                    value={tempScheduleItem.task}
                                    onChange={(e) => setTempScheduleItem({ ...tempScheduleItem, task: e.target.value })}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '0.8rem 1rem', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Time Slot</label>
                                    <select
                                        value={tempScheduleItem.time}
                                        onChange={(e) => setTempScheduleItem({ ...tempScheduleItem, time: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(15, 23, 42, 1)', border: '1px solid var(--glass-border)', padding: '0.8rem 1rem', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem', cursor: 'pointer' }}
                                    >
                                        {!TIME_SLOTS.includes(tempScheduleItem.time) && (
                                            <option value={tempScheduleItem.time}>{tempScheduleItem.time} (Current)</option>
                                        )}
                                        {TIME_SLOTS.map(slot => {
                                            const conflict = schedule.find(item => item.time === slot && item.id !== tempScheduleItem.id);
                                            return (
                                                <option
                                                    key={slot}
                                                    value={slot}
                                                    disabled={!!conflict}
                                                    style={{ background: conflict ? 'rgba(255,255,255,0.05)' : 'rgba(15, 23, 42, 1)', color: conflict ? '#64748b' : 'white' }}
                                                >
                                                    {slot} {conflict ? `(Reserved: ${conflict.task})` : '(Available)'}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Priority</label>
                                    <select
                                        value={tempScheduleItem.priority}
                                        onChange={(e) => setTempScheduleItem({ ...tempScheduleItem, priority: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(15, 23, 42, 1)', border: '1px solid var(--glass-border)', padding: '0.8rem 1rem', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem', cursor: 'pointer' }}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Session Type</label>
                                    <input
                                        value={tempScheduleItem.type}
                                        onChange={(e) => setTempScheduleItem({ ...tempScheduleItem, type: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', padding: '0.8rem 1rem', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Status</label>
                                    <select
                                        value={tempScheduleItem.status}
                                        onChange={(e) => setTempScheduleItem({ ...tempScheduleItem, status: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(15, 23, 42, 1)', border: '1px solid var(--glass-border)', padding: '0.8rem 1rem', borderRadius: '12px', color: 'white', outline: 'none', fontSize: '1rem', cursor: 'pointer' }}
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ready">Ready</option>
                                        <option value="Paused">Paused</option>
                                        <option value="Syncing">Syncing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            {scheduleError && (
                                <p style={{ color: 'var(--danger-color)', fontSize: '0.85rem', fontWeight: '700', marginTop: '0.5rem', background: 'rgba(248, 113, 113, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>{scheduleError}</p>
                            )}

                            <button
                                onClick={() => { playSound('click'); handleSaveScheduleEdit(); }}
                                className="btn btn-primary"
                                style={{ marginTop: '1.5rem', padding: '1.1rem', borderRadius: '14px', fontWeight: '800', letterSpacing: '0.05em' }}
                            >
                                {isEditingSchedule === 'add' ? 'ADD SESSION' : 'SAVE CHANGES'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {curriculumModule && (
                <div className="modal-overlay animate-fade-in" style={{ zIndex: 9999, background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)' }}>
                    <div className="card glass-card animate-modal-slide-up" style={{ width: '90%', maxWidth: '650px', maxHeight: '85vh', padding: '3rem', position: 'relative', display: 'flex', flexDirection: 'column', background: '#0f172a', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
                        <button onClick={() => { playSound('click'); setCurriculumModule(null); }} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }} className="hover-scale"><X size={20} /></button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(129, 140, 248,0.1)', borderRadius: '16px' }}><List size={32} color="#818cf8" /></div>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{curriculumModule.title} Curriculum</h2>
                                <p style={{ color: '#94a3b8' }}>Topics you'll learn and milestones to hit.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {curriculumModule.videos.map((vid, idx) => (
                                <a
                                    key={idx}
                                    href={vid.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="nav-item glass"
                                    style={{
                                        padding: '1.25rem',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem',
                                        textDecoration: 'none',
                                        color: 'white',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}
                                >
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <PlayCircle size={18} color="white" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.2rem' }}>{vid.title}</h4>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Advanced Course Module • Module {idx + 1}</p>
                                    </div>
                                    <ExternalLink size={18} color="#64748b" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container" onClick={() => { playSound('click'); navigate('/'); setIsMobileMenuOpen(false); }}>
                        <img src="/rabbit-logo.jpeg" alt="Logo" className="logo-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
                        <span className="app-name">My True Companion</span>
                    </div>
                    <button className="collapse-btn" onClick={() => { playSound('click'); setIsSidebarCollapsed(!isSidebarCollapsed); }}>
                        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                    <button className="mobile-close-btn" onClick={() => { playSound('click'); setIsMobileMenuOpen(false); }}><X size={20} /></button>
                </div>
                <nav className="nav-section">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} title="Dashboard">
                        <Layout size={18} /> <span>Dashboard</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('timetable'); setIsMobileMenuOpen(false); }} title="My Schedule">
                        <Calendar size={18} /> <span>My Schedule</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'library' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('library'); setIsMobileMenuOpen(false); }} title="My Library">
                        <BookOpen size={18} /> <span>My Library</span>
                    </button>
                    <div className="nav-divider"></div>
                    <button className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('performance'); setIsMobileMenuOpen(false); }} title="My Progress">
                        <TrendingUp size={18} /> <span>My Progress</span>
                    </button>
                    <div className="nav-divider"></div>
                    <button className={`nav-item ${activeTab === 'mentor' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('mentor'); setIsMobileMenuOpen(false); }} title="AI Mentor">
                        <MessageSquare size={18} /> <span>AI Mentor</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'companion' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('companion'); setIsMobileMenuOpen(false); }} title="Companion">
                        <Heart size={18} /> <span>Companion</span>
                    </button>
                    <button className={`nav-item ${activeTab === 'doubts' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('doubts'); setIsMobileMenuOpen(false); }} title="Doubts">
                        <Flame size={18} /> <span>Doubts</span>
                    </button>
                    <div className="nav-divider"></div>
                    <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { playSound('click'); setActiveTab('settings'); setIsMobileMenuOpen(false); }} title="Settings">
                        <Settings size={18} /> <span>Settings</span>
                    </button>
                </nav>
            </aside>
            {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
            <main className="main-content">
                <header className="header-bar">
                    <div className="header-left">
                        <button className="mobile-menu-toggle" onClick={() => { playSound('click'); setIsMobileMenuOpen(true); }}>
                            <Menu size={24} />
                        </button>
                        <div className="welcome-text">
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', position: 'relative', width: 'fit-content' }}
                                onClick={(e) => { e.stopPropagation(); playSound('click'); setIsNavDropdownOpen(!isNavDropdownOpen); }}
                                className="section-title-trigger"
                            >
                                <h1 style={{ margin: 0 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                                <ChevronDown
                                    size={24}
                                    style={{
                                        color: 'var(--primary-color)',
                                        transform: isNavDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                        marginTop: '4px'
                                    }}
                                />

                                {isNavDropdownOpen && (
                                    <div className="nav-dropdown animate-scale-in">
                                        {[
                                            { id: 'dashboard', label: 'Dashboard', icon: <Layout size={18} /> },
                                            { id: 'timetable', label: 'My Schedule', icon: <Calendar size={18} /> },
                                            { id: 'library', label: 'Knowledge Library', icon: <BookOpen size={18} /> },
                                            { id: 'performance', label: 'My Progress', icon: <TrendingUp size={18} /> },
                                            { id: 'mentor', label: 'AI Mentor', icon: <MessageSquare size={18} /> },
                                            { id: 'companion', label: 'Companion', icon: <Heart size={18} /> },
                                            { id: 'doubts', label: 'Doubts', icon: <Flame size={18} /> }
                                        ].map(tab => (
                                            <div
                                                key={tab.id}
                                                className={`dropdown-item ${activeTab === tab.id ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playSound('click');
                                                    setActiveTab(tab.id);
                                                    setIsNavDropdownOpen(false);
                                                }}
                                            >
                                                <div className="dropdown-icon-wrapper">{tab.icon}</div>
                                                <span>{tab.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p style={{ marginTop: '0.25rem' }}>Hey there, {user?.name}! 👋 {userProfile?.academicData?.college && <span style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.9rem' }}> // {userProfile.academicData.college}</span>}</p>
                        </div>
                    </div>
                    <div className="user-profile" style={{ position: 'relative' }}>
                        <div className="avatar" onClick={(e) => { e.stopPropagation(); playSound('click'); setIsUserDropdownOpen(!isUserDropdownOpen); }} style={{ overflow: 'hidden', padding: 0, borderRadius: '50%', cursor: 'pointer' }}>
                            <img
                                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${settingsForm.avatarSeed || 'default'}`}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        {isUserDropdownOpen && (
                            <div className="user-dropdown animate-scale-in">
                                <div
                                    className="dropdown-item"
                                    onClick={() => { playSound('click'); setActiveTab('settings'); setIsUserDropdownOpen(false); }}
                                >
                                    <div className="dropdown-icon-wrapper"><Settings size={18} /></div>
                                    <span>Settings</span>
                                </div>
                                <div
                                    className="dropdown-item"
                                    style={{ color: '#f87171' }}
                                    onClick={() => { playSound('click'); setShowLogoutPrompt(true); setIsUserDropdownOpen(false); }}
                                >
                                    <div className="dropdown-icon-wrapper" style={{ background: 'rgba(248, 113, 113, 0.1)' }}><LogOut size={18} /></div>
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </header>
                {activeTab === 'dashboard' && renderOverview()}
                {activeTab === 'timetable' && renderSchedule()}
                {activeTab === 'library' && renderLibrary()}
                {activeTab === 'performance' && renderPerformance()}
                {activeTab === 'mentor' && renderMentor()}
                {activeTab === 'companion' && renderCompanion()}
                {activeTab === 'doubts' && renderDoubts()}
                {activeTab === 'settings' && renderSettings()}
            </main>
            {/* Premium Confirmation Modals */}
            {pendingDeleteDoubt && (
                <div className="modal-overlay animate-fade-in" style={{ zIndex: 10000 }}>
                    <div className="card glass-card animate-modal-slide-up" style={{ width: '90%', maxWidth: '420px', padding: '2.5rem', textAlign: 'center', background: '#0f172a', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(248, 113, 113, 0.1)', color: '#f87171', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertTriangle size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>Delete Doubt?</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            This will permanently remove the record of this question and its AI solution. This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setPendingDeleteDoubt(null)} className="btn btn-outline" style={{ flex: 1 }}>CANCEL</button>
                            <button
                                onClick={async () => {
                                    try {
                                        await axios.delete(`${BASE_URL}/api/doubts/${pendingDeleteDoubt.id}`);
                                        setDoubts(prev => prev.filter(d => d.id !== pendingDeleteDoubt.id));
                                        setPendingDeleteDoubt(null);
                                        playSound?.('success');
                                    } catch (error) {
                                        console.error("Delete failed:", error);
                                        setPendingDeleteDoubt(null);
                                    }
                                }}
                                className="btn btn-primary"
                                style={{ flex: 1, background: '#ef4444', borderColor: '#ef4444' }}
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutPrompt && (
                <div className="modal-overlay animate-fade-in" style={{ zIndex: 10000 }}>
                    <div className="card glass-card animate-modal-slide-up" style={{ width: '90%', maxWidth: '420px', padding: '2.5rem', textAlign: 'center', background: '#0f172a', border: '1px solid rgba(129, 140, 248, 0.2)' }}>
                        <div style={{ width: '80px', height: '80px', background: 'rgba(129, 140, 248, 0.1)', color: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <LogOut size={36} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>Ready to Leave?</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            We've saved all your progress and AI sessions. You can jump back in anytime to continue your journey.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => setShowLogoutPrompt(false)} className="btn btn-outline" style={{ flex: 1 }}>STAY</button>
                            <button onClick={() => { logout(); }} className="btn btn-primary" style={{ flex: 1 }}>LOGOUT</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
