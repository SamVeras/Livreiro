const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  description: String,
  coverImage: String,
  originalCoverImage: String,
  publishedDate: String,
  rating: { type: Number, min: 0, max: 10 },
  progress: { type: Number, min: 0, max: 100 },
  review: String,
  startedAt: Date,
  finishedAt: Date,
  createdAt: { type: Date, default: Date.now },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  available: { type: Boolean, default: true },
});
module.exports = mongoose.model("Book", BookSchema);
