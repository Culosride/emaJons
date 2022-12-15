const express = require("express")
const registerRouter = express.Router()
const userController = require("../controllers/userController")

registerRouter.post("/register", userController.handleNewUser);

module.exports = registerRouter
