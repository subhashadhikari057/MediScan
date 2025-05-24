const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // optional for Google sign-up
  role: { type: String, enum: ["user", "doctor","admin"], default: "user" },
  specialization: { type: String },
  licenseNumber: { type: String },
  photoURL: { type: String }, // ✅ added for storing Google or uploaded image
  location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
