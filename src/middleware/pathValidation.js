const _ = require("lodash")
const Category = require('../models/category');
const Post = require('../models/post');


async function pathValidation(req, res, next) {

  const { category, postId } = req.params
  console.log(category, postId)
  console.log("checking")
  const catExists = await Category.findOne({name: _.capitalize(category)})
  if(!catExists) {
    console.log("cat does not exist")
    return res.status(404).json({message: "This resource doesn't exist"})
  };

  if(postId) {
    if(postId.length !== 24 || postId.length !==12) {
      console.log("middle")
      return res.status(404).json({message: "This resource doesn't exist"});
    }
    const postExists = await Post.findOne({_id: (postId)})
    if(!postExists) {
      console.log("post does not exist")
      return res.status(404).json({message: "This resource doesn't exist"});
    }
  }

  console.log("cat exists at middleware")
  next()
};

module.exports = pathValidation
