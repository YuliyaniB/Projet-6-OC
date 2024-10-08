// Importation du module jsonwebtoken qui permet de manipuler les tokens JWT (création, vérification, etc.)
const jwt = require("jsonwebtoken");
// Chargement des variables d'environnement depuis le fichier .env à l'aide du module dotenv
// Cela permet d'accéder à des informations sensibles, telles que des clés secrètes, sans les coder en dur dans le projet.
require('dotenv').config();

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Récupération du token JWT dans l'en-tête Authorization de la requête.
    // Le token est généralement au format "Bearer <token>", on le découpe pour récupérer uniquement la partie après "Bearer".
    const token = req.headers.authorization.split(" ")[1];
    // Vérification du token avec la clé secrète stockée dans le fichier .env (JWT_SECRET).
    // Si le token est valide, la méthode jwt.verify décode le token.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // Extraction de l'ID utilisateur contenu dans le token décodé.
    const userId = decodedToken.userId;
    // Ajout de l'ID utilisateur dans l'objet de la requête (req.auth)
    // pour qu'il soit accessible dans les prochains middleware ou contrôleurs.
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
