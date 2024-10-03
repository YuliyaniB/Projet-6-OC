const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const bookRoutes = require("./route/bookRoutes");
const userRoutes = require("./route/userRoutes");

mongoose
  .connect(
    "mongodb+srv://julienb:PVX18pdsWUa9da7P@cluster0.d8ksr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/image", express.static(path.join(__dirname, "image")));

module.exports = app;
