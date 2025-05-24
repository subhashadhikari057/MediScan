const mongoose = require("mongoose");

const appointmentLogSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  note: {
    type: String,
  },
});

module.exports = mongoose.model("AppointmentLog", appointmentLogSchema);
