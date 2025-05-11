const BookModel = require("../models/book.model");
const MemberModel = require("../models/member.model");
const addMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json({ message: "Member added", member });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getMemberBooks = async (req, res) => {
  try {
    const member = await Member.findById(req.params.memberId).populate(
      "borrowedBooks"
    );
    res.status(200).json({ borrowedBooks: member.borrowedBooks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = { getMemberBooks, addMember };
