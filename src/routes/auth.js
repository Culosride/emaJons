const express = require("express")
const authRouter = new express.Router();
const authController = require("../controllers/authController");

// authRouter.get("/auth", (req, res) => {res.render("login")});
authRouter.post("/auth", authController.handleLogin);
authRouter.get("/auth/refresh", authController.handleRefreshToken)
authRouter.post("/auth/logout", authController.handleLogout)

module.exports = authRouter
