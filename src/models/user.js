const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, {timestamps: true})

const User = mongoose.model('User', userSchema);

userSchema.plugin(passportLocalMongoose);

module.exports = User
