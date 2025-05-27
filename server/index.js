const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointment");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const healthScanRoutes = require("./routes/healthScanRoutes");
const healthScanImageRoutes = require("./routes/healthScanImageRoutes");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Root Route
app.get("/", (req, res) => {
  res.send("MediScan API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/symptom", symptomRoutes);
app.use("/api/healthscan", healthScanRoutes);
app.use("/api/healthscan", healthScanImageRoutes);


// ✅ Cron job to auto-delete cancelled appointments
require("./scheduler");

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
