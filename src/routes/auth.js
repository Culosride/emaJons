const express = require('express');
const passport = require("passport");
const authRouter = new express.Router();

authRouter.get("/login", (req, res) => {
  res.render("login");
});

authRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/admin/dashboard",
  failureRedirect: "/login"
}));

authRouter.get('/logout', (req, res, next) => {
  req.session.user = null
  req.session.save((err) => {
    if (err) next(err)
    req.session.regenerate((err) => {
      if (err) next(err)
      res.redirect('/')
    })
  })
})

authRouter.get("/admin/dashboard", (req, res) => {
  res.set(
    'Cache-Control',
    'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
  );
  if (req.isAuthenticated()) {
      res.render("dashboard");
  } else {
      res.redirect("/login");
  }
})

module.exports = authRouter;
