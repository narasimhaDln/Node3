const mongoose = require("mongoose");
const workoutSchema = new mongoose.Schema({
  username: { type: String, required: true },
  workoutType: { type: String, required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  workoutDate: { type: Date },
  intensity: { type: String, required: true },
});
const WorkOutModel = mongoose.model("workouts", workoutSchema);
module.exports = WorkOutModel;
