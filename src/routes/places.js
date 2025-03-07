const express = require('express');
const { getPlacePhoto } = require('../controllers/placesController');

const router = express.Router();

/**
 * @route   POST /mcp/google-places-photo
 * @desc    Récupère l'URL d'une photo à partir d'une référence Google Places
 * @access  Public
 */
router.post('/google-places-photo', getPlacePhoto);

module.exports = {
  placesRouter: router
};