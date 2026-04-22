const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDlzWe5LEGW7z86LHXZU4C_NsQ-vuBTmSQ");

async function list() {
    try {
        console.log("Listing models...");
        // In some versions it is genAI.getGenerativeModel({model: '...'})
        // But listing models is often done via a different client or not supported directly in the basic SDK.
        // Let's try to just hit a known good one.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        const result = await model.generateContent("hi");
        console.log("Success with latest:", result.response.text());
    } catch (e) {
        console.error("Error:", e.message);
        console.error("Status:", e.status);
    }
}
list();
