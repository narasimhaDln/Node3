const express = require("express");
const connection = require("./config/db");
const CategoryModel = require("./models/category.mode");
const ProductModel = require("./models/product.model");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/add-category", async (req, res) => {
  try {
    const newCategory = new CategoryModel(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: "something wrong in add category route" });
  }
});
app.post("/add-product", async (req, res) => {
  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "something wrong in add product route" });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find().populate(
      "category",
      "name price description"
    );
    res.send(products);
  } catch (error) {
    res.status(400).json({ message: "something wrong in get request" });
  }
});

app.listen(4500, () => {
  connection();
  console.log("Server running at port 4500");
});
