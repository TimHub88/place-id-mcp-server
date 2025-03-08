const { searchPlaces, getPlacePhoto } = require('./placesController');

// Versions adaptées pour le protocole MCP
const executeSearchPlaces = async (params) => {
  try {
    // Simuler une requête Express avec les paramètres MCP
    const req = {
      query: {
        query: params.query,
      },
    };

    // Simuler une réponse Express
    let responseData = null;
    const res = {
      json: (data) => {
        responseData = data;
      },
    };

    // Simuler une fonction next
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    // Exécuter la fonction de contrôleur originale
    await searchPlaces(req, res, next);

    // Renvoyer les données de la réponse
    if (responseData && responseData.success) {
      return responseData.data;
    } else {
      throw new Error('Failed to search places');
    }
  } catch (error) {
    console.error('Error in executeSearchPlaces:', error);
    throw error;
  }
};

const executeGetPlacePhoto = async (params) => {
  try {
    // Simuler une requête Express avec les paramètres MCP
    const req = {
      body: {
        photo_reference: params.photo_reference,
        maxwidth: params.maxwidth || 400,
      },
    };

    // Simuler une réponse Express
    let responseData = null;
    const res = {
      json: (data) => {
        responseData = data;
      },
    };

    // Simuler une fonction next
    const next = (error) => {
      if (error) {
        throw error;
      }
    };

    // Exécuter la fonction de contrôleur originale
    await getPlacePhoto(req, res, next);

    // Renvoyer les données de la réponse
    if (responseData && responseData.success) {
      return responseData.data;
    } else {
      throw new Error('Failed to get place photo');
    }
  } catch (error) {
    console.error('Error in executeGetPlacePhoto:', error);
    throw error;
  }
};

// Exporter les contrôleurs originaux et les versions adaptées pour MCP
const placesController = {
  searchPlaces,
  getPlacePhoto,
  executeSearchPlaces,
  executeGetPlacePhoto,
};

module.exports = {
  placesController,
};