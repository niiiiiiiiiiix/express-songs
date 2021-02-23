const express = require("express");
const app = express();
app.use(express.json()); // read up more on this

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    res.status(400).send("Server wants application/json!");
  } else {
    next();
  }
};

app.post("/", requireJsonContent, (req, res, next) => {
  res.status(201).send("Thanks for the JSON!");
});

const songsRouter = require("./routes/songs.routes");
app.use("/songs", songsRouter);

// MOVIES PART

const moviesRouter = require("./routes/movies.routes");
app.use("/movies", moviesRouter);

module.exports = app;
