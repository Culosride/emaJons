const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");

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
  refreshToken: String
}, {timestamps: true})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User
