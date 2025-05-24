const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isUser = (req, res, next) => {
  if (req.user.role === "user") return next();
  return res.status(403).json({ message: "Access denied: Users only" });
};

const isDoctor = (req, res, next) => {
  if (req.user.role === "doctor") return next();
  return res.status(403).json({ message: "Access denied: Doctors only" });
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ message: "Access denied: Admins only" });
};

module.exports = { verifyToken, isUser, isDoctor, isAdmin };
