const express = require('express');
const postRouter = new express.Router();
const upload = require('../middleware/upload');
const multerUpload = upload.array('images', 20);
const verifyJWT = require("../middleware/verifyJWT")
const Post = require('../models/post');
const { Image } = require('../models/image');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary.config');
const _ = require('lodash');
require("dotenv").config()

// routes for BasicUsers


postRouter.get('/api/posts/:category', async (req, res) => {
  try {
    const allPosts = await Post.find({category: _.capitalize(req.params.category)});
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(404).send(err);
  }
});

postRouter.get('/api/posts/:category/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).send(err);
  }
});


// routes requiring authorization

postRouter.post('/posts', verifyJWT, multerUpload, async (req, res) => {
  const post = new Post(req.body);
  const savedPost = await post.save();
  const images = req.files;
  await Promise.all(images.map(async (image) => {
    const data = await uploadToCloudinary(image.path, 'emaJons_dev');
    const newImage = new Image({
      publicId: data.public_id,
      imageUrl: data.url,
    });
    await Post.updateOne(
      { _id: savedPost._id },
      { $addToSet: { images: [newImage]}}
      )
    }))
    const updatedPost = await Post.findById(post._id)
    res.status(200).json(updatedPost);
  });

  postRouter.delete('/:category/:postId', verifyJWT, async (req, res) => {
    try {
      const post = await Post.findOne({_id: req.params.postId}).exec();
      if(!post) return res.status(204).json({ message: "No post found with this id."})
      const publicIds = post.images.map(img => img.publicId)
      if(publicIds.length) {await removeFromCloudinary(publicIds)};
      await post.deleteOne();
      res.status(200).json({message: 'post deleted successfully'});
    } catch (err) {
      res.status(400).send(err);
    }
  });

  // postRouter.get('/posts', verifyJWT, async (req, res) => {
  //   try {
  //     const allPosts = await Post.find();
  //     res.status(200).json(allPosts);
  //   } catch (err) {
  //     res.status(404).send(err);
  //   }
  // });

  module.exports = postRouter;
