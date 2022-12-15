const cloudinary = require('cloudinary')
const dotenv = require("dotenv")
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = (path, folder) => {
  return cloudinary.v2.uploader
  .upload(path, {
    folder
  }).then((data) => {
    return { url: data.url, public_id: data.public_id };
  }).catch((err) => {
    console.log(err)
  })
}

const removeFromCloudinary = async (public_ids) => {
  await cloudinary.v2.api.delete_resources((public_ids), (err, res) => {
    console.log(err, res)
  })
}

module.exports = { uploadToCloudinary, removeFromCloudinary }
