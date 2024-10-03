const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/userCtrl");

// Route pour l'inscription d'un nouvel utilisateur
router.post("/signup", userCtrl.signup);
// Route pour la connexion d'un utilisateur déjà inscrit
router.post("/login", userCtrl.login);

module.exports = router;
