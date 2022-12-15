const mongoose = require("mongoose")
const User = require("./src/models/user")
const Category = require("./src/models/category");
require("dotenv").config()

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

}

main()
