const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  signedIn: { type: Boolean, required: true, default: false },
  likedSongs: { type: Array, required: true, default: [] },
  playlists: { type: Array, required: true, default: [] },
});

module.exports = mongoose.model("User", userSchema);
