const express = require("express");
const mongoose = require("mongoose");

const Book = require("./models/Book");

mongoose
  .connect(
    "mongodb+srv://julienb:julienb59200++@cluster0.d8ksr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res) => {
  res.json({ message: "Votre requete a bien été reçue." });
});

module.exports = app;
