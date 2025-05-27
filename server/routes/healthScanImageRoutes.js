const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { analyzeReport } = require("../controllers/healthScanController");

const router = express.Router();
const upload = multer(); // memory storage

router.post("/image", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    const ocrRes = await axios.post(
      "https://api.ocr.space/parse/image",
      new URLSearchParams({
        base64Image: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        language: "eng",
        isOverlayRequired: "false",
      }),
      {
        headers: {
          apikey: process.env.OCR_SPACE_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const extractedText = ocrRes.data?.ParsedResults?.[0]?.ParsedText;
    if (!extractedText) {
      return res.status(500).json({ error: "OCR failed to extract text" });
    }

    // Forward extracted text to OpenRouter (reuse controller)
    req.body.reportText = extractedText;
    analyzeReport(req, res);
  } catch (err) {
    console.error("OCR error:", err.response?.data || err.message);
    return res.status(500).json({ error: "OCR processing failed" });
  }
});

module.exports = router;
