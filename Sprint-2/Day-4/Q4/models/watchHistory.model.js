const mongoose = require("mongoose");
const watchHistorySchema = new mongoose.Schema({
  username: { type: String, required: true },
  movie: { type: String, required: true },
  genre: { type: String, required: true },
  watchTime: { type: Number, required: true },
  subscriptionType: { type: String, required: true },
  watchedDate: { type: Number, required: true },
  rating: { type: Number, required: true },
});
const HistoryModel = mongoose.model("movies", watchHistorySchema);
module.exports = HistoryModel;
