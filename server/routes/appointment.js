const express = require("express");
const {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const { verifyToken, isUser, isDoctor, isAdmin } = require("../middlewares/authMiddleware");

const Appointment = require("../models/Appointment");
const AppointmentLog = require("../models/AppointmentLog");

const router = express.Router();

// Book appointment (user only)
router.post("/book", verifyToken, isUser, bookAppointment);

// View own appointments
router.get("/user", verifyToken, isUser, getUserAppointments);
router.get("/doctor", verifyToken, isDoctor, getDoctorAppointments);
router.get("/admin", verifyToken, isAdmin, getAllAppointments);

// Update appointment status + reschedule (doctor only)
router.patch("/:id/status", verifyToken, isDoctor, updateAppointmentStatus);

// ✅ NEW: Fetch appointment logs (doctor only, for their own appointments)
router.get("/:id/logs", verifyToken, isDoctor, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment || appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await AppointmentLog.find({ appointmentId: appointment._id })
      .populate("changedBy", "name email")
      .sort({ timestamp: -1 });

    res.status(200).json(logs);
  } catch (err) {
    console.error("Doctor log fetch error:", err);
    res.status(500).json({ message: "Error fetching logs", error: err });
  }
});

module.exports = router;
