const express = require("express");
const { getAllDoctors, getDoctorById } = require("../controllers/doctorController");

const router = express.Router();

router.get("/", getAllDoctors);
router.get("/:id", getDoctorById);

module.exports = router;
