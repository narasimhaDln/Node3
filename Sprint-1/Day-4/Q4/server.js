const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
//get request
// parse convert json string to object
app.get("/all-users", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  res.send(user);
});
//post request
app.post("/data", (req, res) => {
  let newData = req.body;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  user.push(newData);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.send(user);
});
app.delete("/delete/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  let index = user.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "user not found" });
  } else {
    let deleteUser = user.filter((ele) => ele.id !== id);
    data.users = deleteUser;
    fs.writeFileSync("./db.json", JSON.stringify(data));
  }
  res.send(user);
});
app.put("/update/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  let index = user.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "user not found" });
  } else {
    let updateUser = user.map((ele) => {
      if (ele.id === id) {
        return { ...ele, ...req.body };
      } else {
        return ele;
      }
    });
    data.users = updateUser;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.send(updateUser);
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
app.get("/user", (req, res) => {
  let { name } = req.query;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let user = data.users;
  if (name) {
    user = user.filter((use) =>
      use.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  res.send(user);
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found please check routes" });
});
app.listen(6070, () => {
  console.log("server running at 6070");
});
