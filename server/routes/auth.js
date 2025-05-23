const express = require("express");
const {
  registerUser,
  loginUser,
  googleSignup,
  completeProfile,
  getUserProfile,
  updateProfile,
  changePassword, // ✅ Import this
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleSignup);
router.post("/complete-profile", completeProfile);
router.get("/profile", getUserProfile);
router.post("/update-profile", updateProfile);
router.post("/change-password", changePassword); // ✅ Add this new route

module.exports = router;
