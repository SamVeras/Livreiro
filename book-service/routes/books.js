const express = require("express");
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "OK", service: "book-service" });
});

router.post("/", auth, async (req, res) => {
  const { coverImage, title, author, genre, description, publishedDate, ...rest } = req.body;
  const book = await Book.create({
    ...rest,
    title,
    originalTitle: title,
    author,
    originalAuthor: author,
    genre,
    originalGenre: genre,
    description,
    originalDescription: description,
    coverImage,
    originalCoverImage: coverImage,
    publishedDate,
    originalPublishedDate: publishedDate,
    ownerId: req.userId,
  });
  res.status(201).json(book);
});

router.get("/", async (req, res) => {
  const books = await Book.find({ available: true });
  res.json(books);
});

router.get("/mine", auth, async (req, res) => {
  const books = await Book.find({ ownerId: req.userId });
  res.json(books);
});

router.get("/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || String(book.ownerId) !== req.userId) {
    return res.status(403).json({ error: "Livro não encontrado ou acesso negado." });
  }
  res.json(book);
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book || String(book.ownerId) !== req.userId) {
      return res.status(403).json({ error: "Você não tem permissão para editar este livro." });
    }

    const {
      rating,
      progress,
      review,
      startedAt,
      finishedAt,
      coverImage,
      title,
      author,
      genre,
      description,
      publishedDate,
    } = req.body;
    if (rating !== undefined) book.rating = rating;
    if (progress !== undefined) book.progress = progress;
    if (review !== undefined) book.review = review;
    if (startedAt !== undefined) book.startedAt = startedAt ? new Date(startedAt) : undefined;
    if (finishedAt !== undefined) book.finishedAt = finishedAt ? new Date(finishedAt) : undefined;
    if (coverImage !== undefined) book.coverImage = coverImage;
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (description !== undefined) book.description = description;
    if (publishedDate !== undefined) book.publishedDate = publishedDate;

    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || String(book.ownerId) !== req.userId) {
    return res.status(403).json({ error: "Você não tem permissão para remover este livro." });
  }
  await book.deleteOne();
  res.json({ message: "Livro removido com sucesso." });
});

module.exports = router;
