const mongoose = require("mongoose")
const User = require("./src/models/user")
const dotenv = require("dotenv")
dotenv.config()
const passport = require("passport");

const main = async () => {

  await mongoose.connect("mongodb://localhost:27017/emaJonsDB")
  User.register({username: process.env.SUPERUSER}, process.env.SUPERPW, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local");
        mongoose.connection.close()
    }
  });
}

main()
