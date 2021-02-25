// require("../models/song.model");
const Song = require("../models/song.model");

const createOne = async (song, next) => {
  try {
    const newSong = new Song(song);
    await newSong.save();
    return newSong;
  } catch (err) {
    next(err);
  }
};

const getAllSongs = async (next) => {
  try {
    const songs = await Song.find();
    return songs;
  } catch (err) {
    next(err);
  }
};

const findById = async (id, next) => {
  try {
    const song = await Song.findById(id);
    return song;
  } catch (err) {
    next(err);
  }
};

const updateById = async (id, body, next) => {
  try {
    const song = await Song.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    return song;
  } catch (err) {
    next(err);
  }
};

const deleteById = async (id, next) => {
  try {
    const song = await Song.findByIdAndDelete(id);
    return song;
  } catch (err) {
    next(err);
  }
};

module.exports = { createOne, getAllSongs, findById, updateById, deleteById };
