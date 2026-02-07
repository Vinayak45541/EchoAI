// import "dotenv/config";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const getAIResponse = async (message) => {
//     try {
//         const model = genAI.getGenerativeModel({
//             model: "gemini-1.5-flash"
//         });

//         const result = await model.generateContent(message);
//         const response = await result.response;
//         const text = response.text();

//         console.log("Gemini reply:", text);

//         return text;

//     } catch (err) {
//         console.log("Gemini SDK error:", err);
//         return null;
//     }
// };

// export default getAIResponse;

const getAIResponse = async (message) => {
    try {
        // Temporary mock AI response
        return `AI response to: ${message}`;
    } catch (err) {
        console.log("AI mock error:", err);
        return null;
    }
};

export default getAIResponse;
