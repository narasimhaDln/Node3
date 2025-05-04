const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the server");
});

app.get("/get-users", (req, res) => {
  res.status(200).json({ users: [] });
});

app.post("/add-user", (req, res) => {
  res.status(201).json({ message: "User added successfully" });
});

app.put("/user/:id", (req, res) => {
  res
    .status(200)
    .json({ message: `User ${req.params.id} updated successfully` });
});

app.delete("/user/:id", (req, res) => {
  res
    .status(200)
    .json({ message: `User ${req.params.id} deleted successfully` });
});
app.listen(2000, () => {
  console.log("Server running on port 2000");
});
