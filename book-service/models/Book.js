const mongoose = require("mongoose");
const BookSchema = new mongoose.Schema({
  title: String,
  originalTitle: String,
  author: String,
  originalAuthor: String,
  genre: String,
  originalGenre: String,
  description: String,
  originalDescription: String,
  coverImage: String,
  originalCoverImage: String,
  publishedDate: String,
  originalPublishedDate: String,
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
