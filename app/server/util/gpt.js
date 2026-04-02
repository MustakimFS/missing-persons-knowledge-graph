require('dotenv').config();
const axios = require('axios');

const GPT_API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
    throw new Error("OPENAI_API_KEY is not defined");
}

const generateSummary = async (data) => {
    try {
        const prompt = `Summarize the following data on missing persons into a single concise paragraph, focusing on overall patterns, trends, and notable anomalies across the cases. Avoid listing individual case names and instead highlight key insights such as recurring demographics, geographic hotspots, timeframes, or shared circumstances. The goal is to provide actionable observations for researchers studying missing persons. Use professional and precise language, avoiding redundancy or vague phrases.\n${JSON.stringify(data, null, 2)}`;
        const response = await axios.post(
            GPT_API_URL,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant summarizing case data." },
                    { role: "user", content: prompt },
                ],
                max_tokens: 200,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        if (response.data && response.data.choices && response.data.choices[0]) {
            return response.data.choices[0].message.content.trim();
        } else {
            throw new Error("Invalid response from GPT API");
        }
    } catch (error) {
        console.error("Error in generateSummary:", error.response?.data || error.message);
        throw new Error("Failed to generate summary");
    }
};

module.exports = {
    generateSummary,
};