const { GoogleGenerativeAI } = require("@google/generative-ai");

const HealthRecord = require("../models/HealthRecord");
const BMI = require("../models/BMI");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const chatWithAI = async (req, res) => {

    try {

        const { message, userId } = req.body;

        if (!message) {

            return res.status(400).json({
                message: "Please enter a question."
            });

        }


        // ==========================
        // Get Health Record
        // ==========================

        let healthRecord = null;

        if (userId) {

            console.log("Getting health record...");

            healthRecord = await HealthRecord.findOne({
                userId
            });

            console.log("Health record received");

        }


        // ==========================
        // Get Latest BMI
        // ==========================

        let bmiRecord = null;

        if (userId) {

            console.log("Getting BMI...");

            bmiRecord = await BMI.findOne({
                userId
            }).sort({
                createdAt: -1
            });

            console.log("BMI received");

        }


        // ==========================
        // Health Profile
        // ==========================

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


        // ==========================
        // BMI Information
        // ==========================

        const bmiInfo = bmiRecord
            ? `
BMI: ${bmiRecord.bmi}
BMI Status: ${bmiRecord.status}
`
            : "No BMI record available.";


        // ==========================
        // Gemini Model
        // ==========================

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        });


        // ==========================
        // Prompt
        // ==========================

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


        // ==========================
        // Start Streaming
        // ==========================

        console.log("Sending request to Gemini...");

        const geminiStart = Date.now();

        const result = await model.generateContentStream(prompt);

        console.log(
            "Gemini stream started after:",
            ((Date.now() - geminiStart) / 1000).toFixed(2),
            "seconds"
        );


        // Tell browser we are sending text
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.setHeader("Transfer-Encoding", "chunked");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        res.flushHeaders();


        // ==========================
        // Send Chunks
        // ==========================

        for await (const chunk of result.stream) {

            const text = chunk.text();

            if (text) {

                res.write(text);

            }

        }


        console.log(
            "Gemini finished in:",
            ((Date.now() - geminiStart) / 1000).toFixed(2),
            "seconds"
        );


        res.end();


    } catch (error) {

        console.error("Gemini Error:", error);

        // If headers haven't been sent yet
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