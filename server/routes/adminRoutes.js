const express = require("express");
const {
  getAllUsers,
  deleteUserOrDoctor,
  updateAppointmentTime,
  getAdminStats,
  getAllDoctors,
  updateUserOrDoctor,
  updateAppointmentStatus, // ✅ NEW
  deleteAppointmentByAdmin
} = require("../controllers/adminController");

const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const CleanupLog = require("../models/CleanupLog");
const AppointmentLog = require("../models/AppointmentLog"); // ✅ Make sure this is imported


const router = express.Router();

// Users
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, isAdmin, deleteUserOrDoctor);

// Doctors
router.get("/doctors", verifyToken, isAdmin, getAllDoctors);
router.delete("/doctors/:id", verifyToken, isAdmin, deleteUserOrDoctor);
router.patch("/doctors/:id", verifyToken, isAdmin, updateUserOrDoctor);

// Users patch
router.patch("/users/:id", verifyToken, isAdmin, updateUserOrDoctor);

// Appointments

router.patch("/appointments/:id/status", verifyToken, isAdmin, updateAppointmentStatus); // ✅
router.delete("/appointments/:id", verifyToken, isAdmin, deleteAppointmentByAdmin);

// Stats
router.get("/stats", verifyToken, isAdmin, getAdminStats);

// Cleanup Logs
router.get("/cleanup-logs", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await CleanupLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (err) {
    console.error("Failed to fetch cleanup logs:", err);
    res.status(500).json({ message: "Error fetching logs", error: err });
  }
});

// Fetch logs for an appointment
router.get("/appointments/:id/logs", verifyToken, isAdmin, async (req, res) => {
  try {
    const logs = await AppointmentLog.find({ appointmentId: req.params.id })
      .populate("changedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error("Failed to fetch appointment logs:", err);
    res.status(500).json({ message: "Error fetching logs", error: err });
  }
});

module.exports = router;
