const Post = require('../models/post');
const _ = require("lodash")

async function deleteTagFromPost(req, res, next) {
  const { tag } = req.body
  console.log('req.body', req.body)
  // const capitalizedTag = _.capitalize(newTag)
  // const selectedCategory = await Category.findOne({}).exec();
  // selectedCategory.allTags.some(catTag => catTag === capitalizedTag) ?
  // res.status(400).json({message: "Tag already exists"}) :
  // next()
};

module.exports = deleteTagFromPost
