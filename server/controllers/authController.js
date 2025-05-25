const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    
  try {
    
    const { name, email, password, role, photoURL, specialization, licenseNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      photoURL: photoURL || "", // Optional
      specialization: role === "doctor" ? specialization : undefined,
      licenseNumber: role === "doctor" ? licenseNumber : undefined
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.googleSignup = async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: "", // No password for Google auth
        role: "user",
        photoURL:"",
        // You can optionally store photoURL if your model supports it
      });

      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
         photoURL: user.photoURL,
      },
    });

  } catch (error) {
    console.error("Google Signup Error:", error);
    res.status(500).json({ message: "Google signup failed", error });
  }
};

exports.completeProfile = async (req, res) => {
  try {
    const { email, password, role, specialization, licenseNumber, location } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Format name to Capitalized First + Last Name (optional)
    if (user.name) {
      user.name = user.name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

    // Update user fields
    user.password = hashedPassword;
    user.role = role;
    user.specialization = role === "doctor" ? specialization : undefined;
    user.licenseNumber = role === "doctor" ? licenseNumber : undefined;
    user.location = location;

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Profile completed successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        photoURL: user.photoURL || null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch profile", error: err });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, photoURL, mobile, location } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (photoURL) user.photoURL = photoURL;
    if (mobile !== undefined) user.mobile = mobile;
    if (location !== undefined) user.location = location;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        mobile: user.mobile || "",
        role: user.role,
        location: user.location || "",
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};




exports.changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { oldPassword, newPassword } = req.body;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};