const express = require('express');
const upload = require('../middleware/upload');
const Post = require('../models/post');
const { Image } = require('../models/image');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary.config');
const _ = require('lodash');
// const authRouter = require("./auth")

const postRouter = new express.Router();
const multer = require('multer');
const multerUpload = upload.array('images', 20);

postRouter.get("/", async (req, res) => {
  res.redirect("/admin/dashboard")
})

postRouter.get('/posts', async (req, res) => {
  try {
    const allPosts = await Post.find();
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


postRouter.post('/posts', multerUpload, async (req, res) => {
    if (req.isAuthenticated()) {
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
      console.log("savedpost", updatedPost)
      res.status(200).json(updatedPost)
    } else {
      res.redirect("/login")
    }
});
// postRouter.post('/posts', multerUpload, async (req, res) => {
//   console.log("req.body", req.files)
//   try {
//     if (req.isAuthenticated()) {
//     const post = new Post(req.body);
//     const savedPost = await post.save();

//     const images = req.files;
//     // res.status(200).json(post)
//     await Promise.all(images.map(async (image) => {
//       const data = await uploadToCloudinary(image.path, 'emaJons_dev');
//       const newImage = new Image({
//         publicId: data.public_id,
//         imageUrl: data.url,
//       });
//       await Post.updateOne(
//         { _id: savedPost._id },
//         { $addToSet: { images: [newImage]}}
//       )
//     }))
//     res.status(200).json({lastId: post._id})
//     } else {
//       res.send("/login")
//     }
//   }
//   catch (err) {
//     res.status(400).send(err);
//   }
// });


// router.delete('/image/:id', async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id });
//     const publicId = user.publicId;
//     await removeFromCloudinary(publicId);
//     const deleteImg = await User.updateOne(
//       { _id: req.params.id },
//       {
//         $set: {
//           imageUrl: '',
//           publicId: '',
//         },
//       }
//     );
//     res.status(200).send('post image deleted successfully!');
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

module.exports = postRouter;
