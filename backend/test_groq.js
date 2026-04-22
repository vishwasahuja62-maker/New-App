const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function test() {
    try {
        console.log("Testing Groq...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "user", content: "Say hi" }
            ],
            model: "llama-3.3-70b-versatile",
        });
        console.log("Success:", chatCompletion.choices[0].message.content);
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
