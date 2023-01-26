const express = require("express")
require("./src/db/mongoose")
// const User = require("./src/models/user") // needed to authenticate session
const Category = require('./src/models/category');
const routers = require("./src/routes/routers")
const errorHandler = require("./src/middleware/errorHandler")
const path = require('path')
const cors = require('cors');
const cookieParser = require("cookie-parser");
const app = express()
app.use(cors())

app.use(express.json())
app.use(cookieParser())

app.set("view engine", "ejs")
app.set("views", "./src/views")

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))

app.use(routers.authRouter, routers.postRouter, routers.categoryRouter, routers.registerRouter, routers.tagRouter)

app.use(errorHandler)
app.use('/assets', express.static(path.join(__dirname, '../public')))

// fixes React Routes 404 on reload
app.get('/*', (req, res) => {
  try {
    res.render('home');
  } catch (err) {
    res.status(400).send(err);
  }
})

app.listen(3000)
