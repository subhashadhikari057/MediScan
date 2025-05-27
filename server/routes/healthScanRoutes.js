const express = require("express");
const router = express.Router();
const { analyzeReport } = require("../controllers/healthScanController");

router.post("/", analyzeReport);

module.exports = router;
