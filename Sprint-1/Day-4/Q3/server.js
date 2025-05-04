const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());
app.post("/data", (req, res) => {
  let newUser = req.body;
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dish = data.dish;
  dish.push(newUser);
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.send(dish);
});
app.get("/dishes", (req, res) => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dish = data.dish;
  res.send(dish);
});
app.get("/dishes/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dish;
  let dish = dishes.find((ele) => ele.id === id);
  if (!dish) {
    return res.status(404).json({ message: "Dish not found" });
  }
  res.status(200).json(dish);
});
app.delete("/delete/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dish;
  let index = dishes.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "dish not found" });
  } else {
    let deleteDish = dishes.filter((ele) => ele.id !== id);
    data.dish = deleteDish;
  }
  fs.writeFileSync("./db.json", JSON.stringify(data));
  res.status(200).json({ message: "dish deleted" });
});
app.put("/update/:id", (req, res) => {
  let id = Number(req.params.id);
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dish;
  let index = dishes.findIndex((ele) => ele.id == id);
  if (index == -1) {
    return res.status(404).json({ message: "dish not found" });
  } else {
    let updateDish = dishes.map((ele) => {
      if (ele.id == id) {
        return { ...ele, ...req.body };
      } else {
        return ele;
      }
    });
    data.dishes = updateDish;
    fs.writeFileSync("./db.json", JSON.stringify(data));
    res.status(200).json({ message: "dish updated" });
  }
});
app.get("/dishes/get", (req, res) => {
  let { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));
  let dishes = data.dish;
  const result = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(name.toLocaleLowerCase())
  );
  if (result.length === 0) {
    return res.status(404).json({ message: "No dishes found" });
  }
  res.status(200).json(res);
});
app.use((req, res) => {
  res.status(404).json({ message: "Not found please chek routes" });
});
app.listen(9080, () => {
  console.log("server running at 9080");
});
