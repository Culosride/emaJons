const express = require('express');
const tagRouter = new express.Router();
const { Tag } = require('../models/tag');
const _ = require('lodash');
const tagValidation = require("../middleware/tagValidation")
require("dotenv").config()

tagRouter.post('/api/tags', async (req, res) => {
  try {
    const tag = new Tag(req.body);
    const savedTag = await tag.save();
    res.status(200).json(savedTag);
  } catch (err) {
    res.status(400).send(err);
  }
})

tagRouter.get('/api/tags', async (req, res) => {
  try {
    const allTags = await Tag.find();
    res.status(200).json(allTags);
  } catch (err) {
    res.status(400).send(err);
  }
})

tagRouter.patch("/api/tags/deleteTag", async (req, res) => {
  try {
    const { tagToDelete } = req.body
    const deletedTag = await Tag.findOneAndDelete({ name: tagToDelete });
    res.status(200).json({deletedTag: deletedTag, message: "Tag deleted"});
  } catch (err) {
    res.status(400).send(err);
  }
})

module.exports = tagRouter;
