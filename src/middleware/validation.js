const Category = require('../models/category');
// const User = require("../models/user")
const _ = require("lodash")

async function noDups(req, res, next) {
  const { newTag } = req.body
  const capitalizedTag = _.capitalize(newTag)
  const selectedCategory = await Category.findOne({});
  selectedCategory.allTags.some(catTag => catTag === capitalizedTag) ?
  res.status(400).json({message: "Tag already exists"}) :
  next()
};

// async function userExists(req, res, next) {
//   const { username } = req.body
//   const duplicateUser = await User.find({username: username});
//   duplicateUser ?
//   res.status(409).json({ message: "Username already exists" }) :
//   next()
// };

module.exports = noDups
