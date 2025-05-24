const express = require("express");
const {
  getAllUsers,
  deleteUserOrDoctor,
  updateAppointmentTime,
  getAdminStats
} = require("../controllers/adminController");

const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");




const router = express.Router();

// Users
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, isAdmin, deleteUserOrDoctor);

// Doctors (reuse same controller)
router.delete("/doctors/:id", verifyToken, isAdmin, deleteUserOrDoctor);

// Appointments
router.patch("/appointments/:id", verifyToken, isAdmin, updateAppointmentTime);

router.get("/stats", verifyToken, isAdmin, getAdminStats);


module.exports = router;
