const express = require("express");
const router = express.Router();
// const Joi = require("joi");
const jsonContent = require("../middleware/requireJSONcontent");
// const Song = require("../models/song.model");
const ctrl = require("../controllers/songs.controllers");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const createJWTToken = require("../config/jwt");
const protectRoute = require("../middleware/protectRoute");

// function validateSong(song) {
//   const schema = Joi.object({
//     id: Joi.number().integer(),
//     name: Joi.string().min(3),
//     artist: Joi.string().min(3),
//   });
//   return schema.validate(song);
// }

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

////// PROTECTION FOR PUT AND DELETE

router.put("/:id", protectRoute, async (req, res, next) => {
  try {
    const song = await ctrl.updateById(req.params.id, req.body, next);
    res.status(200).json(song);
  } catch (err) {
    next(err);
  }
});

// router.put("/:id", async (req, res, next) => {
//   const song = await ctrl.updateById(req.params.id, req.body, next);
//   res.status(200).json(song);
// });

router.delete("/:id", protectRoute, async (req, res, next) => {
  try {
    const song = await ctrl.deleteById(req.params.id, next);
    res.status(200).json(song);
  } catch (err) {
    next(err);
  }
});

// router.delete("/:id", async (req, res, next) => {
//   const song = await ctrl.deleteById(req.params.id, next);
//   res.status(200).json(song);
// });

router.post("/user", async (req, res, next) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.send(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      // you are setting the cookie here, and the name of your cookie is `token`
      expires: expiryDate,
      httpOnly: true, // client-side js cannot access cookie info
      secure: true, // use HTTPS
    });

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
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
