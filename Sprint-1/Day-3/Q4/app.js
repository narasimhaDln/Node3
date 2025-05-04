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
//todo curd operations;
app.get("/get-data", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let todo = data.todos;
  res.send(todo);
});
app.post("/data", (req, res) => {
  let newTodo = req.body;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  data.todos.push(newTodo);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.send(data.todos);
});
app.delete("/delete/:id", (req, res) => {
  let id = req.param.id;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let todo = data.todos;
  let index = todo.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "todo not found" });
  } else {
    let deleteTodo = todo.filter((ele) => ele.id !== id);
    data.todos = deleteTodo;
  }
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({ message: "Todo updated" });
});
app.put("/update/:id", (req, res) => {
  let id = req.params.id;
  const data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let todos = data.todos;
  let index = todos.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "user not found" });
  } else {
    let updateUser = todos.map((ele) => {
      if (ele.id == id) {
        return { ...ele, ...req.body };
      } else {
        return ele;
      }
    });
    data.todos = updateUser;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.status(200).json({ message: "user updated" });
  }
});
app.listen(9000, () => {
  console.log("server running at 9000 ");
});
