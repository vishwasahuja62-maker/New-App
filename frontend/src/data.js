export const phase1Questions = [
    // Well-being Assessment
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

export const phase2Questions = (level, selectedSubjects = []) => {
    const questions = [
        {
            id: "learning_mode",
            text: "When studying difficult material, what helps you understand best?",
            type: "learning_mode",
            options: ["Watching diagrams & videos (Visual)", "Listening to explanations (Auditory)", "Reading textbooks (Read/Write)", "Doing practice problems (Kinesthetic)"]
        },
        {
            id: "lifestyle_1",
            text: "How would you describe your current sleep pattern lately?",
            type: "lifestyle",
            options: ["Consistent (7-9 hours)", "Irregular but sufficient", "Insufficient (< 6 hours)", "Insomnia / Disrupted"]
        },
        {
            id: "lifestyle_2",
            text: "Do you engage in any physical activity or mindfulness practice?",
            type: "lifestyle",
            options: ["Daily", "2-3 times a week", "Rarely", "Never"]
        }
    ];

    // Map questions to selected subjects
    const subjectsToAsk = selectedSubjects && selectedSubjects.length > 0
        ? selectedSubjects
        : (educationData[level]?.subjects || ["Math", "Physics"]);

    subjectsToAsk.slice(0, 3).forEach((subject, idx) => {
        questions.push({
            id: `subject_q_${idx}`,
            text: `In your ${subject} studies, what do you currently struggle with the most?`,
            type: "subject_analysis",
            options: ["Understanding core concepts", "Memorizing definitions", "Applying knowledge to problems", "Maintaining interest"]
        });
    });

    if (level === "College") {
        questions.push({
            id: "college_extra",
            text: "Which of your semester projects feels most daunting right now?",
            type: "lifestyle",
            options: ["Laboratory Work", "Research Papers", "Case Studies", "Final Presentations"]
        });
    }

    return questions;
};

export const wellbeingFlags = {
    high_support_need: 8,
    low_sleep: "Insufficient (< 6 hours)",
    insomnia: "Insomnia / Disrupted"
};

export const educationData = {
    "Class 10": {
        streams: null,
        subjects: ["Mathematics", "Science", "Social Science", "English", "Hindi/Sanskrit", "Information Technology", "Physical Education", "Art & Design"]
    },
    "Class 11": {
        streams: ["PCM (Physics, Chem, Math)", "PCB (Physics, Chem, Bio)", "Commerce", "Humanities/Arts"],
        subjects: {
            "PCM (Physics, Chem, Math)": ["Physics", "Chemistry", "Mathematics", "English", "Computer Science", "Physical Education", "Economics"],
            "PCB (Physics, Chem, Bio)": ["Physics", "Chemistry", "Biology", "English", "Psychology", "Biotechnology", "Physical Education"],
            "Commerce": ["Accountancy", "Business Studies", "Economics", "Mathematics", "English", "Informatics Practices", "Entrepreneurship"],
            "Humanities/Arts": ["History", "Political Science", "Geography", "Sociology", "English", "Psychology", "Legal Studies", "Home Science"]
        }
    },
    "Class 12": {
        streams: ["PCM (Physics, Chem, Math)", "PCB (Physics, Chem, Bio)", "Commerce", "Humanities/Arts"],
        subjects: {
            "PCM (Physics, Chem, Math)": ["Physics", "Chemistry", "Mathematics", "English", "Computer Science", "Physical Education", "Applied Mathematics"],
            "PCB (Physics, Chem, Bio)": ["Physics", "Chemistry", "Biology", "English", "Psychology", "Biotechnology", "Health Care"],
            "Commerce": ["Accountancy", "Business Studies", "Economics", "Mathematics", "English", "Financial Markets", "Informatics Practices"],
            "Humanities/Arts": ["History", "Political Science", "Geography", "Sociology", "English", "Psychology", "Fine Arts", "Mass Media Studies"]
        }
    },
    "College": {
        colleges: [
            "IIT Delhi", "IIT Bombay", "IIT Madras",
            "BITS Pilani", "Delhi University", "VIT University",
            "SRM Institute", "Manipal Academy", "Amity University",
            "IIT Kharagpur", "NIT Trichy", "LPU", "Chandigarh University",
            "Manav Rachna University"
        ],
        streams: ["B.Tech (Engineering)", "B.Sc (Science)", "B.Com (Commerce)", "MBBS (Medical)", "BA (Arts)", "BCA (Computer App)"],
        semesters: ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"],
        subjects: {
            // High-Precision University Specific Mappings
            "IIT Delhi": {
                "B.Tech (Engineering)": {
                    "Semester 1": ["Intro to Computer Programming", "Physics Lab", "Introductory Mathematics", "Analysis-I", "Engineering Visualization"],
                    "Semester 2": ["Data Structures", "Electrical Engineering", "Chemistry Lab", "Calculus & Analysis", "Signal Processing Basics"],
                    "Semester 3": ["Discrete Mathematical Structures", "Computer Architecture", "Signals & Systems", "Logic Design", "Design Practices"],
                    "Semester 4": ["Programming Languages", "Stochastic Processes", "Probability Theory", "Dept Elective-I", "Hardware Lab"],
                    "Semester 5": ["Design and Analysis of Algorithms", "Computer Networks", "Database Management Systems", "Mini Project", "Open Elective-I"],
                    "Semester 6": ["Operating Systems", "Compiler Design", "AI Fundamentals", "Dept Elective-III", "Architecture Lab"],
                    "Semester 7": ["Machine Learning", "Advanced CS Topics", "Cloud Computing", "Technical Communications", "Major Project-I"],
                    "Semester 8": ["Capstone Project", "Industrial Training", "Professional Ethics", "Open Elective-IV", "Research Thesis"]
                }
            },
            "IIT Bombay": {
                "B.Tech (Engineering)": {
                    "Semester 1": ["Calculus", "Linear Algebra", "Intro to Programming", "Physics-I", "Economics for Engineers"],
                    "Semester 2": ["Differential Equations", "Chemistry-I", "Biology Basics", "Digital Electronics", "Programming Lab"],
                    "Semester 3": ["Discrete Structures", "Data Structures", "Numerical Analysis", "Circuits & Systems", "Humanities-I"],
                    "Semester 4": ["Logic Design", "Algorithms", "Software Systems Lab", "Microprocessors", "Communication Skills"],
                    "Semester 5": ["Computer Architecture", "Operating Systems", "Database Systems", "Formal Languages", "AI Foundations"],
                    "Semester 6": ["Computer Networks", "Implementation of Prog. Languages", "Optimization", "Dept Elective-I", "Management-I"],
                    "Semester 7": ["Advanced Algorithms", "Security & Cryptography", "Specialization Elective", "Capstone Project-I", "Lab-VII"],
                    "Semester 8": ["Contemporary CS Topics", "B.Tech Project", "Open Elective-II", "Environmental Studies", "Professional Skills"]
                }
            },
            "IIT Madras": {
                "B.Tech (Engineering)": {
                    "Semester 1": ["Engineering Mathematics-I", "Physics Lab", "Problem Solving & Programming", "Life Skills", "Intro to Engineering"],
                    "Semester 2": ["Engineering Mathematics-II", "Chemistry Lab", "Basic Electrical Engineering", "Humanities-I", "Workshop Practice"],
                    "Semester 3": ["Data Structures & Algorithms", "Programming Lab-I", "Discrete Math", "Digital Logic", "Electric Circuits"],
                    "Semester 4": ["Computer Organization", "Probability & Statistics", "OOP Implementation Lab", "Signals & Systems", "Device Electronics"],
                    "Semester 5": ["Operating Systems", "Formal Languages", "Theory of Computation", "Design Lab-I", "Database Systems"],
                    "Semester 6": ["Compiler Design", "Paradigms of Programming", "Computer Networks", "AI & Knowledge Rep", "Design Lab-II"],
                    "Semester 7": ["Humanities Elective", "Machine Learning", "Mobile Computing", "Technical Seminar", "Minor Project"],
                    "Semester 8": ["Professional Ethics", "Open Elective", "Technical Elective", "Internship", "Final Year Project"]
                }
            },
            "BITS Pilani": {
                "B.Tech (Engineering)": {
                    "Semester 1": ["Mathematics-I", "Programming Fundamentals", "Physics Lab", "Biology Lab", "Humanities & Social Science"],
                    "Semester 2": ["Mathematics-II", "Chemistry Lab", "Electrical Sciences", "Workshop Practice", "Technical Communication"],
                    "Semester 3": ["Discrete Structures", "Data Structures & Algorithms", "Digital Design", "Control Systems", "Micro-Economics"],
                    "Semester 4": ["Database Systems", "Microprocessors & Interfacing", "Computer Architecture", "Object Oriented Programming", "Logic in CS"],
                    "Semester 5": ["Operating Systems", "Design & Analysis of Algorithms", "Theory of Computation", "Integrated Electronics", "Communication Systems"],
                    "Semester 6": ["Compiler Construction", "Computer Networks", "Information Retrieval", "Machine Learning", "Software Engineering"],
                    "Semester 7": ["Open Elective-I", "Humanities Elective", "Special Project", "Cryptography", "Parallel Computing"],
                    "Semester 8": ["Practice School-II", "Thesis Stage", "Professional Ethics", "Entrepreneurship", "Final Seminar"]
                }
            },
            "NIT Trichy": {
                "B.Tech (Engineering)": {
                    "Semester 1": ["Linear Algebra", "Physics", "Intro to Programming", "Civil Engineering Basics", "English for Communication"],
                    "Semester 2": ["Calculus", "Chemistry", "Mechanical Engineering Basics", "Engineering Graphics", "Environmental Science"],
                    "Semester 3": ["Probability & Operations Research", "Discrete Structures", "Data Structures", "Digital Circuits", "Electronics Lab"],
                    "Semester 4": ["Principles of Programming Languages", "Design & Analysis of Algorithms", "Computer Organization", "Database Mgmt", "Systems Lab"],
                    "Semester 5": ["Operating Systems", "Theory of Computation", "Microprocessors", "Communication Theory", "Programming Lab"],
                    "Semester 6": ["Computer Networks", "Software Engineering", "AI Fundamentals", "Dept Elective-I", "OS Lab"],
                    "Semester 7": ["Distributed Systems", "Network Security", "Dept Elective-II", "Capstone Project-I", "Vocational Training"],
                    "Semester 8": ["Industrial Economics", "Professional Ethics", "Dept Elective-III", "Final Project", "General Viva"]
                }
            },
            "Manav Rachna University": {
                "B.Tech (Engineering)": {
                    "Semester 1": ["Engineering Mathematics-I", "Computer Programming", "Principles of Electrical Engg.", "Basic Electronics", "Engineering Graphics"],
                    "Semester 2": ["Engineering Mathematics-II", "Object-Oriented Programming", "Data Structures", "Digital Logic Design", "Electrical Circuits Fundamentals"],
                    "Semester 3": ["Engineering Mathematics-III", "Computer Organization & Architecture", "Software Engineering", "Discrete Mathematics", "Advanced Data Structures"],
                    "Semester 4": ["Software Engineering", "Machine Learning", "Digital Electronics", "Computer Networks", "Professional Competence Enhancement-II"],
                    "Semester 5": ["Design & Analysis of Algorithms", "Theory of Computation", "Web Technologies", "ML Elective", "Professional Elective A"],
                    "Semester 6": ["Data Communication & Networking", "Compiler Design", "Artificial Intelligence", "Cloud Computing Elective", "Project Work Lab"],
                    "Semester 7": ["Mobile Computing", "Computer Vision", "Cybersecurity", "Data Science Elective", "Ongoing Project Work"],
                    "Semester 8": ["Internet of Things", "Software Project Management", "Blockchain Tech Elective", "Final Project", "Internship"]
                }
            },
            // Fallback / Generic Mappings
            "Default": {
                "B.Tech (Engineering)": {
                    "Semester 1": ["Engineering Mathematics-I", "Physics-I", "Chemistry-I", "Mechanical Engineering", "Programming in C"],
                    "Semester 2": ["Engineering Mathematics-II", "Physics-II", "Electrical Engineering", "Engineering Graphics", "Data Structures"],
                    "Semester 3": ["Digital Logic", "Object Oriented Programming", "Discrete Mathematics", "Data Structures", "Electronics"],
                    "Semester 4": ["Computer Organization", "Algorithm Design", "Probability & Stats", "Microprocessors", "OS Basics"],
                    "Semester 5": ["Operating Systems", "Networking", "Theory of Computation", "Database Systems", "Software Engineering"],
                    "Semester 6": ["Compiler Design", "AI Fundamentals", "Distributed Systems", "Cloud Computing", "Cyber Security"],
                    "Semester 7": ["Machine Learning", "Big Data", "Mobile Computing", "Advanced Algorithms", "IoT"],
                    "Semester 8": ["Professional Ethics", "Entrepreneurship", "Project Management", "Research Methodologies", "Final Project"]
                },
                "BCA (Computer App)": {
                    "Semester 1": ["Programming in C", "Mathematical Foundations", "Computer Fundametals", "Business Comm", "Basic Electronics"],
                    "Semester 2": ["Data Structures", "C++ Programming", "Database Mgmt", "Accounting", "Discrete Math"],
                    "Semester 3": ["Java Programming", "Web Technologies", "Operating Systems", "Software Engineering", "Numerical Methods"],
                    "Semester 4": ["Mobile Apps", "Computer Graphics", "E-Commerce", "Software Testing", "VB.NET"],
                    "Semester 5": ["Python Programming", "Network Security", "Cloud Computing", "UI/UX Design", "Business Analytics"],
                    "Semester 6": ["Final Major Project", "Technical Writing", "Advanced Java", "AI Basics", "Professional Ethics"]
                },
                "B.Sc (Science)": {
                    "Semester 1": ["Classical Mechanics", "Basic Math", "Atomic Chemistry", "Cell Biology", "English-I"],
                    "Semester 2": ["Thermal Physics", "Calculus", "Organic Chemistry", "Botany-I", "Zoology-I"],
                    "Semester 3": ["Electromagnetism", "Genetics", "Stereochemistry", "Thermodynamics", "Linear Algebra"],
                    "Semester 4": ["Nuclear Physics", "Ecology", "Inorganic Chem", "Real Analysis", "Lab Methods"],
                    "Semester 5": ["Quantum Mechanics", "Microbiology", "Analytical Chem", "Special Relativity", "Biochem"],
                    "Semester 6": ["Solid State Physics", "Biotech", "Green Chemistry", "Numerical Analysis", "Internship"]
                },
                "B.Com (Commerce)": {
                    "Semester 1": ["Financial Accounting", "Business Law", "Microeconomics", "Business Stats", "Env Studies"],
                    "Semester 2": ["Business Comm", "Corp Accounting", "Macroeconomics", "Business Math", "Marketing"],
                    "Semester 3": ["Cost Accounting", "Income Tax-I", "Management Principles", "Banking", "Company Law"],
                    "Semester 4": ["Auditing", "Income Tax-II", "E-Commerce", "Human Resources", "Indirect Tax"],
                    "Semester 5": ["Financial Mgmt", "Cost Mgmt", "Consumer Behavior", "Investment Mgmt", "Advertising"],
                    "Semester 6": ["Project Work", "Auditing-II", "International Trade", "Entrepreneurship", "Strategic Mgmt"]
                }
            }
        }
    }
};
