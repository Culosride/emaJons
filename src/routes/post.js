const express = require('express');
const postRouter = new express.Router();
const upload = require('../middleware/upload');
const multerUpload = upload.array('media', 20);
const verifyJWT = require("../middleware/verifyJWT")
// const validatePath = require("../middleware/pathValidation")
const Post = require('../models/post');
const Category = require('../models/category');
const { Media } = require('../models/media');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary.config');
const _ = require('lodash');
require("dotenv").config()

// routes for BasicUsers
postRouter.get('/api/posts', async (req, res) => {
  try {
    const allPosts = await Post.find({});
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(404).send(err);
  }
});

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
  const data = req.files;
  console.log("req.files",req.files)
  await Promise.all(data.map(async (media) => {
    const mediaType = media.mimetype.split("/")[0]
    const data = await uploadToCloudinary(media.path, 'emaJons_dev', mediaType);
    console.log("data at post", data)
    const newMedia = new Media({
      publicId: data.public_id,
      url: data.url,
      mediaType
    });
    await Post.updateOne(
      { _id: savedPost._id },
      { $addToSet: { media: [newMedia]}}
      )
    }))
    const updatedPost = await Post.findById(post._id)
    console.log(updatedPost)
    res.status(200).json(updatedPost);
  });

  postRouter.delete('/:category/:postId', verifyJWT, async (req, res) => {
    const { postId } = req.params
    console.log("at delete", req.params)
    try {
      const post = await Post.findOne({_id: postId}).exec();
      console.log(post)
      if(!post) return res.status(204).json({ message: "No post found with this id."})
      const publicIds = post.media.map(med => med.publicId)

      if(publicIds.length) {await removeFromCloudinary(publicIds)};
      await post.deleteOne();

      res.status(200).json({message: 'post deleted successfully'});
    } catch (err) {
      res.status(400).send(err);
    }
  });

  postRouter.patch('/posts/:postId/edit', verifyJWT, multerUpload, async (req, res) => {
    const update = Object.assign({}, req.body);
    const post = await Post.findOneAndUpdate({_id: req.params.postId,}, {$set: update}, {new: true}).exec();

    if(!post) return res.status(204).json({ message: "No post found with this id."})

    const media = req.files;
    console.log(post)
    await Promise.all(media.map(async (med) => {
      const mediaType = med.mimetype.split("/")[0]
      const data = await uploadToCloudinary(med.path, 'emaJons_dev', mediaType);
      const newMedia = new Media({
        publicId: data.public_id,
        url: data.url,
        mediaType
      });
      await Post.updateOne(
        { _id: post._id },
        { $addToSet: { media: [newMedia]}}
        )
    }))

    const updatedPost = await Post.findById(post._id)
    console.log(updatedPost)
    res.status(200).json(updatedPost);
  });

module.exports = postRouter
