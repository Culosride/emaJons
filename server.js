const express = require("express")
require("./src/db/mongoose")
const router = require("./src/routers/post")
const app = express()


app.use(express.json())
app.set("view engine", "ejs")
app.set("views", "./src/views")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(router)

app.get("/", (req, res) => {
  res.render("home")
});

app.get("/about", async (req, res) => {
  res.render("home")
})


app.get("/home", async (req, res) => {
  try {
    res.send("ciao");
  } catch (err) {
    res.status(400).send(err);
  }
});


app.listen(3000)
