const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
//get request
// parse convert json string to object
app.get("/users", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  const user = data.users;
  res.send(user);
});
//stringify convert js object to json string

app.post("/data", (req, res) => {
  let newUser = req.body;
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  user.push(newUser);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  console.log(user);
  res.send(user);
});
app.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let users = data.users;
  let index = users.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "user not found" });
  } else {
    let deleteUser = users.filter((ele) => ele.id !== id);
    data.users = deleteUser;
  }
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({ message: "user deleted" });
});
app.put("/update/:id", (req, res) => {
  let id = req.params.id;
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let users = data.users;
  let index = users.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "user not found" });
  } else {
    let updateUser = users.map((ele) => {
      if (ele.id == id) {
        return { ...ele, ...req.body };
      } else {
        return ele;
      }
    });
    data.users = updateUser;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.status(200).json({ message: "user updated" });
  }
});
app.get("/users/get", (req, res) => {
  let { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  const result = user.filter((dish) =>
    dish.name.toLowerCase().includes(name.toLocaleLowerCase())
  );
  if (result.length === 0) {
    return res.status(404).json({ message: "No dishes found" });
  }
  res.status(200).json(res);
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found please check routes" });
});
