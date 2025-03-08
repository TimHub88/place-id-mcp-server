require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { placesRouter } = require('./routes/places');
const { handleJsonRpc } = require('./mcp');

// Mode JSON-RPC pour Smithery
const isStdioMode = process.argv.includes('--stdio');

// Configuration du serveur
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({
  strict: false, // Plus tolérant pour le parsing JSON
  limit: '5mb' // Augmente la limite pour les requêtes plus grandes
}));

// Supprime les logs HTTP dans le mode stdio pour éviter d'interférer avec JSON-RPC
if (!isStdioMode) {
  app.use((req, res, next) => {
    // Log seulement en mode non-stdio
    if (req.path !== '/') {
      console.log(`${req.method} ${req.path}`);
    }
    next();
  });
}

// Endpoint JSON-RPC pour MCP (préféré pour Smithery)
app.post('/', (req, res, next) => {
  // Ne pas logger les requêtes JSON-RPC brutes pour éviter de polluer stdout
  // qui est utilisé comme canal de communication
  if (!isStdioMode) {
    console.log("Received JSON-RPC request");
  }
  handleJsonRpc(req, res, next);
});

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

// Route healthcheck (important pour Smithery et les containers)
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Pour vérifier la connexion MCP sans JSON-RPC (utile pour déboguer)
app.get('/mcp-status', (req, res) => {
  res.status(200).json({
    status: 'running',
    version: '1.0.0',
    protocol: 'MCP JSON-RPC',
    message: 'MCP server is running correctly'
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  // En mode stdio, ne pas logger les erreurs sur la console standard
  if (!isStdioMode) {
    console.error("Server Error:", err.message);
    console.error(err.stack);
  }
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

if (isStdioMode) {
  // Mode stdio pour Smithery - traite les requêtes JSON-RPC via stdin/stdout
  console.error("Starting in stdio mode for Smithery");
  
  // Fonction pour gérer les entrées depuis stdin
  const handleStdin = async (data) => {
    try {
      const input = data.toString().trim();
      if (!input) return;
      
      // Tenter de parser la requête JSON-RPC
      const jsonRpcRequest = JSON.parse(input);
      
      // Simulation de req/res pour handleJsonRpc
      const req = { body: jsonRpcRequest };
      const res = {
        json: (response) => {
          // Écrire la réponse directement sur stdout
          process.stdout.write(JSON.stringify(response) + '\n');
        },
        status: (code) => {
          // Ignorer les codes de statut en mode stdio
          return res;
        }
      };
      
      // Traiter la requête comme si elle venait via HTTP
      await handleJsonRpc(req, res);
    } catch (error) {
      // Écrire l'erreur sur stdout avec le format JSON-RPC
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal error',
          data: error.message
        },
        id: null
      }) + '\n');
    }
  };
  
  // Configurer stdin pour le mode non-bloquant
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', handleStdin);
  
  // Log de démarrage uniquement sur stderr pour ne pas interférer avec stdout
  console.error('MCP JSON-RPC Server running in stdio mode');
} else {
  // Mode HTTP normal
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`MCP JSON-RPC endpoint available at: http://localhost:${PORT}/`);
    console.log(`Healthcheck endpoint: http://localhost:${PORT}/healthcheck`);
    console.log(`REST endpoints available at:`);
    console.log(`- http://localhost:${PORT}/mcp/google-places-photo`);
    console.log(`- http://localhost:${PORT}/mcp/search-places`);
  });
}