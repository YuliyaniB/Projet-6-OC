// Importation de la bibliothèque mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");
// Importation du plugin mongoose-unique-validator pour valider l'unicité des champs
const uniqueValidator = require("mongoose-unique-validator");

// Création du schéma de l'utilisateur avec les propriétés email et password
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // L'email est obligatoire et doit être unique
  password: { type: String, required: true }, // Le mot de passe est obligatoire
});

// Application du plugin uniqueValidator au schéma userSchema
// Cela permet d'afficher des erreurs plus explicites si un email déjà utilisé est entré
userSchema.plugin(uniqueValidator);

// Exportation du modèle "User", basé sur le schéma "userSchema"
module.exports = mongoose.model("User", userSchema);
