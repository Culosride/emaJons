const express = require('express');
const Category = require('../models/category');
const categoryRouter = new express.Router();
const _ = require('lodash');

categoryRouter.get('/api/categories/:category', async (req, res) => {
  try {
    const category = await Category.find({name: _.capitalize(req.params.category)});
    res.json(category);
  } catch (err) {
    res.status(400).send(err);
  }
})

module.exports = categoryRouter;

categoryRouter.post("/categories", async (req, res) => {
  const [tag, category] = req.body
  try {
    const selectedCategory = await Category.findOneAndUpdate(
      { name: _.capitalize(category) },
      { allTags: tag },
      {new: true}
      );
    res.status(200).json(selectedCategory);
  } catch (error) {
    console.error();
  }
})
