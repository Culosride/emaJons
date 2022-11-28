const express = require("express")
require("./src/db/mongoose")
const router = require("./src/routes/post")
const app = express()

app.use(express.json())
app.set("view engine", "ejs")
app.set("views", "./src/views")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(router)

app.listen(3000)
