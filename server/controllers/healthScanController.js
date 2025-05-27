const axios = require("axios");

exports.analyzeReport = async (req, res) => {
  const { reportText } = req.body;

  if (!reportText) {
    return res.status(400).json({ error: "Missing report text" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "system",
            content: `
You are a helpful medical assistant.

Given a list of lab test values (e.g., Hemoglobin: 9.5 g/dL), return a simplified and structured explanation with the following format:

1. 🔴 Abnormal Values – List only those out of range with reason.
2. 📖 What It Could Mean – Brief explanation in friendly tone.
3. 🩺 Suggested Action – Clear next step (Monitor / See Doctor / Recheck).
4. ⚠️ Disclaimer – Add: "This is AI-generated, not medical advice."

Be concise and avoid overly technical terms. Respond clearly and use bullet points when possible.

Here is the lab report:
`,
          },
          {
            role: "user",
            content: reportText,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173/",
          "X-Title": "MediScan HealthScan",
        },
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    res.json({ analysis: aiMessage });
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to analyze report" });
  }
};
