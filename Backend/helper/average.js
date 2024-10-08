// Fonction pour calculer la moyenne d'un tableau de nombres
exports.average = (array) => {
    // Utilise la méthode reduce pour calculer la somme des éléments du tableau.
    // 'acc' est l'accumulateur qui commence à 0 (défini comme second argument de reduce),
    // et 'nb' représente chaque nombre du tableau.
    const sum = array.reduce((acc, nb) => acc + nb, 0);
    // Calcule la moyenne en divisant la somme par le nombre d'éléments,
    // puis retourne la moyenne arrondie à une décimale (en tant que chaîne de caractères).
    return (sum / array.length).toFixed(1);
};