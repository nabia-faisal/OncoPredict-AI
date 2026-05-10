const express = require("express");
const router = express.Router();
const PatientHistory = require("../models/PatientHistory");
const { protect } = require("../middleware/auth");

// GET /api/patients — get all patients for the logged-in doctor
router.get("/", protect, async (req, res) => {
  try {
    const patients = await PatientHistory.find({ doctorId: req.doctor.doctorId })
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/patients — save a patient history record
router.post("/", protect, async (req, res) => {
  const { patientName } = req.body;

  if (!patientName) {
    return res.status(400).json({ message: "Patient name is required" });
  }

  try {
    const patient = await PatientHistory.create({
      doctorId: req.doctor.doctorId,
      ...req.body,
    });
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/patients/:id — get a single patient record
router.get("/:id", protect, async (req, res) => {
  try {
    const patient = await PatientHistory.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    if (patient.doctorId !== req.doctor.doctorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
