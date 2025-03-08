const express = require('express');
const { getPlacePhoto, searchPlaces } = require('../controllers/placesController');

const router = express.Router();

/**
 * @route   POST /mcp/google-places-photo
 * @desc    Récupère l'URL d'une photo à partir d'une référence Google Places
 * @access  Public
 */
router.post('/google-places-photo', getPlacePhoto);

/**
 * @route   GET /mcp/search-places
 * @desc    Recherche des lieux et récupère leurs références de photos
 * @access  Public
 */
router.get('/search-places', searchPlaces);

module.exports = {
  placesRouter: router
};