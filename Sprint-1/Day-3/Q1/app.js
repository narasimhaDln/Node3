const express = require("express");
const app = express();
app.use(express.json());
app.get("/test", (req, res) => {
  res.send("This is test route working fine..!");
});
app.post("/data", (req, res) => {
  console.log(req);
  res.status(201).json({ message: "Data received" });
});
app.listen(4050, () => {
  console.log("server running at 4050");
});
