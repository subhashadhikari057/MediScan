const mongoose = require("mongoose");

const cleanupLogSchema = new mongoose.Schema({
  deletedAppointments: [
    {
      appointmentId: String,
      doctorName: String,
      userName: String,
      date: String,
      time: String,
      reason: String,
    }
  ],
  deletedCount: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("CleanupLog", cleanupLogSchema);
