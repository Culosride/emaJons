const express = require('express');
const postRouter = new express.Router();
const upload = require('../middleware/upload');
const multerUpload = upload.array('images', 20);
const verifyJWT = require("../middleware/verifyJWT")
// const validatePath = require("../middleware/pathValidation")
const Post = require('../models/post');
const Category = require('../models/category');
const { Tag } = require('../models/tag');
const { Image } = require('../models/image');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary.config');
const _ = require('lodash');
require("dotenv").config()

// routes for BasicUsers
postRouter.get('/api/posts', async (req, res) => {
  try {
    const allPosts = await Post.find({}).populate({ path: 'postTags' })
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
  const { postTags } = req.body;
  const post = new Post(req.body);
  const savedPost = await post.save()

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
    const updatedPost = await Post.findById(savedPost._id).populate({ path: 'postTags' })
    res.status(200).json(updatedPost);
  });

  postRouter.delete('/:category/:postId', verifyJWT, async (req, res) => {
    const { postId } = req.params
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

  postRouter.patch('/posts/:postId/edit', verifyJWT, multerUpload, async (req, res) => {
    const update = Object.assign({}, req.body);
    update.images = (update.images) ? update.images.map(img => JSON.parse(img)) : []
    console.log('update', update)

    // filter public id that is not in update images and save public id
    const post = await Post.findOne({ _id: req.params.postId }).exec()
    if(!post) return res.status(204).json({ message: "No post found with this id."})

    const imagesToDelete = post.images.filter(postImg => update.images.every((newImg) => {
      return postImg.publicId !== newImg.publicId
    }))

    // remove public id from cloudinary
    const publicIds = imagesToDelete.map(img => img.publicId)
    if(publicIds.length) {await removeFromCloudinary(publicIds)};

    // update post
    await post.updateOne({ $set: update }, { new: true }).exec();

    const images = req.files;
    await Promise.all(images.map(async (image) => {
      const data = await uploadToCloudinary(image.path, 'emaJons_dev');
      const newImage = new Image({
        publicId: data.public_id,
        imageUrl: data.url,
      });
      await Post.updateOne(
        { _id: post._id },
        { $addToSet: { images: [newImage]}}
        )
    }))

    const updatedPost = await Post.findById(post._id)
    res.status(200).json(updatedPost);
  });

module.exports = postRouter
