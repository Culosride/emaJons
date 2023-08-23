const cloudinary = require('cloudinary')
require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = (path, folder, resourceType) => {
  return cloudinary.v2.uploader
  .upload(path, {
    folder,
    resource_type: resourceType,
    // chunk_size: default: 2000000, 20mb
  })
  .then((data) => {
    console.log("data", data)
    return ({ url: data.url, public_id: data.public_id });
  })
  .catch((err) => {
    console.log("error is",err)
  });
};

const removeFromCloudinary = async (public_ids) => {
  await cloudinary.v2.api.delete_resources((public_ids), (err, res) => {
    console.log(err, res)
  })
}
const removeVideoFromCloudinary = async (public_ids) => {
  await cloudinary.v2.api.delete_resources((public_ids), {resource_type: "video"},(err, res) => {
    console.log(err, res)
  })
}

module.exports = { uploadToCloudinary, removeFromCloudinary, removeVideoFromCloudinary }
