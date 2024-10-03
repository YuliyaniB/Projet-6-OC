// Importation de la bibliothèque mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');

// Définition du schéma pour les "Book" dans MongoDB
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  rating: [
    {
      userId: { type: String },
      grade: { type: Number },
    },
  ],
  averageRating: { type: Number },
});

// Exportation du modèle "Book", basé sur le schéma "bookSchema"
module.exports = mongoose.model('Book', bookSchema);
