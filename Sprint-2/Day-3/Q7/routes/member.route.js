const express = require("express");
const router = express.Router();
const {
  getMemberBooks,
  addMember,
} = require("../controllers/member.controllers");
router.post("/add-member", addMember);
router.get("/member-borrowed-books/:memberId", getMemberBooks);
module.exports = router;
