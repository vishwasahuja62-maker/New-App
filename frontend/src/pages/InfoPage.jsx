import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Coffee, Heart, Users, Shield, Globe, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoPage = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();

    const footerData = {
        'assessment': {
            title: 'How We Understand You',
            content: 'Our assessment goes far beyond a standard quiz. We utilize cognitive science principles to identify your unique learning cognitive architecture. By analyzing how you process information—whether through visual schemas, auditory narratives, or kinesthetic applications—we build a detailed "Neural Blueprint" of your learning style. This 5-minute interactive session also evaluates your current knowledge base and emotional readiness, allowing our AI to tailor every subsequent interaction to your specific needs.',
            icon: Brain
        },
        'learning-path': {
            title: 'Your Adaptive Journey',
            content: 'Forget rigid syllabi. Your learning path is a dynamic, living entity that breathes with you. Our "Neural Flow" algorithm adjusts your schedule in real-time based on your daily energy levels, performance, and retention rates. If you ace a concept, we accelerate. If you struggle, we pivot to a new teaching angle. We break down massive subjects into bite-sized "Micro-Mastery" nodes, turning a daunting mountain of coursework into a series of achievable, rewarding steps.',
            icon: Sparkles
        },
        'resources': {
            title: 'Curated Resource Vault',
            content: 'Stop wasting hours sifting through low-quality tutorials. Our Resource Vault is an AI-curated library of the world\'s best educational content, vetted for accuracy and engagement. From high-definition video breakdowns and interactive 3D models to concise cheat sheets and expert-verified notes, everything you need is instantly accessible. We verify every source, so you can trust that you are learning from the reliable materials, perfectly matched to your syllabus.',
            icon: Coffee
        },
        'about-us': {
            title: 'Our Mission & Story',
            content: 'We started My True Companion because we were tired of the "one-size-fits-all" education system that leaves so many brilliant minds behind. We are a diverse collective of educators, neuroscientists, and AI engineers united by a single purpose: to democratize personalized learning. We believe that burnout is a design flaw, not a user error. Our goal is to build a tool that acts not just as a tutor, but as a compassionate mentor that grows with you.',
            icon: Heart
        },
        'careers': {
            title: 'Join the Revolution',
            content: 'We are building the future of education, and we need visionaries. At My True Companion, we value curiosity over credentials and impact over hours logged. We operate as a fully remote, asynchronous team that respects deep work and creative autonomy. If you are passionate about AI, pedagogy, or simply making the world a smarter place, we want to hear from you. We offer competitive equity, unlimited learning stipends, and the chance to change millions of lives.',
            icon: Users
        },
        'privacy-policy': {
            title: 'Your Privacy is Sacred',
            content: 'In an age of data exploitation, we stand as a fortress for your privacy. We strictly adhere to a "User-First" data policy. Your learning data is encrypted end-to-end and is used solely to enhance your personal learning experience. We never sell, rent, or trade your personal information to third parties. You own your data completely—you can download or delete your entire history at any time with a single click. We are fully GDPR and CCPA compliant.',
            icon: Shield
        },
        'twitter': {
            title: 'Join the Conversation',
            content: 'Follow @MyTrueCompanion for your daily dose of study motivation, neuroscience nuggets, and behind-the-scenes looks at our latest features. We host weekly "Study Space" threads where you can share your setup, ask questions to our engineering team, and connect with a global community of learners. It\'s not just a feed; it\'s a stream of inspiration to keep your academic momentum going.',
            icon: Globe
        },
        'discord': {
            title: 'Your Global Study Group',
            content: 'The journey is easier when you don\'t walk it alone. Our Discord server is a thriving 24/7 campus with over 50,000 active students. Join dedicated channels for your specific subjects, participate in guided "Pomodoro" study sessions with live lo-fi music, or just hang out in the "Break Room" to relax. Our community moderators and expert mentors are always online to help you unstuck specific problems or offer encouragement.',
            icon: Zap
        },
        'linkedin': {
            title: 'Professional Updates',
            content: 'Connect with us on LinkedIn for industry insights, partnership announcements, and professional growth opportunities. We regularly publish deep-dive articles on the intersection of AI and Education, case studies on student success, and opportunities for internships and ambassador programs. Use our network to build your own professional footprint while you learn.',
            icon: Users
        }
    };

    const data = footerData[pageId] || { title: 'Page Not Found', content: 'The page you are looking for does not exist.', icon: Sparkles };
    const Icon = data.icon;

    return (
        <div className="landing-container" style={{ minHeight: '100vh', padding: '2rem' }}>
            {/* Background Elements (copied from LandingPage for consistency) */}
            <div className="bg-blobs">
                <div className="bg-glow-1"></div>
                <div className="bg-glow-2"></div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn btn-outline"
                    style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass"
                    style={{ padding: '3rem', borderRadius: '24px' }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2rem',
                        color: '#a78bfa'
                    }}>
                        <Icon size={40} />
                    </div>

                    <h1 className="hero-headline" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{data.title}</h1>
                    <p className="hero-subtext" style={{ fontSize: '1.1rem', marginBottom: '0' }}>{data.content}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default InfoPage;
