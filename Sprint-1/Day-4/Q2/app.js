const express = require("express");
const app = express();
app.use(express.json());
const user = {
  name: "vamsi",
  age: 22,
  email: "vamsi123@gmail.com",
  role: "employee",
};
const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    age: 28,
    role: "admin",
    isActive: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    age: 34,
    role: "user",
    isActive: true,
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    age: 22,
    role: "user",
    isActive: false,
  },
];
app.get("/user/get", (req, res) => {
  res.send(user);
});
app.get("/users/list", (req, res) => {
  res.send(users);
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found please chek routes" });
});
app.listen(7080, () => {
  console.log("server running at 7080");
});
