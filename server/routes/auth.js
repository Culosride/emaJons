const express = require("express")
const authRouter = new express.Router();
const authController = require("../controllers/authController");

// authRouter.post("/api/auth/register", authController.handleNewUser);
authRouter.post("/api/auth", authController.handleLogin);
authRouter.get("/api/auth/refresh", authController.handleRefreshToken)
authRouter.post("/api/auth/logout", authController.handleLogout)
authRouter.get("/api/auth/validatePath/:category/:postId?/:edit?", authController.validatePath);

module.exports = authRouter
