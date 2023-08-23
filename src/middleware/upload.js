const multer = require("multer")
const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
  // console.log("at filter",req.files, "file", file, "cb", cb)
  if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'video/mp4' ||
      file.mimetype === 'video/mov')
  {
    cb (null, true)
  } else {
    cb({message: 'Invalid file type.'}, false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

module.exports = upload;
