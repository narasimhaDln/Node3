const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
  name: { type: String, minlength: 3, required: true },
  description: { type: String, required: true },
});

const CategoryModel = mongoose.model("category", categorySchema);
module.exports = CategoryModel;
