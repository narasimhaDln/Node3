const mongoose = require("mongoose");
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected DB");
  } catch (error) {
    console.log("connection failed", error);
  }
};
module.exports = connection;
