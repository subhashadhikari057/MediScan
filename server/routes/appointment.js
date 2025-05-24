const express = require("express");
const {
  bookAppointment,
  getUserAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const { verifyToken, isUser, isDoctor, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Book appointment (user only)
router.post("/book", verifyToken, isUser, bookAppointment);

// View own appointments
router.get("/user", verifyToken, isUser, getUserAppointments);
router.get("/doctor", verifyToken, isDoctor, getDoctorAppointments);
router.get("/admin", verifyToken, isAdmin, getAllAppointments);

// Update appointment status (doctor only)
router.patch("/:id/status", verifyToken, isDoctor, updateAppointmentStatus);

module.exports = router;
