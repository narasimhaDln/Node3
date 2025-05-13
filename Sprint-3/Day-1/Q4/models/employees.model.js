const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  position: String,
  joiningDate: Date,
});
const EmployeeModel = require("employee", employeeSchema);
module.exports = EmployeeModel;
