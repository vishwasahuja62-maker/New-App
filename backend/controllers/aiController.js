const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const getMentorResponse = async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] DEBUG: Groq Mentor hit`);
    const { message, history } = req.body;

    if (!message) return res.status(400).json({ error: "No message provided" });

    try {
        const historyMessages = (history || []).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are an Adaptive AI Mentor. You must strictly follow the user's specific request (e.g., storytelling, specific POV, roleplay, or complex analysis) while adapting your delivery style across three distinct personas.

                    QUANTITY: You MUST provide a MEDIUM length response for each mode (roughly 200-300 words). Do not give short or brief answers. Be thorough and detailed.

                    Apply the user's instructions to all three modes:

                    1. **Friendly Mode**: Execute the request with a warm, supportive, and encouraging tone. Use conversational language, simple words, and helpful emojis.
                    
                    2. **Strict Mode**: Execute the request with a no-nonsense, disciplined, and slightly stern tone. Focus on the core objective, efficiency, and directness.
                    
                    3. **Expert Mode**: Execute the request with deep technical precision, high-level analysis, and professional terminology. Provide maximum depth and extensive context.

                    Your output MUST be a JSON object with exactly these keys: "friendly", "strict", "expert".
                    Return ONLY the JSON object.`
                },
                ...historyMessages,
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = chatCompletion.choices[0]?.message?.content;
        try {
            const parsed = JSON.parse(content);
            res.json(parsed);
        } catch (parseError) {
            console.error("JSON Parse Error in Mentor:", content);
            res.json({ text: content });
        }
    } catch (error) {
        console.error("GROQ Mentor Error:", error.message);
        res.status(500).json({ error: "AI reasoning failed", details: error.message });
    }
};

const getCompanionResponse = async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] DEBUG: Groq Companion hit`);
    const { message, history } = req.body;
    try {
        const historyMessages = (history || []).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a supportive, empathetic, and slightly playful Emotional Companion for a student. 
                    
                    Your task:
                    1. Empathize with the user's current mood/state based on their message.
                    2. Provide a warm, supportive response.
                    3. If the user mentions social media, movies, study tools, or any platform, or asks where to find links, mention that they can click the 🌐 Globe icon (Link Portal) in the header of this chat to access 80+ curated platforms (Instagram, YT, Netflix, Notion, etc.).
                    4. Provide a RELATABLE YouTube or Instagram link (or search query link) that matches their mood to help them relax or feel heard when they need a quick recommendation.
                    
                    Remember: You should not list all the links yourself. Just guide them to the 🌐 Globe icon button in the header if they need a platform portal.`
                },
                ...historyMessages,
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.8,
        });
        res.json({ text: chatCompletion.choices[0]?.message?.content });
    } catch (error) {
        console.error("GROQ Companion Error:", error.message);
        res.status(500).json({ error: "Connection to companion failed" });
    }
};

const solveDoubt = async (req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] DEBUG: Groq Doubt hit`);
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Solve the academic doubt thoroughly with step-by-step explanations. You MUST return ONLY a JSON object. No conversational text outside the JSON. Format: { \"answer\": \"... detailed explanation ...\", \"subject\": \"...\", \"topic\": \"...\" }"
                },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        let content = chatCompletion.choices[0]?.message?.content;
        console.log("AI Response received");

        try {
            const parsed = JSON.parse(content);
            res.json(parsed);
        } catch (parseError) {
            console.error("JSON Parse Error. Content was:", content);
            // Fallback attempt to extract JSON if it was wrapped in text
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                res.json(JSON.parse(jsonMatch[0]));
            } else {
                throw new Error("AI failed to provide valid JSON structure");
            }
        }
    } catch (error) {
        console.error("GROQ Doubt Error:", error);
        res.status(500).json({ error: "Solver unavailable", details: error.message });
    }
};

module.exports = { getMentorResponse, getCompanionResponse, solveDoubt };
