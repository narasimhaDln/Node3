const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doctor" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
  appointmentDate: Date,
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"] },
});
const AppointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = AppointmentModel;
