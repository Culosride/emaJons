const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (path, folder, resourceType) => {
  try {
    const data = await cloudinary.uploader.upload(
      path, {
        folder,
        resource_type: resourceType,
    });
    console.log("dataaaaaaaaaaaaaaa", data)
    return { url: data.url, public_id: data.public_id };
  } catch (e) {
    console.log(e.message, e.status);
  }
};

const removeFromCloudinary = async (public_ids) => {
  await cloudinary.api.delete_resources(public_ids, (err, res) => {
    console.log(err, res);
  });
};
const removeVideoFromCloudinary = async (public_ids) => {
  await cloudinary.api.delete_resources(
    public_ids,
    { resource_type: "video" },
    (err, res) => {
      console.log(err, res);
    }
  );
};

const generatePreview = (public_id) => {

  const convertToColonSeparated = (inputString) => {
    const convertedString = inputString.replace("/", ":");
    return convertedString;
  };
  const convertedId = convertToColonSeparated(public_id);

  const newVideo = cloudinary.url(public_id, {
    resource_type: "video",
    transformation: [
      {end_offset: "20%", duration: "1"},
      { flags: "splice", overlay: `video:${convertedId}` },
      {end_offset: "50%", duration: "1"},
      { flags: "layer_apply" },
      { flags: "splice", overlay: `video:${convertedId}` },
      {end_offset: "80%", duration: "1"},
      { flags: "layer_apply" },
    ],
  });

  return newVideo;
};

module.exports = {
  uploadToCloudinary,
  removeFromCloudinary,
  removeVideoFromCloudinary,
  generatePreview,
};
