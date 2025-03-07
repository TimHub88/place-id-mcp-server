const axios = require('axios');
const { AppError } = require('../utils/errorHandler');
const { validatePhotoParams } = require('../utils/validation');

/**
 * Récupère l'URL d'une photo Google Places à partir d'une référence
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Middleware de gestion d'erreurs
 */
exports.getPlacePhoto = async (req, res, next) => {
  try {
    const { photo_reference, maxwidth = 400 } = req.body;
    
    // Valider les paramètres
    const validationError = validatePhotoParams(photo_reference, maxwidth);
    if (validationError) {
      return next(new AppError(validationError, 400));
    }

    // Récupérer la clé API de Google Places
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return next(new AppError('Google Places API key is missing', 500));
    }

    // Construire l'URL de l'API Google Places
    const googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/photo';
    const requestUrl = `${googlePlacesUrl}?photoreference=${photo_reference}&maxwidth=${maxwidth}&key=${apiKey}`;

    // Effectuer la requête à l'API Google Places en mode "no follow redirects"
    const response = await axios.get(requestUrl, {
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });

    // Google renvoie un 302 avec l'en-tête Location pointant vers l'URL réelle
    if (response.status === 302 && response.headers.location) {
      // Renvoyer l'URL de la photo dans le format MCP attendu
      return res.json({
        success: true,
        data: {
          photoUrl: response.headers.location
        }
      });
    } else {
      return next(new AppError('Failed to retrieve photo URL from Google Places API', 500));
    }
  } catch (error) {
    console.error('Error fetching place photo:', error);
    
    // Gérer les erreurs spécifiques de l'API Google
    if (error.response) {
      const { status, data } = error.response;
      let message = 'Error from Google Places API';
      
      if (data && data.error_message) {
        message = data.error_message;
      }
      
      return next(new AppError(message, status));
    }
    
    return next(new AppError('Error fetching place photo', 500));
  }
};