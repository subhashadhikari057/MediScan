const express = require("express");
const { bookAppointment } = require("../controllers/appointmentController");
const { getUserAppointments } = require("../controllers/appointmentController");
const { getDoctorAppointments,getAllAppointments } = require("../controllers/appointmentController");





const router = express.Router();

router.post("/book", bookAppointment);
router.get("/user", getUserAppointments);
router.get("/doctor", getDoctorAppointments);
router.get("/admin", getAllAppointments);




module.exports = router;
