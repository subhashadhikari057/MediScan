// scheduler.js
const cron = require("node-cron");
const Appointment = require("./models/Appointment");

// Run this task every hour
cron.schedule("0 * * * *", async () => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const result = await Appointment.deleteMany({
      status: "cancelled",
      updatedAt: { $lt: cutoff },
    });

    if (result.deletedCount > 0) {
      console.log(`🗑️ Deleted ${result.deletedCount} cancelled appointments older than 24 hrs`);
    }
  } catch (err) {
    console.error("❌ Scheduler error:", err.message);
  }
});
