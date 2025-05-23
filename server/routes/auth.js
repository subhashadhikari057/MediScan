const express = require("express");
const { registerUser, loginUser, googleSignup } = require("../controllers/authController");
const { completeProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleSignup); // <-- add this route
router.post("/complete-profile", completeProfile);


module.exports = router;
