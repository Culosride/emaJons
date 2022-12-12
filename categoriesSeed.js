const mongoose = require("mongoose")
const Category = require("./src/models/category")

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/emaJonsDB")

  const categories = [
    { name: 'Walls', allTags: []},
    { name: 'Video', allTags: []},
    { name: 'Sketchbooks', allTags: []},
    { name: 'Paintings', allTags: []},
    { name: 'Sculptures', allTags: []},
  ];
    Category.insertMany(categories);
    console.log("Categories seeded")
    // mongoose.connection.close()
}

main()
