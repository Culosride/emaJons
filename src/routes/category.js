const express = require('express');
const Category = require('../models/category');
const Post = require('../models/post');
const categoryRouter = new express.Router();
const _ = require('lodash');
const tagValidation = require("../middleware/tagValidation")
require("dotenv").config()

// routes for BasicUsers

categoryRouter.get('/api/categories/:category', async (req, res) => {
  try {
    const category = await Category.find({name: _.capitalize(req.params.category)});
    res.json(category);
  } catch (err) {
    res.status(400).send(err);
  }
})

categoryRouter.get("/api/categories", async (req, res) => {
  try {
    const category = await Category.findOne({name: "dummy"}).exec();
    res.status(200).json(category.allTags);
  } catch (err) {
    res.status(400).send(err);
  }
})

// routes requiring authorization

categoryRouter.patch("/api/categories/tags", tagValidation, async (req, res) => {
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
  try {
    await Category.findOneAndUpdate(
      { name: "dummy" },
      { $pull: { allTags: tagToDelete } }
    );
    const post = await Post.updateMany(
      { },
      { $pull: { postTags: tagToDelete } }
    );
    console.log(post)
    res.status(200).json({deletedTag: tagToDelete, message: "Tag deleted"});
    } catch (err) {
      res.status(400).send(err);
    }
})

module.exports = categoryRouter;
