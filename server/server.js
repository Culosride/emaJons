const express = require("express");
require("./db/mongoose");
const routers = require("./routes/routers");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;

const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());

// Serve static files from the client/public directory
app.use(express.static(path.join(__dirname, "../client/public")));
app.use(express.urlencoded({ extended: true }));

app.use(routers.authRouter, routers.postRouter, routers.tagRouter);

app.use(errorHandler);

// Serve the index.html file from the client/public directory
app.get("/*", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "../client", "index.html"));
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
