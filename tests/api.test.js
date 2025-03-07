const request = require('supertest');
const express = require('express');
const { placesRouter } = require('../src/routes/places');

// Mock des dépendances
jest.mock('axios');
const axios = require('axios');

// Configuration de l'application de test
const app = express();
app.use(express.json());
app.use('/mcp', placesRouter);

describe('Google Places Photo API', () => {
  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.resetAllMocks();
    
    // Simuler la configuration d'environnement
    process.env.GOOGLE_PLACES_API_KEY = 'test_api_key';
  });

  it('should return a photo URL when given a valid photo reference', async () => {
    // Simuler une réponse de redirection de l'API Google
    axios.get.mockResolvedValue({
      status: 302,
      headers: {
        location: 'https://example.com/test-photo.jpg'
      }
    });

    const response = await request(app)
      .post('/mcp/google-places-photo')
      .send({
        photo_reference: 'test_photo_reference',
        maxwidth: 400
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        photoUrl: 'https://example.com/test-photo.jpg'
      }
    });

    // Vérifier que axios a été appelé avec les bons paramètres
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('photoreference=test_photo_reference'),
      expect.objectContaining({
        maxRedirects: 0
      })
    );
  });

  it('should return an error when photo_reference is missing', async () => {
    const response = await request(app)
      .post('/mcp/google-places-photo')
      .send({
        maxwidth: 400
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('photo_reference');
  });

  it('should handle errors from the Google Places API', async () => {
    // Simuler une erreur de l'API Google
    axios.get.mockRejectedValue({
      response: {
        status: 400,
        data: {
          error_message: 'Invalid request'
        }
      }
    });

    const response = await request(app)
      .post('/mcp/google-places-photo')
      .send({
        photo_reference: 'test_photo_reference',
        maxwidth: 400
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Invalid request');
  });
});