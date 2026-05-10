const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");
const { protect } = require("../middleware/auth");

// GET /api/predictions — get all predictions for the logged-in doctor
router.get("/", protect, async (req, res) => {
  try {
    const predictions = await Prediction.find({ doctorId: req.doctor.doctorId })
      .sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/predictions — save a new prediction
router.post("/", protect, async (req, res) => {
  const { type, patientName, result, confidence, riskLevel, date } = req.body;

  if (!type || !result || confidence === undefined || !riskLevel) {
    return res.status(400).json({ message: "Missing required prediction fields" });
  }

  try {
    const prediction = await Prediction.create({
      doctorId: req.doctor.doctorId,
      type,
      patientName: patientName || "Unknown",
      result,
      confidence,
      riskLevel,
      date,
    });
    res.status(201).json(prediction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/predictions/:id — delete a specific prediction
router.delete("/:id", protect, async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) return res.status(404).json({ message: "Prediction not found" });

    if (prediction.doctorId !== req.doctor.doctorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prediction.deleteOne();
    res.json({ message: "Prediction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
