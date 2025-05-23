const express = require("express");
const {
  getAllUsers,
  deleteUserOrDoctor,
  updateAppointmentTime,
  getAdminStats
} = require("../controllers/adminController");

const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const CleanupLog = require("../models/CleanupLog");

const router = express.Router();

// Users
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, isAdmin, deleteUserOrDoctor);

// Doctors (reuse same controller)
router.delete("/doctors/:id", verifyToken, isAdmin, deleteUserOrDoctor);

// Appointments
router.patch("/appointments/:id", verifyToken, isAdmin, updateAppointmentTime);

// Stats
router.get("/stats", verifyToken, isAdmin, getAdminStats);

// 🧹 Cleanup Logs (UPDATED)
router.get("/cleanup-logs", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await CleanupLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (err) {
    console.error("Failed to fetch cleanup logs:", err);
    res.status(500).json({ message: "Error fetching logs", error: err });
  }
});

module.exports = router;
