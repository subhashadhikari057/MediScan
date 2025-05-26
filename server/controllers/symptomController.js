require("dotenv").config();
const axios = require("axios");

exports.getDiagnosis = async (req, res) => {
  const { symptoms = [], duration = "Not provided", severity = 5, reliefFactors = "Not provided", model } = req.body;

  const selectedModel = model || "mistralai/mistral-7b-instruct";

  const prompt = `
You are a smart and structured medical AI. Return the following in clean plain text:
1. Likely Diagnosis: <one line summary>
2. Health Tips:
- Tip 1
- Tip 2
- Tip 3 (if possible)
3. Over-the-Counter Medicines:
- Medicine 1 (if appropriate)
- Medicine 2 (if appropriate)
4. Advice: <Short general advice line>

Avoid markdown, headings, and don't return empty sections. If any section can't be determined, say "Not available".

Input:
Symptoms: ${symptoms.length ? symptoms.join(", ") : "Not specified"}
Duration: ${duration}
Severity: ${severity}/10
Relief Factors: ${reliefFactors}
`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: selectedModel,
        messages: [{ role: "user", content: prompt.trim() }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "MediScan",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    res.json({ diagnosis: content });
  } catch (error) {
    console.error("📛 Diagnosis Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI diagnosis failed. Please try again later." });
  }
};
