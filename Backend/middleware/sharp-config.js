const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next(); // Si aucune image n'est uploadée, on passe au middleware suivant
  }

  const inputFilePath = req.file.path; // Chemin de l'image uploadée
  const outputFileName = req.file.filename.split('.')[0] + ".webp"; // Nom du fichier de sortie
  const outputFilePath = path.join("image", outputFileName); // Chemin du fichier de sortie

  sharp(inputFilePath)
    .resize(400, 600) // Redimensionnement à 400x600
    .toFormat("webp") // Conversion en WebP
    .toFile(outputFilePath) // Sauvegarde de la nouvelle image
    .then(() => {
      // Suppression de l'image d'origine
      fs.unlink(inputFilePath, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'image originale:", err);
        }
        // Mettre à jour les infos du fichier optimisé
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