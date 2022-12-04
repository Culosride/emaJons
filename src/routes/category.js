const express = require('express');
const Category = require('../models/category');
const categoryRouter = new express.Router();
const _ = require('lodash');

categoryRouter.get('/api/categories/:category', async (req, res) => {
  console.log(_.capitalize(req.params.category))
  try {
    const category = await Category.find({name: _.capitalize(req.params.category)});
    res.json(category);
  } catch (err) {
    res.status(400).send(err);
  }
})

module.exports = categoryRouter;
