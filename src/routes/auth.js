const express = require('express');
const passport = require("passport");

const authRouter = new express.Router();

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/adminForm",
  failureRedirect: "/login"
}));

module.exports = authRouter;
