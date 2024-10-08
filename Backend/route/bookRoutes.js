// Importation des modules nécessaires
const express = require("express");
const router = express.Router(); // Création d'un nouvel objet Router pour gérer les routes
const bookCtrl = require("../controller/bookCtrl"); // Contrôleur pour gérer la logique des livres
const auth = require("../middleware/auth"); // Middleware d'authentification
const multerConfig = require("../middleware/multer-config"); // Middleware de configuration de Multer pour l'upload d'images
const optimizeImg = require("../middleware/sharp-config"); // Middleware pour optimiser les images avec Sharp

// Route pour obtenir les 3 livres les mieux notés
router.get("/bestrating", bookCtrl.getBestRatedBooks);

// Route pour obtenir la liste de tous les livres
router.get("/", bookCtrl.getAllBooks);

// Route pour obtenir les informations d'un livre par son ID
router.get("/:id", bookCtrl.getBookById);

// Route pour la création d'un nouveau livre
router.post("/", auth, multerConfig, optimizeImg, bookCtrl.createBook);

// Route pour noter un livre
router.post("/:id/rating", auth, bookCtrl.rateBook);

// Route pour modifier un livre par son ID
router.put("/:id", auth, multerConfig, optimizeImg, bookCtrl.modifyBook);

// Route pour supprimer un livre par son ID
router.delete("/:id", auth, bookCtrl.deleteBook);

// Exportation du routeur pour utilisation dans l'application principale
module.exports = router;
