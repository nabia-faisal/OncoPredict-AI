const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["Clinical", "Image", "Combined"],
      required: true,
    },
    patientName: {
      type: String,
      default: "Unknown",
    },
    result: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["Low", "Moderate", "High"],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", predictionSchema);
