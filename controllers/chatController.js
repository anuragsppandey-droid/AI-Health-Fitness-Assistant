const { GoogleGenAI } = require("@google/genai");

const HealthRecord = require("../models/HealthRecord");
const BMI = require("../models/BMI");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Please enter a question."
            });
        }

        // Get user's health record
        console.log("Getting health record...");

        const healthRecord = await HealthRecord.findOne({ userId });

        console.log("Health record received");

        // Get user's latest BMI
        console.log("Getting BMI...");

        const bmiRecord = await BMI.findOne({ userId })
            .sort({ createdAt: -1 });

        console.log("BMI received");

        // Health profile
        const profile = healthRecord
            ? `
Age: ${healthRecord.age}
Gender: ${healthRecord.gender}
Blood Group: ${healthRecord.bloodGroup || "Not provided"}
Height: ${healthRecord.height || "Not provided"} cm
Weight: ${healthRecord.weight || "Not provided"} kg
Medical Conditions: ${healthRecord.medicalConditions || "None"}
Allergies: ${healthRecord.allergies || "None"}
Medications: ${healthRecord.medications || "None"}
`
            : "No health record available.";

        // BMI information
        const bmiInfo = bmiRecord
            ? `
BMI: ${bmiRecord.bmi}
BMI Status: ${bmiRecord.status}
`
            : "No BMI record available.";

        // AI prompt
        const prompt = `
You are an AI Health & Fitness Assistant.

Help the user with general health, fitness,
nutrition and wellness questions.

USER HEALTH PROFILE:

${profile}

BMI INFORMATION:

${bmiInfo}

USER QUESTION:

${message}

Instructions:

1. Personalize the answer using the user's information
when relevant.

2. Give simple and practical advice.

3. Do not diagnose diseases.

4. Do not prescribe medicines.

5. Do not make unsafe medical recommendations.

6. If the user describes serious symptoms or an
emergency, recommend consulting a qualified healthcare
professional.

7. Do not unnecessarily reveal private health information.

Answer the user's question clearly and simply.
`;

        console.log("Sending request to Gemini...");

        const geminiStart = Date.now();

        try {
            console.log("Trying Gemini 3.6 Flash...");

            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: prompt
            });

            const text = response.text;

            console.log(
                "Gemini response received in:",
                ((Date.now() - geminiStart) / 1000).toFixed(2),
                "seconds"
            );

            if (!text) {
                return res.status(503).json({
                    message: "AI could not generate a response."
                });
            }

            res.setHeader(
                "Content-Type",
                "text/plain; charset=utf-8"
            );

            res.setHeader(
                "Cache-Control",
                "no-cache"
            );

            return res.send(text);

        } catch (geminiError) {

            console.error(
                "Gemini Error:",
                geminiError.message
            );

            return res.status(503).json({
                message:
                    "AI service is temporarily unavailable. Please try again in a few seconds."
            });
        }

    } catch (error) {

        console.error(
            "Chat Controller Error:",
            error
        );

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Unable to get response from AI."
            });
        }

        res.end();
    }
};

module.exports = {
    chatWithAI
};