const express = require('express');
const Category = require('../models/category');
const categoryRouter = new express.Router();
const _ = require('lodash');
const noDups = require("../middleware/validation")

categoryRouter.get('/api/categories/:category', async (req, res) => {
  try {
    const category = await Category.find({name: _.capitalize(req.params.category)});
    res.json(category);
  } catch (err) {
    res.status(400).send(err);
  }
})


categoryRouter.patch("/categories", noDups, async (req, res) => {
  const [tag, category] = req.body
  try {
    const selectedCategory = await Category.findOneAndUpdate(
      { name: _.capitalize(category) },
      { $push: { categoryTags: tag } },
      {new: true}
      );
      res.status(200).json(selectedCategory);
    } catch (error) {
      console.error();
    }
})

module.exports = categoryRouter;
