const express = require('express');
const Category = require('../models/category');

const categoryRouter = new express.Router();

// categoryRouter.get("/categories", async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json(categories);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// })

categoryRouter.get("/rawCategories", async (req, res) => {
  try {
      const categories = await Category.find();

      res.status(200).json(categories);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
})

categoryRouter.post("/categories", async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
  } catch (error) {
    res.status(400).send(error);
  }
})

module.exports = categoryRouter;
