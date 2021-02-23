const express = require("express");
const app = express();
app.use(express.json()); // read up more on this

const songs = [
  {
    id: 1,
    name: "someSongName",
    artist: "someSongArtist",
  },
];

app.get("/songs", (req, res) => {
  res.status(200).json(songs);
});

// POST /songs
app.post("/songs", (req, res) => {
  // console.log(req.body);
  let newSong = {
    id: songs.length + 1,
    name: req.body.name,
    artist: req.body.artist,
  };
  songs.push(newSong);

  res.status(201).json(newSong);
});

app.param("id", (req, res, next, id) => {
  req.song = songs.find((song) => song.id === parseInt(req.params.id));
  // scope req.song is accessible both at param and get but not song
  // so "song = songs.find((song) => song.id === parseInt(req.params.id))" alone would not work
  // alternatively you can use "req.song = song"
  next();
});

app.get("/songs/:id", (req, res) => {
  res.status(200).json(req.song);
});

app.put("/songs/:id", (req, res) => {
  req.song.name = req.body.name;
  req.song.artist = req.body.artist;
  res.status(200).json(req.song);
});

app.delete("/songs/:id", (req, res) => {
  let index = songs.indexOf(req.song);
  songs.splice(index, 1);
  res.status(200).json(req.song);
});

// // GET /songs/id
// app.get("/songs/:id", (req, res) => {
//   let searchSong = songs.find((song) => song.id === parseInt(req.params.id));
//   res.status(200).json(searchSong);
// });

// // PUT /songs/id
// app.put("/songs/:id", (req, res) => {
//   let song = songs.find((song) => song.id === parseInt(req.params.id));
//   song.name = req.body.name;
//   song.artist = req.body.artist;

//   res.status(200).json(song);
// });

// // DELETE /songs/id
// app.delete("/songs/:id", (req, res) => {
//   // say @ /songs/1, this will give me the song object with id = 1
//   let song = songs.find((song) => song.id === parseInt(req.params.id));
//   // index variable gives me the index of the song object with id = 1
//   let index = songs.indexOf(song);
//   // splice this song object out
//   songs.splice(index, 1);

//   res.status(200).json(song);
// });

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

// MOVIES PART
const movies = [];

app.post("/movies", (req, res) => {
  let newMovie = {
    movieID: movies.length + 1,
    movieName: req.body.movieName,
  };
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.get("/movies", (req, res) => {
  res.status(200).json(movies);
});

app.param("movieID", (req, res, next, movieID) => {
  req.movie = movies.find(
    (movie) => movie.movieID === parseInt(req.params.movieID)
  );
  next();
});

app.get("/movies/:movieID", (req, res) => {
  res.status(200).json(req.movie);
});

app.put("/movies/:movieID", (req, res) => {
  req.movie.movieName = req.body.movieName;
  res.status(200).json(req.movie);
});

app.delete("/movies/:movieID", (req, res) => {
  let index = movies.indexOf(req.movie);
  movies.splice(index, 1);

  res.status(200).json(req.movie);
});

module.exports = app;
