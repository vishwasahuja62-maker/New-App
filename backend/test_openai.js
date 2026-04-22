const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: "sk-5678ijklmnopabcd5678ijklmnopabcd5678ijkl",
});

async function test() {
    try {
        console.log("Testing OpenAI key...");
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Say hi" }],
        });
        console.log("Success:", response.choices[0].message.content);
    } catch (error) {
        console.error("OpenAI Error:", error.message);
        if (error.response) {
            console.error("Status:", error.status);
        }
    }
}

test();
