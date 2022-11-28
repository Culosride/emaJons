const mongoose = require("mongoose")
const User = require("./src/models/user")
const dotenv = require("dotenv")
dotenv.config()

const main = async () => {

  await mongoose.connect("mongodb://localhost:27017/emaJonsDB")
  const newUser = new User({
    username: "admin",
    password: "123"
  })

  await newUser.save()

  mongoose.connection.close()
}

main()
