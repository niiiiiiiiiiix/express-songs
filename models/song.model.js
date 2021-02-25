const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  name: {
    type: String,
    required: [true, "Song name needed!"],
  },
  artist: {
    type: String,
    required: [true, "Song artist needed!"],
  },
});

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
