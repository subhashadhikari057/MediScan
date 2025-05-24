const Appointment = require("../models/Appointment");
const User = require("../models/User");

exports.userDashboard = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id }).populate("doctorId", "name specialization location");
    res.status(200).json({ message: "User dashboard", data: appointments });
  } catch (err) {
    res.status(500).json({ message: "Error loading user dashboard", error: err });
  }
};

exports.doctorDashboard = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id }).populate("userId", "name email location");
    res.status(200).json({ message: "Doctor dashboard", data: appointments });
  } catch (err) {
    res.status(500).json({ message: "Error loading doctor dashboard", error: err });
  }
};

exports.adminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();

    res.status(200).json({
      message: "Admin dashboard",
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading admin dashboard", error: err });
  }
};
