const mongoose = require("mongoose");

const patientHistorySchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
      required: true,
      index: true,
    },
    patientName: { type: String, required: true },
    age: { type: String },
    contact: { type: String },
    bodyTemperature: { type: String },
    bloodPressureSystolic: { type: String },
    bloodPressureDiastolic: { type: String },
    heartRate: { type: String },
    height: { type: String },
    weight: { type: String },
    bmi: { type: String },
    chiefComplaint: { type: String },
    allergiesDrug: { type: Boolean, default: false },
    allergiesFood: { type: Boolean, default: false },
    allergiesEnvironmental: { type: Boolean, default: false },
    allergyDetails: { type: String },
    onsetDuration: { type: String },
    severity: { type: String },
    pastMedicalHistory: { type: String },
    pastSurgicalHistory: { type: String },
    familyMedicalHistory: { type: String },
    smoking: { type: String },
    alcohol: { type: String },
    diet: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientHistory", patientHistorySchema);
