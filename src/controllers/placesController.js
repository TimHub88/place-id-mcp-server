const axios = require('axios');
const { AppError } = require('../utils/errorHandler');
const { validatePhotoParams } = require('../utils/validation');

/**
 * Recherche des lieux avec l'API Google Places et retourne leurs références de photos
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Middleware de gestion d'erreurs
 */
exports.searchPlaces = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    console.log(`[searchPlaces] Query received: ${query}`);
    
    if (!query) {
      return next(new AppError('A search query is required', 400));
    }
    
    // Récupérer la clé API de Google Places
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return next(new AppError('Google Places API key is missing', 500));
    }
    
    // Construire l'URL de recherche de l'API Google Places
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    
    console.log(`[searchPlaces] Sending request to Google API: ${searchUrl.replace(apiKey, 'API_KEY')}`);
    
    const response = await axios.get(searchUrl);
    
    console.log(`[searchPlaces] Response status: ${response.status}`);
    console.log(`[searchPlaces] Response data: ${JSON.stringify(response.data).substring(0, 300)}...`);
    
    if (response.data && response.data.results) {
      // Extraire les résultats et les références de photos
      const placesWithPhotos = response.data.results
        .filter(place => place.photos && place.photos.length > 0)
        .map(place => ({
          name: place.name,
          address: place.formatted_address,
          place_id: place.place_id,
          photos: place.photos.map(photo => ({
            photo_reference: photo.photo_reference,
            width: photo.width,
            height: photo.height,
            html_attributions: photo.html_attributions
          }))
        }));
      
      console.log(`[searchPlaces] Found ${placesWithPhotos.length} places with photos`);
      
      return res.json({
        success: true,
        data: {
          places: placesWithPhotos
        }
      });
    } else {
      console.log(`[searchPlaces] No results found or no places with photos`);
      return next(new AppError('No results found', 404));
    }
  } catch (error) {
    console.error('[searchPlaces] Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      let message = 'Error from Google Places API';
      
      console.error(`[searchPlaces] API Error - Status: ${status}, Data:`, data);
      
      if (data && data.error_message) {
        message = `Google API Error: ${data.error_message}`;
      }
      
      return next(new AppError(message, status));
    }
    
    return next(new AppError('Error searching places', 500));
  }
};

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
    const requestUrl = `${googlePlacesUrl}?photoreference=${encodeURIComponent(photo_reference)}&maxwidth=${maxwidth}&key=${apiKey}`;

    console.log(`Sending request to Google Places API: ${googlePlacesUrl}?photoreference=REFERENCE&maxwidth=${maxwidth}&key=API_KEY`);

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
        message = `Google API Error: ${data.error_message}`;
      } else if (typeof data === 'string' && data.includes('malformed or illegal request')) {
        message = 'Invalid photo_reference: The reference provided is not a valid Google Places photo reference. Please use a proper photo_reference obtained from Places API.';
      }
      
      return next(new AppError(message, status));
    }
    
    return next(new AppError('Error fetching place photo', 500));
  }
};