export const phase1Questions = [
    { id: 1, text: "I often feel overwhelmed by daily tasks.", type: "mind_state", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
    { id: 2, text: "Wait, IQ questions here...", type: "iq", options: ["A", "B", "C", "D"], answer: "A" }, // Placeholder for real IQ questions
    { id: 3, text: "I find it easy to understand others' feelings.", type: "eq", options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"] },
    // ... more questions (total 10-15)
];

export const phase2Questions = [
    { id: 1, text: "Which subject do you find most difficult?", type: "subject", options: ["Math", "Science", "History", "Literature", "Art"] },
    { id: 2, text: "How do you prefer to learn new topics?", type: "learning_mode", options: ["Visual (Images, Videos)", "Auditory (Listening, Podcasts)", "Reading/Writing", "Kinesthetic (Hands-on)"] },
    { id: 3, text: "How many hours of sleep do you get on average?", type: "lifestyle", options: ["< 4 hours", "4-6 hours", "6-8 hours", "> 8 hours"] },
];

export const depressionFlags = {
    high_stress_score: 8, // If score >= 8/10
    low_sleep: "< 4 hours"
};
