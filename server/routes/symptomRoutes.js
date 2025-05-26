const express = require("express");
const router = express.Router();
const { getDiagnosis } = require("../controllers/symptomController");

router.post("/check", getDiagnosis);

module.exports = router;
