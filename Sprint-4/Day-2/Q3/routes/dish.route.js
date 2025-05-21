const AuthMiddleware = require("../middlewares/auth.midddleware");
const checkRole = require("../middlewares/role.middleware");
const DishModel = require("../models/dish.model");
const express = require("express");
const dishRoute = express.Router();
dishRoute.use(AuthMiddleware);
dishRoute.post("/data", checkRole("admin"), async (req, res) => {
  try {
    const dish = await DishModel.create(req.body);
    res.status(201).json({ message: "Dish created", dish });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

dishRoute.get("/getAllDishes", checkRole("admin"), async (req, res) => {
  try {
    const dishes = await DishModel.find();
    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

dishRoute.put("/updateDish/:id", checkRole("admin"), async (req, res) => {
  try {
    const updated = await DishModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Dish updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

dishRoute.delete("/deleteDish/:id", checkRole("admin"), async (req, res) => {
  try {
    await DishModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Dish deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = dishRoute;
