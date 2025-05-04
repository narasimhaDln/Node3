const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.get("/test", (req, res) => {
  res.send("This is testing route working fine");
});
app.get("/home", (req, res) => {
  res.send("<h1>Welcome to Home Page</h1>");
});
app.get("/about", (req, res) => {
  res.json({ message: "Welcome to About Us" });
});
app.get("/contactUs", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  const contact = data.contactUs;
  res.send(contact);
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found please chek routes" });
});
app.listen(3000, () => {
  console.log("server started");
});
