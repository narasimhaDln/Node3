const express = require("express");
const app = express();

app.use(express.json());
app.get("/home", (req, res) => {
  res.send("This is home page");
});
app.get("/contacts", (req, res) => {
  res.send("contact us at contact@contact.com");
});
app.get("/about", (req, res) => {
  res.send("welcome to about page");
});
app.listen(6070, () => {
  console.log("server running 6070");
});
