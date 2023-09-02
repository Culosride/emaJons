const mongoose = require("mongoose")

const mediaSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  mediaType: String,
  preview: String
}, {timestamps: true})

const Media = mongoose.model('Media', mediaSchema);

module.exports = { Media, mediaSchema }
