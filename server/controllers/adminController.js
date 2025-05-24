const User = require("../models/User");
const Appointment = require("../models/Appointment");
const AppointmentLog = require("../models/AppointmentLog"); // ✅ make sure this is at the top



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

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors", error: err });
  }
};


exports.updateUserOrDoctor = async (req, res) => {
  try {
    const { name, location, specialization } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (location) user.location = location;
    if (user.role === "doctor" && specialization) user.specialization = specialization;

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};


// PATCH /api/admin/appointments/:id/status
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

    const oldStatus = appointment.status;

    appointment.status = status;
    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;

    if (status === "cancelled") {
      appointment.cancellationReason = cancellationReason;
    } else {
      appointment.cancellationReason = "";
    }

    await appointment.save();

    await AppointmentLog.create({
      appointmentId: appointment._id,
      action: "Status Updated",
      changedBy: req.user._id,
      from: oldStatus,
      to: status,
      note: cancellationReason || "Status updated along with time/date",
    });

    res.status(200).json({ message: "Appointment status updated", appointment });
  } catch (err) {
    console.error("Status update failed:", err);
    res.status(500).json({ message: "Failed to update status", error: err });
  }
};

exports.deleteAppointmentByAdmin = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deletion failed", error: err });
  }
};


