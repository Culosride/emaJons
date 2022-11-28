const multer = require("multer")
const storage = multer.diskStorage({})

const upload = multer({ storage: storage,
  allowedFormats: ["jpg", "png"],})

module.exports = upload
