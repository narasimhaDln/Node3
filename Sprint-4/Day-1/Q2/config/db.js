const mongoose = require("mongoose");
const connection = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Db connected");
  } catch (error) {
    console.log("failed to connect Db", error);
  }
};
module.exports = connection;
