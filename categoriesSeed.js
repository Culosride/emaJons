const mongoose = require("mongoose")
const Category = require("./src/models/category")

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/emaJonsDB")
  const categories = [
    { name: 'Walls', categoryTags: []},
    { name: 'Video', categoryTags: []},
    { name: 'Sketchbooks', categoryTags: []},
    { name: 'Paintings', categoryTags: []},
    { name: 'Sculptures', categoryTags: []},
  ];
    Category.insertMany(categories);
    console.log("Categories seeded")
    // mongoose.connection.close()
}

main()
