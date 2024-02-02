const express = require('express');
const Category = require('../models/category');
const Post = require('../models/post');
const categoryRouter = new express.Router();
const _ = require('lodash');
const tagValidation = require("../middleware/tagValidation")
require("dotenv").config()

// routes for BasicUsers

// categoryRouter.get('/api/categories/:category', async (req, res) => {
//   try {
//     const category = await Category.find({name: _.capitalize(req.params.category)});
//     res.json(category);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// })

// Fetch tags
// categoryRouter.get('/api/categories', async (req, res) => {
//   try {
//     if(Object.keys(req.query).length) {
//       const posts = await Post.find(req.query);
//       const tags = posts.map(post => post.postTags).flat();
//       const uniqueTags = [...new Set(tags)];

//       res.status(200).json(uniqueTags);
//     } else {
//       console.log("no query")
//       const category = await Category.findOne({name: "dummy"}).exec();
//       res.status(200).json(category.allTags);
//     }

//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

// categoryRouter.get("/api/categories", async (req, res) => {
//   try {
//     const category = await Category.findOne({name: "dummy"}).exec();
//     res.status(200).json(category.allTags);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// })

// PROTECTED ROUTES
// new tag
// categoryRouter.patch("/api/categories/tags", tagValidation, async (req, res) => {
//   const { newTag } = (req.body)
//   const capitalizedTag = _.capitalize(newTag)
//   try {
//     await Category.findOneAndUpdate(
//       {name: "dummy"},
//       { $push: { allTags: capitalizedTag } }
//       );
//     res.status(200).json(capitalizedTag);
//     } catch (err) {
//       res.status(400).send(err);
//     }
// })

// // delete tag
// categoryRouter.patch("/api/categories/deleteTag", async (req, res) => {
//   const { tagToDelete } = req.body
//   try {
//     await Category.findOneAndUpdate(
//       { name: "dummy" },
//       { $pull: { allTags: tagToDelete } }
//     );
//     const updatedPosts = await Post.updateMany(
//       { },
//       { $pull: { postTags: tagToDelete } }
//     );
//     console.log(updatedPosts)
//     res.status(200).json({deletedTag: tagToDelete, message: "Tag deleted"});
//     } catch (err) {
//       res.status(400).send(err);
//     }
// })

module.exports = categoryRouter;
