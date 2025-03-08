require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { placesRouter } = require('./routes/places');
const { handleJsonRpc } = require('./mcp');

// Configuration du serveur
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint JSON-RPC pour MCP
app.post('/', handleJsonRpc);

// Routes REST traditionnelles (conservées pour la compatibilité)
app.use('/mcp', placesRouter);

// Route d'accueil
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    endpoints: {
      jsonRpc: '/', // Endpoint principal pour JSON-RPC
      googlePlacesPhoto: '/mcp/google-places-photo', // Endpoint REST traditionnel
      searchPlaces: '/mcp/search-places' // Endpoint REST traditionnel
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MCP JSON-RPC endpoint available at: http://localhost:${PORT}/`);
  console.log(`REST endpoints available at:`);
  console.log(`- http://localhost:${PORT}/mcp/google-places-photo`);
  console.log(`- http://localhost:${PORT}/mcp/search-places`);
});