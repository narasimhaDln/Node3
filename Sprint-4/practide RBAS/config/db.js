const mongoose = require("mongoose");
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected DOne....!");
  } catch (error) {
    console.log("Connection failed", error);
  }
};
module.exports = connection;
