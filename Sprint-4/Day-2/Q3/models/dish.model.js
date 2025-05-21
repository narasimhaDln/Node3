const mongoose = require("mongoose");
const dishSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const DishModel = mongoose.model("dish", dishSchema);
module.exports = DishModel;
