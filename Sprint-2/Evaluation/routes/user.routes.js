const express = require("express");
const fs = require("fs");

const router = express.Router();
//post data
router.post("/data", (req, res) => {
  const newData = req.body;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  user.push(newData);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.send(user);
});
//get user by id
router.get("/user/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users.find((u) => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "user not found" });
  }
});
//delete user
router.delete("/delete/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  let index = user.findIndex((ele) => ele.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "user not found" });
  } else {
    let deleteUser = user.filter((ele) => ele.id !== id);
    data.users = deleteUser;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.json(deleteUser);
  }
});
module.exports = router;
