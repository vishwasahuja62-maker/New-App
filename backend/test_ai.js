const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAGyfm7OHFi-xuert5as_gyvAri6v2i0v4");

async function test() {
    try {
        const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        for (const name of modelNames) {
            try {
                console.log(`Testing Gemini with model: ${name} (v1beta)...`);
                const model = genAI.getGenerativeModel({ model: name }, { apiVersion: 'v1beta' });
                const result = await model.generateContent("Say hi");
                console.log(`Success with ${name}:`, result.response.text());
                return;
            } catch (inner) {
                console.error(`Failed ${name}:`, inner.message);
            }
        }
    } catch (e) {
        console.error("Error Status:", e.status);
        console.error("Error StatusText:", e.statusText);
        console.error("Error Message:", e.message);
        if (e.response) {
            console.error("Error Response:", await e.response.json());
        }
    }
}

test();
