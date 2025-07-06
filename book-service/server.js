require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const bookRoutes = require("./routes/books");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/books", bookRoutes);

connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Book Service rodando na porta ${process.env.PORT}`);
});
