const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  date: Date,
  status: { type: String, enum: ["present", "absent", "late", "leave"] },
});
const AttendanceModel = mongoose.model("attendance", attendanceSchema);
module.exports = AttendanceModel;
