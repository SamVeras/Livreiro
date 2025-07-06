require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Auth Service rodando na porta ${process.env.PORT}`);
});
