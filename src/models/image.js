const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
  imageUrl: String,
  publicId: String
}, {timestamps: true})

const Image = mongoose.model('Image', imageSchema);

module.exports = { Image, imageSchema }
