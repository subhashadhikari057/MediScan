const Appointment = require("../models/Appointment");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppointmentLog = require("../models/AppointmentLog");

// Book Appointment (USER)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const appointment = new Appointment({
      userId: decoded.id,
      doctorId,
      date,
      time,
      reason,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Failed to book appointment", error: err });
  }
};

// Get User Appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .populate("doctorId", "name specialization location");
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch appointments", error: err });
  }
};

// Get Doctor Appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate("userId", "name email location");
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Doctor Appointment Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch doctor appointments", error: err });
  }
};

// Get All Appointments (Admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .populate("doctorId", "name specialization");
    res.status(200).json(appointments);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ message: "Failed to fetch appointments", error: err });
  }
};

// Update Appointment Status (Doctor only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellationReason = "" } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!["approved", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    appointment.status = status;
    appointment.cancellationReason = status === "cancelled" ? cancellationReason : "";

    await appointment.save();
    res.status(200).json({ message: "Appointment status updated", appointment });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Failed to update status", error: err });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellationReason, date, time } = req.body;

    const validStatuses = ["pending", "approved", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (status === "cancelled" && !cancellationReason?.trim()) {
      return res.status(400).json({ message: "Cancellation reason is required" });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    const logs = [];

    if (appointment.status !== status) {
      logs.push({
        action: "Status Change",
        from: appointment.status,
        to: status,
        note: status === "cancelled" ? `Reason: ${cancellationReason}` : "",
      });
      appointment.status = status;
      appointment.cancellationReason = status === "cancelled" ? cancellationReason : "";
    }

    if (date && date !== appointment.date) {
      logs.push({
        action: "Date Rescheduled",
        from: appointment.date,
        to: date,
      });
      appointment.date = date;
    }

    if (time && time !== appointment.time) {
      logs.push({
        action: "Time Rescheduled",
        from: appointment.time,
        to: time,
      });
      appointment.time = time;
    }

    await appointment.save();

    // Save logs
    for (let log of logs) {
      await AppointmentLog.create({
        appointmentId: appointment._id,
        changedBy: req.user._id,
        ...log,
      });
    }

    res.status(200).json({ message: "Appointment updated", appointment });
  } catch (err) {
    console.error("Status update failed:", err);
    res.status(500).json({ message: "Failed to update status", error: err });
  }
};

