const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String },
  specialty: { type: String },
  experience: { type: Number },
  availability: [String],
});
const DoctorModel = mongoose.model("doctor", doctorSchema);
module.exports = DoctorModel;
