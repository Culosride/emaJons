const express = require("express")
const registerRouter = express.Router()
const authController = require("../controllers/authController")

registerRouter.post("/register", authController.handleNewUser);

module.exports = registerRouter
