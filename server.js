const express = require("express")
require("./src/db/mongoose")
const User = require("./src/models/user") // needed to authenticate session
const { authRouter, postRouter } = require("./src/routes/routers")
const passport = require("passport");
const session = require("express-session")
const errorHandler = require("./src/middleware/errorHandler")
const path = require('path')
const app = express()

app.use(session ({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.set("view engine", "ejs")
app.set("views", "./src/views")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(postRouter, authRouter)
app.use(errorHandler)
app.use('/assets', express.static(path.join(__dirname, '../public')))

// fixes React Routes 404 on reload
app.get('/*', (req, res) => {
  try {
    res.render('dashboard');
  } catch (err) {
    res.status(400).send(err);
  }
})

app.listen(3000)
