// Importation des dépendances nécessaires
const bcrypt = require('bcrypt'); // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken'); // Pour la création de tokens JWT
const dotenv = require('dotenv'); // Pour la gestion des variables d'environnement

const User = require('../model/User'); // Importation du modèle User

// Chargement des variables d'environnement depuis le fichier .env
dotenv.config();

// Fonction d'inscription des utilisateurs
exports.signup = (req, res, next) => {
  // Hachage du mot de passe de l'utilisateur
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création d'une nouvelle instance de User avec l'email et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistrement de l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ error })); 
    })
    .catch((error) => res.status(400).json({ error }));
};

// Fonction de connexion des utilisateurs
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur par son email dans la base de données
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Vérification si l'utilisateur existe
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Paire login/mot de passe incorrecte' }); 
      }
      // Comparaison du mot de passe fourni avec le mot de passe haché
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Vérification si le mot de passe est valide
          if (!valid) {
            return res
              .status(401)
              .json({ message: 'Paire login/mot de passe incorrecte' }); 
          }
          // Si l'authentification réussit, réponse avec le userId et le token JWT
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id }, // Payload du token
                process.env.JWT_SECRET, // Clé secrète pour signer le token
                { expiresIn: '6h' } // Durée d'expiration du token
            )
          });
        })
        .catch((error) => res.status(500).json({ error })); 
    })
    .catch((error) => res.status(500).json({ error }));
};