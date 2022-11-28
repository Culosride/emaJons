// const express = require("express")
// const upload = require("../middleware/upload.js")
// const { uploadToCloudinary, removeFromCloudinary } = require("../services/cloudinary.config.js")
// const router = new express.Router();

// router.post("/users", async (req, res) => {
//   try {
//     const image = new Image(req.body);
//     await image.save();
//     res.status(201).send(image);
//   } catch (err) {
//     res.status(400).send(err)
//   }
// })

// router.post("/image/:id", upload.single("image"), async (req, res) => {
//   try {
//     const data = await uploadToCloudinary(req.file.path, "emaJons_dev");
//     const savedImg = await Image.updateOne(
//       { _id: req.params.id },
//       {
//         $set: {
//           imageUrl: data.url,
//           puclidId: data.public_id,
//         },
//       }
//     );

//     res.status(200).send("successful upload");
//   } catch (err) {
//     res.status(400).send(err)
//   }
// })

// router.delete("/image/:id", upload.single("image"), async (req, res) => {
//   try {
//     const image = await Image.findOne({ _id: req.params.id });
//     const publicId = image.puclidId;
//     await removeFromCloudinary(publicId)

//     const deleteImg = await Image.updateOne(
//       { _id: body.params.id },
//       {
//         $set: {
//           imageUrl: "",
//           puclidId: "",
//         }
//       }
//     );
//     res.status(200).send("successful removed");
//   } catch (err) {
//     res.status(400).send(err)
//   }
// })

// module.exports = router
