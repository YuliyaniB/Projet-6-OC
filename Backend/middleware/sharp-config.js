const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucune image n'est uploadée, passer au middleware suivant
  }

  const inputFilePath = req.file.path; // Chemin de l'image uploadée
  const outputFileName = req.file.filename.split('.')[0] + ".webp"; // Nom du fichier de sortie
  const outputFilePath = path.join("image", outputFileName); // Chemin de la nouvelle image WebP

  // Utiliser sharp pour redimensionner et convertir en WebP
  sharp.cache(false)
  sharp(inputFilePath)
    .resize(400, 600) // Redimensionnement à 400x600
    .toFormat("webp") // Conversion en WebP
    .toFile(outputFilePath) // Sauvegarde de la nouvelle image WebP
    .then(() => {
        // Supprimer l'image originale après conversion
        fs.unlink(inputFilePath, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier original:", err);
          }
          // Mettre à jour req.file avec les infos du fichier WebP
          req.file.path = outputFilePath;
          req.file.filename = outputFileName;

        next(); // Passer au middleware suivant
      });
    })
    .catch((err) => {
      console.error("Erreur lors de l'optimisation de l'image:", err);
      next(err);
    });
};

module.exports = optimizeImage;