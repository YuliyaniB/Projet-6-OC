// Importation du module multer pour la gestion des fichiers (images) uploadés
const multer = require("multer");

// Définition des types MIME autorisés pour les fichiers d'images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration du stockage des fichiers avec multer
const storage = multer.diskStorage({
  // Définition de la destination des fichiers uploadés
  destination: (req, file, callback) => {
    callback(null, "image"); // Enregistre les fichiers dans le dossier "image"
  },
  // Définition du nom de fichier utilisé pour enregistrer l'image
  fileName: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Remplace les espaces par des underscores dans le nom original du fichier
    const extension = MIME_TYPES[file.mimetype]; // Récupère l'extension du fichier en fonction de son type MIME (jpg ou png)
    callback(null, name + Date.now() + "." + extension); // Génère un nom unique pour le fichier en ajoutant un timestamp
  },
});

// Exportation du middleware multer, configuré pour accepter un fichier unique nommé "image"
module.exports = multer({ storage }).single("image");
