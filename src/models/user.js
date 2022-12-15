const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"]
  },
  roles: {
    Admin: Number,
    BasicUser: {
      type: Number,
      default: 1909
    },
  },
  refreshToken: String
}, {timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User
