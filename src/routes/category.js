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
    const category = await Category.findOne({name: "dummy"});
    res.status(200).json(category.allTags);
  } catch (err) {
    res.status(400).send(err);
  }
})

categoryRouter.patch("/api/categories/tags", noDups, async (req, res) => {
  const { newTag } = (req.body)
  const capitalizedTag = _.capitalize(newTag)

  try {
    await Category.findOneAndUpdate(
      {name: "dummy"},
      { $push: { allTags: capitalizedTag } }
      );
    res.status(200).json(capitalizedTag);
    } catch (err) {
      res.status(400).send(err);
    }
})

categoryRouter.patch("/api/categories/deleteTag", async (req, res) => {
  const { tagToDelete } = req.body
  // console.log(tagToDelete)
  try {
    const category = await Category.findOneAndUpdate(
      { name: "dummy" },
      { $pull: { allTags: tagToDelete } }
      );
    res.status(200).json({deletedTag: tagToDelete, message: "Tag deleted"});
    // console.log("category", category, category.allTags, tagToDelete)
    } catch (err) {
      res.status(400).send(err);
    }
})

module.exports = categoryRouter;
