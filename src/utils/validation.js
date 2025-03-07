/**
 * Valide les paramètres pour la requête de photo Google Places
 * @param {string} photoReference - Référence de la photo
 * @param {number} maxWidth - Largeur maximale de la photo
 * @returns {string|null} - Message d'erreur ou null si la validation est réussie
 */
exports.validatePhotoParams = (photoReference, maxWidth) => {
  // Vérifier que la référence de photo est présente
  if (!photoReference) {
    return 'photo_reference is required';
  }

  // Vérifier que la référence de photo est une chaîne non vide
  if (typeof photoReference !== 'string' || photoReference.trim() === '') {
    return 'photo_reference must be a non-empty string';
  }

  // Vérifier que maxWidth est un nombre positif si fourni
  if (maxWidth && (isNaN(maxWidth) || maxWidth <= 0)) {
    return 'maxwidth must be a positive number';
  }

  return null;
};