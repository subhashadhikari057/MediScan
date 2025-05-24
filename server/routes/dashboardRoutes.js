const express = require("express");
const { userDashboard, doctorDashboard, adminDashboard } = require("../controllers/dashboardController");
const { verifyToken, isUser, isDoctor, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user", verifyToken, isUser, userDashboard);
router.get("/doctor", verifyToken, isDoctor, doctorDashboard);
router.get("/admin", verifyToken, isAdmin, adminDashboard);

module.exports = router;
