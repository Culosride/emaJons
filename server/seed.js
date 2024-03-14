const mongoose = require("mongoose")
const User = require("./models/user")
const Category = require("./models/category");
const bcrypt = require("bcrypt")

require("dotenv").config()

const main = async () => {
  await mongoose.connect("mongodb://mongo:27017/emaJonsDB")
  const categories = [
    { name: "dummy", allTags: ["India", "Messico", "Palermo", "2020", "2016"]},
    { name: 'Walls'},
    { name: 'Video'},
    { name: 'Sketchbooks'},
    { name: 'Paintings'},
    { name: 'Sculptures'},
  ];
  try {
    const existingCat = await Category.find({})
    if(!existingCat.length) {
      await Category.insertMany(categories);
      console.log("Categories seeded")
    }
  } catch (error) {
    console.log(error)
  };

  try {
    const hashedPassword = await bcrypt.hash(process.env.SUPERPW, 10);
    const admin = new User({
    username: process.env.SUPERUSER,
    password: hashedPassword,
    roles: ["Admin"]
  })
  await admin.save()
  console.log("Admin seeded")
  mongoose.connection.close()

  } catch (error) {
    console.log(error)
  }

}

main()
