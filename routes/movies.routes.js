const express = require("express");
const router = express.Router();

const movies = [];

router.post("/", (req, res) => {
  let newMovie = {
    movieID: movies.length + 1,
    movieName: req.body.movieName,
  };
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

router.get("/", (req, res) => {
  res.status(200).json(movies);
});

router.param("movieID", (req, res, next, movieID) => {
  req.movie = movies.find(
    (movie) => movie.movieID === parseInt(req.params.movieID)
  );
  next();
});

router.get("/:movieID", (req, res) => {
  res.status(200).json(req.movie);
});

router.put("/:movieID", (req, res) => {
  req.movie.movieName = req.body.movieName;
  res.status(200).json(req.movie);
});

router.delete("/:movieID", (req, res) => {
  let index = movies.indexOf(req.movie);
  movies.splice(index, 1);

  res.status(200).json(req.movie);
});

module.exports = router;
