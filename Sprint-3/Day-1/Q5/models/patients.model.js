const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  contact: { type: String },
  medicalHistory: [String],
});
const PatientModel = mongoose.model("patient", patientSchema);
module.exports = PatientModel;
