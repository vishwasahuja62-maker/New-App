import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Coffee, Heart, Users, Shield, Globe, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoPage = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();

    const footerData = {
        'assessment': { title: 'How We Understand You', content: 'Our assessment isn\'t just a boring test. It\'s a friendly quiz that helps us see how your mind works—whether you love diagrams, stories, or practice problems.', icon: Brain },
        'learning-path': { title: 'Your Own Road', content: 'We don\'t follow one path. Your schedule changes based on how much energy you have each day.', icon: Sparkles },
        'resources': { title: 'Everything You Need', content: 'We gather the best videos and notes for your subjects so you don\'t have to search for them.', icon: Coffee },
        'about-us': { title: 'Our Story', content: 'We are a group of friends and teachers who think studying should be less stressful and more personal.', icon: Heart },
        'careers': { title: 'Work With Us', content: 'We\'re always looking for creative people to help us build a better way to learn. Send us a message!', icon: Users },
        'privacy-policy': { title: 'Your Data is Private', content: 'We never sell your data. Your results are only used to help you learn better.', icon: Shield },
        'twitter': { title: 'Follow Us', content: 'Check out our Twitter for daily study tips and neural-harmony updates!', icon: Globe },
        'discord': { title: 'Join the Community', content: 'Meet other students and get help with your subjects in our Discord server.', icon: Zap },
        'linkedin': { title: 'Company Updates', content: 'Follow our official page for big announcements and professional partnerships.', icon: Users }
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
