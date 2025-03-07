/**
 * Classe personnalisée pour la gestion des erreurs
 * @class AppError
 * @extends Error
 */
class AppError extends Error {
  /**
   * Crée une nouvelle instance d'AppError
   * @param {string} message - Message d'erreur
   * @param {number} statusCode - Code HTTP de l'erreur
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  AppError
};