const express = require('express');
const tagRouter = new express.Router();
const Post = require('../models/post');
const Category = require('../models/category');
const tagValidation = require("../middleware/tagValidation")
const _ = require('lodash');
// require("dotenv").config()

tagRouter.get('/api/tags', async (req, res) => {
  try {
    const posts = await Post.find({ postTags: { $exists: true, $not: {$size: 0} } });

    let categoryTags = {
      Walls: [],
      Paintings: [],
      Sketchbooks: [],
      Video: [],
      Sculptures: [],
    }

    // Assigns to each category its tags
    posts.forEach(post => {
      categoryTags[post.category] = [...categoryTags[post.category], ...post.postTags];
    });

    // Eliminates duplicates
    Object.keys(categoryTags).forEach((key) => {
      categoryTags[key] = [...new Set(categoryTags[key])];
    })

    const category = await Category.findOne({name: "dummy"}).exec();

    res.status(200).json({ categoryTags, availableTags: category.allTags });

  } catch (err) {
    res.status(400).send(err);
  }
});

// PROTECTED ROUTES
// Create tag
tagRouter.patch("/api/tags", tagValidation, async (req, res) => {
  const { newTag } = (req.body)
  const capitalizedTag = _.capitalize(newTag)
  try {
    await Category.findOneAndUpdate(
      { name: "dummy" },
      { $push: { allTags: capitalizedTag } }
    );
    res.status(200).json(capitalizedTag);
  } catch (err) {
    res.status(400).send(err);
  }
})

// Delete tag
tagRouter.patch("/api/tags/deleteTag", async (req, res) => {
  const { tagToDelete } = req.body
  try {
    await Category.findOneAndUpdate(
      { name: "dummy" },
      { $pull: { allTags: tagToDelete } }
    );
    await Post.updateMany(
      { },
      { $pull: { postTags: tagToDelete } }
    );

    res.status(200).json({ deletedTag: tagToDelete, message: "Tag deleted" });
    } catch (err) {
      res.status(400).send(err);
    }
})

module.exports = tagRouter;
