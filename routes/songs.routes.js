const express = require("express");
const router = express.Router();
const Joi = require("joi");
const jsonContent = require("../middleware/requireJSONcontent");
const Song = require("../models/song.model");
const ctrl = require("../controllers/songs.controllers");

function validateSong(song) {
  const schema = Joi.object({
    id: Joi.number().integer(),
    name: Joi.string().min(3),
    artist: Joi.string().min(3),
  });
  return schema.validate(song);
}

router.get("/", async (req, res, next) => {
  const songs = await ctrl.getAllSongs(next);
  res.status(200).json(songs);
});

// POST /songs
router.post("/", jsonContent, async (req, res, next) => {
  const song = await ctrl.createOne(req.body, next);
  res.status(201).json(song);
});

router.get("/:id", async (req, res) => {
  const song = await ctrl.findById(req.params.id);
  res.status(200).json(song);
});

router.put("/:id", async (req, res, next) => {
  const song = await ctrl.updateById(req.params.id, req.body, next);
  res.status(200).json(song);
});

router.delete("/:id", async (req, res, next) => {
  const song = await ctrl.deleteById(req.params.id, next);
  res.status(200).json(song);
});

module.exports = router;

// router.post("/", jsonContent, async (req, res, next) => {
//   try {
//     const validation = validateSong(req.body);
//     if (validation.error) {
//       const error = new Error(validation.error.details[0].message);
//       // 400 Bad Request
//       error.statusCode = 400;
//       throw error;
//     } else {
//       const newSong = new Song(req.body);
//       await newSong.save();
//       res.status(201).json(newSong);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// router.param("id", async (req, res, next, id) => {
//   const song = await Song.findById(id);
//   req.song = song;
//   // .find((song) => song.id === parseInt(req.params.id));
//   // scope req.song is accessible both at param and get but not song
//   // so "song = songs.find((song) => song.id === parseInt(req.params.id))" alone would not work
//   // alternatively you can use "req.song = song"
//   next();
// });

// router.put("/:id", async (req, res, next) => {
//   try {
//     const validation = validateSong(req.body);
//     if (validation.error) {
//       const error = new Error(validation.error.details[0].message);
//       // 400 Bad Request
//       error.statusCode = 400;
//       throw error;
//     } else {
//       const song = await Song.findByIdAndUpdate(req.song.id, req.body, {
//         new: true,
//         runValidators: true,
//       });
//       res.status(200).json(song);
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// router.delete("/:id", async (req, res, next) => {
//   try {
//     const song = await Song.findByIdAndDelete(req.song.id);
//     res.status(200).json(song);
//   } catch (error) {
//     next(error);
//   }
// });

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
