const multer = require("multer")
const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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
