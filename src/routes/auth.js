const express = require("express")
const authRouter = new express.Router();
const userController = require("../controllers/userController");
const validateJWT = require("../middleware/verifyJWT")

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post("/login", userController.handleLogin);
authRouter.get("/refresh", userController.handleRefreshToken)
authRouter.get("/logout", userController.handleLogout)

module.exports = authRouter
