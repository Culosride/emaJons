const mongoose = require("mongoose")
const User = require("./src/models/user")
const Category = require("./src/models/category")
const dotenv = require("dotenv")
dotenv.config()
const passport = require("passport");

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/emaJonsDB")
  const categories = [
    { name: "dummy", allTags: []},
    { name: 'Walls'},
    { name: 'Video'},
    { name: 'Sketchbooks'},
    { name: 'Paintings'},
    { name: 'Sculptures'},
  ];
  Category.insertMany(categories);
  console.log("Categories seeded")
    // mongoose.connection.close()
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
