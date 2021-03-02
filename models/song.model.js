const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  artist: {
    type: String,
    required: true,
    minlength: 1,
  },
});

const SongModel = mongoose.model("Song", SongSchema);
module.exports = SongModel;
