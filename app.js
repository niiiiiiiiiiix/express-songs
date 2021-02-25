const express = require("express");
const requireJsonContent = require("./middleware/requireJSONcontent");
require("./utils/db");

const app = express();
app.use(express.json()); // read up more on this

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.post("/", requireJsonContent, (req, res, next) => {
  res.status(201).send("Thanks for the JSON!");
});

// SONGS PART

const songsRouter = require("./routes/songs.routes");
app.use("/songs", songsRouter); // "/songs" is a namespace so that in songs.routes.js we don't have to keep referring to it
// i.e. instead of router.get("/songs") we can just use router.get("/")

// MOVIES PART

const moviesRouter = require("./routes/movies.routes");
app.use("/movies", moviesRouter);

// start: example error handling
// app.get("/song", (req, res, next) => {
//   const err = new Error("Unexpected network error");
//   next(err);
// });

// app.use((err, req, res, next) => {
//   if (err.message === "Unexpected network error") {
//     console.log("I don't know how to handle network error. Pass it on.");
//     next(err);
//   } else {
//     console.log(err);
//     console.log("Unknown error. Pass it on.");
//     next(err);
//   }
// });
// end: example error handling

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
