const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["user", "doctor", "admin"], default: "user" },
  specialization: { type: String },
  licenseNumber: { type: String },
  photoURL: { type: String },
  location: { type: String },
  mobile: { type: String }, // ✅ Added mobile number
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
