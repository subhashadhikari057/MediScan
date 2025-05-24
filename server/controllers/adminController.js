const User = require("../models/User");
const Appointment = require("../models/Appointment");

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

// DELETE user or doctor by ID
exports.deleteUserOrDoctor = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User/Doctor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err });
  }
};

// PATCH appointment time
exports.updateAppointmentTime = async (req, res) => {
  try {
    const { date, time } = req.body;
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { date, time },
      { new: true }
    );
    res.status(200).json({ message: "Appointment updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};


// GET /api/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalAppointments = await Appointment.countDocuments();

    res.status(200).json({
      totalUsers,
      totalDoctors,
      totalAppointments,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
