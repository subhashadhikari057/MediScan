const Appointment = require("./models/Appointment");
const User = require("./models/User");
const CleanupLog = require("./models/CleanupLog");

const deleteCancelledAppointments = async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const oldCancelled = await Appointment.find({
    status: "cancelled",
    updatedAt: { $lte: cutoff },
  }).populate("doctorId", "name")
    .populate("userId", "name");

  if (oldCancelled.length > 0) {
    const deletedDetails = oldCancelled.map(appt => ({
      appointmentId: appt._id,
      doctorName: appt.doctorId?.name,
      userName: appt.userId?.name,
      date: appt.date,
      time: appt.time,
      reason: appt.cancellationReason || "No reason provided"
    }));

    await Appointment.deleteMany({ _id: { $in: oldCancelled.map(a => a._id) } });

    await CleanupLog.create({
      deletedAppointments: deletedDetails,
      deletedCount: deletedDetails.length,
    });

    console.log(`[Scheduler] Deleted ${deletedDetails.length} cancelled appointments and logged them.`);
  }
};
