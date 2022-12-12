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

categoryRouter.get('/categories/tags', async (req, res) => {
  try {
    const category = await Category.findOne({});
    res.status(200).json(category.allTags);
  } catch (err) {
    res.status(400).send(err);
  }
})

categoryRouter.patch("/categories", noDups, async (req, res) => {
  const newTag = req.body.newTag
  try {
    await Category.updateMany(
      {},
      { $push: { allTags: newTag } },
      {new: true}
      );
      res.status(200).json(newTag);
    } catch (err) {
      res.status(400).send(err);
    }
})

module.exports = categoryRouter;
