const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Doctor = require("../models/Doctor");

// Generate JWT
const generateToken = (doctorId) => {
  return jwt.sign({ doctorId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { doctorId, password, name } = req.body;

  if (!doctorId || !password) {
    return res.status(400).json({ message: "Doctor ID and password are required" });
  }

  try {
    const existing = await Doctor.findOne({ doctorId });
    if (existing) {
      return res.status(400).json({ message: "Doctor ID already exists" });
    }

    const doctor = await Doctor.create({ doctorId, password, name: name || "" });
    const token = generateToken(doctor.doctorId);

    res.status(201).json({
      doctorId: doctor.doctorId,
      name: doctor.name,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { doctorId, password } = req.body;

  if (!doctorId || !password) {
    return res.status(400).json({ message: "Doctor ID and password are required" });
  }

  try {
    const doctor = await Doctor.findOne({ doctorId });
    if (!doctor || !(await doctor.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid Doctor ID or password" });
    }

    const token = generateToken(doctor.doctorId);

    res.json({
      doctorId: doctor.doctorId,
      name: doctor.name,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
