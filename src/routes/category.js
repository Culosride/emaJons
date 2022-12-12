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

categoryRouter.get("/api/categories/", async (req, res) => {
  try {
    const category = await Category.findOne({});
    res.status(200).json(category.allTags);
  } catch (err) {
    res.status(400).send(err);
  }
})

categoryRouter.patch("/api/categories/tags", async (req, res) => {
  const { newTag } = req.body
  try {
    await Category.updateMany(
      {},
      { $push: { allTags: newTag } }
      );
    res.json(newTag);
    } catch (err) {
      res.status(400).send(err);
    }
})

module.exports = categoryRouter;
