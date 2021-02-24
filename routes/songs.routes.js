const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jsonContent = require("../middleware/requireJSONcontent");

const songs = [
  {
    id: 1,
    name: "someSongName",
    artist: "someSongArtist",
  },
];

function validateSong(song) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().min(3).required(),
    artist: Joi.string().min(3).required(),
  });
  return schema.validate(song);
}

router.get("/", (req, res) => {
  res.status(200).json(songs);
});

// POST /songs
router.post("/", jsonContent, (req, res, next) => {
  // console.log(req.body);
  let newSong = {
    id: songs.length + 1,
    name: req.body.name,
    artist: req.body.artist,
  };

  // res.status(201).json(newSong);

  const validation = validateSong(req.body);
  if (validation.error) {
    const error = new Error(validation.error.details[0].message);
    // 400 Bad Request
    error.statusCode = 400;
    next(error);
  } else {
    songs.push(newSong);
    res.status(201).json(newSong);
  }
});

router.param("id", (req, res, next, id) => {
  req.song = songs.find((song) => song.id === parseInt(req.params.id));
  // scope req.song is accessible both at param and get but not song
  // so "song = songs.find((song) => song.id === parseInt(req.params.id))" alone would not work
  // alternatively you can use "req.song = song"
  next();
});

router.get("/:id", (req, res) => {
  res.status(200).json(req.song);
});

router.put("/:id", (req, res) => {
  req.song.name = req.body.name;
  req.song.artist = req.body.artist;
  res.status(200).json(req.song);
});

router.delete("/:id", (req, res) => {
  let index = songs.indexOf(req.song);
  songs.splice(index, 1);
  res.status(200).json(req.song);
});

// // GET /songs/id
// router.get("/songs/:id", (req, res) => {
//   let searchSong = songs.find((song) => song.id === parseInt(req.params.id));
//   res.status(200).json(searchSong);
// });

// // PUT /songs/id
// router.put("/songs/:id", (req, res) => {
//   let song = songs.find((song) => song.id === parseInt(req.params.id));
//   song.name = req.body.name;
//   song.artist = req.body.artist;

//   res.status(200).json(song);
// });

// // DELETE /songs/id
// router.delete("/songs/:id", (req, res) => {
//   // say @ /songs/1, this will give me the song object with id = 1
//   let song = songs.find((song) => song.id === parseInt(req.params.id));
//   // index variable gives me the index of the song object with id = 1
//   let index = songs.indexOf(song);
//   // splice this song object out
//   songs.splice(index, 1);

//   res.status(200).json(song);
// });

module.exports = router;
