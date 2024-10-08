// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importation des routes
const bookRoutes = require("./route/bookRoutes");
const userRoutes = require("./route/userRoutes");

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Initialisation de l'application Express
const app = express();

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Sécurisation des en-têtes HTTP avec Helmet
app.use(helmet({ crossOriginResourcePolicy: false }));

// Middleware pour gérer les headers CORS (Cross-Origin Resource Sharing)
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

// Limiteur de requêtes pour éviter les attaques DDoS ou les abus
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limite de 100 requêtes par IP dans cette fenêtre
  message: "Trop de requêtes provenant de cette IP, réessayez plus tard.", // Message d'erreur
});
app.use("/api/", limiter);

// Gestion des routes pour les livres et les utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// Gestion des fichiers statiques (images)
app.use("/image", express.static(path.join(__dirname, "image")));

// Exportation de l'application pour le serveur
module.exports = app;