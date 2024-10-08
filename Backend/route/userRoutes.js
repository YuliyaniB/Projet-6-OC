// Importation des modules nécessaires
const express = require("express");
const router = express.Router(); // Création d'un nouvel objet Router pour gérer les routes
const userCtrl = require("../controller/userCtrl"); // Contrôleur pour gérer la logique des utilisateurs

// Route pour l'inscription d'un nouvel utilisateur
router.post("/signup", userCtrl.signup);
// Route pour la connexion d'un utilisateur déjà inscrit
router.post("/login", userCtrl.login);

// Exportation du routeur pour utilisation dans l'application principale
module.exports = router;
