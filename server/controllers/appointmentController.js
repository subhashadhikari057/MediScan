const Appointment = require("../models/Appointment");
const User = require("../models/User");

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const jwt = require("jsonwebtoken");
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


exports.getUserAppointments = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const appointments = await Appointment.find({ userId: decoded.id }).populate("doctorId", "name specialization location");

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch appointments", error: err });
  }
};


exports.getDoctorAppointments = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user || user.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find({ doctorId: decoded.id }).populate("userId", "name email location");

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Doctor Appointment Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch doctor appointments", error: err });
  }
};


//for admin
exports.getAllAppointments = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const adminUser = await User.findById(decoded.id);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find()
      .populate("userId", "name email")
      .populate("doctorId", "name specialization");

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ message: "Failed to fetch appointments", error: err });
  }
};
