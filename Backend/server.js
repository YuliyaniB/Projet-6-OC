// Importation des modules nécessaires
const http = require('http'); // Module HTTP natif de Node.js pour créer un serveur
const app = require('./app'); // Importation de l'application Express définie dans 'app.js'

// Fonction pour normaliser le port
const normalizePort = val => {
  const port = parseInt(val, 10); // Conversion de la valeur en entier

  if (isNaN(port)) { // Si la conversion échoue, c'est une chaîne (nom de pipe par exemple)
    return val; // Retourne la chaîne telle quelle
  }
  if (port >= 0) { // Si le port est un nombre valide
    return port; // Retourne le port
  }
  return false; // Si le port est négatif, retourne faux
};

// Définit le port à utiliser : soit la variable d'environnement PORT, soit 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port); // Définit le port pour l'application Express

// Fonction de gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') { // Vérifie si l'erreur est liée à l'écoute du port
    throw error; // Lance l'erreur si ce n'est pas le cas
  }
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // Crée une chaîne d'information sur le port

  switch (error.code) { // Gère les erreurs spécifiques
    case 'EACCES': // Erreur d'accès (le port nécessite des privilèges élevés)
      console.error(bind + ' requires elevated privileges.'); // Affiche l'erreur
      process.exit(1); // Quitte le processus avec un code d'erreur
      break;
    case 'EADDRINUSE': // Erreur d'adresse déjà utilisée
      console.error(bind + ' is already in use.'); // Affiche l'erreur
      process.exit(1); // Quitte le processus avec un code d'erreur
      break;
    default:
      throw error; // Lance l'erreur par défaut
  }
};

// Création du serveur HTTP
const server = http.createServer(app);

// Événements du serveur
server.on('error', errorHandler); // Écouteur d'événements pour les erreurs
server.on('listening', () => { // Écouteur d'événements pour l'état d'écoute
  const address = server.address(); // Récupère l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // Crée une chaîne d'information sur le port
  console.log('Listening on ' + bind); // Affiche un message indiquant que le serveur écoute
});

// Démarre le serveur sur le port spécifié
server.listen(port);