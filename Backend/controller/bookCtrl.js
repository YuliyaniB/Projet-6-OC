// Importation des dépendances nécessaires
const Book = require("../model/Book"); // Modèle Book pour interagir avec la base de données
const fs = require("fs"); // Module pour manipuler les systèmes de fichiers
const average = require("../helper/average"); // Fonction helper pour calculer la moyenne des notes

// Fonction pour récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find() // Recherche tous les livres dans la base de données
    .then((books) => res.status(200).json(books)) // Réponse avec la liste des livres
    .catch((error) => res.status(404).json({ error })); // Gestion des erreurs
};

// Fonction pour récupérer un livre par son ID
exports.getBookById = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche d'un livre avec l'ID fourni dans les paramètres de requête
    .then((book) => res.status(200).json(book)) // Réponse avec les détails du livre
    .catch((error) => res.status(404).json({ error })); // Gestion des erreurs
};

// Fonction pour récupérer les meilleurs livres selon leur note moyenne
exports.getBestRatedBooks = (req, res, next) => {
  Book.find() // Recherche tous les livres
    .sort({ averageRating: -1 }) // Tri par note moyenne, de la plus élevée à la plus basse
    .limit(3) // Limite les résultats aux 3 meilleurs livres
    .then((books) => res.status(200).json(books)) // Réponse avec les meilleurs livres
    .catch((error) => {
      console.log(error); // Affiche l'erreur dans la console
      res.status(404).json({ error }); // Gestion des erreurs
    });
};

// Fonction pour créer un nouveau livre
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Parse l'objet livre envoyé dans la requête
  delete bookObject._id; // Supprime l'ID s'il existe (peut être généré par la base de données)
  delete bookObject._userId; // Supprime l'ID utilisateur s'il existe
  const book = new Book({
    ...bookObject, // Utilise le reste des propriétés de l'objet livre
    userId: req.auth.userId, // Associe l'ID de l'utilisateur authentifié
    imageUrl: `${req.protocol}://${req.get("host")}/image/${req.file.filename}`, // Crée l'URL de l'image
  });

  book
    .save() // Enregistre le livre dans la base de données
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" }); // Réponse de succès
    })
    .catch((error) => {
      res.status(400).json({ error }); // Gestion des erreurs lors de l'enregistrement
    });
};

// Fonction pour modifier un livre existant
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book), // Si une nouvelle image est uploadée, inclut l'URL de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/image/${req.file.filename}`,
      }
    : { ...req.body }; // Sinon, prend simplement le corps de la requête

  delete bookObject._userId; // Supprime l'ID utilisateur s'il existe
  Book.findOne({ _id: req.params.id }) // Recherche le livre à modifier
    .then((book) => {
      // Vérification si l'utilisateur authentifié est le propriétaire du livre
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request" }); // Réponse interdite si non autorisé
      } else {
        Book.updateOne(
          { _id: req.params.id }, // Mise à jour du livre avec les nouvelles données
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" })) // Réponse de succès
          .catch((error) => res.status(401).json({ error })); // Gestion des erreurs
      }
    })
    .catch((error) => {
      res.status(400).json({ error }); // Gestion des erreurs si le livre n'est pas trouvé
    });
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Recherche du livre à supprimer
    .then((book) => {
      // Vérification si l'utilisateur authentifié est le propriétaire du livre
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "403: unauthorized request" }); // Réponse interdite si non autorisé
      } else {
        const filename = book.imageUrl.split("/image/")[1]; // Extrait le nom de fichier de l'URL de l'image
        fs.unlink(`image/${filename}`, () => { // Supprime l'image du système de fichiers
          Book.deleteOne({ _id: req.params.id }) // Supprime le livre de la base de données
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" }); // Réponse de succès
            })
            .catch((error) => res.status(401).json({ error })); // Gestion des erreurs lors de la suppression
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error }); // Gestion des erreurs si le livre n'est pas trouvé
    });
};

// Fonction pour noter un livre
exports.rateBook = (req, res, next) => {
  // Vérification que la note est comprise entre 0 et 5
  if (0 <= req.body.rating && req.body.rating <= 5) {
    const ratingObject = { ...req.body, grade: req.body.rating }; // Crée un objet de note

    delete ratingObject._id; // Supprime l'ID s'il existe

    Book.findOne({ _id: req.params.id }) // Recherche du livre à noter
      .then((book) => {
        const newRatings = book.ratings; // Récupère les notes existantes
        const userIdArray = newRatings.map((rating) => rating.userId); // Crée un tableau d'IDs d'utilisateur

        // Vérification si l'utilisateur a déjà noté ce livre
        if (userIdArray.includes(req.auth.userId)) {
          res.status(403).json({ message: "Not authorized" }); // Réponse interdite si l'utilisateur a déjà noté
        } else {
          newRatings.push(ratingObject); // Ajoute la nouvelle note

          const grades = newRatings.map((rating) => rating.grade); // Crée un tableau des notes
          const averageGrades = average.average(grades); // Calcule la moyenne des notes
          book.averageRating = averageGrades; // Met à jour la note moyenne

          // Met à jour le livre avec les nouvelles notes et la nouvelle note moyenne
          Book.updateOne(
            { _id: req.params.id },
            {
              ratings: newRatings,
              averageRating: averageGrades,
              _id: req.params.id,
            }
          )
            .then(() => {
              res.status(201).json(); // Réponse de succès
            })
            .catch((error) => {
              res.status(400).json({ error }); // Gestion des erreurs lors de la mise à jour
            });
          res.status(200).json(book); // Réponse avec les détails du livre
        }
      })
      .catch((error) => {
        res.status(404).json({ error }); // Gestion des erreurs si le livre n'est pas trouvé
      });
  } else {
    res
      .status(400)
      .json({ message: "La note doit être comprise entre 0 et 5" }); // Réponse si la note est hors limites
  }
};