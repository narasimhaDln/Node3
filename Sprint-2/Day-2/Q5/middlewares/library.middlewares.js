const LibraryModel = require("../models/library.model");

const libraryData = (req, res, next) => {
  const { status, author, description } = req.body;
  if (!status || !author || !description) {
    return res.status(400).json({ message: "Data incomplete" });
  }
  next();
};
const borrowingLimit = async (req, res, next) => {
  const { borrowerName } = req.body;
  try {
    const borrowedBooks = await LibraryModel.countDocuments({
      borrowerName,
      status: "borrowed",
    });
    if (borrowedBooks >= 3) {
      return res.status(400).json({
        message: "borrowing limit reached,you can't borrow more than 3 books",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
module.exports = { libraryData, borrowingLimit };
