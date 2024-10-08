// Importation des modules nécessaires
const sharp = require("sharp"); // Module pour le traitement d'images
const fs = require("fs"); // Module pour les opérations sur le système de fichiers
const path = require("path"); // Module pour travailler avec les chemins de fichiers

// Middleware pour l'optimisation de l'image
const optimizeImage = (req, res, next) => {
  // Vérifie si un fichier a été uploadé
  if (!req.file) {
    return next(); // Si aucun fichier, passe au middleware suivant
  }

  const inputFilePath = req.file.path; // Chemin de l'image uploadée
  const outputFileName = req.file.filename.split('.')[0] + ".webp"; // Nom de sortie pour le fichier WebP, remplaçant l'extension par .webp
  const outputFilePath = path.join("image", outputFileName); // Chemin complet pour enregistrer le fichier WebP

  // Désactive la mise en cache de sharp pour éviter des problèmes de traitement
  sharp.cache(false);

  // Utilisation de sharp pour redimensionner et convertir l'image
  sharp(inputFilePath)
    .resize(400, 600) // Redimensionnement de l'image à 400x600 pixels
    .toFormat("webp") // Conversion de l'image au format WebP
    .toFile(outputFilePath) // Sauvegarde du fichier WebP à l'emplacement spécifié
    .then(() => {
      // Une fois la conversion réussie, supprimer le fichier original
      fs.unlink(inputFilePath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression du fichier original:", err);
        }
        
        // Met à jour req.file avec les informations du nouveau fichier WebP
        req.file.path = outputFilePath; // Met à jour le chemin du fichier
        req.file.filename = outputFileName; // Met à jour le nom du fichier

        next();
      });
    })
    .catch((err) => {
      // Gère les erreurs lors du traitement de l'image
      console.error("Erreur lors de l'optimisation de l'image:", err);
      next(err);
    });
};

// Exportation du middleware d'optimisation de l'image
module.exports = optimizeImage;