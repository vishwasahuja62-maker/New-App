export const phase1Questions = [
    // Mental State / Stress Assessment
    {
        id: 1,
        text: "Over the last two weeks, how often have you felt little interest or pleasure in doing things?",
        type: "mind_state",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        id: 2,
        text: "How frequently do you feel overwhelmed by your current academic workload?",
        type: "mind_state",
        options: ["Rarely", "Sometimes", "Often", "Constantly"]
    },
    {
        id: 3,
        text: "Do you often feel restless or unable to sit still?",
        type: "mind_state",
        options: ["Never", "Occasionally", "Frequently", "Always"]
    },

    // Emotional Intelligence (EQ)
    {
        id: 4,
        text: "When a friend is upset, I usually...",
        type: "eq",
        options: ["Don't know what to say", "Try to change the subject", "Listen and try to understand their perspective", "Immediately try to fix their problem"]
    },
    {
        id: 5,
        text: "I can tell how someone is feeling just by looking at their facial expression.",
        type: "eq",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
        id: 6,
        text: "When I am under pressure, I remain calm and focused.",
        type: "eq",
        options: ["Rarely", "Sometimes", "Often", "Always"]
    },

    // IQ / Cognitive Pattern (Abstract Reasoning)
    {
        id: 7,
        text: "Which number comes next in the series? 2, 3, 5, 8, 12, ...",
        type: "iq",
        options: ["15", "16", "17", "18"],
        answer: "17" // +1, +2, +3, +4, +5
    },
    {
        id: 8,
        text: "Forest is to Tree as Book is to...",
        type: "iq",
        options: ["Author", "Page", "Library", "Cover"],
        answer: "Page"
    },
    {
        id: 9,
        text: "If all Bloops are Razzies and some Razzies are Zazzles, are all Bloops definitely Zazzles?",
        type: "iq",
        options: ["Yes", "No", "Impossible to tell"],
        answer: "No"
    },
    {
        id: 10,
        text: "Select the odd one out.",
        type: "iq",
        options: ["Triangle", "Square", "Circle", "Rectangle"],
        answer: "Circle" // No corners
    }
];

export const phase2Questions = [
    {
        id: 1,
        text: "Which subject currently causes you the most anxiety?",
        type: "subject",
        options: ["Mathematics & Calculus", "Physics & Chemistry", "Literature & Arts", "History & Social Sciences", "Computer Science"]
    },
    {
        id: 2,
        text: "When studying difficult material, what helps you understand best?",
        type: "learning_mode",
        options: ["Watching diagrams & videos (Visual)", "Listening to explanations (Auditory)", "Reading textbooks (Read/Write)", "Doing practice problems (Kinesthetic)"]
    },
    {
        id: 3,
        text: "How would you describe your current sleep pattern?",
        type: "lifestyle",
        options: ["Consistent (7-9 hours)", "Irregular but sufficient", "Insufficient (< 6 hours)", "Insomnia / Disrupted"]
    },
    {
        id: 4,
        text: "Do you engage in any physical activity or mindfulness practice?",
        type: "lifestyle",
        options: ["Daily", "2-3 times a week", "Rarely", "Never"]
    },
    {
        id: 5,
        text: "What is your preferred environment for studying?",
        type: "lifestyle",
        options: ["Complete silence", "With background music", "In a coffee shop / public space", "In a study group"]
    }
];

export const depressionFlags = {
    high_stress_score: 8,
    low_sleep: "Insufficient (< 6 hours)",
    insomnia: "Insomnia / Disrupted"
};
